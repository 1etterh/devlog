---
title: TypeScript 7 설치 시 typescript-eslint가 실패하는 문제
type: archive
tags: [archive, typescript, typescript_eslint, pnpm, peer_dependency]
draft: true
---

**Q**: `typescript`를 버전 지정 없이 설치했더니 `eslint .`이 "typescript-eslint does not support TS 7.0"으로 실패한다. 왜?

**A**:
- `typescript`의 latest가 7.x(Go 네이티브 컴파일러)로 바뀌었고, typescript-eslint는 TS JS API에 의존해서 `<6.1.0`만 지원
- `typescript@~6.0.3`으로 내려도 같은 에러가 남 → pnpm이 peer 조합별로 만든 parser 디렉터리(`..._typescript@7.0.2`)가 그대로 남아 있었음
- `rm -rf node_modules pnpm-lock.yaml && pnpm install`로 peer 조합을 다시 계산해서 해결
- 새 major가 latest가 된 직후에는 lint·타입 도구의 peer 범위를 보고 버전을 고정할 것
