# Decision history

Important decisions belong here, not every small edit. Use GitHub handles, distinguish AI proposals from human decisions, cite evidence when available, and never include private data. Add a new entry when a decision changes; do not erase its history.

## Before 2026-11-18 — Existing project context

- Status: background, not a newly attributed decision.
- `mow-coding` reports this is their first work on this repository and the existing work is `dongseok2001-creator`'s. The owner uses Claude. For any particular earlier choice, whether the owner or Claude proposed or decided it is not established.
- Evidence: `mow-coding`'s account in the collaboration conversation; existing repository history. Do not infer authorship of individual decisions from tool use or commit authorship.

## 2026-11-18 — Shared decision history

- Status: decided.
- Proposer and decision maker: `mow-coding` (human).
- Context: people and their AI assistants collaborate on the same public repository. Commit authorship alone does not explain why a choice was made or who made it.
- Decision: use repository instructions shared by Codex and Claude, and record significant decisions with attribution and rationale. Do not change GitHub settings to enforce this workflow. Keep real names and private information out of public records.
- Evidence: instructions from `mow-coding` in the collaboration planning conversation; the conversation itself is not public.

## 2026-11-18 — Group related subdomains

- Status: decided for product behavior; implementation selected and pending release verification.
- Proposer: `mow-coding` (human) raised the issue; `mow-coding`'s Codex proposed registrable-domain grouping and evaluating `tldts` with private suffixes enabled.
- Decision maker: `mow-coding` (human); owner input has not been recorded.
- Decision: group subdomains by registrable domain by default. For now Gmail and Google Drive may be grouped together. Separate independently hosted sites such as different `github.io` users using the private section of the Public Suffix List.
- Rationale: `uos.ac.kr` and `portal.uos.ac.kr` feel like one site. A maintained public suffix list avoids a manually maintained list of websites, while recognizing shared hosting boundaries. This is a practical heuristic, not proof of common ownership.
- Evidence: collaboration planning conversation; [Public Suffix List](https://publicsuffix.org/); [tldts documentation](https://github.com/remusao/tldts).
- Implementation: `mow-coding`'s Codex selected bundled `tldts` 7.5.4 with private suffixes enabled. It is an implementation choice under the approved behavior, not a claim that the owner personally chose this library. Update the bundled version and license together when the list is refreshed.
