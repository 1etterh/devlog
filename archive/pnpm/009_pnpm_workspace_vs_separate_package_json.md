---
title: pnpm workspace(monorepo) vs 개별 package.json 버전 관리
type: archive
tags: [archive, pnpm, monorepo, workspace, dependency_management]
draft: true
---

**Q**: 여러 프로젝트의 패키지 버전을 통일하려면 현재 방식(각자 package.json)과 pnpm workspace 중 어느 게 나은가?

**A**:
- 현재 방식은 프로젝트별 독립성은 보장하지만, 같은 패키지 버전이 drift되는 문제가 있음
- pnpm workspace + `catalog:` 문법(pnpm 9.5+)으로 루트의 `pnpm-workspace.yaml`에 버전 한 곳에서 정의 가능
- `catalog:` 적용 시 각 package.json에서 `"nuxt": "catalog:"` 처럼 참조 → 버전 sync 자동 보장
- pnpm-lock.yaml이 하나 → 모든 프로젝트에서 실제 resolve 버전 동일
- 단점: CI/CD 파이프라인을 root 기준으로 수정 필요, 별도 git repo라면 monorepo 합치기 작업 필요

패키지명이 `@scope/package-name` 형태인 프로젝트가 있으면 이미 workspace 구조를 염두에 둔 설계일 가능성 높음.
