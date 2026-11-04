---
title: "사이트(Site)"
tags:
  - project
  - nms
  - ITU-T-M3100
  - RFC3418
  - RFC8299
  - RFC8466
  - RFC9179
  - RFC8345
  - 참고/TMForum
  - 참고/MEF
  - 참고/NetBox
  - 참고/행정구역코드
  - 자체정의
draft: false
---

장비가 설치된 **장소** 하나(데이터센터·국사·지사·현장 중계소). [[projects/nms/data/node|노드]]는 사이트에 소속된다. 지도(`/maps`)의 가장 작은 단위이고, 사이트 안(장비·포트)은 토폴로지 화면에서 본다.

- **노드와 따로 두는 이유**: 장비 수백 대라도 좌표는 하나다. 지도가 답할 것은 "어디"이고, 위치 정보는 장소에 붙어야 장비마다 반복되지 않는다.
- **사람이 등록한다**: SNMP `sysLocation`은 자유 문자열이라 좌표·계층으로 못 쓴다. 사이트를 기준 정보로 두고 장비는 사이트를 고른다.

## 근거 문서 (공신력 순)

사이트만 정의한 단일 표준은 없다. 공식 표준 → 업계 명세 → 사실상 표준 → 자체 정의 순.

| 순위 | 문서 | 성격 | 가져오는 것 |
|---|---|---|---|
| 1 | ITU-T M.3100 | ITU-T 권고 | 장비는 한 지리적 위치에 있다(`locationName`) → 노드 : 사이트 = N : 0..1 |
| 2 | RFC 3418 SNMPv2-MIB | Internet Standard | `sysLocation`. 등록 힌트로만 |
| 3 | RFC 8299 L3SM · RFC 8466 L2SM | Proposed Standard | 주소 필드(`location` › `address`, `postal-code`) |
| 4 | RFC 9179 | Proposed Standard | 좌표(위도·경도, WGS 84, 기록 시각) |
| 5 | RFC 8345 | Proposed Standard | 사이트 없음 → 사이트는 그래프 밖 소속 정보, 회선은 링크에서 계산 |
| 6 | TM Forum TMF674 (+ TMF673) | 업계 명세 | 사이트(`GeographicSite`)와 주소 분리, 한 주소에 여러 사이트 |
| 7 | MEF 79 / 122 | 업계 명세 (TMF674 기반) | 사업자 간 사이트 조회. 범위 밖 |
| 8 | NetBox | 사실상 표준 | Site > Location(중첩) > Rack > Device 계층, 운영 상태 |
| 9 | 행정구역 코드 | 국가 코드 체계 | `regionCode` |

- 이름이 겹치면 위 순서대로 따른다. NetBox는 구조만 참고하고 필드 이름은 가져오지 않는다.
- **용어 주의**: RFC 8299·8466의 `site`는 고객 거점의 VPN 접속 단위(논리)이고 물리 장소는 그 안의 `location`이다. 우리 사이트 = RFC 8299 `location` = TMF674 `GeographicSite` = NetBox Site.

## 사이트 유형

| 유형(type) | 뜻 | 지도 표현 |
|---|---|---|
| `datacenter` | 데이터센터·IDC | 큰 마커, 장비·장애 수 |
| `office` | 국사·POP | 중간 마커 |
| `branch` | 지사·영업점 | 작은 마커 |
| `field` | 중계소·기지국·옥외 함체(보통 장비 1대) | 작은 마커, 카드에서 바로 장비 상세 |

표준이 없어 자체 정의. 현장 장비도 `field`로 같은 모델 안에서 다룬다.

## 위치 계층

```
권역(시·도 / 시·군·구) ─ 사이트 ─ 로케이션(건물·층) ─ 랙 ─ 장비
     계산(regionCode)      지도        추후(평면도·랙 실장도)   토폴로지
```

- 권역은 저장하지 않고 `regionCode`로 묶는다.
- 건물·층은 추후. 단계를 고정하지 않고 NetBox처럼 **중첩 가능한 로케이션** 하나로 둔다(건물 없이 층만 있는 곳, 랙 없는 장비가 흔하다). 당분간 노드의 `sitePosition` 문자열.

