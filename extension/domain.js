/* Shared grouping rule. tldts and the Public Suffix List are bundled locally. */
function domainFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    return tldts.getDomain(host, { allowPrivateDomains: true }) || host;
  } catch {
    return null;
  }
}
