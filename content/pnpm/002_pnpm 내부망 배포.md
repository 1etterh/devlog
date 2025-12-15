---
title:
tags:
draft: true
---
> 테스트용 내부망 서버에 배포하는 과정을 정리함.

## I. 기존 방식 및 개선 목표
### 1. 기존 내부망 배포 방식
1. docker image에는 패키지만 설치되어있음
2. 개발한 소스 코드를 volume mount시킴
3. container를 올릴 때 mount 시킨 소스를 빌드 및 배포함

![[Pasted image 20251215144318.png]]

> 다수의 이미지에 같은 패키지가 중복 설치되어 있어, 저장 공간의 효율성이 떨어지는 문제 발생

### 2. pnpm 사용 목적
1. 내부망 서버에 패키지 설치 후 container에 mount하여, 패키지 설치 용량을 줄임
2. 다수의 프로젝트에서 한 이미지를 사용하여 배포
3. source 코드를 mount하는 방식은 유지

## II. pnpm 배포

### 1. Docker Image 생성
1. 현재 사용하고 있는 node 버전의 이미지를 사용
2. pnpm store path를 환경변수로 설정(다수의 컨테이너에서 동일한 store를 참조하기 위함)

#### pnpm설치, 환경변수를 설정한 Docker Image 생성

[pnpm 공식 문서](https://pnpm.io/ko/docker)의 Dockerfile을 변형함.
```Dockerfile
FROM node:24-slim AS base  
ENV PNPM_HOME="/pnpm"  
ENV PATH="$PNPM_HOME:$PATH"  
ENV PNPM_STORE_DIR=/pnpm/store  
  
#ADD --chown=node:node https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linux-x64 /usr/local/bin/pnpm
RUN npm i -g pnpm  
RUN chmod +x /usr/local/bin/pnpm  
  
WORKDIR /app  
  
  
EXPOSE 20990
```
> pnpm을 설치하는 2가지 방법(하나는 주석처리됨)중 1가지를 선택하여 사용

```cmd
docker build . --no-cache --platform=linux/amd64 -t pnpm-node-24
```
### 2. Docker Compose.yml 파일 작성

```yml
version: '3.8'  
services:  
  asmk-mgr:  
    image: pnpm-node-24  
    restart: always  
    container_name: asmk-mgr-server  
    volumes:  
      - ./source:/app  
      - /app/node_modules  
      - ${HOME}/pnpm/store:/pnpm/store  
    ports:  
      - "30950:30950"  
    environment:  
      - CI=true  
    entrypoint: ["sh", "-c", "/app/entrypoint.sh"]
```

### 3. entrypoint.sh 작성

```
#!/bin/sh  
# 에러 발생 시 즉시 스크립트 중단  
set -e  
  
echo "--- 0. Clearing previous build caches (.nuxt, .output) ---"  
rm -rf .nuxt .output  
  
pnpm config set store-dir ${PNPM_STORE_DIR}  
  
echo "--- 1. Running pnpm install (offline from store) ---"  
# pnpm install을 실행하여 node_modules 구성  
pnpm install --frozen-lockfile  
  
echo "--- 2. Building the Nuxt application ---"  
# Nuxt 프로젝트 빌드 (package.json의 build 스크립트 실행)  
pnpm build  
  
echo "--- 3. Starting the production server ---"  
# Nuxt 프로젝트 시작 (package.json의 start 스크립트 실행)  
# exec를 사용하면 불필요한 셸 프로세스를 남기지 않고 주 프로세스로 실행됩니다.  
exec pnpm start
```

