# Chrome·Edge 스토어 배포

2026-11-22에 Chrome 웹스토어가 Tab Zoo `0.1.15`를 접수했고 상태 화면에 **검토 대기 중**이 표시됐다. 항목 ID는 `oiklijhodjopidofbkdbmonoifkakadk`다. 무료·공개·전체 지역으로 설정했고, 심사를 통과하면 자동 게시된다. 공개 설치와 스토어를 통한 버전 업데이트는 게시 후 확인한다. Edge Add-ons 제출은 보류했다.

게시자는 **MOW**, 인증된 공개 연락처는 **hello@mow.codes**다. 소개에는 “DS가 처음 만들고, DS와 basoon이 함께 개발합니다.”라고 표기했다. 등록정보에 승인된 빨간 티라노 아이콘, 한국어 스크린샷 한 장, 소형 홍보 이미지가 저장된 것을 확인했다. GitHub 저장소의 링크 미리보기에도 같은 디자인을 적용했다.

## 소개 문구 초안

**이름:** Tab Zoo

**짧은 설명:** 열린 탭을 작은 도트 동물로 만나고, 떠난 동물은 화석으로 모아보세요.

**상세 설명:**

Tab Zoo는 열린 웹사이트를 작은 동물로 보여주는 브라우저 확장 프로그램입니다. 사이트를 방문하면 알이 생기고, 해당 사이트를 실제로 보고 있는 시간에 따라 동물이 자랍니다. 탭을 모두 닫으면 동물은 떠나고, 화석 컬렉션에서 다시 볼 수 있습니다.

- 같은 등록 가능 도메인의 서브도메인은 하나의 동물로 묶습니다.
- 초원, 시베리아, 사막 중 원하는 맵을 고를 수 있습니다.
- 같은 사이트의 탭을 모두 닫거나 그 사이트를 떠나면 화석으로 남습니다. 화석은 컬렉션에서 삭제할 수 있습니다.
- Aside의 `Agent Tabs`라는 탭 그룹에서 열린 사이트는 도메인과 방문 횟수를 컬렉션에서 확인할 수 있습니다. 그룹 이름을 이용하는 기능으로, 모든 AI 활동을 감지하거나 탭의 주체를 확정하지는 못합니다. 다른 프로필과 탭을 거치지 않는 네트워크 활동도 보이지 않습니다.
- 사이트 기록과 화석은 브라우저 안에 저장됩니다. 전체 URL이나 페이지 제목을 저장하지 않습니다.

이 확장 프로그램은 사이트의 안전성을 판정하거나 위험 사이트를 차단하는 보안 프로그램이 아닙니다.

## 권한 설명 초안

| 권한 | 필요한 이유 |
| --- | --- |
| `tabs` | 열린 탭의 주소에서 사이트를 구분하고, 동물을 선택하면 해당 탭으로 이동합니다. |
| `tabGroups` | `Agent Tabs`라는 이름의 탭 그룹을 확인하여 해당 그룹의 방문을 별도로 기록합니다. |
| `storage` | 동물의 성장 상태, 화석 컬렉션, 맵과 색상 설정을 브라우저에 저장합니다. |
| `favicon` | 브라우저의 파비콘을 이용해 동물의 색상을 정합니다. |
| `idle` | 자리를 비우거나 화면이 잠긴 시간을 사람의 체류 시간에서 제외합니다. |
| `alarms` | 1분 간격으로 현재 체류 상태를 저장합니다. |

**목적 설명 초안:** 브라우저에서 열린 웹사이트를 동물로 표현하고, 떠난 동물과 `Agent Tabs` 그룹의 방문을 로컬 컬렉션으로 보여줍니다.

