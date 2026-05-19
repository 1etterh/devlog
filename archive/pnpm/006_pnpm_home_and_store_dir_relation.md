---
title: PNPM_HOME만 설정하면 store-dir도 자동으로 잡히는가
type: archive
tags: [archive, pnpm, package_manager, env_var]
draft: true
---

**Q**: `PNPM_HOME`만 설정하면 pnpm store path는 `$PNPM_HOME/store`로 알아서 잡히는가?

**A**:
- 그렇다. pnpm `store-dir` 기본값 결정 순서:
  1. `$PNPM_HOME` 있으면 → `$PNPM_HOME/store`
  2. 없고 `$XDG_DATA_HOME` 있으면 → `$XDG_DATA_HOME/pnpm/store`
  3. 둘 다 없으면 OS별 기본 (macOS `~/Library/pnpm/store`, Linux `~/.local/share/pnpm/store`, Windows `~/AppData/Local/pnpm/store`)
- 단 `store-dir`을 명시적으로 설정해뒀다면 그게 우선
- store는 프로젝트와 **같은 파일시스템**이어야 hardlink가 동작 → 외장 드라이브 등에 `PNPM_HOME`을 두면 다른 드라이브 프로젝트는 별도 store가 생길 수 있음

출처: pnpm 공식 settings 문서의 `store-dir` 항목.
