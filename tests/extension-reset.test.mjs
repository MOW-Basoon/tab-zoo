import assert from "node:assert/strict";
import { webcrypto as crypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const extensionRoot = new URL("../extension/", import.meta.url);

function eventSlot() {
  return { addListener(listener) { this.listener = listener; } };
}

test("repeated resets clear the current species map and tracking records", async () => {
  const data = {
    tabZooSpeciesMapV1: { "example.com": "cat" },
    tabZooStateV1: { fossils: [{ id: "one", domain: "example.com", species: "cat", totalMs: 123, departedAt: 1 }] },
  };
  const runtimeMessage = eventSlot();
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
      id: "extension-id",
      onInstalled: eventSlot(),
      onStartup: eventSlot(),
      onMessage: runtimeMessage,
    },
    tabs: {
      onActivated: eventSlot(),
      onUpdated: eventSlot(),
      onRemoved: eventSlot(),
    },
    windows: {
      WINDOW_ID_NONE: -1,
      onFocusChanged: eventSlot(),
    },
  };

  const source = await readFile(new URL("background.js", extensionRoot), "utf8");
  const context = vm.createContext({ chrome, console, URL, crypto });
  const vendor = await readFile(new URL("vendor/tldts-7.5.4.min.js", extensionRoot), "utf8");
  const domain = await readFile(new URL("domain.js", extensionRoot), "utf8");
  context.importScripts = () => {};
  vm.runInContext(vendor + "\n" + domain + "\n" + source, context);

  const reset = () => new Promise((resolve) => {
    const handled = runtimeMessage.listener({ type: "reset" }, { id: "extension-id" }, resolve);
    assert.equal(handled, true);
  });

  await reset();
  assert.equal(data.tabZooSpeciesMapV1, undefined);
  assert.equal(Object.keys(data.tabZooStateV1.records).length, 0);
  assert.equal(data.tabZooStateV1.speciesGeneration, 1);
  assert.equal(Object.keys(data.tabZooStateV1.speciesMap).length, 0);
  assert.equal(data.tabZooStateV1.fossils.length, 1, "reset preserves the collection");

  // Simulate an old popup writing its stale, separate map after reset.
  data.tabZooSpeciesMapV1 = { "example.com": "duck" };
  const stateAfterStaleWrite = await vm.runInContext("readState()", context);
  assert.equal(Object.keys(stateAfterStaleWrite.speciesMap).length, 0);

  await reset();
  assert.equal(data.tabZooSpeciesMapV1, undefined);
  assert.equal(Object.keys(data.tabZooStateV1.records).length, 0);
  assert.equal(data.tabZooStateV1.speciesGeneration, 2);
  assert.equal(Object.keys(data.tabZooStateV1.speciesMap).length, 0);
  assert.equal(runtimeMessage.listener({ type: "deleteFossil", id: "one" }, { id: "other-extension" }, () => {}), false);
  const deleted = await new Promise(resolve => runtimeMessage.listener({ type: "deleteFossil", id: "one" }, { id: "extension-id" }, resolve));
  assert.equal(deleted.ok, true);
  assert.equal(data.tabZooStateV1.fossils.length, 0);
  assert.deepEqual([...data.tabZooStateV1.discoveredSpecies], ["cat"], "deleting a legacy fossil retains only the species in the guide");
});

test("a new assignment selects from the complete species list", async () => {
  const source = await readFile(new URL("background.js", extensionRoot), "utf8");
  const functionSource = source.slice(source.indexOf("function assignSpecies("), source.indexOf("async function writeState("));
  assert.ok(functionSource, "assignSpecies function should be present");

  const species = ["sauropod", "trex", "triceratops", "cat", "fox", "duck", "elephant"];
  for (const [index, expected] of species.entries()) {
    const state = { speciesMap: {}, discoveredSpecies: [] };
    const math = Object.create(Math);
    math.random = () => (index + 0.5) / species.length;
    const assigned = vm.runInNewContext(
      `${functionSource}; assignSpecies(state, "example.com")`,
      { species, state, Math: math },
    );
    assert.equal(assigned, expected);
    assert.equal(state.speciesMap["example.com"], assigned);
    assert.deepEqual(state.discoveredSpecies, [expected]);
  }
});