Chrome 등록정보에는 [개인정보처리방침](https://github.com/MOW-Basoon/tab-zoo/blob/main/extension/PRIVACY.md)과 위 권한의 사용 목적을 등록했다. 권한이나 데이터 처리가 바뀌면 다음 버전 제출 전에 등록정보도 갱신한다.

## 제출 자료와 검증

**준비한 자료**

[소형 홍보 이미지 (440×280)](store/tab-zoo-promo-440x280.png)에는 승인된 티라노 아이콘을 사용했다. [한국어 스토어 소개 화면 (1280×800)](store/tab-zoo-listing-1280x800.png)은 별도 시험에서 캡처한 동물원과 화석 컬렉션을 나란히 배치한 시안이다. 두 화면은 서로 다른 시험 데이터이며 동물원의 체류 시간은 시험용으로 설정했다. 동물원 화면에 표시된 버전은 0.1.13이다. 0.1.14는 아이콘을 변경했으며 팝업 동작 코드는 같다.

**심사 메모 초안 (영문)**

No account is needed. In a fresh test profile, open example.org, then open Tab Zoo from the toolbar. The site appears as an egg. Keep the site in the foreground for a minute to see it grow. Close the last tab for that site, reopen Tab Zoo, and select 화석 컬렉션 (Fossil collection). Look for example.org. To remove just that entry, choose 삭제 (Delete) on its row.

To check the optional tab-group feature in Chrome or Edge, name a tab group exactly `Agent Tabs` and navigate a grouped tab to example.net. After closing the tab, open the collection and look for example.net with an Agent Tabs count. This tests recognition of a group name. An ordinary visit outside that group should not increase that count. The feature does not require an AI account.

- **Aside 실제 사용 확인** — 설치돼 있던 개발자용 확장을 0.1.13에서 0.1.15로 갱신한 뒤 기존 화석이 유지됐다. Aside 에이전트가 example.net 탭을 열고 닫자 컬렉션에 `Agent Tabs 1회`로 나타났다.
- **Chrome for Testing 확인** — 별도 프로필에 0.1.14를 설치하고 같은 경로에서 0.1.15로 갱신했다. 확장 ID와 기존 화석이 유지됐고 일반 탭, 그룹 방문, 개별 화석 삭제를 확인했다.
- **공개 후 확인할 일** — 일반 Chrome에서 스토어 링크로 신규 설치를 확인하고, 다음 버전이 공개되면 기존 스토어 설치본의 자동 업데이트와 화석 보존을 확인한다. Edge는 제출을 재개할 때 설치·업데이트·삭제부터 검증한다.

## 다음 Chrome 버전 준비

1. 평소 기능 PR은 기존 버전으로 main에 병합한다. 출시할 때 `extension/manifest.json`의 `version`을 올린 PR을 main에 병합한다. 예를 들어 `0.1.15`에서 `0.1.16`으로 올린다.
2. GitHub가 병합 전후 버전을 숫자로 비교하고 병합된 PR과 커밋이 일치하면 테스트·패키징·업로드·심사 요청을 자동으로 실행한다. 버전이 같은 병합, 개발 브랜치 푸시, main 직접 푸시는 제출 대상에서 제외한다. ZIP은 GitHub에서 3일 뒤 만료된다. 수동 실행의 `package`와 `status`로 각각 패키지 생성과 상태 조회도 가능하다.
3. 실행 로그에서 Google의 접수 결과를 확인한다. 공식 스토어로 설치한 사용자는 승인·게시 후 Chrome의 업데이트 주기에 따라 새 버전을 받는다. [Chrome 업데이트 안내](https://developer.chrome.com/docs/extensions/develop/concepts/extensions-update-lifecycle)

자동화 인증은 Google Cloud의 단기 토큰을 쓴다. Google은 저장소·소유 조직의 숫자 ID, main 브랜치, 실행 방식과 워크플로 파일을 확인한다. Google의 서비스 계정 연결 권한은 MOW 게시자 전체에 적용되며 이 워크플로에서 사용하는 항목 ID는 Tab Zoo로 고정했다. [Chrome Web Store API](https://developer.chrome.com/docs/webstore/using-api)

다른 버전이 심사 중이거나 게시 대기 중이면 해당 작업이 중단된다. 먼저 진행 중인 버전의 결과를 확인하고 원래 버전 병합 작업에서 **Re-run all jobs**를 선택한다. 같은 버전이 이미 심사 중이거나 게시됐으면 재실행해도 중복 제출하지 않는다.

참고: [Chrome 게시](https://developer.chrome.com/docs/webstore/publish), [Chrome 이미지](https://developer.chrome.com/docs/webstore/images), [Chrome 개발자 등록](https://developer.chrome.com/docs/webstore/register), [Chrome 개인정보 항목](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [Edge 게시](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension).
