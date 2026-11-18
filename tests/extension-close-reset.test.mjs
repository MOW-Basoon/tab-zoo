import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const extensionRoot = new URL("../extension/", import.meta.url);

function eventSlot() {
  return { addListener(listener) { this.listener = listener; } };
}

function record(totalMs) {
  return { totalMs, sessionsMs: [totalMs], visits: [], lastSeen: 1, title: "", url: "" };
}

async function loadBackground({ openTabs, state }) {
  const data = { tabZooStateV1: state, tabZooSpeciesMapV1: { "legacy.com": "cat" } };
  const chrome = {
    storage: {
      local: {
        async get(key) {
          return typeof key === "string" ? { [key]: data[key] } : { ...data };
        },
        async set(values) { Object.assign(data, values); },
        async remove(key) { delete data[key]; },
      },
    },
    idle: {
      setDetectionInterval() {},
      async queryState() { return "active"; },
      onStateChanged: eventSlot(),
    },
    alarms: {
      async get() { return { name: "tab-zoo-heartbeat" }; },
      async create() {},
      onAlarm: eventSlot(),
    },
    runtime: {
      onInstalled: eventSlot(),
      onStartup: eventSlot(),
      onMessage: eventSlot(),
    },
    tabs: {
      async query() { return openTabs; },
      onActivated: eventSlot(),
      onUpdated: eventSlot(),
      onRemoved: eventSlot(),
    },
    windows: {
      WINDOW_ID_NONE: -1,
      async getLastFocused() { return { id: -1, focused: false }; },
      onFocusChanged: eventSlot(),
    },
  };

  const source = await readFile(new URL("background.js", extensionRoot), "utf8");
  const context = vm.createContext({ chrome, console, URL });
  const vendor = await readFile(new URL("vendor/tldts-7.5.4.min.js", extensionRoot), "utf8");
  const domain = await readFile(new URL("domain.js", extensionRoot), "utf8");
  context.importScripts = () => {};
  vm.runInContext(vendor + "\n" + domain + "\n" + source, context);
  return { chrome, data, context, drain: () => vm.runInContext("taskQueue", context) };
}

test("subdomains share an animal and the final close removes the combined record", async () => {
  const state = baseState();
  state.records = { "uos.ac.kr": record(60000), "portal.uos.ac.kr": { ...record(120000), url: "https://portal.uos.ac.kr/private?token=example", title: "private" } };
  state.speciesMap = { "uos.ac.kr": "cat", "portal.uos.ac.kr": "fox" };
  state.seenTabs = { 1: "uos.ac.kr", 2: "portal.uos.ac.kr" };
  state.session = { tabId: 2, domain: "portal.uos.ac.kr", startedAt: 1, lastHeartbeatAt: 1 };
  const openTabs = [{ id: 2, url: "https://portal.uos.ac.kr/" }];
  const { chrome, data, drain } = await loadBackground({ openTabs, state });
  chrome.tabs.onRemoved.listener(1);
  await drain();
  const merged = data.tabZooStateV1;
  assert.equal(merged.records["uos.ac.kr"].totalMs, 180000);
  assert.equal(merged.speciesMap["uos.ac.kr"], "fox");
  assert.equal(merged.records["uos.ac.kr"].url, undefined);
  assert.equal(merged.records["uos.ac.kr"].title, undefined);
  assert.equal(merged.seenTabs[2], "uos.ac.kr");
  openTabs.length = 0;
  chrome.tabs.onRemoved.listener(2);
  await drain();
  assert.equal(data.tabZooStateV1.records["uos.ac.kr"], undefined);
});

test("tracking does not persist a tab's full URL or title", async () => {
  const state = baseState();
  const { data, context } = await loadBackground({ openTabs: [], state });
  context.tab = { id: 42, windowId: 1, url: "https://portal.uos.ac.kr/private?token=example", title: "private title" };
  await vm.runInContext("beginTab(tab, 100000)", context);
  const record = data.tabZooStateV1.records["uos.ac.kr"];
  assert.ok(record);
  assert.equal(record.url, undefined);
  assert.equal(record.title, undefined);
  assert.doesNotMatch(JSON.stringify(data.tabZooStateV1), /token=example|private title/);
});

function baseState() {
  return {
    records: { "a.com": record(60000), "b.com": record(120000) },
    seenTabs: { 1: "a.com", 2: "b.com", 3: "b.com" },
    registeredTabs: {},
    activationGate: false,
    resetAt: 0,
    session: null,
    speciesStateVersion: 1,
    speciesGeneration: 0,
    speciesMap: { "a.com": "fox", "b.com": "duck" },
  };
}

test("closing the last tab of a site resets that site's animal", async () => {
  const openTabs = [
    { id: 2, url: "https://b.com/" },
    { id: 3, url: "https://b.com/x" },
  ];
  const { chrome, data, drain } = await loadBackground({ openTabs, state: baseState() });

  chrome.tabs.onRemoved.listener(1, { windowId: 1, isWindowClosing: false });
  await drain();

  const state = data.tabZooStateV1;
  assert.equal(state.records["a.com"], undefined);
  assert.equal(state.speciesMap["a.com"], undefined);
  assert.equal(state.records["b.com"].totalMs, 120000);
  assert.equal(state.speciesMap["b.com"], "duck");
});

test("a site still open in another tab keeps its animal", async () => {
  const openTabs = [
    { id: 1, url: "https://a.com/" },
    { id: 3, url: "https://b.com/x" },
  ];
  const { chrome, data, drain } = await loadBackground({ openTabs, state: baseState() });

  chrome.tabs.onRemoved.listener(2, { windowId: 1, isWindowClosing: false });
  await drain();

  assert.equal(data.tabZooStateV1.records["b.com"].totalMs, 120000);
  assert.equal(data.tabZooStateV1.speciesMap["b.com"], "duck");
});

test("closing a window resets every site that was only open there", async () => {
  const openTabs = [];
  const { chrome, data, drain } = await loadBackground({ openTabs, state: baseState() });

  for (const tabId of [1, 2, 3]) {
    chrome.tabs.onRemoved.listener(tabId, { windowId: 1, isWindowClosing: true });
  }
  await drain();

  assert.deepEqual(Object.keys(data.tabZooStateV1.records), []);
  assert.deepEqual(Object.keys(data.tabZooStateV1.speciesMap), []);
});

test("restarting the browser starts a fresh zoo", async () => {
  const openTabs = [{ id: 10, url: "https://a.com/" }];
  const state = { ...baseState(), session: { tabId: 1, windowId: 1, domain: "a.com", startedAt: 1, lastHeartbeatAt: 1 } };
  const { chrome, data, drain } = await loadBackground({ openTabs, state });

  chrome.runtime.onStartup.listener();
  await drain();

  const next = data.tabZooStateV1;
  assert.deepEqual(Object.keys(next.records), []);
  assert.deepEqual(Object.keys(next.speciesMap), []);
  assert.deepEqual(Object.keys(next.seenTabs), []);
  assert.equal(next.session, null);
  assert.equal(data.tabZooSpeciesMapV1, undefined);
});
