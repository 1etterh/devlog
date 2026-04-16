---
tags:
  - project
  - docker
  - offline_deployment
  - airgapped
draft: true
---
> 폐쇄망 배포 자동화 도구 — DB, BE, FE를 하나의 번들로 준비하고 한 방에 설치

## 개요

인터넷이 차단된 환경(폐쇄망)에 여러 서비스를 반복 배포할 때마다 수동으로 이미지를 준비하고, SQL을 옮기고, 설정을 맞추는 작업이 번거로워서 만든 자동화 도구.

**핵심 흐름**: `prepare.sh` (인터넷) → tar.gz 전송 → `install.sh` (폐쇄망)

## 프로젝트 구조

```
offline-deploy/
├── db/              # MariaDB 초기화 SQL + 설정
├── be/              # Spring/Armeria 백엔드 Dockerfile
├── fe/              # Nuxt 프론트엔드 (올인원 이미지)
├── scripts/
│   ├── prepare.sh   # 번들 생성
│   └── install.sh   # 폐쇄망 설치
├── docker-compose.yml
└── .env.example
```

## 관련 글

1. [[폐쇄망 Docker 배포 전체 흐름]]
2. [[올인원 Docker 이미지 패턴]]
3. [[폐쇄망 배포 체크리스트]]
4. [[폐쇄망 배포 트러블슈팅]]
