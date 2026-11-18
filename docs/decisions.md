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

## 2026-11-18 — Fossils, collection, and useful signals

- Status: product direction decided; individual designs and AI identification remain under investigation.
- Proposer: `mow-coding` (human). `mow-coding` reports that `dongseok2001-creator` liked the collection idea; the friend's exact wording has not been independently recorded.
- Decision: explore a practical, approachable view of browser activity as well as playful visuals. When an animal leaves, preserve it as a fossil in a collection rather than losing it forever. AI activity needs an event-based approach distinct from human foreground dwell time.
- Rationale: a person may want to see sites an agent visited in the background or quickly closed while they were away. The proposer also suggested unusual creatures as a possible way to communicate suspicious sites.
- Safety constraint: unknown or unusual is not evidence that a site is dangerous. No risk verdict or alarming warning should be presented without a reliable source and a clearly explained basis; privacy, reliability, and applicable service terms must be reviewed first.
- Implementation choice by `mow-coding`'s Codex: keep the fossil collection locally until the user deletes entries, recording the site domain, animal, duration, and departure time but not full URLs or titles. Current-zoo reset preserves the collection. Agent attribution is not assumed from a background tab alone.
- Evidence: `mow-coding`'s instructions in the collaboration conversation.

## 2026-11-18 — Observe Aside Agent Tabs visits

- Status: implemented for the observed Aside tab-group behavior, subject to browser compatibility limits.
- Proposer and decision maker: `mow-coding` (human) requested a working view of sites visited by an AI while the person is away; implementation selected by `mow-coding`'s Codex.
- An isolated Aside test showed an agent-opened test tab in a Chrome tab group titled `Agent Tabs` and a separately opened ordinary tab outside that group. Observe that group, count domain arrivals separately from human foreground time, and keep them in the local fossil collection until deletion.
- This is a group-name heuristic, not proof of AI authorship: a user can rename or create such a group, behavior can change, other profiles and non-tab network requests are not visible, and very short visits may be missed before group assignment. Never report these limits as universal AI monitoring.
- Store only the registrable domain, count, animal and timestamp; update the privacy notice. The added `tabGroups` permission may require user acceptance during an extension update.

## 2026-11-18 — Signature animal and colour

- Status: decided for the proposed brand identity; artwork and release implementation are pending.
- Proposer and decision maker: `mow-coding` (human). Input from `dongseok2001-creator` on this specific decision has not been recorded.
- Decision: use Tab Zoo's existing red T-rex as the signature animal, against a dark green background. Explore a close-up pixel-art face for the extension icon, keeping the existing character recognisable.
- Context: the current extension includes seven species and a typography-based icon. The idea is to give the project an identifiable character grounded in its existing artwork.
- Still open: the exact artwork, left/right/front-facing direction, icon dimensions and final adoption in the extension. Review comparable store icons and small-size legibility before choosing a direction. Do not represent a draft as an approved final icon.
- Evidence: `mow-coding`'s instruction in the collaboration conversation; the conversation itself is not public.
