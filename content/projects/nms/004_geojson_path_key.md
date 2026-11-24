---
title: NMS 화면 다시 짜기 — 행정구역을 code 대신 path로 찾기
type: log
tags:
  - log
  - nms
  - geojson
  - map_drilldown
draft: true
---

> 2026-11-20. [[projects/nms/003_geojson_admin_boundary_map|GeoJSON 행정구역 지도]]의 파일 구조와 로딩 함수를 다시 정한 기록.
> 파일을 만드는 과정은 [[tools/gis/002_korea_admin_boundary_geojson|행정구역 GeoJSON 만들기]]에 있다.

## 헷갈렸던 것: `KR.json`에는 KR이 없다

처음 구조는 `KR.json`(한국의 하위), `KR/11.json`(서울의 하위)이었다. 그런데 코드를 다시 읽을 때마다 헷갈렸다.

| 파일 | 이름이 주는 느낌 | 실제 내용 |
|---|---|---|
| `KR.json` | KR의 파일 → KR 자신의 모양 | KR **아래** 시·도들 |
| `KR/index.json` | KR 폴더 안의 목차 → KR의 안쪽 | KR **아래** 시·도들 |

`KR.json`은 파일 이름과 내용이 한 단계 어긋나 있다. 폴더 구조로 바꾸니 **폴더 = 그 지역의 안쪽**이 되어 이름과 내용이 맞는다.

```
index.json                국가들      ← 한국의 모양은 여기
KR/index.json             시·도들     ← 서울의 모양은 여기
KR/11/index.json          서울의 구들 ← 종로구의 모양은 여기
```

| 지역 | 자기 모양이 든 파일 | 하위 모양이 든 파일 |
|---|---|---|
| 한국 `KR` | `index.json` | `KR/index.json` |
| 서울 `KR.11` | `KR/index.json` | `KR/11/index.json` |

## path: 지역을 찾는 키

각 지역에 **root부터 자기 code까지 `.`으로 이은 path**(`'KR.11'`)를 붙였다. 경계 파일에는 적지 않고, 받을 때 `부모 path + '.' + code`로 채운다.

path 하나에 세 가지가 들어 있다.

| 필요한 것 | path로 구하기 |
|---|---|
| 하위 파일 위치 | `[...path.split('.'), 'index'].join('/')` |
| 부모 | 마지막 마디를 뗀다 (`'KR.11'` → `'KR'`) |
| 브레드크럼 | `split('.')` |

code만 있을 때는 이걸 위해 따로 장치가 필요했다.

| code만 쓸 때 | path를 쓰면 |
|---|---|
| 파일을 받을 때마다 `parentOf` Map에 부모를 기록 | 필요 없음 |
| 코드 규칙(앞 2자리 = 시·도)으로 부모를 추측 | 필요 없음 |
| 나라마다 코드 규칙이 다르면 다시 짜야 함 | 규칙에 기대지 않음 |

그래서 path는 거의 필수다. 사이트 위치 같은 다른 데이터도 code 대신 path로 저장한다.

헷갈리지 않게 이름으로 두 종류를 구분한다.
- `loadChildren(parentPath)`, 캐시 Map의 키 → **부모** path
- `feature.properties.path` → **자기** path

## loadChildren과 loadRegion

| | `loadChildren(parentPath)` | `loadRegion(code)` (예전) |
|---|---|---|
| 받는 것 | 그 지역의 **하위**가 든 파일 | 그 지역 **자신**이 든 파일 |
| 방향 | 아래로 | 위로 (나를 담은 부모의 파일) |
| 쓰는 곳 | 지도를 눌러 내려갈 때 | 바깥에서 code만 주어질 때 (사이트 위치 → 이름, 중심 좌표) |

`loadRegion`은 code만으로는 부모를 몰라서 코드 규칙으로 추측했다.

```ts
async function loadRegion(code: string) {
  if (!parentOf.has(code)) await loadChildren();                // 시·도 파일
  if (!parentOf.has(code) && code.length > 2)
    await loadChildren(code.slice(0, 2)).catch(() => undefined); // 앞 2자리 = 시·도
}
```

시·군·구까지만 되고, 한국 코드 규칙에만 맞고, 받기를 순서대로 기다린다. path가 있으면 부모가 path 안에 있으니 한 줄이 된다.

```ts
const parentOf = (path: string) => path.split('.').slice(0, -1).join('.');
const loadRegion = (path: string) => loadChildren(parentOf(path));
```

조상 파일이 다 필요하면(브레드크럼 이름 등) `''`, `'KR'`, `'KR.11'`을 `Promise.all`로 동시에 받는다.

## 하위 파일이 있는지는 받아 보고 안다

경계 데이터에 `hasChildren`을 적는 대신, 하위 파일을 받아 보고 없으면 그 path를 기억해 두고 다시 요청하지 않는다.

- SPA로 배포하면 없는 파일도 **200 + index.html**로 온다. 요청 실패가 아니라 응답의 `type`이 `FeatureCollection`인지로 판단한다.
- 네트워크 오류는 기억하지 않는다. 잠깐 끊긴 지역이 계속 못 누르는 지역이 되면 안 된다.
- 대신 하위가 없는 지역은 처음 누를 때 요청이 한 번 갔다가 아무 일도 안 일어난다. 미리 커서를 다르게 보여 줄 수 없는 것도 감수했다.

`loadChildren`이 Promise를 돌려주는데 `async`가 아닌 이유는 [[javascript/001_function_returning_promise_vs_async|Promise를 돌려주는 함수는 async 함수인가]]에 정리했다.

## 정리

| 결정 | 이유 |
|---|---|
| 모든 단계를 폴더로 (`KR/11/index.json`) | 이름과 내용이 맞고, 규칙 하나로 단계가 늘어도 그대로 |
| 지역 키는 path | 위치 · 부모 · 파일 위치가 한 값에 들어 있어 추측 장치가 필요 없다 |
| `hasChildren` 대신 받아 보고 기억 | 자료를 바꿀 때 맞춰 줄 표시가 없어진다 |
