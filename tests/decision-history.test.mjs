import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const log = readFileSync(new URL('../docs/decisions.md', import.meta.url), 'utf8');
const sections = log.replaceAll('\r\n', '\n').split(/^## /m).slice(1);
const roles = ['Proposed by', 'Decided by', 'Approved by', 'Implemented by'];
const actor = /^(DS|basoon) \((human|Claude|Codex)\)$/;

function field(lines, label) {
  const prefix = `- ${label}: `;
  const matches = lines.filter(line => line.startsWith(prefix));
  assert.equal(matches.length, 1, `Expected one "${label}" field`);
  const value = matches[0].slice(prefix.length).trim();
  assert.ok(value, `Empty "${label}" field`);
  return value;
}

test('decision history contains dated entries', () => {
  assert.ok(sections.length > 0);
});

for (const section of sections) {
  const [title, ...lines] = section.split('\n');
  test(`decision record: ${title}`, () => {
    assert.match(title, /^\d{4}-\d{2}-\d{2} — \S/);
    for (const role of roles) {
      const value = field(lines, role);
      if (value === 'unknown' || value === 'pending') continue;
      for (const contributor of value.split(', ')) {
        assert.match(contributor, actor, `Invalid actor in "${role}": ${contributor}`);
        if (role === 'Approved by') {
          assert.ok(contributor.endsWith(' (human)'), 'Approval requires a human actor');
        }
      }
    }
    field(lines, 'Basis');
  });
}
