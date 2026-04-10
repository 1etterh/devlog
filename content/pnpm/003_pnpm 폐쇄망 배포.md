---
title: pnpm 폐쇄망 배포 - 오프라인 환경에서 pnpm store 이전
tags: [pnpm, air_gapped, offline, deployment]
draft: false
---
## 1. pnpm 실행파일 준비

1. 대상 서버 사양 확인

```
uname -m
```

> x86_64

2. [pnpm 릴리즈 페이지](https://github.com/pnpm/pnpm/releases) 접속
3. 원하는 버전 선택, OS에 맞는 파일 다운로드
4. USB로 pnpm 파일 복사

## 2. pnpm store 복사
1. pnpm store 경로 확인

```
pnpm store path
```

2. pnpm store 경로 설정
```
pnpm config set store-dir ~/pnpm/store
```

3. pnpm store에 설치된 패키지를 압축

```
# 스토어 경로 확인 (예: /home/user/.local/share/pnpm/store/v3)
PNPM_STORE_PATH=$(pnpm store path)

# 스토어 압축
tar -czf pnpm-store.tar.gz -C "$PNPM_STORE_PATH" .
```

4. USB로 해당 tar.gz파일을 옮긴 후 압축 해제

```
sudo mkdir -p ~/pnpm/store
sudo tar -xzf /path/to/pnpm-store.tar.gz -C ~/pnpm/store
# Docker가 접근 가능하도록 권한 설정 (필요 시)
# sudo chown -R <user>:<user> ~/pnpm/store
```
