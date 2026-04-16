---
title: "폐쇄망 배포 체크리스트"
type: question
tags: [question, docker, airgapped, checklist, deployment]
draft: true
---

## 준비 단계 (인터넷 환경)

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

### 번들 생성
- [ ] `prepare.sh` 실행
- [ ] 번들 파일 크기 확인
- [ ] 이미지 누락 없는지 확인 (tar 파일 개수)

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

### 검증
- [ ] DB 접속 확인
- [ ] 백엔드 API 헬스체크
- [ ] 프론트엔드 페이지 로딩 확인

## 자주 빠뜨리는 항목

| 항목 | 증상 | 해결 |
|------|------|------|
| 플랫폼 불일치 | `exec format error` | `--platform linux/amd64`로 재빌드 |
| .env 미설정 | DB 접속 실패 | `.env` 파일 값 확인 |
| 포트 충돌 | 컨테이너 즉시 종료 | `docker compose ps`로 확인, 포트 변경 |
| DB 볼륨 잔존 | 초기화 SQL 미실행 | `docker compose down -v` 후 재시작 |
| 디스크 부족 | `docker load` 실패 | 불필요 이미지 정리 후 재시도 |
