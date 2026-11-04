---
title: 폐쇄망
tags:
  - project
  - airgapped
  - offline_deployment
draft: false
---
> 인터넷이 차단된 환경(폐쇄망)에서 개발하고, 서비스를 배포하고, 몇 달 상주하며 겪은 것들

```mermaid
flowchart LR
    A[체크리스트<br/>개발·배포 준비물] --> B[배포<br/>pnpm store 반입·설치]
    B --> C[회고<br/>장기 상주]
```

## 체크리스트

반입 전에 한 줄씩 지우며 점검한다. 글마다 맨 위에 체크박스 점검표가 있고, 아래에 이유와 명령어가 있다.

1. [[001_airgapped_dev_environment_checklist|개발 환경 반입 체크리스트]] — 에디터·IDE 설정, 설치 파일, 공식 문서, Docker 기본 이미지, 패키지 미러, DB 덤프
2. [[002_airgapped_deploy_checklist|배포 준비물 체크리스트]] — 서비스 번들(DB·BE·FE), 프론트엔드 pnpm store, 폐쇄망 설치·검증

## 배포

프론트엔드 프로젝트를 pnpm store 기반으로 오프라인 설치하는 방법.

1. [[004_online_preparation|pnpm store 온라인 준비]] — pnpm 실행 파일, lockfile 점검, `pnpm fetch`, store 압축
2. [[005_pnpm_install_in_airgapped|폐쇄망 pnpm 설치 비교]] — exe 직접 / PATH 등록 / npm pack / corepack

## 회고

1. [[010_airgapped_onsite_retrospective|폐쇄망 장기 상주 회고]]
