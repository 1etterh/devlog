---
title: .gitignore 패턴은 regex가 아니라 glob이다
type: archive
tags: [archive, git, gitignore, glob, regex, wildcard]
draft: true
---

**glob**(글롭) 패턴입니다. 셸에서 `ls *.txt` 할 때 쓰는 그 와일드카드 문법이고, 정규식(regex)과는 다른 별개의 문법입니다. `.gitignore`는 glob에 Git 고유 규칙 몇 개를 더 얹은 형태입니다. Git 문서에서는 내부적으로 `fnmatch(3)` 스타일이라고 설명합니다.

## glob vs regex 핵심 차이

| 의미 | glob | regex |
|---|---|---|
| 아무 문자 0개 이상 | `*` | `.*` |
| 아무 문자 1개 | `?` | `.` |
| 문자 집합 | `[abc]`, `[a-z]` | `[abc]`, `[a-z]` (같음) |
| 부정 집합 | `[!abc]` | `[^abc]` |
| 리터럴 점 | `.` | `\.` |
| 전체 일치 여부 | 문자열 **전체**가 맞아야 함 | 기본은 부분 일치(`^…$`로 고정) |
| 반복·그룹·OR | 없음 | `+`, `{n}`, `( )`, `\|` |

가장 많이 헷갈리는 건 `*`입니다. regex에서 `*`는 "앞 글자 반복"이지만, glob에서는 그 자체로 "아무 문자열"입니다. 그래서 `*.log`를 regex로 읽으면 문법 오류이고, glob으로 읽으면 "`.log`로 끝나는 이름"입니다.

## .gitignore가 glob에 더한 규칙

| 패턴 | 의미 |
|---|---|
| `*` | `/`를 **넘지 않는** 아무 문자열 (한 단계 경로 안에서만) |
| `**` | 디렉토리 여러 단계 (`**/logs`, `logs/**`, `a/**/b`) |
| `/build` | 앞에 `/` → `.gitignore`가 있는 위치 기준으로만 매칭 |
| `build` | `/` 없음 → 아무 깊이의 `build` 파일·폴더 모두 |
| `build/` | 끝에 `/` → 디렉토리만 |
| `!keep.txt` | 앞에 `!` → 앞에서 무시한 것을 다시 포함 |
| `#` | 주석 |

예를 들어 `.gitignore:90`의 `.claude/*`는 "루트의 `.claude` 폴더 **안의 항목 전부**"라는 뜻입니다. `.claude/` 자체를 무시하는 것과는 차이가 있습니다. `/*` 형태로 써야 뒤에 `!.claude/settings.json`처럼 일부만 다시 살릴 수 있습니다. Git은 **부모 디렉토리가 통째로 무시되면 그 안을 다시 포함할 수 없기 때문**입니다.

## 같은 glob 계열을 쓰는 곳

- 셸 와일드카드: `ls src/**/*.ts` (zsh, bash의 `globstar`)
- `.dockerignore`, `.eslintignore`, `.prettierignore`
- `tsconfig`의 `include`/`exclude`, Vite·Nuxt 설정의 파일 패턴
- 라이브러리: Node `minimatch`/`picomatch`/`fast-glob`, Python `fnmatch`/`pathlib.glob`

도구마다 `**`나 `!`를 지원하는 정도가 조금씩 다르니, 세부 규칙은 해당 도구 문서를 확인하는 게 안전합니다.
