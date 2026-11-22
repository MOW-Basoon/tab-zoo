/* global chrome, domainFromUrl */
importScripts("vendor/tldts-7.5.4.min.js", "domain.js");

const STORAGE_KEY = "tabZooStateV1";
const SPECIES_KEY = "tabZooSpeciesMapV1";
const SPECIES_STATE_VERSION = 1;
const species = ["sauropod", "trex", "triceratops", "cat", "fox", "duck", "elephant"];
const TEN_MINUTES = 10 * 60 * 1000;
const MAX_SESSIONS = 20;
const MAX_VISITS = 80;
const IDLE_SECONDS = 5 * 60;
const HEARTBEAT_ALARM = "tab-zoo-heartbeat";
const HEARTBEAT_MINUTES = 1;
const SESSION_STALE_MS = 2 * 60 * 1000;
const AGENT_GROUP_TITLE = "Agent Tabs";
const agentGroups = new Set();
let agentGroupsReady = Promise.resolve();

let taskQueue = Promise.resolve();

function enqueue(task) {
  taskQueue = taskQueue.then(task).catch((error) => console.error("Tab Zoo:", error));
  return taskQueue;
}

function emptyState() {
  return {
    domainGroupingVersion: 1,
    fossils: [],
    agentSeenTabs: {},
    records: {},
    seenTabs: {},
    registeredTabs: {},
    activationGate: false,
    resetAt: 0,
    session: null,
    speciesStateVersion: SPECIES_STATE_VERSION,
    speciesGeneration: 0,
    speciesMap: {},
  };
}

async function readState() {
  const stored = await chrome.storage.local.get([STORAGE_KEY, SPECIES_KEY]);
  const state = stored[STORAGE_KEY] ?? emptyState();
  state.records = Object.assign(Object.create(null), state.records ?? {});
  state.fossils ??= [];
  state.agentSeenTabs ??= {};
  state.seenTabs ??= {};
  state.registeredTabs ??= {};
  state.activationGate ??= false;
  state.resetAt ??= 0;
  if (state.speciesStateVersion !== SPECIES_STATE_VERSION) {
    state.speciesMap = stored[SPECIES_KEY] ?? state.speciesMap ?? {};
    state.speciesStateVersion = SPECIES_STATE_VERSION;
  }
  state.speciesGeneration ??= 0;
  state.speciesMap = Object.assign(Object.create(null), state.speciesMap ?? {});
  if (!Array.isArray(state.discoveredSpecies)) {
    const previous = [...Object.values(state.speciesMap), ...state.fossils.map(fossil => fossil.species)];
    state.discoveredSpecies = species.filter(id => previous.includes(id) || (id === "duck" && previous.includes("owl")));
  }
  delete state.resetTabAccess;
  delete state.suppressedTabs;
  state.session ??= null;
  if (state.session && !Number.isFinite(state.session.lastHeartbeatAt)) {
    state.session.lastHeartbeatAt = state.session.startedAt;
  }
  if (state.domainGroupingVersion !== 1) migrateDomains(state);
  for (const record of Object.values(state.records)) {
    delete record.url;
    delete record.title;
  }
  return state;
}

// Combine old hostname records once, preserving elapsed time and an existing animal.
function migrateDomains(state) {
  const key = (host) => domainFromUrl(`https://${host}/`) || host;
  const records = Object.create(null);
  for (const [host, record] of Object.entries(state.records)) {
    const domain = key(host);
    const merged = records[domain] ??= { totalMs: 0, sessionsMs: [], visits: [], lastSeen: 0 };
    merged.totalMs += record.totalMs || 0;
    merged.sessionsMs.push(...(record.sessionsMs || []));
    merged.visits.push(...(record.visits || []));
    merged.lastSeen = Math.max(merged.lastSeen, record.lastSeen || 0);
  }
  for (const record of Object.values(records)) {
    record.sessionsMs = record.sessionsMs.slice(-MAX_SESSIONS);
    record.visits = record.visits.sort((a, b) => a - b).slice(-MAX_VISITS);
  }
  const assigned = Object.create(null);
  // Prefer the currently active animal, then the base domain, then a stable hostname order.
  const active = state.session?.domain;
  const hosts = Object.keys(state.speciesMap).sort((a, b) =>
    Number(b === active) - Number(a === active) || Number(b === key(b)) - Number(a === key(a)) || a.localeCompare(b));
  for (const host of hosts) assigned[key(host)] ??= state.speciesMap[host];
  for (const tab of Object.keys(state.seenTabs)) state.seenTabs[tab] = key(state.seenTabs[tab]);
  for (const registration of Object.values(state.registeredTabs)) registration.domain = key(registration.domain);
  if (state.session) state.session.domain = key(state.session.domain);
  state.records = records;
  state.speciesMap = assigned;
  state.domainGroupingVersion = 1;
}