## 논리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 식별자(id) | O | 노드 `siteId`가 참조 | 자체 정의 |
| 이름(name) | O | 지도 라벨·카드 제목 | 자체 정의 |
| 유형(type) | O | [사이트 유형](#사이트-유형) | 자체 정의 |
| 운용 단계(lifecycle) | - | **저장.** planned / active / retired. planned는 흐리게, retired는 기본 숨김 | 참고: NetBox Site 상태 |
| 상태(status) | - | **계산.** 소속 노드 중 가장 나쁜 값(DOWN > WARN > UNKNOWN > UP) | 자체 정의 |
| 장비 수(nodeCount) | - | **계산.** 소속 노드 수 | 자체 정의 |

## 물리적 정보

| 항목 | 필수 | 용도 | 출처 |
|---|---|---|---|
| 주소(address) · 우편번호(postalCode) | - | 카드 표시, 좌표·지역 코드를 얻는 입력 | RFC 8299 `address` · `postal-code` |
| 위도(latitude) · 경도(longitude) | O | 지도 위치. WGS 84 십진 도. 이름 있는 필드로 저장(`[경도, 위도]` 배열 순서 혼동 방지) | RFC 9179 `ellipsoid` › `latitude`, `longitude` |
| 행정구역 코드(regionCode) | O | 시·군·구 5자리. 지역 묶음·필터 | 참고: 행정구역 코드 |
| 좌표 기록 시각(locatedAt) | - | 이전·정정 이력 | RFC 9179 `timestamp` |

- 두지 않는 것: RFC 9179 `height`·`velocity`(고정 설비), RFC 8299 `state`·`city`(`regionCode`가 대신), `country-code`(해외 사이트가 생기면 추가).
- `regionCode`는 좌표로 계산할 수 있어도 등록 시 고정 저장한다(경계 개편·경계선 근처에서 흔들리지 않게).

### 행정구역 코드 체계

| 체계 | 예: 서울 / 부산 / 경기 | 쓰는 곳 |
|---|---|---|
| 행정안전부 법정동 코드(앞 5자리 = 시·군·구) | `11` / `26` / `41` | 주소 API(도로명주소·VWorld·카카오) |
| 통계청 행정구역 분류(SGIS) | `11` / `21` / `31` | 통계청 경계 파일. **현재 `/maps` GeoJSON(2013년판)** |

- **법정동 코드 추천**(주소 API 결과를 그대로 저장). 경계 파일도 같은 체계 최신판으로 바꾸거나 대응표를 둔다. 2013년판은 강원·전북 특별자치도 전환(42→51, 45→52)이 빠져 있어 어느 쪽이든 교체가 필요하다.
- 시·군·구 이름(`중구`)은 시·도마다 겹치므로 판정은 코드로.

## 사이트 간 회선

저장하지 않고 링크에서 계산한다. **필수 항목이 아니다.** 회선 없는 사이트도 정상이다(사업자 망 건너편은 LLDP로 수집되지 않아 수동 링크로 잇는 경우가 많다).

| 항목 | 계산 |
|---|---|
| 양 끝 사이트 | 링크 양 끝 노드의 사이트가 **다른** 것만. 무방향(A–B = B–A) |
| 링크 수 | 같은 사이트 쌍의 링크 수. 2 이상 = 이중화 |
| 상태 | 묶인 링크 중 가장 나쁜 값 |
| 사용률 | 추후(트래픽 수집 후) |

## 노드와의 관계

- 노드는 사이트를 0..1개 가진다(`siteId`). 없으면 지도에 안 나오고 "위치 미지정 N대"로 알린다. 새로 수집된 장비는 처음엔 없는 게 정상.
- 소속 노드가 있는 사이트는 지울 수 없다(옮긴 뒤 삭제).

## 수집 방법

장비에서 수집되지 않는다. **사람이 등록**하는 기준 정보다.

| 항목 | 1순위 | 대안 | 비고 |
|---|---|---|---|
| 이름 · 유형 · 운용 단계 | 관리 화면 등록 / CSV 일괄 등록 | — | |
| 주소 · 우편번호 | 등록 시 주소 검색 API(도로명주소 · VWorld · 카카오) | 직접 입력 | |
| 위도 · 경도 | 주소 → 좌표 변환(지오코딩) | 지도에서 직접 찍기 | `locatedAt`에 정한 시각 기록 |
| 행정구역 코드 | 주소 API가 돌려주는 법정동 코드 앞 5자리 | 좌표 → 경계 데이터로 계산(역지오코딩) | 등록 시 한 번 정해 고정 |
| 노드의 소속(siteId) | 장비 등록 시 사이트 선택 | SNMP `sysLocation` 문자열로 후보 제안 | `sysLocation`은 자유 문자열이라 자동 확정은 하지 않는다 |

## DB (안)

기존 토폴로지 스키마의 `topology_node`에 사이트를 붙이는 안.

```sql
CREATE TABLE topology_site (
  id           VARCHAR(64) PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  type         VARCHAR(16)  NOT NULL,                   -- datacenter / office / branch / field
  lifecycle    VARCHAR(16)  NOT NULL DEFAULT 'active',  -- planned / active / retired
  address      VARCHAR(255),
  postal_code  VARCHAR(10),
  latitude     DECIMAL(9, 6) NOT NULL,                  -- WGS 84, 소수 6자리 ≈ 0.1m
  longitude    DECIMAL(9, 6) NOT NULL,
  region_code  CHAR(5) NOT NULL,                        -- 법정동 코드 앞 5자리
  located_at   TIMESTAMP,
  CHECK (latitude  BETWEEN -90  AND 90),
  CHECK (longitude BETWEEN -180 AND 180)
);
CREATE INDEX idx_site_region ON topology_site (region_code);

ALTER TABLE topology_node
  ADD COLUMN site_id VARCHAR(64) REFERENCES topology_site(id) ON DELETE RESTRICT,
  ADD COLUMN site_position VARCHAR(100);                -- 건물·층·랙 자유 문자열
```

상태·장비 수·사이트 간 회선은 컬럼으로 두지 않는다(값이 두 군데 있으면 어긋난다). 시·도 코드는 `region_code` 앞 2자리.
