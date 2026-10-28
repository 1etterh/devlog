---
title: Docker Hub 이미지는 pull할 때 아키텍처를 알아서 고르는가
type: archive
tags: [archive, docker, multi_platform, image_index, cpu_architecture]
draft: true
---

**Q**: Docker Hub에서 공식 이미지를 받을 때 amd64/arm64 표시가 없는데, pull할 때 알아서 골라 받는가?

**A**:
- 공식 이미지의 태그 하나는 이미지 한 개가 아니라 아키텍처별 이미지 목록(image index, 예전 이름 manifest list)이다 (예: amd64, arm64/v8, ppc64le + attestation)
- `docker pull`을 하면 Docker가 내 컴퓨터의 OS/CPU에 맞는 이미지 하나만 골라 받는다
- 직접 빌드한 이미지는 빌드한 컴퓨터의 아키텍처 하나로만 만들어져 고를 게 없다 → 다른 아키텍처 서버용이면 빌드할 때 `--platform` 지정 필요
- `docker buildx build --platform linux/amd64,linux/arm64 --push`로 레지스트리에 올리면 자체 이미지도 자동 선택된다 (빌드 시간은 늘어남)

확인 명령: `docker buildx imagetools inspect <image>:<tag>`
