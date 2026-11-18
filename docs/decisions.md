# Decision history

Important decisions belong here, not every small edit. Use GitHub handles, distinguish AI proposals from human decisions, cite evidence when available, and never include private data. Add a new entry when a decision changes; do not erase its history.

## Original project and decision credit

Tab Zoo was created by `dongseok2001-creator`. Before the collaboration, the project already turned sites into seven species of pixel animals, coloured them from favicons, grew them with foreground time, put them to sleep after inactivity, and removed them when their site's last tab closed. The red T-rex and the three habitats were already part of the original project. See the [README before the first collaborative PR](https://github.com/dongseok2001-creator/tab-zoo/blob/7de031a/README.md).

**Attribution correction, 2026-11-18.** At `mow-coding`'s request, credit project decisions to `dongseok2001-creator` by default. Credit a decision to `mow-coding` only when they explicitly claim or confirm it as their own. This corrects earlier entries that treated requests for work as personal decisions. The default assigns project credit; personal approval by the owner or authorship by the owner's Claude requires separate evidence. The entries below preserve known proposals and implementation contributions.

## 원작자 dongseok2001-creator의 제품 결정

아래는 협업을 시작하기 전 0.1.10에 이미 구현된 결정이다. 2026-11-18에 당시 버전을 대조해 소급 기록했다. 각 결정의 귀속은 원작자 `dongseok2001-creator`이며, 최초 결정 날짜와 항목별 AI 참여 여부는 확인되지 않았다.

