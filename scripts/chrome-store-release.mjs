import { readFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const api = 'https://chromewebstore.googleapis.com';
const item = 'publishers/a67f693a-e486-4bbf-a341-3a03de83dacf/items/oiklijhodjopidofbkdbmonoifkakadk';
const { version } = JSON.parse(await readFile('extension/manifest.json', 'utf8'));
const { CWS_TOKEN, OPERATION } = process.env;
if (!CWS_TOKEN || !['status', 'submit'].includes(OPERATION)) throw new Error('Missing token or invalid operation');

async function request(path, method = 'GET', body) {
  const headers = { Authorization: `Bearer ${CWS_TOKEN}` };
  if (body) headers['Content-Type'] = 'application/zip';
  const response = await fetch(api + path, { method, headers, body, redirect: 'error' });
  if (!response.ok) throw new Error(`Chrome Web Store HTTP ${response.status}: ${await response.text()}`);
  return response.json();
}

const statusPath = `/v2/${item}:fetchStatus`;
const status = await request(statusPath);
const submitted = status.submittedItemRevisionStatus;
const published = status.publishedItemRevisionStatus;
console.log('Submitted:', submitted ?? 'none', 'Published:', published ?? 'none');

if (OPERATION === 'submit') {
  if (['PENDING_REVIEW', 'STAGED'].includes(submitted?.state)) {
    throw new Error('A release is already under review or awaiting publication. Check the dashboard.');
  }
  if (published?.distributionChannels?.some(channel => channel.crxVersion === version)) {
    throw new Error(`Version ${version} has already been published. Increase the manifest version.`);
  }
  const zip = await readFile(`outputs/tab-zoo-extension-${version}.zip`);
  const upload = await request(`/upload/v2/${item}:upload`, 'POST', zip);
  let state = upload.uploadState;
  for (let poll = 0; state === 'IN_PROGRESS' && poll < 30; poll++) {
    await sleep(5000);
    state = (await request(statusPath)).lastAsyncUploadState;
  }
  if (state !== 'SUCCEEDED' || (upload.crxVersion && upload.crxVersion !== version)) {
    throw new Error(`Upload of ${version} could not be confirmed (${state}). Check the dashboard.`);
  }
  const receipt = await request(`/v2/${item}:publish`, 'POST');
  console.log(`Review submission for ${version}:`, receipt);
}
