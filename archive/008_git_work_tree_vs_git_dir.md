---
title: git은 .git 위치 하위만 관리할 수 있는가
type: archive
tags: [archive, git, work_tree, git_dir]
draft: true
---

**Q**: git은 `.git`이 위치한 폴더 하위 항목만 관리할 수 있는가?

**A**:
- 기본 동작은 그렇다. `.git`의 부모 폴더를 working tree로 보고 그 하위만 추적
- 하지만 `--git-dir` / `--work-tree` 옵션, `GIT_DIR` / `GIT_WORK_TREE` 환경변수로 분리 가능
- 즉 정확히는 "`.git` 하위"가 아니라 "**working tree 하위**"만 관리하며, working tree 위치는 `.git`과 무관하게 지정 가능
- dotfiles 관리에서 자주 쓰는 패턴: `git --git-dir=$HOME/.dotfiles.git --work-tree=$HOME ...` — 저장소는 별도 위치, 추적 대상은 홈 전체
- bare repo는 working tree 자체가 없는 형태(원격 저장소용)

| 구분 | 역할 | 위치 |
|---|---|---|
| `.git` (repository) | objects·refs·메타데이터 | 임의 위치 가능 |
| working tree | 실제 추적 대상 파일이 있는 폴더 | `.git`과 분리 가능 |
| bare repo | working tree 없는 저장소 | 원격용 |
