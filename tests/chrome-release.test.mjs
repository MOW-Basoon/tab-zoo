import assert from 'node:assert/strict';
import test from 'node:test';
import { releaseOperation } from '../scripts/chrome-release-gate.mjs';
import { compareVersions } from '../scripts/chrome-version.mjs';

const repository = 'MOW-Basoon/tab-zoo';
const sha = 'merged-sha';
const pr = { merged_at: '2026-11-22', merge_commit_sha: sha, base: { ref: 'main', repo: { full_name: repository } } };

test('a numeric version increase in the merged main PR requests store review', () => {
  assert.equal(releaseOperation('1.9.99', '1.10', sha, repository, () => [pr]), 'submit');
  assert.equal(compareVersions('1.0.0.1', '1'), 1);
});

test('unchanged and equivalent versions skip even the PR lookup', () => {
  for (const version of ['1.2', '1.2.0', '1.2.0.0']) {
    assert.equal(releaseOperation('1.2', version, sha, repository, assert.fail), 'skip');
  }
});

test('direct pushes and unrelated, open or unmerged PRs do not submit', () => {
  for (const pulls of [[], [{ ...pr, merged_at: null }], [{ ...pr, merge_commit_sha: 'other' }],
    [{ ...pr, base: { ...pr.base, ref: 'dev' } }], [{ ...pr, base: { ref: 'main', repo: { full_name: 'another/repo' } } }]]) {
    assert.equal(releaseOperation('1', '2', sha, repository, () => pulls), 'skip');
  }
});

test('downgrades and invalid Chrome versions fail before any store access', () => {
  assert.throws(() => releaseOperation('2', '1', sha, repository, assert.fail), /decreased/);
  for (const invalid of ['0.0', '01.2', '1.65536', '1.2.3.4.5', '2-beta', undefined]) {
    assert.throws(() => compareVersions(invalid, '1'), /Invalid Chrome version/);
  }
});
