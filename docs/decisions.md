# Decision history

공개 기록에서는 원작자를 **DS**, 협업자를 **basoon**으로 표기한다. 괄호 안의 human은 본인, Claude와 Codex는 그 사람과 작업한 AI를 뜻한다. 날짜는 기록일이다. 제안·결정·승인·구현의 근거가 없으면 `unknown`, 아직 진행 전이면 `pending`으로 적는다.

## 2026-11-18 — 원작의 핵심 아이디어와 초기 버전

열어 둔 사이트를 픽셀 동물로 보여 주는 동물원은 **DS 본인이 제안하고 결정한 핵심 아이디어**다. 초기 버전(0.1.10까지)의 구현은 **DS의 Claude가 대부분 맡았다**고 basoon이 설명했다. 최초 결정 날짜는 미상이다.

- Proposed by: DS (human)
- Decided by: DS (human)
- Approved by: unknown
- Implemented by: DS (Claude)
- Basis: basoon의 소급 설명이 사람과 AI의 역할에 대한 근거다. [협업 전 README][original-readme]에서 그 아이디어가 구현된 버전을 확인할 수 있다. 구현자 표시는 초기 작업 전체에 대한 설명이다.

### 0.1.10에서 확인되는 세부 동작

첫 행은 위 핵심 아이디어다. 나머지 행의 근거는 당시 동작을 확인할 수 있는 코드·문서다. 세부 규칙 하나하나를 누가 제안·결정·승인·구현했는지는 미상이다. 예를 들어 성장 시간을 1분과 5분으로 정한 사람이나 도구까지 특정할 자료는 없다.

