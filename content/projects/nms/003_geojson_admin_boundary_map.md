---
title: NMS 화면 다시 짜기 — GeoJSON으로 행정구역 지도 만들기
type: log
tags:
  - log
  - nms
  - geojson
  - echarts
  - map_drilldown
draft: true
---

> 2026-11-10. 직접 이해하면서 다시 구현한 기록 중 행정구역 지도 부분.
> 같은 날 기록: [[projects/nms/002_typescript_types_location_and_base_fields|TypeScript 타입 정리]]

## 무엇을 만들었나

- 전국 지도를 시·도 단위로 나눠 보여 준다.
- 시·도를 누르면 그 지역으로 확대하고, 그 안을 시·군·구로 나눠 보여 준다.
- "상위 지역" 버튼으로 한 단계씩 올라온다.

차트는 ECharts를 쓰고 있어서 지도도 ECharts `geo` 컴포넌트로 그렸다. ECharts는 지도 데이터를 내장하지 않으므로 **행정구역 경계를 GeoJSON으로 직접 넣어야** 한다.

---

## 1. GeoJSON 구조

GeoJSON(RFC 7946)은 지리 도형을 JSON으로 표현하는 표준이다. 행정구역 경계 파일은 이런 모양이다.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "code": "39", "name": "제주특별자치도", "name_eng": "Jeju-do", "base_year": "2013" },
      "geometry": { "type": "MultiPolygon", "coordinates": [[[[126.957, 33.522], "..."]]] }
    }
  ]
}
```

| 요소 | 뜻 | 메모 |
|---|---|---|
| `FeatureCollection` | Feature 목록 | 경계 파일 하나 |
| `Feature` | 도형 + 속성 | 지역 하나 |
| `properties` | 자유 형식 속성 | **표준이 키를 정하지 않는다.** 데이터마다 다르다 |
| `geometry` | 도형 | `Point`, `LineString`, `Polygon`, `MultiPolygon` 등 |
| `coordinates` | 좌표 | **`[경도, 위도]` 순서** |

행정구역에서 나오는 도형은 두 가지다.

| type | coordinates 깊이 | 언제 |
|---|---|---|
| `Polygon` | `ring[]` → `[lng, lat][]` | 땅이 한 덩어리 |
| `MultiPolygon` | `polygon[]` → `ring[]` → `[lng, lat][]` | 섬이 있는 지역 |

Polygon의 **`ring[0]`은 바깥 경계, 나머지는 구멍**이다. 그래서 지역 범위를 구할 때는 `ring[0]`만 보면 된다.

타입은 `@types/geojson`의 제네릭으로 좁혀 쓴다. 이렇게 정하기까지의 과정은 [[projects/nms/002_typescript_types_location_and_base_fields|TypeScript 타입 정리 글]]에 있다.

```ts
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export interface IGeoProperties { code: string; name: string } // 파일의 키 중 쓰는 것만
export type IBoundaryCollection = FeatureCollection<Polygon | MultiPolygon, IGeoProperties>;
```

---

## 2. 경계 파일 구조

**"파일 하나 = 한 지역의 바로 아래 구역들"** 규칙으로 나눴다.

```
public/geo/
├── KR.json            국가의 하위 (시·도 17개, 약 200KB)
├── KR/{code}.json     그 지역의 하위 (시·도별 시·군·구, 17개 합계 약 550KB)
└── KR.children.json   KR/{code}.json 이 있는 지역 코드 목록
```

- 필요할 때만 받는다. 전국 화면은 `KR.json` 하나만.
- 행정코드는 단계가 달라도 겹치지 않아서(2자리, 5자리) 어느 단계든 `KR/{code}.json` 규칙 하나로 된다.
- 번들에 넣지 않고 `public/`에서 런타임에 받는다. 자료를 바꿔 끼워도 다시 빌드할 필요가 없다.
- 브라우저는 서버 폴더 목록을 읽을 수 없어서, 하위 파일이 있는 지역 목록(`KR.children.json`)을 따로 둔다. 하위가 없는 지역을 누를 수 없게 하는 데 쓴다. 목록을 받지 못해도 지도는 그려야 하므로, 실패하면 경고만 남기고 모든 지역을 누를 수 있게 둔다.

### 단계는 이름 대신 depth로

처음에는 `loadProvinces`(시·도), `loadMunicipalities`(시·군·구)처럼 단계 이름으로 함수를 나눴다. 그런데 단계 이름은 나라마다 다르다. 그래서 depth로 바꿨다.

| depth | 한국 | 경계 파일 |
|---|---|---|
| 1 | 국가 | (파일에 없음, 직접 정의) |
| 2 | 시·도 | `KR.json` |
| 3 | 시·군·구 | `KR/{시·도}.json` |
| 4 | 읍·면·동 | `KR/{시·군·구}.json` |

로딩 함수도 `loadChildren(parentCode?)` 하나가 됐다. 파일을 받을 때 각 지역의 상위 코드를 기록해 두면, 나라별 코드 규칙(앞 2자리가 시·도 등)을 몰라도 상위 지역을 찾을 수 있다.

```ts
const loading = new Map<string, Promise<IBoundaryCollection>>();
const parentOf = new Map<string, string | undefined>();

