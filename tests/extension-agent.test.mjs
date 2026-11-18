import assert from "node:assert/strict";
import { webcrypto as crypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../extension/", import.meta.url);
const files = await Promise.all(["vendor/tldts-7.5.4.min.js", "domain.js", "background.js"].map(path => readFile(new URL(path, root), "utf8")));
const slot = () => ({ addListener(fn) { this.listener = fn; } });

async function harness(groups = [{ id: 7, title: "Agent Tabs" }]) {
  const data = {};
  const chrome = {
    storage: { local: { async get() { return structuredClone(data); }, async set(v) { Object.assign(data, structuredClone(v)); }, async remove(k) { delete data[k]; } } },
    idle: { setDetectionInterval() {}, async queryState() { return "active"; }, onStateChanged:slot() },
    alarms: { async get() { return {}; }, async create() {}, onAlarm:slot() },
    runtime: { onInstalled:slot(), onStartup:slot(), onMessage:slot() },
    tabs: { onCreated:slot(), onUpdated:slot(), onRemoved:slot(), onActivated:slot(), async query() { return []; } },
    tabGroups: { async query(query) { return groups.filter(group => !query.title || group.title === query.title); }, onCreated:slot(), onUpdated:slot(), onRemoved:slot() },
    windows: { WINDOW_ID_NONE:-1, onFocusChanged:slot() },
  };
  const context = vm.createContext({ chrome, URL, crypto, console, importScripts() {} });
  vm.runInContext(files.join("\n"), context);
  await vm.runInContext("agentGroupsReady", context);
  const drain = async () => { await vm.runInContext("taskQueue", context); };
  return { chrome, data, drain };
}

test("background Agent Tabs visits survive rapid closure without storing a full URL", async () => {
  const { chrome, data, drain } = await harness();
  const tab = { id: 5, groupId: 7, active: false, url: "https://portal.uos.ac.kr/private?token=secret" };
  chrome.tabs.onUpdated.listener(5, { groupId: 7 }, tab);
  chrome.tabs.onUpdated.listener(5, { url: tab.url }, tab);
  chrome.tabs.onRemoved.listener(5);
  chrome.tabGroups.onRemoved.listener({ id: 7 });
  await drain();
  const fossils = data.tabZooStateV1.fossils;
  assert.equal(fossils.length, 1);
  assert.equal(fossils[0].domain, "uos.ac.kr");
  assert.equal(fossils[0].source, "agent-group");
  assert.equal(fossils[0].visits, 1);
  assert.doesNotMatch(JSON.stringify(data), /token=secret|\/private/);
});

test("ordinary groups and ungrouped background tabs are not labelled as agents", async () => {
  const { chrome, data, drain } = await harness([{ id: 9, title: "Work" }]);
  for (const groupId of [-1, 9]) chrome.tabs.onUpdated.listener(10, { url: "https://example.com/" }, { id: 10, groupId, active: false, url: "https://example.com/" });
  await drain();
  assert.equal(data.tabZooStateV1?.fossils?.length ?? 0, 0);
});

test("different agent tabs to the same site increase its visit count", async () => {
  const { chrome, data, drain } = await harness();
  for (const id of [11, 12]) chrome.tabs.onUpdated.listener(id, { url: "https://example.com/" }, { id, groupId: 7, active: false, url: "https://example.com/" });
  await drain();
  assert.equal(data.tabZooStateV1.fossils[0].visits, 2);
});
