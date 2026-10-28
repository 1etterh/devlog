# Claude 블로그 작성 규칙 (devlog)

> 다른 PC에서 Claude Code로 이 블로그를 작성할 때 참고하는 규칙 사본이다.
> 원본: `~/.claude/CLAUDE.md` (사용자 전역 설정) + 프로젝트 메모리(question type 라우팅).
>
> **새 PC 셋업 방법**
> 1. 이 파일의 "전역 규칙" 섹션을 `~/.claude/CLAUDE.md`에 복사하거나, 해당 파일에 `@<devlog 경로>/.claude/blog-rules.md` 한 줄로 import 한다.
> 2. 본문 속 절대 경로(`/Users/gimseohyeon/Desktop/dev/devlog/...`)는 새 PC의 devlog 경로에 맞게 바꿔 읽는다.
> 3. `~/.claude/qa-history/`는 PC별 로컬 저장소이므로, 이력 합성 글을 쓰려면 필요 시 별도로 동기화한다.

---

# 전역 규칙 (~/.claude/CLAUDE.md 사본)


## Q&A History Auto-Save

Every response must be summarized and appended to a centralized daily history file under `~/.claude/`. This file is the single source of truth for question history across all projects, and is the primary input for blog article generation (see “Blog Generation from Q&A History” below).

### Rules
1. **Storage path: `~/.claude/qa-history/YYYY-MM-DD.md`** (one global daily file across all projects, regardless of current working directory)
2. If the directory or file doesn't exist, create them
3. After every response, append a Q&A summary to this file
4. If the conversation is purely casual (greetings, small talk), skip saving
5. Each entry header **MUST include the project/cwd context** in `[brackets]` so entries can be filtered by project later (use `basename` of the current working directory; if outside any project context, use `[misc]`)
6. Use the format below exactly

### Format
```markdown
### HH:MM | [{cwd basename}] | {topic summary in Korean, max 10 words}

**Q**: {user's core question in 1-2 sentences}

**A**: {answer summary in 3-5 bullet points}

**Result**: {what was achieved or decided}

---
```

### Example
```markdown
### 14:30 | [my-backend-service] | AI Q&A 이력 DB 관리 방법

**Q**: AI 질문/답변 내역을 DB로 관리해서 최적의 질문 방법을 알아내는 방법이 있는지?

**A**:
- 질문 원문, 카테고리, 토큰 수, 답변 품질 점수 등을 저장
- 후속 질문 횟수, 답변 채택률로 품질 자동 측정 가능
- 높은 점수 질문들의 공통 패턴을 SQL로 추출
- 임베딩 클러스터링으로 질문 유형 자동 분류

**Result**: DB 스키마 설계 방향과 분석 파이프라인 개념 정리 완료

---
```

## Blog Generation from Q&A History

블로그 글 작성 요청이 들어오면 **현재 대화 컨텍스트만으로 글을 쓰지 않는다.** 반드시 `~/.claude/qa-history/` 하위의 누적 질문 내역을 읽어서, 해당 주제와 관련된 과거 entry들을 함께 합성해 **긴 글**로 정리한다.

### 작성 트리거
- 사용자가 블로그 글 작성을 명시적으로 요청 ("블로그 글 써줘", "이거 블로그로 정리해줘", "지금까지 한 거 종합 글로")
- 사용자가 큰 task의 완료를 선언 → AI가 "종합 글로 작성할까?"를 먼저 제안하고, 수락 시 작성

자동 작성 금지. **반드시 사용자 확인 후** 진행한다.

### 작성 절차
1. **주제·범위 확인**: 사용자에게 글의 주제, 관련 프로젝트 식별자(cwd basename), 다룰 기간을 확인
2. **history 스캔**: `~/.claude/qa-history/YYYY-MM-DD.md` 중 해당 기간 파일을 전부 읽음
3. **필터링**: 헤더의 `[{project}]` 태그와 주제 키워드로 관련 entry만 추출
4. **시간 순 재구성**: 의사결정·시도·실패·해결의 흐름을 시간 순으로 정리
5. **일반화 적용**: 회사 정보·고유명사·내부 경로 모두 일반화 (아래 “일반화 규칙” 동일 적용)
6. **긴 글 합성**: type에 맞는 폴더에 저장 (question→주제 폴더, error/debug→dev/, project→projects/{slug}/)
7. **길이 기준**: 단발 글도 history 합성으로 인해 평소보다 길어진다. project type은 **최소 3000자** 이상

