---
title: git init 후 파일이 tracked 상태가 되는 시점
type: archive
tags: [archive, git, version_control, staging_area]
draft: true
---

**Q**: `git init`을 하면 파일들이 언제 tracked 상태가 되는가?

**A**:
- `git init`은 `.git/` 디렉토리만 생성한다. 이 시점에 tracked 파일은 0개이고, 모든 파일은 untracked 상태다.
- 파일이 tracked 상태로 전환되는 순간은 **`git add`로 staging area(index)에 처음 등록될 때**이다.
- `git commit`은 tracked 파일을 history(objects)에 영구 저장하는 단계로, tracked 여부 자체는 이미 add 시점에 결정되어 있다.

| 상태 | 의미 | 진입 시점 |
|---|---|---|
| untracked | git이 존재만 인식, 관리 대상 아님 | `git init` 직후 모든 파일 |
| tracked | 한 번이라도 add 또는 commit된 파일 | `git add <file>` 실행 시 |
| staged | 다음 commit에 포함될 변경 | `git add` 실행 시 |
| unmodified | tracked이며 working tree와 index가 동일 | `git commit` 직후 |

즉 “tracked의 진입점은 `git init`이 아니라 `git add`”가 핵심이다. `git init`은 저장소를 만들 뿐 어떤 파일도 자동으로 따라오지 않는다.

---

**Q (이어지는 의문)**: `git add` 했는데 commit 전에 잘못 올린 걸 unstage하면, 그 파일은 계속 tracked인가?

**A**: 그 파일이 **이전에 commit된 적이 있는지**에 따라 갈린다.

| 케이스 | unstage 후 상태 |
|---|---|
| 신규 파일 (한 번도 commit 안 됨) | 다시 **untracked**로 복귀 |
| 기존 파일 (이미 commit 이력 있음) | **tracked 유지** (이전 commit에 존재) |

판단 기준: tracked는 “현재 index에 있거나 마지막 commit에 존재하는가”로 결정된다. 신규 파일을 add → unstage하면 둘 다에서 빠지므로 tracked 자격이 사라진다.

unstage 명령 비교:

| 명령 | 동작 |
|---|---|
| `git restore --staged <file>` | staging만 취소 (현대식, Git 2.23+) |
| `git reset HEAD <file>` | 동일 동작 (옛 방식) |
| `git rm --cached <file>` | index에서 강제 제거, working tree 파일은 유지 |

요약: commit 전이라면 신규 파일은 깨끗이 untracked로 되돌릴 수 있고, 기존 파일은 staging만 취소될 뿐 tracked 상태와 working tree 변경은 그대로 남는다.
