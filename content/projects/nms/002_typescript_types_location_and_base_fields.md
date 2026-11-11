---
title: NMS 화면 다시 짜기 — TypeScript 타입 위치·이름 규칙과 공통 필드 타입
type: log
tags:
  - log
  - nms
  - typescript
  - nuxt
draft: true
---

> 2026-11-10. 직접 이해하면서 다시 구현한 기록 중 타입 정의 부분.
> 같은 날 기록: [[projects/nms/003_geojson_admin_boundary_map|GeoJSON 행정구역 지도]]

## 왜 다시 짰나

대시보드 화면(지도, 랙 배치, 토폴로지, 초기 설정 등)이 꽤 만들어져 있었지만, 내가 이해하지 못한 코드가 많았다. 그래서 **지금 작업 중인 범위(행정구역 지도, 사이트 목록)만 남기고 나머지를 지운 뒤** 하나씩 직접 이해하면서 다시 만들기로 했다. CSS도 쓰지 않는 스타일을 정리했더니 6025줄에서 493줄로 줄었다.

그 첫 작업이 타입 정리였다.

---

## 1. 타입은 어디에 두나

### 규칙: 화면 전용은 `app/types`, 서버와 같이 쓰면 `shared/types`

처음에는 interface와 type이 composables, utils, 컴포넌트에 흩어져 있었다. 이걸 한곳으로 모았다.

| 위치 | 무엇 | 자동 import |
|---|---|---|
| `app/types/` | 화면에서만 쓰는 타입 (메뉴, 배지 색, 지도 경계 등) | `imports.dirs`에 `types` 추가 |
| `shared/types/` | app과 server가 같이 쓰는 타입 (사이트 등) | Nuxt 4가 app·server 양쪽에 기본 제공 |
| 파일 안 | 그 파일에서만 쓰는 비공개 타입 | 옮기지 않음 |

```ts
// nuxt.config.ts
imports: {
  dirs: ['enum', 'types', 'constants', 'stores'], // app/types 를 자동 import
},
```

`shared/`를 쓰기 전에는 서버 코드가 `'../../app/types/ISite'`처럼 화면 쪽 파일을 상대 경로로 가져오고 있었다. 서버가 화면 폴더에 기대는 구조라 어색했는데, `shared/types`로 옮기니 import 문 자체가 사라졌다.

### 자동 import의 함정: 이름이 겹치면 조용히 하나가 무시된다

타입을 모으다가 같은 이름(`SiteLayout`)이 두 군데에 있다는 걸 발견했다. 하나는 장비 구성 방식(`'rack' | 'netsrv'`), 하나는 배치 문서 타입이었다. 자동 import에서는 **이름이 겹치면 하나가 무시되고, 에러 없이 지나간다.** 의미에 맞게 `LayoutKind`로 이름을 바꿔 해결했다. 자동 import를 쓸수록 **이름이 프로젝트 전체에서 유일해야** 한다는 걸 배웠다.

### 이름 규칙: 직접 정의한 타입은 `I` 접두사

라이브러리 타입(`Feature`, `FeatureCollection` 등)과 내가 정의한 타입이 섞이면 어디서 온 건지 헷갈린다. 그래서 직접 정의한 타입에는 `I`를 붙였다.

| 전 | 후 | 이유 |
|---|---|---|
| `BaseInterface` | `IBase` | 접미사 대신 접두사로 통일 |
| `GeoProperties` | `IGeoProperties` | |
| `GeoCollection` | `IBoundaryCollection` | GeoJSON의 `GeometryCollection`과 헷갈리지 않게 |

---

## 2. 저장 항목의 공통 필드를 타입으로

### `IBase`와 `WithoutBase<T>`

목록 저장소(mock, Nitro storage)에 쌓이는 모든 항목은 자동 증가 번호 `seqId`를 가진다. 이 공통 필드를 `IBase`로 빼고, 각 항목은 이것을 상속한다.