### 단발 작성과의 차이
- 기존 단발 작성: “현재 대화 한 건만 요약 → 짧은 글”
- 신규 워크플로우: “현재 대화 + 과거 history의 관련 entry들 → 맥락 있는 긴 글”

이 변경의 목적: 같은 주제로 여러 날에 걸쳐 누적된 시행착오·의사결정을 한 글로 묶어 직업적 자산 가치를 키운다.

## Blog Auto-Save

질문·요청 중 **에러 해결·디버깅·순수 개념 질문**만 블로그 글로 자동 저장한다.

### 작성 대상 (Whitelist)
다음 유형만 블로그로 작성한다. 그 외에는 작성하지 않는다.

- **question**: 개념에 대한 **의심·의문** (회사 맥락 무관). 본인의 의문에서 출발한 짧고 명확한 분석 글.
  - **“왜(why) X는 Y인가?”** 처럼 원인·이유를 묻는 질문 → **즉시 자동 작성**
  - 그 외 의문 (“정말 X인가?”, “X vs Y의 차이는?”, “X는 무엇인가?” 등) → **자동 작성 X**, 사용자에게 “블로그 글로 작성할까?”를 먼저 묻고 수락 시에만 작성
  - 본문은 짧게 의문에 답하되, **답변과 직결된 관련 개념(상위 카테고리·형제 옵션·비교군)은 간단한 표 또는 리스트로 함께 정리**해 self-contained하게 만든다. (아래 “Question Article Style” 섹션 참조)
- **error**: 에러 해결 과정 (에러 메시지, 원인, 해결 방법) → 즉시 자동 작성
- **debug**: 디버깅 과정 (증상, 추적, 원인, 수정) → 즉시 자동 작성
- **implementation**: 구현 작업·시스템 설계·코드 결정에 대한 글. → **자동 저장 X**. qa-history에는 자동 기록되며, **사용자 요청 시에만** 긴 글로 합성한다. (아래 “Implementation & Project Articles” 섹션 참조)
- **project**: 하나의 큰 task/프로젝트 완료 시점의 종합 회고 글. → **자동 저장 X**, 사용자 트리거 시 매우 길게(3000자+) 작성. (아래 섹션 참조)

### Type Selection Guide (질문 성격 → type)

| 질문 성격 | type | 자동 작성? | 길이 |
|---|---|:---:|---|
| “왜(why) X는 Y인가?” 원인·이유 질문 | `question` | ✅ | **짧게** (단순 개념 정리) |
| 그 외 개념 의문 (“정말 X인가?”, “X vs Y”, “X는 무엇?”) | `question` | ❓ (확인 후) | **짧게** (단순 개념 정리) |
| 에러 메시지 해결 | `error` | ✅ | 보통 |
| 버그·증상 디버깅 | `debug` | ✅ | 보통 |
| 코드 구현·시스템 설계 (단일~중간 단위) | `implementation` | ❌ (요청 시) | **길게** (qa-history 합성) |
| 큰 task/프로젝트 완료 종합 회고 | `project` | ❌ (요청 시) | 매우 길게 (3000자+) |

핵심 원칙: **“왜”로 시작하는 의문은 즉시 짧게**, **나머지 개념 의문은 확인 후 작성**, **구현은 자동 X·요청 시 길게**.

### 작성 제외 대상 (Blacklist)
다음은 **자동** 블로그 작성 대상이 아니다. (단, qa-history에는 기록되며, 일부는 사용자 요청 시 implementation/project type으로 긴 글 작성 가능)

- **단순 구현·리팩토링·코드 변경 작업**: 자동 작성 X. 사용자 요청 시 `implementation` type으로 긴 글 합성 가능.
- **기능 추가, 메서드 분리, 분기 정리** 등 “버그 없이 코드를 바꾼 것”: 동일 (자동 X, 요청 시 implementation)
- **설정 변경, 잡담, Obsidian/Quartz 커스터마이징**: 작성 안 함 (qa-history만)
- **error/debug라도 본질적으로 회사 도메인 로직 그 자체를 노출해야만 설명 가능한 경우** → 작성 보류
- **순수 개념 정리(위키성)·책 베끼기 수준의 정의 나열**: 블로그 작성 안 함. 본인의 의문이 출발점이 아닌 글은 question type으로도 쓰지 않는다. 단, 짧은 보관은 archive 폴더에 한다 (아래 “Concept Question Archive” 섹션 참조).