| 원작자가 정한 것 | 원래 동작과 사용자에게 보이는 의미 | 당시 근거 |
| --- | --- | --- |
| 열린 사이트를 픽셀 동물원으로 표현 | 브라우저 팝업을 열면 현재 열어 둔 사이트가 동물로 나타난다. | [원본 소개][original-readme] |
| 같은 사이트에는 한 마리 배정 | 같은 호스트의 탭을 여러 개 열어도 한 마리를 보여준다. 당시에는 호스트명에서 앞의 `www.`를 제거했다. [협업 후 서브도메인 묶음 기준 변경](#2026-11-18--group-related-subdomains). | [사이트 식별 코드][original-bg] |
| 처음 방문한 사이트에 7종 중 한 종 배정 | 브라키오·티라노·트리케라·고양이·사막여우·오리·코끼리 중 하나가 알에서 자란다. 빨간 티라노는 이때부터 있던 캐릭터다. | [원본 소개][original-readme], [그림 제작 기록][original-art] |
| 사이트 아이콘의 색을 동물에 반영 | 사이트마다 파비콘에서 대표색을 가져와 동물의 몸 색을 정한다. | [원본 소개][original-readme] |
| 앞에 띄워 본 시간으로 성장 | 누적 1분에 알에서 유년체로, 5분에 성체로 자란다. 이후 60분과 120분을 기준으로 크기가 달라진다. | [성장 기준표][original-readme], [성장 계산][original-popup] |
| 이용 습관이 체형에 반영 | 한 번에 오래 보면 통통해지고 자주 전환하면 날렵해진다. 같은 종도 이용 방식에 따라 다르게 보인다. | [원본 소개][original-readme], [체형 계산][original-popup] |
| 오래 보지 않은 동물은 휴식 | 마지막으로 본 뒤 10분부터 졸고 35분부터 잠든 모습으로 표시한다. | [휴식 상태 계산][original-popup] |
| 자리를 비운 시간은 체류 시간에서 제외 | 입력이 없거나 화면이 잠기거나 창이 포커스를 잃으면 시간 누적을 멈춘다. 소리가 나는 탭은 계속 재생하는 경우를 고려했다. | [시간 측정 설명][original-readme], [시간 기록][original-bg] |
| 마지막 탭을 닫으면 동물이 떠남 | 같은 사이트의 마지막 탭을 닫으면 현재 동물의 기록이 사라지고 다음 방문은 새 알에서 시작했다. [협업 후 떠난 동물을 화석으로 남기는 기능 추가](#2026-11-18--fossils-collection-and-useful-signals). | [원래 생명 주기][original-readme] |
| 동물을 눌러 해당 탭으로 이동 | 동물원에서 사이트 하나를 골라 열려 있는 탭으로 바로 돌아갈 수 있다. | [팝업 동작][original-popup] |
| 세 가지 서식지 제공 | 사용자가 초원·시베리아·사막 중 원하는 맵을 고른다. | [원본 소개][original-readme] |
| 사용 기록을 브라우저 안에 보관 | 원래 방침은 사이트 이용 기록과 설정을 로컬에 저장하고 개발자 서버로 전송하지 않는 것이었다. 당시 저장 항목은 당시 방침에, 현재 항목은 [현행 개인정보처리방침](../extension/PRIVACY.md)에 적혀 있다. | [0.1.10 개인정보처리방침][original-privacy] |

[original-readme]: https://github.com/dongseok2001-creator/tab-zoo/blob/7de031a0279fbc6b2978885941d666111a5a1d33/README.md
[original-bg]: https://github.com/dongseok2001-creator/tab-zoo/blob/7de031a0279fbc6b2978885941d666111a5a1d33/extension/background.js
[original-popup]: https://github.com/dongseok2001-creator/tab-zoo/blob/7de031a0279fbc6b2978885941d666111a5a1d33/extension/popup.js
[original-art]: https://github.com/dongseok2001-creator/tab-zoo/blob/7de031a0279fbc6b2978885941d666111a5a1d33/extension/assets/ARTWORK.md
[original-privacy]: https://github.com/dongseok2001-creator/tab-zoo/blob/7de031a0279fbc6b2978885941d666111a5a1d33/extension/PRIVACY.md

## 2026-11-18 — Shared decision history

- Status: decided.
- Project decision credit: `dongseok2001-creator` (default). Workflow requested by `mow-coding`.
- Context: people and their AI assistants collaborate on the same public repository. Commit authorship alone does not explain why a choice was made or who made it.
- Decision: use repository instructions shared by Codex and Claude, and record significant decisions with attribution and rationale. Do not change GitHub settings to enforce this workflow. Keep real names and private information out of public records.
- Evidence: instructions from `mow-coding` in the collaboration planning conversation; the conversation itself is not public.

## 2026-11-18 — Group related subdomains

- Status: decided for product behavior; implementation selected and pending release verification.
- Proposer: `mow-coding` (human) raised the issue; `mow-coding`'s Codex proposed registrable-domain grouping and evaluating `tldts` with private suffixes enabled.
- Project decision credit: `dongseok2001-creator` (default). `mow-coding` asked to keep Gmail and Drive together for now.
- Decision: group subdomains by registrable domain by default. For now Gmail and Google Drive may be grouped together. Separate independently hosted sites such as different `github.io` users using the private section of the Public Suffix List.
- Rationale: `uos.ac.kr` and `portal.uos.ac.kr` feel like one site. A maintained public suffix list avoids a manually maintained list of websites, while recognizing shared hosting boundaries. This is a practical heuristic, not proof of common ownership.
- Evidence: collaboration planning conversation; [Public Suffix List](https://publicsuffix.org/); [tldts documentation](https://github.com/remusao/tldts).
- Implementation: `mow-coding`'s Codex selected bundled `tldts` 7.5.4 with private suffixes enabled. It is an implementation choice under the approved behavior, not a claim that the owner personally chose this library. Update the bundled version and license together when the list is refreshed.

## 2026-11-18 — Explore AI agent browsing in Tab Zoo

- Status: proposal; product design and feasibility not yet decided.
- Project decision credit: `dongseok2001-creator` (default).
- Proposer: `mow-coding` (human), who reports having discussed the idea previously with `dongseok2001-creator`.
- Idea: people are not the only browser users; exploring where AI agents browse could be an interesting use for Tab Zoo. Consider supporting Chrome, Edge, and Aside.
- Context: the current extension is built around open tabs and focused activity. Whether it can observe an agent's tabs, distinguish them from a person's tabs, or retain activity after tabs close depends on the browser, profile, APIs, and agent. None of those capabilities is confirmed here.
- Before implementing: investigate browser support and privacy, agree what activity should be shown and for how long, and obtain product direction for any UI changes. Do not assume access to other profiles, separate agent browsers, or private task details.
- Evidence: `mow-coding`'s description in the collaboration conversation; details of the earlier discussion have not been independently established.

## 2026-11-18 — Fossils, collection, and useful signals

- Status: product direction decided; individual designs and AI identification remain under investigation.
- Project decision credit: `dongseok2001-creator` (default).
- Proposer: `mow-coding` (human). `mow-coding` reports that `dongseok2001-creator` liked the collection idea; the friend's exact wording has not been independently recorded.
- Decision: explore a practical, approachable view of browser activity as well as playful visuals. When an animal leaves, preserve it as a fossil in a collection rather than losing it forever. AI activity needs an event-based approach distinct from human foreground dwell time.
- Rationale: a person may want to see sites an agent visited in the background or quickly closed while they were away. The proposer also suggested unusual creatures as a possible way to communicate suspicious sites.
- Safety constraint: unknown or unusual is not evidence that a site is dangerous. No risk verdict or alarming warning should be presented without a reliable source and a clearly explained basis; privacy, reliability, and applicable service terms must be reviewed first.
- Implementation choice by `mow-coding`'s Codex: keep the fossil collection locally until the user deletes entries, recording the site domain, animal, duration, and departure time but not full URLs or titles. Current-zoo reset preserves the collection. Agent attribution is not assumed from a background tab alone.
- Evidence: `mow-coding`'s instructions in the collaboration conversation.

## 2026-11-18 — Observe Aside Agent Tabs visits

- Status: implemented for the observed Aside tab-group behavior, subject to browser compatibility limits.
- Project decision credit: `dongseok2001-creator` (default). `mow-coding` proposed and requested the feature. `mow-coding`'s Codex selected the group-name implementation.
- An isolated Aside test showed an agent-opened test tab in a Chrome tab group titled `Agent Tabs` and a separately opened ordinary tab outside that group. Observe that group, count domain arrivals separately from human foreground time, and keep them in the local fossil collection until deletion.
- This is a group-name heuristic, not proof of AI authorship: a user can rename or create such a group, behavior can change, other profiles and non-tab network requests are not visible, and very short visits may be missed before group assignment. Never report these limits as universal AI monitoring.
- Store only the registrable domain, count, animal and timestamp; update the privacy notice. The added `tabGroups` permission may require user acceptance during an extension update.

## 2026-11-18 — Signature animal and colour

- Status: decided for the proposed brand identity; artwork and release implementation are pending.
- Proposer and decision maker: `mow-coding` (human).
- Decision: use Tab Zoo's existing red T-rex as the signature animal, against a dark green background. Explore a close-up pixel-art face for the extension icon, keeping the existing character recognisable.
- Context: the current extension includes seven species and a typography-based icon. The idea is to give the project an identifiable character grounded in its existing artwork.
- Still open: the exact artwork, left/right/front-facing direction, icon dimensions and final adoption in the extension. Review comparable store icons and small-size legibility before choosing a direction. Do not represent a draft as an approved final icon.
- Evidence: `mow-coding`'s instruction in the collaboration conversation; the conversation itself is not public.

## 2026-11-18 — Signature icon orientation

- Status: decided for the icon direction; final artwork and release implementation remain pending.
- Proposer and decision maker: `mow-coding` (human).
- Decision: the signature red T-rex faces right, and the icon should not have a white outline. Explore a subtle browser-tab or site-visit cue without losing the close-up character or small-size legibility.
- Context: after comparing the existing animals and discussing store references, `mow-coding` chose the orientation and asked how the icon could communicate the extension's relationship to visited websites.
- Evidence: `mow-coding`'s instruction in the collaboration conversation; the conversation itself is not public. This refines the preceding signature animal decision; the exact cue and final artwork remain undecided.

## 2026-11-18 — Explore browser-window cue

- Status: design direction for a draft, not final artwork approval.
- Proposer: `mow-coding` (human).
- Direction: try a white browser-window frame and coloured window controls in its upper-right corner so the motif reads as a browser rather than a folder. Retain the red, right-facing T-rex and dark green background. This refines the earlier no-white-outline instruction for the browser frame; do not assume a white outline around the animal was requested.
- Rationale: the earlier green browser-tab motif looked like a folder and did not sufficiently convey the browser context. Exact pixel layout, legibility at small sizes, and adoption remain open.
- Evidence: `mow-coding`'s instruction in the collaboration conversation; the conversation itself is not public.

## 2026-11-18 — Approve T-rex browser icon

- Status: approved by `mow-coding`; implementation and release checks are tracked separately. This supersedes the open artwork and frame questions in the preceding entries.
- Proposer and producer: `mow-coding`'s Codex generated a draft with an image-generation tool using the existing animal atlas as a reference. Decision maker: `mow-coding` (human), who reviewed and approved that draft for the project and browser-extension icon.
- Decision: use the approved close-up, right-facing red T-rex on a dark green background inside a white browser-window frame with three coloured controls at the upper right. The white frame refines the earlier instruction against a white outline; it is a browser frame, not an outline around the animal.
- Context: the project needed a recognisable mascot and a visual cue that it is a browser extension. Earlier tab-like shapes resembled folders. The approved image is a new AI-generated interpretation of the existing animal rather than a pixel-identical crop.
- Source artwork: `extension/assets/tab-zoo-trex-browser-source.png`. `scripts/build-icons.ps1` produces the installed icon sizes, with the Chrome store icon's transparent inset.
- Evidence: `mow-coding`'s explicit approval in the collaboration conversation; the conversation itself is not public.
