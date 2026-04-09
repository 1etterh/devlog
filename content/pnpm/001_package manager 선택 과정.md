---
title: 패키지 매니저 선택 과정 - pnpm을 선택한 이유
tags: [pnpm, npm, package-manager, air-gapped]
draft: false
---
### 패키지 매니저 선택
### 1. 프로젝트 배포 환경
1. 개인 PC에서 개발
2. 내부망 서버에 배포 및 테스트
3. 실제 배포 시 고객사 서버(주로 폐쇄망)에 CD, USB 등을 통해 파일을 가져가서 설치

### 2. 패키지 매니저 선정 기준
1. 폐쇄망에 배포할 수 있도록, 오프라인 설치를 지원
2. 내부망 테스트시 동일한 패키지 중복설치 방지
3. hoisting으로 인한 phantom dependency 방지
4. 낮은 러닝커브, 현재 프로젝트와의 호환성

> pnpm, yarn berry를 후보군으로 선정

### 3. pnpm 선택 이유
1. 낮은 러닝커브(기존 npm과 유사)
2. 패키지 저장 방식의 효율성(global 저장소에 한번 설치 후 파일을 [[Link#^67d1e7|Hard Link]]하는 방식)
3. npm보다 약 2배 빠른 성능