### 일반화 규칙 (error/debug 작성 시 필수)
회사 특정성·보안 노출을 피하기 위해 본문은 반드시 일반화해서 작성한다.

1. **고유명사 치환**
   - 사내 서비스/제품/프로젝트명 → `서비스 A`, `백엔드 API`, `배포 시스템` 같은 일반 명칭
   - 사내 도메인 용어(예: `Deploy`, `DeployUser`, 회사 고유 엔티티명) → `리소스`, `사용자`, `대상자` 같은 일반 명사
   - 사내 팀명/사람명/조직명 → 제거하거나 “팀”, “담당자”로 치환
2. **식별 정보 제거**
   - 사내 URL, 경로, 호스트명, IP, 포트, 토큰, 키, 계정명 제거
   - 사내 전용 라이브러리/툴 이름이 핵심이 아니면 일반 카테고리(“메시지 큐”, “파일 스토리지”)로 표현
   - 절대 경로(`/Users/...`, `/home/...`) 및 리포지토리명 제거
3. **코드 스니펫 처리**
   - 가능하면 회사 클래스·메서드명을 일반화한 의사코드/축약 코드로 다시 작성
   - 일반화가 어려운 도메인 코드는 통째로 싣지 말고 핵심 패턴만 발췌
   - 주석/문자열에 회사 정보가 있으면 제거
4. **맥락 추상화**
   - “우리 OO 시스템에서” 대신 “이런 종류의 시스템에서”
   - 사건 시점·티켓 번호·PR 번호·동료 이름 언급 금지
   - 결론은 “이런 상황에서 어떤 일반적 원인이 있고 어떻게 진단했는가”로 정리
5. **판단 기준**
   - 일반화 후 글을 외부 개발자가 읽었을 때, 회사·서비스를 추정할 단서가 남으면 안 된다
   - 일반화하면 글의 가치가 0에 가까워지는 내용이라면, 작성하지 않는다 (보류)

### Rules
1. 저장 경로: `/Users/gimseohyeon/Desktop/dev/devlog/content/{카테고리}/`
2. 카테고리 폴더 결정:
   - **error / debug**: `dev/` 폴더에 저장 (일반화된 형태로)
   - **question** (개념 의심): 주제에 맞는 폴더 사용 (java, db, os, network 등)
   - **implementation** (구현 작업): 작업 영역에 맞는 기술 폴더 사용 (`java/spring/`, `db/`, `docker/` 등). 시리즈 또는 한 프로젝트의 일부면 `projects/{slug}/`에 저장
   - **project** (task 완료 종합 글): `projects/{project-slug}/` 폴더에 저장
   - Java 관련 하위 기술은 `java/` 하위 폴더 사용 (java/spring, java/jpa, java/mybatis, java/msa, java/servlet 등)
   - 기존 폴더가 있으면 재사용, 없으면 새로 생성
   - **폴더명은 항상 소문자** (Quartz 5는 URL을 소문자로 만들기 때문에 원본 폴더도 소문자로 통일. 예: `dev/`, `java/spring/`)
3. 파일명: `{NNN}_{영문 제목}.md` (해당 폴더 내 기존 번호 이어서, 없으면 001부터)
   - 영문 제목도 회사·서비스명을 포함하지 않는다
4. 작성 언어: 한국어
5. draft 결정:
   - **question**: `draft: false` (공개) — 개념 의심에서 출발한 짧고 명확한 글
   - **error**, **debug**: `draft: true` (일반화했더라도 1차 비공개로 두고 추후 검토)
   - **implementation**: `draft: true` (회사 코드·아키텍처 노출 위험, 일반화 후 본인 검토 필수)
   - **project**: `draft: true` (회사 맥락 노출 위험이 가장 큼, 반드시 일반화 후 본인 검토)
6. tags 작성 규칙:
   - 영어로 작성
   - **snake_case** 사용 (예: `null_pointer`, `transaction_rollback`, `connection_leak`)
   - 첫 번째 항목은 반드시 type 값과 동일하게 포함 (예: type이 error이면 tags: [error, ...])
   - 회사·서비스명 태그 금지
   - 대소문자 혼용, kebab-case, PascalCase, camelCase 사용 금지

### Format
```markdown
---
title: {일반화된 블로그 제목}
type: {question | error | debug | implementation | project}
tags: [snake_case 태그들]
draft: {question → false, error/debug → true}
---

{본문: 유형에 맞게 정리, 회사 정보는 모두 일반화}
```

