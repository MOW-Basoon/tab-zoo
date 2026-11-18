import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../extension/", import.meta.url);
const vendor = await readFile(new URL("vendor/tldts-7.5.4.min.js", root), "utf8");
const rule = await readFile(new URL("domain.js", root), "utf8");
const context = vm.createContext({ URL });
vm.runInContext(`${vendor}\n${rule}`, context);
function group(url) { context.input = url; return vm.runInContext("domainFromUrl(input)", context); }

test("grouping uses registrable domains including private suffixes", () => {
  assert.equal(group("https://uos.ac.kr"), "uos.ac.kr");
  assert.equal(group("https://portal.uos.ac.kr/path"), "uos.ac.kr");
  assert.equal(group("https://other.ac.kr"), "other.ac.kr");
  assert.equal(group("https://mail.google.com"), "google.com");
  assert.equal(group("https://drive.google.com"), "google.com");
  assert.equal(group("https://alice.github.io"), "alice.github.io");
  assert.equal(group("https://bob.github.io"), "bob.github.io");
  assert.equal(group("http://localhost:3000"), "localhost");
  assert.equal(group("http://127.0.0.1:8080"), "127.0.0.1");
  assert.equal(group("chrome://settings"), null);
  assert.equal(group("not a URL"), null);
});
