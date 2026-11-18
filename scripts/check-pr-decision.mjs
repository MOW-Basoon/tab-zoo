import { readFileSync } from 'node:fs';

// Read PR text as data, including for PRs opened from forks.
const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const body = (event.pull_request.body ?? '').replace(/<!--[\s\S]*?-->/g, '');
const declarations = [...body.matchAll(/^(Decision record|Routine change):[ \t]*(\S[^\r\n]*)/gm)];
if (declarations.length !== 1) {
  throw new Error('Include one Decision record: <exact heading> or Routine change: <reason> in the PR body.');
}
const [, kind, value] = declarations[0];
if (kind === 'Decision record') {
  const log = readFileSync(new URL('../docs/decisions.md', import.meta.url), 'utf8');
  if (!log.split(/\r?\n/).includes(`## ${value.trim()}`)) {
    throw new Error('Decision record must match a dated heading in docs/decisions.md.');
  }
}
