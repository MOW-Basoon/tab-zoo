import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { compareVersions } from './chrome-version.mjs';

export function releaseOperation(oldVersion, newVersion, sha, repository, getPulls) {
  const change = compareVersions(newVersion, oldVersion);
  if (change < 0) throw new Error(`Manifest version decreased from ${oldVersion} to ${newVersion}.`);
  if (change === 0) return 'skip';
  const merged = getPulls().find(pr => pr.merged_at && pr.merge_commit_sha === sha
    && pr.base.ref === 'main' && pr.base.repo.full_name === repository);
  return merged ? 'submit' : 'skip';
}

function checkPush() {
  const { BEFORE_SHA, GITHUB_SHA, GITHUB_REPOSITORY, GITHUB_OUTPUT } = process.env;
  function versionAt(sha) {
    if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Expected a commit SHA from the main push event.');
    return JSON.parse(execFileSync('git', ['show', `${sha}:extension/manifest.json`], { encoding: 'utf8' })).version;
  }
  const oldVersion = versionAt(BEFORE_SHA);
  const newVersion = versionAt(GITHUB_SHA);
  const operation = releaseOperation(oldVersion, newVersion, GITHUB_SHA, GITHUB_REPOSITORY, () =>
    JSON.parse(execFileSync('gh', [
      'api', '--paginate', '--slurp', `repos/${GITHUB_REPOSITORY}/commits/${GITHUB_SHA}/pulls`,
    ], { encoding: 'utf8' })).flat());
  console.log(`${oldVersion} -> ${newVersion}: ${operation}`);
  appendFileSync(GITHUB_OUTPUT, `operation=${operation}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) checkPush();