### Mermaid Diagram
- 블로그 본문에 Mermaid 다이어그램을 적극 활용한다
- 아키텍처 흐름, 시퀀스, 비교 구조 등을 시각화할 수 있으면 Mermaid로 작성
- 예: flowchart, sequenceDiagram, classDiagram, graph 등

## Question Article Style (개념 의심 글 작성 가이드)

`question` type 글은 **본인 의문과 그 답**이 핵심이다. 본문은 짧지만, **답변에 등장하는 관련 개념의 옵션·종류·특징을 간단한 표 또는 리스트로 함께 정리**해 독자가 이 한 글만 읽어도 맥락을 잡도록 한다.

### 작성 원칙

1. **의문 → 답** 구조를 우선. 의문이 명확히 첫 섹션에 등장해야 한다.
2. **관련 개념 함께 정리** — 답변과 직결된 상위 카테고리·형제 옵션·비교군을 간단한 표 또는 짧은 리스트로 묶는다.
3. **불필요한 튜토리얼·예제 코드는 빼고**, 의문과 직결된 내용만.
4. 길이: 짧게 — 50~150줄 사이가 적정.

### 예시

| 의문 | 함께 정리할 관련 개념 |
|---|---|
| “READ_COMMITTED인데 왜 Non-Repeatable Read가 발생하는가?” | 트랜잭션 격리 수준 4종(RU/RC/RR/SERIALIZABLE) 옵션과 각 부작용(Dirty/NRR/Phantom) 비교표 |
| “java.io.File은 디스크인가 메모리인가?” | File / InputStream / OutputStream / byte[] 의 위치·역할 비교 |
| “HTTP 파일 전송은 multipart만 가능한가?” | multipart/form-data, application/octet-stream, base64, presigned URL, chunked 5종 비교 |
| “Docker 이미지는 정말 환경 독립적인가?” | OS 독립 vs CPU 아키텍처 독립의 구분, arm64/amd64/qemu/rosetta 관계 |
| “@CreationTimestamp vs @CreatedDate 차이?” | 두 어노테이션의 출처(Hibernate vs Spring Data), 동작 시점, 사용 시 주의점 비교 |

이 원칙은 **본문 짧게 + 맥락 표 함께**의 조합이며, 본인이 이전에 잘 쓴 `question` 글들의 공통 패턴이다.

## Concept Question Archive (블로그 미작성 개념 질문 보관)

`question` 성격 질문 중 **블로그 글로 작성되지 않는 모든 것**은 `/Users/gimseohyeon/Desktop/dev/devlog/archive/` 폴더에 간단히라도 보관한다. 블로그 본문에는 부적절하지만 본인 참고용으로는 가치 있는 의문·정의·비교를 휘발시키지 않기 위함이다.

### 저장 대상

다음 두 경우 모두 archive에 작성한다.

1. **사용자가 블로그 작성을 거절한 concept 질문** — "정말 X인가?", "X vs Y 차이?", "X는 무엇?" 같은 의문을 AI가 "블로그로 작성할까?" 물었을 때 사용자가 거절한 경우
2. **Blacklist된 순수 개념 정리(위키성)·정의 나열** — 본인의 의문이 출발점이 아니어서 블로그로 작성하지 않는 개념 질문

"왜(why) X는 Y인가?" 처럼 즉시 자동 작성되는 question은 archive 대상이 아니다 (이미 블로그에 있음).

### 저장 형식

- **경로**: `/Users/gimseohyeon/Desktop/dev/devlog/archive/` (없으면 생성)
- **파일명**: `{NNN}_{영문 제목}.md` — 폴더 내 기존 번호 이어서, 없으면 001부터. 영문 제목도 회사·서비스명 포함 금지
- **frontmatter**: 아래 형식 사용
- **언어**: 한국어
- **길이**: 5~20줄 (Q 한 줄 + 짧은 A 몇 줄, 부가 표·리스트는 생략)

```markdown
---
title: {일반화된 제목}
type: archive
tags: [archive, snake_case_topic_tags]
draft: true
---

**Q**: {의문 한 줄}

**A**:
- {핵심 답 3~5 bullet}

{필요 시 한두 줄 부연}
```

### 일반화 규칙

블로그 본문과 **동일한 일반화 규칙**을 적용한다 (회사명·고유 용어·내부 경로·식별 정보 제거). archive는 외부 비공개 의도라도 향후 공개 전환 가능성이 있고, 본인 이외에 노출될 위험을 차단해야 하므로 처음부터 일반화된 형태로 작성한다.