function loadChildren(parentCode?: string) {
  const path = parentCode ? `KR/${parentCode}` : 'KR';
  let p = loading.get(path);
  if (!p) {
    p = $fetch<IBoundaryCollection>(`/geo/${path}.json`).then(
      data => {
        for (const f of data.features) parentOf.set(f.properties.code, parentCode);
        return data;
      },
      err => {
        loading.delete(path); // 실패하면 다음 호출 때 다시 받는다
        throw err;
      }
    );
    loading.set(path, p); // 동시에 여러 번 불려도 요청은 한 번
  }
  return p;
}
```

### 캐시 헤더: `stale-while-revalidate`

경계 파일은 자주 바뀌지 않지만, 바꿔 끼웠을 때 언젠가는 반영돼야 한다.

```ts
routeRules: {
  '/geo/**': {
    headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' },
  },
},
```

| 지시어 | 뜻 |
|---|---|
| `max-age=86400` | 하루 동안은 서버에 묻지 않고 캐시를 그대로 쓴다 |
| `stale-while-revalidate=604800` | 그 뒤 일주일 동안은 캐시로 먼저 보여 주고, 뒤에서 새로 받아 둔다 |

파일을 바꾸면 늦어도 하루 뒤에 반영된다. 이 설정은 Nitro 서버로 배포할 때만 적용되고, nginx나 CDN으로 정적 배포한다면 그쪽에 같은 헤더를 설정해야 한다.

---

## 3. 위치는 좌표가 아니라 행정코드로

처음에는 사이트 위경도로 어느 지역에 속하는지 판정(point-in-polygon)하고, 이름으로 지역을 찾는 함수도 있었다. 둘 다 지웠다.

- **이름은 키가 될 수 없다.** "중구"는 여러 시·도에 있고, 개편으로 이름이 바뀌기도 한다. 경계 데이터가 2013년 기준이라 그 뒤 바뀐 이름을 맞추는 정규화 코드까지 필요했다.
- **좌표 판정은 필요 없었다.** 사이트를 등록할 때 행정구역을 고르게 하면 위치가 처음부터 코드로 저장된다. 경계선 근처의 애매한 판정도 사라진다.

---

## 4. ECharts geo로 그리기

### 지도 등록과 nameProperty

```ts
registerMap('kr-nation', await loadChildren()); // GeoJSON 을 이름 붙여 등록

const option = {
  geo: {
    map: 'kr-nation',
    nameProperty: 'code', // 지역 이름 자리에 코드를 쓴다 → 클릭하면 e.name 에 코드
    label: { show: true, formatter: p => regionName(p.name) }, // 보여 줄 때만 이름으로
    roam: true,
    selectedMode: 'single',
  },
};
```

ECharts geo는 지역을 **이름 하나로만** 구분한다. 기본은 `properties.name`인데 이름은 겹치므로, `nameProperty: 'code'`로 코드를 이름 자리에 썼다.

### 드릴다운: 고른 지역만 쪼갠 지도를 합성

시·도를 눌렀을 때 그 시·도의 시·군·구 파일만 지도로 바꾸면 주변이 사라져서 어디를 보는지 알기 어렵다. 그래서 **고른 지역만 하위로 쪼개고 나머지는 그대로 둔 FeatureCollection을 합성**해서 새 지도로 등록했다.

```mermaid
flowchart LR
  A[전국<br/>시·도 17개] -->|시·도 X 클릭| B[X의 시·군·구<br/>+ X를 뺀 시·도 16개]
  B -->|시·군·구 Y 클릭| C[Y의 읍·면·동<br/>+ Y를 뺀 X의 시·군·구<br/>+ X를 뺀 시·도 16개]
  C -->|상위 지역| B
  B -->|상위 지역| A
