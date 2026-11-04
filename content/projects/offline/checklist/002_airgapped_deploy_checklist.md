---
title: "배포 준비물 체크리스트"
type: log
tags: [log, docker, airgapped, checklist, deployment, offline_deployment]
draft: false
---

> 폐쇄망에 서비스를 배포할 때 챙길 것. 인터넷 PC에서 준비 → 반입 → 폐쇄망 설치 순서로 점검한다. 프론트엔드 store 방식의 자세한 절차는 [[004_online_preparation|pnpm store 온라인 준비]], [[005_pnpm_install_in_airgapped|폐쇄망 pnpm 설치 비교]] 참고.

## 준비 단계 (인터넷 환경)

### 대상 서버 확인
- [ ] OS·CPU 아키텍처 (`uname -m`, `$env:PROCESSOR_ARCHITECTURE`)
- [ ] 반입 가능한 매체 종류 (CD-R / DVD-R / RW)

### DB
- [ ] 초기화 SQL 준비 (스키마 + 시드 데이터)
- [ ] DB 설정 파일 확인 (charset, max_connections 등)
- [ ] `.env`에 DB 계정/비밀번호 설정

### 백엔드
- [ ] 프로젝트 빌드 (JAR/WAR 생성)
- [ ] Dockerfile 작성 및 이미지 빌드
- [ ] application.yml 환경별 설정 분리

### 프론트엔드
- [ ] Docker 이미지 빌드 (`--platform linux/amd64`)
- [ ] 각 앱 실행 테스트

### 기본 이미지
- [ ] 서비스 이미지의 `FROM`에 쓴 베이스 이미지(node, OpenJDK, mariadb 등)도 따로 `docker save` — 폐쇄망 안에서 다시 빌드할 일이 생기면 필요하다
- [ ] 반영 전 로컬 테스트용 이미지도 함께 (운영과 같은 구성을 띄워 보기 위해)
- [ ] `latest` 대신 버전 태그, 서버 아키텍처에 맞춰 `--platform linux/amd64`로 pull

### 번들 생성
- [ ] `prepare.sh` 실행
- [ ] 번들 파일 크기 확인
- [ ] 이미지 누락 없는지 확인 (tar 파일 개수)

> 번들은 **"한 번 담아서 가져가는"** 방식이라, 정해진 버전을 설치하는 데는 충분하다. 폐쇄망 안에서 의존성을 추가하며 계속 개발해야 한다면 번들만으로는 부족하다. 이때는 [[001_airgapped_dev_environment_checklist|개발 환경 반입 체크리스트]]의 패키지 미러(Verdaccio / Nexus) 구성을 함께 준비한다.

### 프론트엔드 pnpm store 방식

Docker 번들 대신 store를 옮겨 폐쇄망에서 직접 install·build할 때.

- [ ] pnpm 실행 파일 (대상 OS·아키텍처용, 예: `pnpm-linux-x64`)
- [ ] 모든 프로젝트에 `pnpm-lock.yaml` 있음
- [ ] 기존 store와 `node_modules` 모두 삭제
- [ ] `.npmrc`에 멀티플랫폼 설정 (`supportedArchitectures`)
- [ ] 모든 프로젝트에서 `pnpm fetch`, store 크기가 수백 MB 이상
- [ ] `tar -czf pnpm-store.tar.gz -C <store 경로> .` (`-C` 필수)
- [ ] 소스는 `node_modules`, `.nuxt`, `.output`, `.cache` 제외
- [ ] (권장) `--network=none` 컨테이너에서 offline install 사전 검증
- [ ] Docker 이미지로 옮긴다면: Lean은 이미지 + store + 소스, Full deps는 이미지 + 소스

## 설치 단계 (폐쇄망)

### 사전 확인
- [ ] Docker + Docker Compose 설치됨
- [ ] 포트 사용 가능 (3306, 8080, 3000 등)
- [ ] 디스크 여유 공간 (이미지 크기 × 2 이상)

### 설치 실행
- [ ] tar.gz 압축 해제
- [ ] `.env` 파일에 실제 값 설정
- [ ] `install.sh` 실행
- [ ] `docker compose ps`로 전체 서비스 Running 확인
- [ ] (store 방식) store 해제 후 `pnpm config set store-dir`, `pnpm store path` 아래 `files/` 확인
- [ ] (store 방식) base-layer 먼저 `pnpm install --frozen-lockfile --offline`
- [ ] (store 방식) 출력에 `downloaded 0`, `.nuxt/tsconfig.json` 생성

### 검증
- [ ] DB 접속 확인
- [ ] 백엔드 API 헬스체크
- [ ] 프론트엔드 페이지 로딩 확인

### 반영 대비
- [ ] 서버 반영 디렉토리에 `git init` + baseline 커밋 (롤백 지점)

## 자주 빠뜨리는 항목

| 항목 | 증상 | 해결 |
|------|------|------|
| 플랫폼 불일치 | `exec format error` | `--platform linux/amd64`로 재빌드 |
| .env 미설정 | DB 접속 실패 | `.env` 파일 값 확인 |
| 포트 충돌 | 컨테이너 즉시 종료 | `docker compose ps`로 확인, 포트 변경 |
| DB 볼륨 잔존 | 초기화 SQL 미실행 | `docker compose down -v` 후 재시작 |
| 디스크 부족 | `docker load` 실패 | 불필요 이미지 정리 후 재시도 |