function assignSpecies(state, domain) {
  if (!Object.hasOwn(state.speciesMap, domain)) state.speciesMap[domain] = null;
  if (state.speciesMap[domain] === "owl") state.speciesMap[domain] = "duck";
  if (!species.includes(state.speciesMap[domain])) state.speciesMap[domain] = species[Math.floor(Math.random() * species.length)];
  const assigned = state.speciesMap[domain];
  rememberSpecies(state, assigned);
  return assigned;
}

function rememberSpecies(state, id) {
  if (!state.discoveredSpecies.includes(id)) state.discoveredSpecies.push(id);
}

async function writeState(state) {
  await chrome.storage.local.set({ [STORAGE_KEY]: state });
}

// Aside exposes its Agent Tabs as a normal tab group. This is a group label,
// not proof of who opened a tab, and cannot observe activity outside this profile.
async function recordAgentTab(tab, url = tab?.url) {
  if (!tab?.id || !agentGroups.has(tab.groupId)) return;
  const domain = domainFromUrl(url);
  if (!domain) return;
  const state = await readState();
  const key = String(tab.id);
  if (state.agentSeenTabs[key] === domain) return;
  state.agentSeenTabs[key] = domain;
  const now = Date.now();
  let fossil = state.fossils.find(item => item.source === "agent-group" && item.domain === domain);
  if (fossil) {
    fossil.visits += 1;
    fossil.departedAt = now;
  } else {
    fossil = { id: crypto.randomUUID(), domain, species: species[Math.floor(Math.random() * species.length)], totalMs: 0, departedAt: now, source: "agent-group", visits: 1 };
    state.fossils.push(fossil);
  }
  rememberSpecies(state, fossil.species);
  await writeState(state);
}

function ensureRecord(state, domain) {
  if (!Object.hasOwn(state.records, domain)) state.records[domain] = {
    totalMs: 0,
    sessionsMs: [],
    visits: [],
    lastSeen: 0,
  };
  return state.records[domain];
}

function pruneVisits(visits, now) {
  return visits.filter((time) => now - time <= TEN_MINUTES).slice(-MAX_VISITS);
}

function settleSession(state, now) {
  const session = state.session;
  if (!session) return;

  const record = ensureRecord(state, session.domain);
  const endedAt = Math.max(session.startedAt, now);
  const elapsed = endedAt - session.startedAt;
  record.totalMs += elapsed;
  record.lastSeen = endedAt;
  if (elapsed >= 1000) {
    record.sessionsMs = [...record.sessionsMs, elapsed].slice(-MAX_SESSIONS);
  }
  state.session = null;
}

function expireStaleSession(state, now) {
  const session = state.session;
  if (!session) return false;
  const lastHeartbeatAt = Number.isFinite(session.lastHeartbeatAt)
    ? session.lastHeartbeatAt
    : session.startedAt;
  if (now - lastHeartbeatAt <= SESSION_STALE_MS) return false;
  settleSession(state, lastHeartbeatAt);
  return true;
}

