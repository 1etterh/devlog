---
title: 클라우드 스토리지(Google Drive 등)에 git remote를 지정할 수 있나?
type: archive
tags: [archive, git, remote, cloud_storage]
draft: true
---

**Q**: Google Drive 같은 파일 동기화 스토리지에도 git remote를 지정할 수 있나?

**A**:
- 기술적으로는 가능하지만 권장 X
- Google Drive를 로컬에 마운트한 뒤, 그 안에 `git init --bare`로 bare repo를 만들고 `file:///mounted/path/repo.git`을 remote로 지정하는 방식
- Dropbox, OneDrive, iCloud Drive도 같은 원리
- 하지만 git은 `.git/objects`와 pack 파일의 동시 쓰기·부분 동기화에 매우 취약 → sync 충돌 시 repo가 깨짐
- 파일 락 개념이 없어 두 기기에서 동시에 push하면 깨짐
- 클라우드 스토리지는 git **프로토콜 자체를 native로 지원하지 않음** (HTTPS/SSH/git:// 모두 미지원)

git이 native로 지원하는 remote 프로토콜은 `https://`, `ssh://`, `git://`, `file://` 4종. 클라우드 스토리지 트릭은 `file://`을 우회적으로 활용하는 것뿐이라 안정성이 낮다. 실용적으로는 GitHub/GitLab의 private repo, 또는 SSH 접근 가능한 서버에 bare repo를 두는 편이 안전하다.

**파일 락 관련 보충**: git은 OS 락 API 대신 `.git/index.lock` 같은 센티넬 파일을 `O_CREAT | O_EXCL`로 원자적 생성한 뒤, 작업 완료 시 `rename()`으로 최종 파일을 갈아끼우는 방식으로 일관성을 보장한다. 이 패턴은 (1) 로컬 파일시스템의 **원자적 rename**과 (2) **lock 파일의 즉시 가시성**을 전제로 한다. 클라우드 스토리지는 동기화 지연으로 락 파일이 다른 기기에 늦게 전파되고, 내부적으로 rename을 "삭제 후 재업로드"로 흉내내며, 충돌 시 `file (1).conflicted` 같은 사본을 만들어 repo를 깨뜨린다. 같은 이유로 NFS·SMB 위에서 git을 돌리는 것도 비권장.
