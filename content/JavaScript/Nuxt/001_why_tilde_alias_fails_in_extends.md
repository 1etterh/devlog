---
title: Nuxt의 extends에서 ~ alias는 왜 동작하지 않는가
type: question
tags: [question, nuxt, path_resolution, layer, alias]
draft: false
---

**Q**: `nuxt.config.ts`에서 `extends: ['~/some/path']`처럼 `~` alias를 쓰면 `cannot extend layer ~/...` 에러가 나는데, 셸에서 `~`가 홈 디렉토리를 가리키는 것처럼 Nuxt에서도 같지 않은가?

**A**: 아니다. 셸의 `~`와 Nuxt의 `~`는 의미가 다르다.

| 환경 | `~`가 가리키는 곳 |
|---|---|
| 셸 (bash/zsh) | `$HOME` (예: `/Users/{user}`) |
| Nuxt alias | 프로젝트의 `srcDir` (기본값: 프로젝트 루트) |
| Node.js fs/path | 어떤 의미도 없음 — 그냥 리터럴 문자 |
| `new URL('~/x', import.meta.url)` | expand 안 함, 현재 파일 디렉토리에 그대로 붙임 |

그래서 `extends: ['~/Desktop/foo/layer']`라고 쓰면 Nuxt는 `<projectRoot>/Desktop/foo/layer`를 찾고, 거기 없으면 layer를 못 찾는다.

## extends가 받는 값의 형식

Nuxt의 `extends` 옵션이 공식적으로 지원하는 입력은 다음 4가지다.

| 형식 | 예시 | 동작 |
|---|---|---|
| 절대 경로 | `/Users/me/layers/foo` | 그대로 사용 |
| 상대 경로 | `../shared-layer` | `nuxt.config.ts` 기준 |
| npm 패키지명 | `'@org/nuxt-layer'` | `node_modules`에서 찾음 |
| git URL | `'github:org/repo'` | giget으로 fetch |

`~`, `@`, `@@`, `~~` 같은 Nuxt 내부 alias는 **layer 경로 resolve 시점에는 아직 등록되지 않았기 때문에** 받지 않는다. alias는 빌드 그래프가 구성된 이후 모듈 import 단계에서만 동작한다.

## 왜 alias가 layer 단계에서 동작하지 않는가

Nuxt의 부팅 순서를 보면 이유가 명확하다.

```mermaid
flowchart LR
    A[nuxt.config 로드] --> B[extends 해석<br/>layer 디렉토리 결정]
    B --> C[layer들의 config 머지]
    C --> D[alias 등록<br/>~, @, ~~ 등]
    D --> E[vite/webpack 빌드<br/>alias 적용]
```

`extends`는 1단계에서 처리되는데, `~`가 실제 경로로 치환되려면 4단계까지 가야 한다. 닭이 먼저냐 달걀이 먼저냐의 순환이 생기므로 의도적으로 지원하지 않는다.

## 홈 디렉토리를 쓰고 싶다면

`os.homedir()`로 expand해서 절대 경로를 만든다.

```ts
import { resolve } from 'node:path';
import { homedir } from 'node:os';

const layerPath = resolve(homedir(), 'workspace/shared-layer');

export default defineNuxtConfig({
  extends: [layerPath],
  alias: {
    '~layer': layerPath,
  },
});
```

또는 단순히 상대 경로로 쓰는 게 가장 안전하다.

```ts
extends: ['../shared-layer'],
```

## 정리

- 셸의 `~` 습관 때문에 Nuxt 설정에서도 자연스럽게 `~/...`를 쓰게 되지만, 의미가 완전히 다르다.
- `extends`는 alias 등록 전에 처리되므로 `~`, `@` 같은 Nuxt alias를 받지 못한다.
- 홈 디렉토리 기반 경로가 필요하면 `node:os`의 `homedir()`로 직접 expand하거나, 처음부터 상대 경로/절대 경로로 쓴다.