```ts
// shared/types/base.ts
export interface IBase {
  /** auto increment 번호. 아직 등록 전이면 -1 */
  seqId: number;
}

/** T 에서 IBase 공통 필드를 뺀 고유 필드 */
export type WithoutBase<T extends IBase> = Omit<T, keyof IBase>;

export const getNewBase = (): IBase => ({ seqId: -1 });
```

```ts
// shared/types/site.ts
export interface ISite extends IBase {
  siteId: number;
  label: string;
  description: string;
  regionCode?: string; // 행정구역 코드 (2자리 시·도 / 5자리 시·군·구)
}

const getNewSiteOnly = (): WithoutBase<ISite> => ({ siteId: -1, label: '', description: '' });

export const getNewSite = (): ISite => ({ ...getNewBase(), ...getNewSiteOnly() });
```

여기서 공부한 것:

- **`keyof IBase`** 는 `IBase`의 키 이름들의 유니온(`'seqId'`)이다. `Omit<T, keyof IBase>`는 "T에서 공통 필드를 모두 뺀 것"이 되어, 공통 필드가 늘어나도 `WithoutBase`는 고칠 필요가 없다.
- **`T extends IBase`** 제약을 걸어서 공통 필드가 없는 타입에는 쓸 수 없게 했다.
- 빈 값은 **공통 부분 + 고유 부분을 펼쳐(spread) 합친다.** 공통 필드의 기본값은 `getNewBase` 한 곳에서만 정한다.
- 아직 등록 전이라 번호가 없다는 표시는 `-1`로 통일했다. `undefined`로 두면 타입이 `number | undefined`가 되어 쓰는 곳마다 확인해야 한다.
- interface는 "필수 키만 정의한 `Record<string, any>`"가 아니다. 정의하지 않은 키는 허용되는 게 아니라 무시될 뿐이다. → [[typescript/001_interface_is_not_record_with_required_keys|interface는 필수 키만 정의한 Record인가]]

### 제네릭 저장소 `createSeqStore<T extends IBase>`

`seqId`를 붙이는 로직을 사이트 저장소에서 떼어 범용으로 만들었다.

```ts
export function createSeqStore<T extends IBase>(key: string) {
  // 동시에 들어온 등록 요청이 같은 번호를 받지 않도록 쓰기를 한 줄로 세운다
  let writing: Promise<unknown> = Promise.resolve();
  function serial<R>(job: () => Promise<R>): Promise<R> {
    const run = writing.then(job, job);
    writing = run.catch(() => undefined);
    return run;
  }

  return {
    list: async () => (await readDoc()).items,
    insert: (item: WithoutBase<T> | ((seqId: number) => T)) =>
      serial(async () => {
        const doc = await readDoc();
        const seqId = doc.seq + 1;
        const saved = typeof item === 'function' ? item(seqId) : ({ ...item, seqId } as T);
        await storage().setItem(key, { seq: saved.seqId, items: [...doc.items, saved] });
        return saved;
      }),
  };
}
```

- `insert`는 **고유 필드만 담은 객체**(`WithoutBase<T>`)를 받거나, **발급된 번호로 항목 전체를 만드는 함수**를 받는다. 유니온 타입이라 `typeof item === 'function'`으로 좁힌다.
- **마지막 번호(`seq`)를 목록과 따로 저장**한다. 목록의 최대값으로 다음 번호를 정하면, 마지막 항목을 지웠을 때 같은 번호를 다시 쓰게 된다.
- 읽고-계산하고-쓰는 사이에 다른 요청이 끼어들면 같은 번호가 나온다. **Promise 체인으로 쓰기를 한 줄로 세워서** 막았다. 앞 작업이 실패해도 다음 작업이 돌도록 `then(job, job)`으로 잇고, 대기열 자체는 실패로 끊기지 않게 `catch`로 삼킨 Promise를 쓴다.

---

