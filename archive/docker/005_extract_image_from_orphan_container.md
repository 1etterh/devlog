---
title: orphan 컨테이너에서 이미지 추출 가능 여부
type: archive
tags: [archive, docker, container, image, commit]
draft: true
---

**Q**: Docker에서 orphan container로부터 이미지를 추출할 수 있는가?

**A**:
- 가능. `docker commit <container_id> <image_name>:<tag>` 사용
- orphan 여부와 무관하게 컨테이너가 존재하기만 하면 됨 (정지 상태 OK)
- 원본 이미지가 삭제되었어도 base layer + writable layer가 묶여 새 이미지로 저장됨
- **volume mount된 데이터는 포함되지 않음** — volume은 컨테이너 외부 자원
- `docker save`로 tar export, `--change` 옵션으로 CMD/ENV 메타데이터 수정 가능

orphan container = compose service에서 제거되었거나 정의가 사라진 컨테이너. 이미지 추출 메커니즘에는 영향 없음. 단, 추출된 이미지는 "현재 writable layer 스냅샷"이므로 런타임 상태(메모리, 네트워크 연결)는 보존되지 않는다.