| 원본에서 확인한 기능 | 원래 동작과 사용자에게 보이는 의미 | 당시 근거 |
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

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon requested repository-level attribution. See [PR #1](https://github.com/dongseok2001-creator/tab-zoo/pull/1) for the initial workflow.


- Status: decided.
- Context: people and their AI assistants collaborate on the same public repository. Commit authorship alone does not explain why a choice was made or who made it.
- Decision: use repository instructions shared by Codex and Claude, and record significant decisions with attribution and rationale. Run attribution checks with the repository's existing test workflow. Keep real names and private information out of public records.
- Evidence: instructions from basoon in the collaboration planning conversation; the conversation itself is not public.

## 2026-11-18 — Group related subdomains

- Proposed by: basoon (Codex)
- Decided by: basoon (Codex)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon raised the grouping issue, accepted grouping and explicitly chose to keep Gmail and Drive together. basoon's Codex chose the bundled library and private-suffix setting in [PR #1](https://github.com/dongseok2001-creator/tab-zoo/pull/1).


- Status: decided for product behavior; implemented in PR #1.
- Proposer: basoon (human) raised the issue; basoon's Codex proposed registrable-domain grouping and evaluating `tldts` with private suffixes enabled.
- Decision: group subdomains by registrable domain by default. For now Gmail and Google Drive may be grouped together. Separate independently hosted sites such as different `github.io` users using the private section of the Public Suffix List.
- Rationale: `uos.ac.kr` and `portal.uos.ac.kr` feel like one site. A maintained public suffix list avoids a manually maintained list of websites, while recognizing shared hosting boundaries. This is a practical heuristic, not proof of common ownership.
- Evidence: collaboration planning conversation; [Public Suffix List](https://publicsuffix.org/); [tldts documentation](https://github.com/remusao/tldts).
- Implementation: basoon's Codex selected bundled `tldts` 7.5.4 with private suffixes enabled. It is an implementation choice under the approved behavior, not a claim that the owner personally chose this library. Update the bundled version and license together when the list is refreshed.

## 2026-11-18 — Keep Gmail and Drive together

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon explicitly chose to defer service-specific exceptions. [PR #1](https://github.com/dongseok2001-creator/tab-zoo/pull/1) implemented the shared grouping rule.

Gmail and Drive share one animal for now. The product can use the normal site grouping rule without maintaining a special list for individual Google services.

## 2026-11-18 — Explore AI agent browsing in Tab Zoo

- Proposed by: basoon (human)
- Decided by: pending
- Approved by: pending
- Implemented by: pending
- Basis: basoon explicitly identified the idea as their own. This entry records the initial proposal. See the later Aside entry for the tested implementation.


- Status: proposal; product design and feasibility not yet decided.
- Proposer: basoon (human), who reports having discussed the idea previously with DS.
- Idea: people are not the only browser users; exploring where AI agents browse could be an interesting use for Tab Zoo. Consider supporting Chrome, Edge, and Aside.
- Context: the current extension is built around open tabs and focused activity. Whether it can observe an agent's tabs, distinguish them from a person's tabs, or retain activity after tabs close depends on the browser, profile, APIs, and agent. See the later Aside entry for the observed behavior.
- Before implementing: investigate browser support and privacy, agree what activity should be shown and for how long, and obtain product direction for any UI changes. Do not assume access to other profiles, separate agent browsers, or private task details.
- Evidence: basoon's description in the collaboration conversation; details of the earlier discussion have not been independently established.

## 2026-11-18 — Fossils, collection, and useful signals

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon proposed fossils and the collection and requested implementation. basoon reports DS supported the collection idea. Retention and data fields were implementation choices by basoon's Codex in [PR #2](https://github.com/dongseok2001-creator/tab-zoo/pull/2).


- Status: product direction decided; individual designs and AI identification remain under investigation.
- Proposer: basoon (human). basoon reports that DS liked the collection idea; this is a secondhand account.
- Decision: explore a practical, approachable view of browser activity as well as playful visuals. When an animal leaves, preserve it as a fossil in a collection rather than losing it forever. AI activity needs an event-based approach distinct from human foreground dwell time.
- Rationale: a person may want to see sites an agent visited in the background or quickly closed while they were away. The proposer also suggested unusual creatures as a possible way to communicate suspicious sites.
- Safety constraint: unknown or unusual is not evidence that a site is dangerous. No risk verdict or alarming warning should be presented without a reliable source and a clearly explained basis; privacy, reliability, and applicable service terms must be reviewed first.
- Implementation choice by basoon's Codex: keep the fossil collection locally until the user deletes entries, recording the site domain, animal, duration, and departure time but not full URLs or titles. Current-zoo reset preserves the collection. Agent attribution is not assumed from a background tab alone.
- Evidence: basoon's instructions in the collaboration conversation.

## 2026-11-18 — Observe Aside Agent Tabs visits

- Proposed by: basoon (human)
- Decided by: basoon (Codex)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon requested observable agent visits. basoon's Codex chose and tested the tab-group heuristic in [PR #3](https://github.com/dongseok2001-creator/tab-zoo/pull/3). The human approval covers the feature direction.


- Status: implemented for the observed Aside tab-group behavior, subject to browser compatibility limits.
- An isolated Aside test showed an agent-opened test tab in a Chrome tab group titled `Agent Tabs` and a separately opened ordinary tab outside that group. Observe that group, count domain arrivals separately from human foreground time, and keep them in the local fossil collection until deletion.
- This is a group-name heuristic, not proof of AI authorship: a user can rename or create such a group, behavior can change, other profiles and non-tab network requests are not visible, and very short visits may be missed before group assignment. Never report these limits as universal AI monitoring.
- Store only the registrable domain, count, animal and timestamp; update the privacy notice. The added `tabGroups` permission may require user acceptance during an extension update.

## 2026-11-18 — Signature animal and colour

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: pending
- Basis: basoon explicitly chose the existing red T-rex and dark green background. See the final icon entry for artwork delivery.


- Status: decided for the proposed brand identity; artwork and release implementation are pending.
- Proposer and decision maker: basoon (human).
- Decision: use Tab Zoo's existing red T-rex as the signature animal, against a dark green background. Explore a close-up pixel-art face for the extension icon, keeping the existing character recognisable.
- Context: the current extension includes seven species and a typography-based icon. The idea is to give the project an identifiable character grounded in its existing artwork.
- Still open: the exact artwork, left/right/front-facing direction, icon dimensions and final adoption in the extension. Review comparable store icons and small-size legibility before choosing a direction. Do not represent a draft as an approved final icon.
- Evidence: basoon's instruction in the collaboration conversation; the conversation itself is not public.

## 2026-11-18 — Signature icon orientation

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: pending
- Basis: basoon chose a right-facing animal during the design review.


- Status: decided for the icon direction; final artwork and release implementation remain pending.
- Proposer and decision maker: basoon (human).
- Decision: the signature red T-rex faces right, and the icon should not have a white outline. Explore a subtle browser-tab or site-visit cue without losing the close-up character or small-size legibility.
- Context: after comparing the existing animals and discussing store references, basoon chose the orientation and asked how the icon could communicate the extension's relationship to visited websites.
- Evidence: basoon's instruction in the collaboration conversation; the conversation itself is not public. This refines the preceding signature animal decision; the exact cue and final artwork remain undecided.

## 2026-11-18 — Explore browser-window cue

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon requested the white window frame and coloured controls for the draft. Final icon approval is recorded separately.


- Status: design direction for a draft, not final artwork approval.
- Proposer: basoon (human).
- Direction: try a white browser-window frame and coloured window controls in its upper-right corner so the motif reads as a browser rather than a folder. Retain the red, right-facing T-rex and dark green background. This refines the earlier no-white-outline instruction for the browser frame; do not assume a white outline around the animal was requested.
- Rationale: the earlier green browser-tab motif looked like a folder and did not sufficiently convey the browser context. Exact pixel layout, legibility at small sizes, and adoption remain open.
- Evidence: basoon's instruction in the collaboration conversation; the conversation itself is not public.

## 2026-11-18 — Approve T-rex browser icon

- Proposed by: basoon (Codex)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon explicitly approved the artwork produced by basoon's Codex. [PR #5](https://github.com/dongseok2001-creator/tab-zoo/pull/5) applied it.


- Status: approved by basoon; implementation and release checks are tracked separately. This supersedes the open artwork and frame questions in the preceding entries.
- Proposer and producer: basoon's Codex generated a draft with an image-generation tool using the existing animal atlas as a reference. Decision maker: basoon (human), who reviewed and approved that draft for the project and browser-extension icon.
- Decision: use the approved close-up, right-facing red T-rex on a dark green background inside a white browser-window frame with three coloured controls at the upper right. The white frame refines the earlier instruction against a white outline; it is a browser frame, not an outline around the animal.
- Context: the project needed a recognisable mascot and a visual cue that it is a browser extension. Earlier tab-like shapes resembled folders. The approved image is a new AI-generated interpretation of the existing animal rather than a pixel-identical crop.
- Source artwork: `extension/assets/tab-zoo-trex-browser-source.png`. `scripts/build-icons.ps1` produces the installed icon sizes, with the Chrome store icon's transparent inset.
- Evidence: basoon's explicit approval in the collaboration conversation; the conversation itself is not public.

## 2026-11-18 — Minimise stored browsing data

- Proposed by: basoon (human)
- Decided by: basoon (Codex)
- Approved by: unknown
- Implemented by: basoon (Codex)
- Basis: basoon requested a security review. The [review](security-review.md) identifies the reviewer and [PR #1](https://github.com/dongseok2001-creator/tab-zoo/pull/1) shows the resulting storage change.

The original background worker retained full URLs and titles. The review found the popup only needed the site, so the worker stopped saving those fields and removes legacy values when it saves the state.

## 2026-11-18 — Prepare Chrome and Edge listings

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon requested preparation for both stores. [PR #4](https://github.com/dongseok2001-creator/tab-zoo/pull/4) and [PR #6](https://github.com/dongseok2001-creator/tab-zoo/pull/6) document the drafts and reviewer materials.

Prepare listing copy, permission explanations and visual assets so reviewers can reproduce the main features. Store submission and its approvals are separate steps.

## 2026-11-18 — Correct attribution and adopt public aliases

- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon clarified the original roles, chose the aliases, and requested this repository-wide correction. [PR #7](https://github.com/dongseok2001-creator/tab-zoo/pull/7) and [PR #8](https://github.com/dongseok2001-creator/tab-zoo/pull/8) preserve the earlier retrospective.

The earlier log gave DS default decision credit for unattributed choices. This correction replaces that rule. Record the specific actor and the evidence for each role. basoon's account credits DS with the core idea and DS's Claude with most early implementation. Individual decisions can be updated as more evidence becomes available.

## 2026-11-19 — Adopt PolyForm Perimeter from 0.1.15

- Status: adopted.
- Proposed by: basoon (Codex)
- Decided by: DS (human), basoon (human)
- Approved by: DS (human), basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon wanted publicly inspectable source and protection against monetized clones. basoon's Codex proposed Perimeter. basoon instructed adoption and reported DS's prior agreement.

Keep the repository public. From 0.1.15 use [PolyForm Perimeter 1.0.1](../LICENSE) for the project's own work. The grant permits ordinary use, including at work, and restricts providing competing products to others, including free competitors. Copies already made available under MIT through 0.1.14 retain those permissions. Preserve the [historical MIT notice](../licenses/MIT-through-0.1.14.txt) and the bundled dependencies' own notices in the store package.

## 2026-11-22 — Chrome 첫 제출과 원작자 표기

- Status: submitted for review.
- Proposed by: basoon (Codex)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon requested distribution and approved the proposed publisher, verified public contact and creator credit. basoon selected the non-trader declaration for the current publisher. The submission receipt and runtime checks are recorded in [스토어 배포](store-submission.md).

Chrome에 먼저 제출한다. 게시자 MOW, 공개 연락처 hello@mow.codes, 소개에는 원작자 DS와 공동 개발자 DS·basoon을 표기한다. 기존에 basoon이 승인한 티라노 아이콘을 사용한다. DS 본인의 핵심 아이디어와 DS의 Claude가 맡은 초기 구현은 이 기록 첫 항목에 있다. basoon의 Codex가 배포 설정에서 무료·공개·전체 지역과 심사 통과 후 자동 게시를 적용했다.

## 2026-11-22 — GitHub에서 배포용 ZIP 생성

- Status: implemented.
- Proposed by: basoon (Codex)
- Decided by: basoon (Codex)
- Approved by: unknown
- Implemented by: basoon (Codex)
- Basis: basoon asked to reduce repeated uploads and local temporary files. basoon's Codex selected an on-demand hosted build and three-day artifact retention as implementation details.

배포할 때만 GitHub에서 테스트하고 기존 허용 목록으로 ZIP을 만든다. 패키지에는 현행 및 이전 라이선스 고지와 외부 구성요소 고지를 포함한다.

## 2026-11-22 — GitHub에서 Chrome 업데이트 제출

- Status: adopted.
- Proposed by: basoon (Codex)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon approved connecting a service account with MOW publisher access after reviewing its scope and the restriction to Tab Zoo releases from main.

다음 버전부터 관리자가 GitHub 작업을 직접 실행해 Chrome 심사에 제출할 수 있도록 한다. 별도의 Tab Zoo 배포 프로젝트와 단기 인증을 사용한다. 스토어 초도 심사 중에는 읽기 전용 상태 조회로 연결을 검증한다.

## 2026-11-22 — 버전을 올린 PR 병합으로 Chrome 심사 요청

- Status: adopted.
- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon explicitly requested automatic review submission when a higher extension version is merged into main, while keeping everyday development pushes separate from releases.

버전을 올린 PR을 main에 병합하는 것이 출시 결정이다. GitHub에서 변경 전후 매니페스트를 비교하고 해당 병합을 확인한 후 테스트부터 Chrome 심사 제출까지 수행한다. 이전 수동 제출 절차를 대체한다. Google의 심사 및 승인 후 공개 절차는 그대로 따른다.

## 2026-11-22 — 동물 도감과 잡기·흔들기, HTTP 괴물

- Status: adopted.
- Proposed by: basoon (human)
- Decided by: basoon (human)
- Approved by: basoon (human)
- Implemented by: basoon (Codex)
- Basis: basoon requested a species collection, animals struggling when picked up and getting dizzy when shaken, and a monster for HTTP pages. The HTTP cue refines basoon's earlier idea of making browsing risks visible. DS created the original tab zoo and its seven animals were present before this feature.

동물 종을 모으는 기능을 사이트별 화석 컬렉션과 함께 제공한다. 지도에서 동물을 들고 놀 수 있고, 암호화되지 않은 HTTP 연결을 괴물로 표시한다.

## 2026-11-22 — 도감의 저장 범위와 제스처·HTTP 표시 기준

- Status: implemented.
- Proposed by: basoon (Codex)
- Decided by: basoon (Codex)
- Approved by: unknown
- Implemented by: basoon (Codex)
- Basis: basoon requested the three features. basoon's Codex selected the following implementation details without a separate human design review.

도감에는 발견한 종 ID만 저장한다. 기존 배정과 화석에서 발견 종을 복원하고, 화석을 삭제해도 발견 종은 보존한다. 클릭은 탭 열기, 길게 누르거나 끌기는 들어 올리기, 빠른 방향 반전 세 번은 어지럼 반응으로 구분한다. 시스템의 모션 감소 설정을 따른다. 같은 사이트의 표시 대상 탭 중 하나라도 HTTP면 괴물 한 마리가 그 HTTP 탭을 가리킨다. 괴물은 기존 종의 임시 모습이며 악성 사이트 판정이나 도감 수집 대상이 아니다.

## 2026-11-22 — 동물 잡기 동작 다듬기

- Status: implemented.
- Proposed by: basoon (human)
- Decided by: basoon (Codex)
- Approved by: unknown
- Implemented by: basoon (Codex)
- Basis: basoon asked for a more natural implementation of the preceding interaction. basoon's Codex chose the landing and animation details.

동물을 놓으면 끌어간 위치에 내려앉고, 걷는 생물은 잠시 쉰 뒤 이어서 움직인다. 들어 올릴 때 작은 몸짓을 하고, 흔든 뒤에는 천천히 흔들리며 회복한다. 움직임 줄이기 설정을 존중한다.