async function beginTab(tab, now = Date.now(), { countVisit = true, allowRegistration = false } = {}) {
  const domain = domainFromUrl(tab?.url);
  const idleState = await chrome.idle.queryState(IDLE_SECONDS);
  const shouldTrack = idleState === "active" || (idleState === "idle" && tab?.audible);
  const state = await readState();
  expireStaleSession(state, now);

  if (!domain || !tab?.id || !shouldTrack) {
    settleSession(state, now);
    await writeState(state);
    return state;
  }

  const tabKey = String(tab.id);
  const registrationRequired = state.activationGate || state.resetAt > 0;
  const registration = state.registeredTabs[tabKey];
  const isRegistered = registration?.domain === domain && registration.at >= state.resetAt;
  if (registrationRequired && !isRegistered && !allowRegistration) {
    settleSession(state, now);
    await writeState(state);
    return state;
  }
  if (registrationRequired && allowRegistration) {
    state.registeredTabs[tabKey] = { domain, at: now };
  }

  assignSpecies(state, domain);
  if (state.session?.tabId === tab.id && state.session?.domain === domain) {
    state.session.lastHeartbeatAt = now;
    state.seenTabs[tabKey] = domain;
    const record = ensureRecord(state, domain);
    record.lastSeen = now;
    await writeState(state);
    return state;
  }

  settleSession(state, now);
  state.seenTabs[tabKey] = domain;
  const record = ensureRecord(state, domain);
  record.visits = pruneVisits(record.visits, now);
  if (countVisit && (!record.visits.length || now - record.visits[record.visits.length - 1] > 3000)) {
    record.visits.push(now);
  }
  record.lastSeen = now;
  state.session = {
    tabId: tab.id,
    windowId: tab.windowId,
    domain,
    startedAt: now,
    lastHeartbeatAt: now,
  };
  await writeState(state);
  return state;
}

async function focusedTab() {
  const window = await chrome.windows.getLastFocused();
  if (!window?.focused || window.id === chrome.windows.WINDOW_ID_NONE) return null;
  const tabs = await chrome.tabs.query({ active: true, windowId: window.id });
  return tabs[0] ?? null;
}

async function refreshFocusedTab(options = {}) {
  return beginTab(await focusedTab(), Date.now(), options);
}

async function endCurrentSession(now = Date.now()) {
  const state = await readState();
  expireStaleSession(state, now);
  settleSession(state, now);
  await writeState(state);
  return state;
}

function forgetDomains(state, keepDomains, now = Date.now()) {
  for (const domain of Object.keys(state.records)) {
    if (!keepDomains.has(domain)) {
      const record = state.records[domain];
      const animal = state.speciesMap[domain];
      if (species.includes(animal)) {
        state.fossils.push({ id: crypto.randomUUID(), domain, species: animal, totalMs: record.totalMs, departedAt: now });
      }
      delete state.records[domain];
    }
  }
  for (const domain of Object.keys(state.speciesMap)) {
    if (!keepDomains.has(domain)) delete state.speciesMap[domain];
  }
  if (state.session && !keepDomains.has(state.session.domain)) state.session = null;
}

async function forgetClosedDomains(now = Date.now()) {
  const state = await readState();
  expireStaleSession(state, now);
  const openTabs = await chrome.tabs.query({});
  const openDomains = new Set(openTabs.map((tab) => domainFromUrl(tab.url)).filter(Boolean));
  forgetDomains(state, openDomains, now);
  await writeState(state);
  return state;
}

async function forgetPreviousBrowserSession() {
  const state = await readState();
  state.seenTabs = {};
  state.registeredTabs = {};
  state.agentSeenTabs = {};
  state.session = null;
  forgetDomains(state, new Set());
  await Promise.all([
    writeState(state),
    chrome.storage.local.remove(SPECIES_KEY),
  ]);
  return state;
}

async function ensureHeartbeatAlarm() {
  const alarm = await chrome.alarms.get(HEARTBEAT_ALARM);
  if (!alarm) {
    await chrome.alarms.create(HEARTBEAT_ALARM, { periodInMinutes: HEARTBEAT_MINUTES });
  }
}

async function resetTracking() {
  const now = Date.now();
  const previousState = await readState();
  const state = {
    domainGroupingVersion: 1,
    fossils: previousState.fossils,
    discoveredSpecies: previousState.discoveredSpecies,
    agentSeenTabs: {},
    records: {},
    seenTabs: {},
    registeredTabs: {},
    activationGate: true,
    resetAt: now,
    session: null,
    speciesStateVersion: SPECIES_STATE_VERSION,
    speciesGeneration: previousState.speciesGeneration + 1,
    speciesMap: {},
  };
  await Promise.all([
    writeState(state),
    chrome.storage.local.remove(SPECIES_KEY),
  ]);
  return state;
}

chrome.idle.setDetectionInterval(IDLE_SECONDS);
ensureHeartbeatAlarm().catch((error) => console.error("Tab Zoo:", error));

