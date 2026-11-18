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

## 2026-11-18 — Explore AI agent browsing in Tab Zoo

- Status: proposal; product design and feasibility not yet decided.
- Proposer: `mow-coding` (human), who reports having discussed the idea previously with `dongseok2001-creator`.
- Idea: people are not the only browser users; exploring where AI agents browse could be an interesting use for Tab Zoo. Consider supporting Chrome, Edge, and Aside.
- Context: the current extension is built around open tabs and focused activity. Whether it can observe an agent's tabs, distinguish them from a person's tabs, or retain activity after tabs close depends on the browser, profile, APIs, and agent. None of those capabilities is confirmed here.
- Before implementing: investigate browser support and privacy, agree what activity should be shown and for how long, and obtain product direction for any UI changes. Do not assume access to other profiles, separate agent browsers, or private task details.
- Evidence: `mow-coding`'s description in the collaboration conversation; details of the earlier discussion have not been independently established.
