---
title: Phase 4 — 근본 원인 분석 (Nuxt dev 모드, inotify, package.json 함정)
type: project
tags: [project, docker, nuxt, inotify, enospc, package_json, watch_mode, root_cause]
draft: false
---

> `container-a`가 1.7TB 로그를 뿜은 이유. ENOSPC 에러 → Nuxt dev/watch 모드 → `package.json`과 `docker-compose.yml`의 함정까지.

---

## 4-1. 로그 내용 확인 — ENOSPC 에러

```bash
docker logs --tail 50 container-a
```

**결과** (수십만 줄 반복):
```
ERROR  Watchpack Error (watcher): Error: ENOSPC: System limit for number of file watchers reached,
       watch '/app/node_modules/vue-client-only/dist'
ERROR  Watchpack Error (watcher): Error: ENOSPC: System limit for number of file watchers reached,
       watch '/app/node_modules/highcharts-vue'
ERROR  Watchpack Error (watcher): Error: ENOSPC: System limit for number of file watchers reached,
       watch '/app/node_modules/readable-stream/lib/internal/streams'
...
```

→ Vue/Nuxt가 webpack을 통해 `node_modules` 전체를 watch하려다 OS의 `inotify` 한도(`fs.inotify.max_user_watches`) 초과. 에러가 초당 수천 줄 stdout으로 흘러나와 `*-json.log`에 영구 저장됨.

확인 명령:
```bash
cat /proc/sys/fs/inotify/max_user_watches
# 기본값 8192 또는 65536 — Nuxt + node_modules 환경에선 즉시 부족
```

---

## 4-2. 왜 dev/watch 모드로 실행됐는가 — `package.json`의 함정

`~/docker/app-1/source/package.json`의 scripts 섹션:

```json
{
  "scripts": {
    "dev":        "cross-env NODE_ENV=development HOST=0.0.0.0 nuxt",
    "production": "cross-env NODE_ENV=production  HOST=0.0.0.0 nuxt",
    "build":      "cross-env NODE_ENV=production  HOST=0.0.0.0 nuxt --watch build",
    "start":      "cross-env NODE_ENV=production  HOST=0.0.0.0 nuxt start",
    "all":        "yarn build && yarn start"
  }
}
```

| 스크립트 | 실제 동작 | 운영용? |
|---|---|---|
| `dev` | `nuxt` (dev 서버) | X |
| **`production`** | **`nuxt` (이름만 production, 실제는 dev 서버)** | **X (함정)** |
| **`build`** | **`nuxt --watch build` (파일 변경 감시하며 빌드)** | **X (함정)** |
| `start` | `nuxt start` (진짜 prod 서버) | O |
| `all` | `build && start` | (함정 — 4-4 참조) |

**핵심**: `nuxt`를 인자 없이 단독 실행 = `nuxt dev`와 동일. `NODE_ENV=production` 환경변수만 줘도 실제 동작은 dev 서버. file watcher 작동.

---

## 4-3. `docker-compose.yml` 분석

```yaml
version: '3.3'
services:
  app-1:
    image:  container-a:3.0.00
    restart : always
    container_name: container-a
    volumes:
      - ./.env.production:/app/.env
      - ./source/pages:/app/pages
      - ./source/components:/app/components
      - ./source/layouts:/app/layouts
      ...
      - ./source/nuxt.config.js:/app/nuxt.config.js
      - ./source/package.json:/app/package.json
    ports:
      - "20960:20960"
    network_mode: host
    command: "yarn all"
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"
```

**중요한 발견**:
1. **로그 로테이션이 이미 compose에 설정됨** (50MB × 3 = 컨테이너당 최대 150MB). 사건 당일 11시에 누군가 추가한 것으로 추정 (`stat`으로 mtime 확인됨).
2. **command가 `yarn all`로 설정됨** — `yarn build && yarn start`. 의도는 production.
3. **호스트의 `source/*` 가 컨테이너 `/app/*`로 bind mount** — 호스트 파일만 고치면 컨테이너에 즉시 반영. 이미지 재빌드 불필요.

---

## 4-4. `yarn all`도 여전히 함정

`yarn all` = `yarn build && yarn start`. 그런데 `build`는 `nuxt --watch build`.

- `nuxt build --watch`는 **빌드 후 파일 변경을 감시하며 계속 동작** → **영원히 안 끝남**
- `&&`는 앞 명령이 끝나야 다음으로 진행
- 결과: `yarn start`는 **영영 실행 안 됨**
- 빌드 모드 watcher가 계속 돌면서 `inotify` 한도 초과 → ENOSPC 폭주

즉 누군가가 `command: yarn all`로 수정했어도 **부분적 fix**. 다시 띄우면 같은 문제 재발.

---

## 4-5. 정리 — 원인 흐름

```
누군가 compose의 command를 yarn all로 설정
    ↓
yarn build = "nuxt --watch build" 실행됨
    ↓
빌드 후에도 watcher가 살아 있음 (--watch 때문)
    ↓
node_modules 수천 개 watch 시도
    ↓
fs.inotify.max_user_watches 한도 초과 (기본 8192)
    ↓
각 파일마다 ENOSPC 에러 출력 (초당 수천 줄)
    ↓
stdout → docker가 *-json.log에 저장
    ↓
로그 로테이션 미설정 시기에 1.7TB 누적
```

당일 추가된 `logging: max-size: 50m, max-file: 3`은 **앞으로의 방어책**이지, 이미 쌓인 1.7TB는 그대로.

---

## 4-6. 부가 관찰 — `Modify` 시각으로 추정

```bash
stat ~/docker/app-1/docker-compose.yml
```

```
Access: 2026-05-19 11:00:46 +0900
Modify: 2026-05-19 11:00:42 +0900   ← 사건 당일 11시 수정
Change: 2026-05-19 11:00:42 +0900
```

→ 누군가 사건 당일 11시에 compose 파일을 저장. 로그 로테이션과 `yarn all` 둘 다 이때 추가됐을 가능성 큼. 응급 조치 중이었던 것으로 보임.

(주의: `vim :w`로 저장만 해도 내용 변경 없이 mtime이 갱신됨. 정확히 무엇이 바뀌었는지는 git diff 필요.)

---

## 4-7. Phase 4 요약

| 발견 | 의미 |
|---|---|
| ENOSPC inotify 에러가 stdout으로 폭주 | 진짜 원인 |
| `package.json`의 `production` = `nuxt` 단독 = dev 서버 | 함정 1 |
| `package.json`의 `build` = `nuxt --watch build` | 함정 2 |
| `compose`의 `command: yarn all`도 `build`의 `--watch` 때문에 무한 루프 | 함정 3 |
| `compose`에 로그 로테이션 이미 추가됨 (당일) | 부분적 응급조치 |
| `source/*`가 bind mount → 호스트 파일 수정만으로 적용 가능 | 해결의 열쇠 |

**다음 Phase**: 즉시 회수 + 영구 해결 → [[005_disk_recovery_solutions]]