## 3. 라이브러리 타입을 좁혀 쓰기: GeoJSON 타입을 네 번 고친 과정

행정구역 경계(GeoJSON) 타입을 정의하면서 TypeScript를 꽤 배웠다. GeoJSON 자체와 지도 구현은 [[projects/nms/003_geojson_admin_boundary_map|별도 글]]에 정리했고, 여기서는 타입만 다룬다.

**1단계: 직접 정의**
```ts
export interface GeoFeature {
  type: 'Feature';
  properties: { code: string; name: string };
  geometry:
    | { type: 'Polygon'; coordinates: number[][][] }
    | { type: 'MultiPolygon'; coordinates: number[][][][] };
}
export interface GeoCollection { type: 'FeatureCollection'; features: GeoFeature[] }
```
동작은 하지만 ECharts `registerMap`에 넘길 때 `as GeoJSONInput` 캐스팅이 필요했다. 표준과 모양만 같은 "다른 타입"이기 때문이다.

**2단계: `@types/geojson`으로 교체**
```ts
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export interface GeoProps { code: string; name: string }
export type GeoGeometry = Polygon | MultiPolygon;
export type GeoFeature = Feature<GeoGeometry, GeoProps>;
export type GeoCollection = FeatureCollection<GeoGeometry, GeoProps>;
```
`Feature<G, P>`, `FeatureCollection<G, P>`는 **도형 타입과 속성 타입을 제네릭으로 받는다.** 표준 타입이 되니 캐스팅이 사라졌다.

**3단계: 한 번만 쓰는 별칭을 합치기**
```ts
export type GeoFeature = Feature<Polygon | MultiPolygon, { code: string; name: string }>;
export type GeoCollection = FeatureCollection<GeoFeature['geometry'], GeoFeature['properties']>;
```
`GeoFeature['geometry']`처럼 **인덱스 접근 타입**으로 다른 타입의 일부를 꺼내 쓸 수 있다.

**4단계: 실제로 쓰는 것만 남기기 (최종)**
```ts
export interface IGeoProperties {
  code: string; // 행정구역 코드
  name: string; // 행정구역 이름
}

export type IBoundaryCollection = FeatureCollection<Polygon | MultiPolygon, IGeoProperties>;
```
코드를 확인해 보니 `GeoFeature`는 아무 데서도 쓰지 않았고, 화면이 필요로 하는 건 경계 파일 전체(collection)와 properties뿐이었다. properties는 다른 곳(지금 보는 지역 상태 등)에서도 쓰여서 이름 있는 interface로 뺐다.

배운 것:
- **표준이 있으면 표준 타입을 쓰고 좁힌다.** 직접 정의한 "같은 모양"은 라이브러리와 맞물리지 않는다.
- 외부 데이터 타입에는 **쓰는 키만** 적는다. 데이터 출처가 바뀌면 고칠 곳이 한 군데다.
- 쓰지 않는 타입은 지운다. 미리 만든 `MapScope`(고른 지역) 같은 타입도 지우고, 필요해질 때 다시 만들었다.

---

## 정리

| 주제 | 배운 것 |
|---|---|
| 타입 위치 | 화면 전용은 `app/types`, 공용은 `shared/types`, 파일 안 비공개 타입은 그대로 |
| 자동 import | 이름이 겹치면 조용히 하나가 무시된다. 이름은 전역에서 유일하게 |
| 이름 규칙 | 직접 정의한 타입은 `I` 접두사, 표준 타입 이름과 헷갈리지 않게 |
| 공통 필드 | `IBase` + `WithoutBase<T> = Omit<T, keyof IBase>`, 빈 값은 spread로 합친다, 미등록은 `-1` |
| 제네릭 | `T extends IBase` 제약, 유니온 인자를 `typeof`로 좁히기 |
| 라이브러리 타입 | 직접 정의 대신 표준 타입의 제네릭으로 좁힌다, 인덱스 접근 타입, 쓰는 것만 남긴다 |