```

```ts
async function ensureFocusMap(code: string) {
  const name = `kr-focus-${code}`;
  if (registered.has(name)) return name;

  const chain = lineage(code); // [code, 상위, 그 상위, ...]
  const [children, ...levels] = await Promise.all([
    loadChildren(code),                               // 고른 지역의 하위
    ...chain.map(c => loadChildren(parentOf.get(c))), // 각 단계의 형제들
  ]);
  registerMap(name, {
    type: 'FeatureCollection',
    features: [
      ...children.features,
      ...levels.flatMap((level, i) => level.features.filter(f => f.properties.code !== chain[i])),
    ],
  });
  registered.add(name);
  return name;
}
```

합성한 지도는 **전체 외곽이 전국 지도와 똑같다.** ECharts는 `zoom: 1`을 "지도 전체 범위를 화면에 맞춘 크기"로 정의하므로, 외곽이 같으면 지도를 바꿔 끼워도 `center`와 `zoom`을 그대로 이어 쓸 수 있고 화면이 튀지 않는다.

### 확대 배율 계산

`zoom`은 픽셀 단위가 아니라 "지도 전체 대비 몇 배"라서, 지역이 화면의 80%를 차지하게 하려면 **(전체 범위 / 지역 범위) × 0.8**로 구한다.

```ts
const ASPECT_SCALE = 0.75; // ECharts 가 GeoJSON 지도의 가로(경도)를 줄여 그리는 기본 비율
const FIT_RATIO = 0.8;

function viewOf(code: string) {
  const all = regionBounds();   // 국가 전체 [[minLng, minLat], [maxLng, maxLat]]
  const r = regionBounds(code); // 지역 (ring[0] 만으로 계산)
  const fit = b => Math.max((b[1][0] - b[0][0]) * ASPECT_SCALE, b[1][1] - b[0][1]);
  return {
    center: [(r[0][0] + r[1][0]) / 2, (r[0][1] + r[1][1]) / 2],
    zoom: (fit(all) / fit(r)) * FIT_RATIO,
  };
}
```

위도가 높을수록 경도 1도의 실제 거리가 짧아져서, ECharts는 GeoJSON 지도의 가로를 기본 0.75배(`aspectScale`)로 줄여 그린다. 범위의 가로 길이에도 같은 비율을 곱해야 계산이 맞다.

### 부딪힌 것들

| 증상 | 원인 | 해결 |
|---|---|---|
| 하위 없는 지역에 `silent`를 주니 hover 이름도 안 뜸 | `silent`는 모든 이벤트를 막는다. 지역별로 선택만 끄는 옵션은 없다 | 선택 색을 평소 색과 같게 두고, 클릭 핸들러에서 무시 |
| hover하면 노랗게 칠해짐 | 강조색을 지우면 기본 강조색이 들어간다 | `emphasis.itemStyle`의 `areaColor`, `color`를 둘 다 `null` (ECharts는 null을 "바꾸지 않음"으로 읽는다. 타입이 null을 안 받아서 `null as unknown as undefined`) |
| 지도가 영역의 80%만 차지 | 위치·크기를 안 주면 기본 배치가 80% | `left/right/top/bottom: 0` + `preserveAspect: 'contain'` |
| 끌면 지도 바깥이 비어 보임 | `clip`이 지도 범위(한국은 좌우가 좁은 사각형)로 자름 | `clip` 끄기 |
| 지역 밖 빈 곳에서는 끌기가 안 됨 | 기본 `roamTrigger`는 지역 위에서만 | `roamTrigger: 'global'` |
| 전국으로 돌아가도 이전 중심이 남음 | `setOption`은 병합이라 `undefined`는 이전 값을 지우지 않는다 | 전국 범위의 가운데를 직접 계산해 넣기 |

---

## 정리

| 결정 | 이유 |
|---|---|
| 경계 파일 = 한 지역의 바로 아래 구역 | 필요한 것만 받고, 단계가 늘어도 규칙이 같다 |
| `public/`에서 런타임 fetch + `stale-while-revalidate` | 자료 교체에 재빌드가 필요 없고, 늦어도 하루 뒤 반영 |
| 단계 이름 대신 depth | 나라마다 단계 이름이 다르다 |
| 위치를 행정코드로 저장 | 이름은 겹치고 바뀐다. 좌표 판정이 필요 없어진다 |
| `nameProperty: 'code'` | ECharts geo는 지역을 이름 하나로만 구분한다 |
| 고른 지역만 쪼갠 지도 합성 | 주변 맥락을 유지하고, 외곽이 같아 화면이 튀지 않는다 |

## 다음에 할 것

- [ ] 지도 위에 사이트 위치를 scatter series(`coordinateSystem: 'geo'`)로 올리기
- [ ] 경계 자료를 최신으로 바꾸고 `KR.children.json`을 자동으로 만드는 스크립트