if (chrome.tabGroups) {
  // Seed the cache on worker startup; group events are observed synchronously,
  // so quick tab closures cannot erase the group name before queued processing.
  agentGroupsReady = chrome.tabGroups.query({ title: AGENT_GROUP_TITLE }).then(groups => {
    for (const group of groups) agentGroups.add(group.id);
  }).catch(error => console.error("Tab Zoo groups:", error));
  chrome.tabGroups.onCreated.addListener(group => {
    if (group.title === AGENT_GROUP_TITLE) agentGroups.add(group.id);
  });
  chrome.tabGroups.onUpdated.addListener(group => {
    if (group.title === AGENT_GROUP_TITLE) {
      agentGroups.add(group.id);
      enqueue(async () => {
        const tabs = await chrome.tabs.query({ groupId: group.id });
        for (const tab of tabs) await recordAgentTab(tab);
      });
    } else agentGroups.delete(group.id);
  });
  chrome.tabGroups.onRemoved.addListener(group => { enqueue(() => agentGroups.delete(group.id)); });
}

chrome.runtime.onInstalled.addListener(() => {
  enqueue(async () => {
    await ensureHeartbeatAlarm();
    await refreshFocusedTab({ countVisit: false });
  });
});

chrome.runtime.onStartup.addListener(() => {
  enqueue(async () => {
    await ensureHeartbeatAlarm();
    // Tab ids are not stable across browser restarts, and a reopened browser starts a fresh zoo.
    await forgetPreviousBrowserSession();
    await refreshFocusedTab({ countVisit: false });
  });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  enqueue(async () => {
    const tab = await chrome.tabs.get(tabId);
    const window = await chrome.windows.get(tab.windowId);
    if (!window.focused) return;
    await beginTab(tab, Date.now(), { allowRegistration: true });
  });
});

chrome.tabs.onCreated?.addListener(tab => {
  if (tab.groupId >= 0) enqueue(async () => { await agentGroupsReady; await recordAgentTab(tab); });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.groupId >= 0 && (changeInfo.url || Object.hasOwn(changeInfo, "groupId") || changeInfo.status === "loading")) {
    enqueue(async () => { await agentGroupsReady; await recordAgentTab(tab, changeInfo.url || tab.url); });
  }
  if (changeInfo.url || changeInfo.status === "loading") {
    enqueue(async () => {
      if (tab.active) {
        // The window may have closed before this queued event is processed.
        const window = await chrome.windows.get(tab.windowId).catch(() => null);
        if (window.focused) await beginTab(tab, Date.now());
      }
      await forgetClosedDomains();
    });
    return;
  }
  if (!tab.active) return;
  if (Object.hasOwn(changeInfo, "audible")) {
    enqueue(async () => {
      const window = await chrome.windows.get(tab.windowId);
      if (!window.focused) return;
      await beginTab(tab, Date.now(), {
        countVisit: false,
      });
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  enqueue(async () => {
    const state = await readState();
    expireStaleSession(state, Date.now());
    delete state.seenTabs[String(tabId)];
    delete state.registeredTabs[String(tabId)];
    delete state.agentSeenTabs[String(tabId)];
    if (state.session?.tabId === tabId) {
      settleSession(state, Date.now());
    }
    await writeState(state);
    // Closing a tab (or the window holding it) resets any site no longer open in another tab.
    await forgetClosedDomains();
  });
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  enqueue(async () => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      await endCurrentSession();
      return;
    }
    const tabs = await chrome.tabs.query({ active: true, windowId });
    await beginTab(tabs[0] ?? null, Date.now(), { countVisit: false });
  });
});

chrome.idle.onStateChanged.addListener((newState) => {
  enqueue(async () => {
    if (newState === "locked") {
      await endCurrentSession();
      return;
    }
    await refreshFocusedTab({ countVisit: false });
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== HEARTBEAT_ALARM) return;
  enqueue(() => refreshFocusedTab({ countVisit: false }));
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return false;
  if (!["snapshot", "reset", "deleteFossil"].includes(message?.type)) return false;
  enqueue(async () => {
    let state;
    if (message.type === "reset") state = await resetTracking();
    else if (message.type === "deleteFossil") {
      state = await readState();
      state.fossils = state.fossils.filter(fossil => fossil.id !== message.id);
      await writeState(state);
    } else state = await refreshFocusedTab({ countVisit: false, allowRegistration: true });
    sendResponse({ ok: true, state, now: Date.now() });
  });
  return true;
});
