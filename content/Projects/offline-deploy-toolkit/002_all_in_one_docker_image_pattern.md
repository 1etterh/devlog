---
title: "올인원 Docker 이미지 패턴"
type: question
tags: [question, docker, multi_app, docker_compose, environment_variable]
draft: true
---

## 문제

유사한 프론트엔드 프로젝트가 여러 개일 때, 각각 이미지를 만들면 전송량이 늘고 관리 포인트가 분산된다.

## 해결: 하나의 이미지 + 환경변수 선택

```dockerfile
# 하나의 이미지에 여러 앱 빌드
COPY app-a/ app-a/
COPY app-b/ app-b/
COPY app-c/ app-c/

RUN cd /app/app-a && npm run build \
 && cd /app/app-b && npm run build \
 && cd /app/app-c && npm run build

ENV APP=app-a

CMD sh -c 'case "$APP" in \
  app-a) node /app/app-a/.output/server/index.mjs ;; \
  app-b) node /app/app-b/.output/server/index.mjs ;; \
  app-c) node /app/app-c/.output/server/index.mjs ;; \
  *) echo "Unknown APP: $APP" && exit 1 ;; \
esac'
```

## docker-compose.yml

같은 이미지를 환경변수만 바꿔서 재사용한다.

```yaml
services:
  app-a:
    image: multi-app
    environment:
      - APP=app-a
    ports:
      - "3000:3000"

  app-b:
    image: multi-app
    environment:
      - APP=app-b
    ports:
      - "3001:3000"

  app-c:
    image: multi-app
    environment:
      - APP=app-c
    ports:
      - "3002:3000"
```

## 장단점

| 장점 | 단점 |
|------|------|
| 이미지 1개만 전송 | 이미지 크기가 큼 |
| 공통 레이어 공유 | 한 앱만 수정해도 전체 재빌드 |
| docker-compose에서 같은 이미지 재사용 | 앱 수가 많아지면 빌드 시간 증가 |

폐쇄망처럼 전송이 어려운 환경에서는 장점이 더 크다.
