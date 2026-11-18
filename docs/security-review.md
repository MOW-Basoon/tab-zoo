# Security and privacy review — 2026-11-18

Reviewer: `mow-coding`'s Codex. Scope: extension runtime source, manifest, privacy notice, and packaging script in this branch. This is a source review, not an external penetration test or proof of complete security.

- The extension requests `tabs`, `storage`, `favicon`, `idle`, and `alarms`; `tabs` exposes sensitive browsing metadata and is needed for the current automatic grouping feature. Reconsider the permission if the feature changes.
- The previous background worker stored the full URL and title even though the popup did not use them. URLs may contain sensitive information. This change stops writing those fields and removes legacy fields as state is next read and saved.
- Site-colour and motion-position caches can retain domain keys after an animal's tracking record is deleted. The privacy notice now discloses this. Reset currently preserves colours by design; consider a separate explicit full-data deletion option before release if desired.
- No outbound network call or remote script load was found in the reviewed runtime source. Favicons use Chrome's extension favicon endpoint. This static review does not establish all browser or network behavior; verify in a real browser before release.
- Popup text derived from sites uses text nodes or escaping in the inspected rendering path. Review any new HTML interpolation and untrusted inputs when modifying it.
- The dependency and public suffix data are packaged locally; update and review the library and its license periodically. The list is a grouping heuristic, not a security or ownership boundary.
- Web Store policy, installed-browser behavior, hostile-page behavior, and third-party dependency vulnerabilities were not comprehensively verified. Reassess before publishing and disclose sensitive findings privately to the owner.
