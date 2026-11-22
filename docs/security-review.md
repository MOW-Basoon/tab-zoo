# Security and privacy review — 2026-11-18

Reviewer: `basoon (Codex)`. Scope: extension runtime source, manifest, privacy notice, and packaging script in this branch. This is a source review, not an external penetration test or proof of complete security.

- The extension requests `tabs`, `storage`, `favicon`, `idle`, and `alarms`; `tabs` exposes sensitive browsing metadata and is needed for the current automatic grouping feature. Reconsider the permission if the feature changes.
- The previous background worker stored the full URL and title even though the popup did not use them. URLs may contain sensitive information. This change stops writing those fields and removes legacy fields as state is next read and saved.
- Site-colour and motion-position caches can retain domain keys after an animal's tracking record is deleted. The privacy notice now discloses this. Reset currently preserves colours by design; consider a separate explicit full-data deletion option before release if desired.
- No outbound network call or remote script load was found in the reviewed runtime source. Favicons use Chrome's extension favicon endpoint. This static review does not establish all browser or network behavior; verify in a real browser before release.
- Popup text derived from sites uses text nodes or escaping in the inspected rendering path. Review any new HTML interpolation and untrusted inputs when modifying it.
- The dependency and public suffix data are packaged locally; update and review the library and its license periodically. The list is a grouping heuristic, not a security or ownership boundary.
- Web Store policy, installed-browser behavior, hostile-page behavior, and third-party dependency vulnerabilities were not comprehensively verified. Reassess before publishing and disclose sensitive findings privately to the owner.

## Follow-up — 2026-11-22

Reviewer: `basoon (Codex)`. Reviewed the current manifest, extension scripts and new popup rendering paths. The runtime still uses locally bundled scripts; the new species artwork comes from bundled data, and domain-derived names rendered into creature markup are escaped. This is a static review of these paths, not a penetration test. The retained domain-keyed colour and position caches still need a complete deletion control.

The npm audit command cannot run for this project because there is no npm lockfile. The extension bundles tldts and Public Suffix List data rather than declaring them as npm dependencies, so npm audit would not assess those bundled files even with a lockfile. Their upstream vulnerability and update status remains to be reviewed separately.

On 2026-11-22, the upstream GitHub advisory list contained [GHSA-mf82-cgp5-3vmq](https://github.com/remusao/tldts/security/advisories/GHSA-mf82-cgp5-3vmq), affecting versions through 7.4.23. The bundled version is 7.5.4, outside that advisory's affected range. The npm registry listed 7.5.5 as the latest release. This comparison is not a complete third-party security audit.