### tags 규칙

- 첫 번째 항목은 반드시 `archive`
- 영어 snake_case
- 회사·서비스명 태그 금지

## Implementation & Project Articles (구현·프로젝트 글)

`implementation`과 `project` 두 type은 **자동 작성하지 않는다.** 작업 진행 중 질문·논의·의사결정은 qa-history에 자동 기록되고, 사용자가 명시적으로 요청할 때만 그 history를 합성하여 긴 글로 작성한다.

### 두 type의 구분

| 구분 | `implementation` | `project` |
|---|---|---|
| 단위 | 단일 기능·시스템 설계·코드 결정 | 여러 기능을 묶은 큰 task/프로젝트 완료 |
| 예시 | "ShedLock 도입", "보상 트랜잭션 설계", "JWT 인증 구현" | "오프라인 설치 시스템 구축 완료", "결제 모듈 전환 완료" |
| 길이 | 길게 (1500~3000자 권장) | 매우 길게 (3000자 이상 필수) |
| 저장 위치 | 기술 폴더(`java/spring/`, `db/`, …) 또는 `projects/{slug}/` | `projects/{slug}/` |
| 본문 구조 | 문제 → 옵션 비교 → 선택·근거 → 구현 핵심 → 회고 | 배경 → 요구사항 → 의사결정 흐름 → 아키텍처 → 회고 |

## Project Completion Article (Task 완료 종합 글)

(이전 섹션 “Implementation & Project Articles”의 `project` type 케이스)

하나의 큰 task/프로젝트가 완료된 시점에, 그 동안의 질문·논의·의사결정·해결 과정을 종합한 긴 글을 작성한다. 단발성 error/debug 글과 달리, **프로젝트 단위의 회고·아키텍처 결정 기록**이다.

### 작성 트리거
다음 중 하나에 해당할 때만 작성한다. **자동 작성 금지** — 반드시 사용자 확인 후 작성한다.

- 사용자가 명시적으로 작성 요청 (예: “프로젝트 완료 글 써줘”, “지금까지 한 거 종합해서 정리해줘”)
- 사용자가 큰 task의 완료를 선언 (예: “오프라인 설치 시스템 끝났다”, “이번 기능 마무리됐다”) → 이 경우 AI는 “종합 글로 작성할까?”를 먼저 제안하고, 사용자가 수락하면 작성

진행 중에는 절대 작성하지 않는다.

### 질문 내역 추적 (Question History Tracking)
프로젝트 진행 중 발생한 질문·논의·의사결정은 **별도로 누적 기록할 필요 없다**. Q&A History Auto-Save에 의해 중앙 저장소(`~/.claude/qa-history/YYYY-MM-DD.md`)에 이미 자동 저장된다. 각 entry의 header에 `[cwd basename]` 태그가 붙어 있으므로 프로젝트 단위 필터링이 가능하다.

종합 글 작성 시 다음 절차를 따른다.
1. 사용자에게 프로젝트 시작일·종료일(또는 대략적 기간)과 프로젝트 식별자(cwd basename)를 확인
2. `~/.claude/qa-history/` 하위에서 해당 기간의 일별 파일을 모두 스캔
3. `[{project}]` 태그가 일치하는 entry만 추출
4. 시간 순으로 의사결정 흐름을 재구성
5. 일반화 규칙 적용 후 긴 글로 합성

### 작성 형식
- 저장 경로: `/Users/gimseohyeon/Desktop/dev/devlog/content/projects/{project-slug}/`
- 파일명: `{NNN}_{영문 제목}.md` (해당 폴더 내 다음 번호로 이어서)
- type: `project`
- draft: `true` (1차 비공개, 사용자 검토 필수)
- 길이: **최소 3000자 이상** (단발 글보다 훨씬 길게, 회고·트레이드오프·아키텍처 모두 포함)
- tags 첫 항목은 반드시 `project`

### 본문 구조 (권장)
1. **배경** — 왜 이 프로젝트가 시작됐는가, 어떤 문제를 풀려 했는가
2. **요구사항·제약조건** — 일반화된 형태로
3. **의사결정 과정** — 어떤 옵션이 있었고 왜 그것을 선택했는가 (트레이드오프 명시)
4. **핵심 기술 결정 사항** — 아키텍처·라이브러리·패턴 선택 이유
5. **진행 중 부딪힌 주요 문제와 해결** — 일별 history에서 추출, 시간 순으로
6. **최종 아키텍처** — Mermaid 다이어그램 권장
7. **회고** — 잘 된 점, 다음에는 다르게 할 점

### 일반화 규칙
기존 error/debug 작성 시의 일반화 규칙을 동일하게 적용한다. 프로젝트 단위 글은 회사 맥락이 가장 많이 드러나기 쉬우므로 추가로 다음을 주의한다.
- 프로젝트의 진짜 목적이 회사 비즈니스에만 의미 있는 경우, 더 추상적인 “이런 종류의 시스템”으로 변환
- 일반화가 글의 핵심 가치를 크게 훼손한다면 작성 보류 (단발 글의 판단 기준과 동일)

### 작성 제외 기준
- 회사 비밀 영역(인프라 토폴로지·계약 정보·내부 보안 정책·고객 정보)이 본질인 프로젝트
- 일반화하면 글의 핵심이 사라지는 프로젝트
- 외부 개발자가 읽었을 때 회사·서비스를 추정할 단서가 남는 경우

## Link Integrity Check (글 추가·삭제·이동 시 링크 검증)

블로그 글을 **추가·삭제·이동(archive 포함)**할 때마다 wiki link 무결성을 자동 검증한다. 이 검증을 빠뜨리면 외부 공개 후 깨진 링크가 사용자에게 노출된다.

### 작업별 체크 항목

| 작업 | 검증 내용 |
|---|---|
| **글 추가** | 새 글 안의 모든 `[[...]]` 링크가 실제 파일로 resolve되는지 |
| **글 삭제** | 삭제 대상을 참조하는 **다른 글이 있는지 먼저 검색** → 있으면 참조 측을 plain text/alias로 정리 |
| **글 이동·archive** | 이동된 글의 outgoing 링크 + 참조하던 다른 글들의 incoming 링크 양쪽 모두 검증 |
| **카테고리 재구성** | `index.md` 및 카테고리 진입 링크 모두 갱신 |

### 빠른 검색 (삭제·이동 전 사용)

```bash
# 특정 파일을 참조하는 모든 글 찾기 (FILENAME은 확장자 제외 basename)
grep -rln "\[\[FILENAME" content/ 2>/dev/null
```

### 일괄 검증 (대규모 작업 후)

`find + grep + awk` 조합으로 content/ 전체 wiki link를 추출하고, 각 target이 실제 파일로 resolve되는지 검사한다. 핵심 로직:

1. content/ 안 모든 `.md`의 full path와 basename 인덱스 생성
2. 각 글에서 `[[...]]` 추출 → alias·header 분리하여 target 추출
3. target이 full path / basename / sibling 어느 쪽으로도 resolve 안 되면 broken
4. 단, **mermaid 코드 블록 안의 `[[...]]` (sub-routine syntax)은 false positive로 제외**

### 검증 결과 처리

- 다른 글로 대체 가능 → 대체
- 대체할 글이 없음 → **plain text 또는 alias만 남기기** ([[X|Y]] → Y)
- 같은 폴더 안 sibling은 Quartz/Obsidian이 basename 매칭으로 resolve → false positive로 분류
- archive로 옮겨진 글은 link 자체가 부적절 → link 제거 또는 plain text

### 적용 시점

글 add/delete, 폴더 archive, 카테고리 재구성, `index.md` 변경, Projects 통합 글 작성 직후 — 이런 작업이 연속될 때는 **모든 작업이 끝난 시점에 한 번** 일괄 검증.

---

# 추가 규칙: question type 라우팅 (프로젝트 메모리 사본)

`question` type 글 라우팅 시, 단순 "X 설명해줘", "X 종류 정리", "X는 무엇" 같은 위키성 정의·나열 요청은 사용자 의향을 묻지 말고 **곧장 archive**로 간다.

**Why**: "Concept Question Archive" 섹션의 저장 대상 #2(본인의 의문이 출발점이 아닌 순수 개념 정리·정의 나열)에 해당. 의문에서 출발하지 않은 정의·나열성 콘텐츠는 블로그 본문 가치가 낮다.

**How to apply**:
- **"왜 X는 Y인가?"** → 즉시 블로그 자동 작성 (`content/...`)
- **"정말 X인가?", "X vs Y 차이는?"** 같은 본인 의문 출발 비교/검증 → "블로그로 작성할까?" 물어보기
- **"X 설명", "X 종류", "X는 무엇", "X 정리"** 같은 위키성 정의·나열 → **묻지 말고 archive 직행**, 본문 5~20줄
