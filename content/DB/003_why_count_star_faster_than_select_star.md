---
title: 왜 SELECT COUNT(*)는 SELECT *보다 빠른가
type: question
tags: [question, db, innodb, count, index, clustered_index, secondary_index, mvcc]
draft: false
---

## 의문

`SELECT COUNT(*) FROM tb_users`와 `SELECT * FROM tb_users` — 직관적으로는 둘 다 "전체 row를 다 봐야 하니까" 비슷한 비용일 것 같다. 그런데 실제로는 `COUNT(*)`가 압도적으로 빠르다. 왜?

> 사전 지식으로 InnoDB의 B+ 트리·페이지 구조가 필요하다 → [[002_innodb_page_structure|디스크 위의 DB 들여다보기]]

## 핵심 차이

세 군데에서 비용이 갈린다.

| 단계 | `SELECT *` | `SELECT COUNT(*)` |
|---|---|---|
| 스캔할 인덱스 | **Clustered index (PK)** — leaf에 모든 컬럼 | **가장 작은 secondary index** — leaf에 PK + 인덱스 컬럼만 |
| 결과 row 수 | 전체 row | 1 row |
| 네트워크 전송량 | 수 MB ~ GB | 8 bytes |
| Buffer pool 영향 | 통째로 갈아엎음 | 거의 없음 |
| 클라이언트 메모리 | 모든 row 적재 | 정수 1개 |

## 1. 옵티마이저가 다른 인덱스를 선택한다

InnoDB는 두 종류의 B+ 트리를 들고 있다.

| 종류 | leaf에 들어있는 것 | 페이지 크기 |
|---|---|---|
| **Clustered index (PK)** | **모든 컬럼 값** | 큼 (row 자체) |
| **Secondary index** | indexed 컬럼 + PK 값만 | 작음 |

```sql
SELECT * FROM tb_users;
-- 모든 컬럼이 필요 → clustered index의 leaf를 전부 스캔
-- → row 데이터(name, email, address, ...)를 다 읽음

SELECT COUNT(*) FROM tb_users;
-- 컬럼 값 필요 없음, 개수만 세면 됨
-- → 옵티마이저가 가장 작은 인덱스를 선택
-- → 보통 가장 작은 secondary index 풀스캔
-- → 없으면 clustered index를 스캔하되 컬럼 데이터는 무시
```

**1천만 row 테이블 예시**:

| 인덱스 | leaf 페이지 수 |
|---|---|
| Clustered (PK + 50개 컬럼) | 약 200,000 pages (3.2GB) |
| Secondary `idx_status` | 약 8,000 pages (130MB) |

→ `SELECT COUNT(*)`는 **8천 페이지**, `SELECT *`는 **20만 페이지**. 디스크 I/O가 25배 차이.

## 2. 전송 데이터량이 압도적으로 다르다

```
SELECT * FROM tb_users;        → 1천만 row × 모든 컬럼 = 수 GB
SELECT COUNT(*) FROM tb_users; → 1 row × 1 컬럼 = 8 bytes
```

DB 안이 빠르다고 해도 결과를 클라이언트로 보내는 비용이 결국 발목을 잡는다. 네트워크 + 시리얼라이즈 + 클라이언트 메모리 할당 비용 모두 누적. `SELECT *`는 결과 전송에만 수초~수십 초가 걸릴 수 있다.

## 3. Buffer pool에 미치는 영향

`SELECT *` 한 번이 buffer pool 전체를 갈아엎을 수 있다.

```
정상 상태       Buffer Pool에 hot한 페이지들 캐시됨
SELECT * 실행   큰 테이블의 모든 페이지를 끌어옴 → LRU 밀림
                → 기존 hot 페이지가 evict됨
끝난 후         다른 쿼리들이 다시 디스크에서 읽음 → 전체 느려짐
```

InnoDB는 이를 완화하기 위해 **midpoint LRU**(LRU의 약 3/8 지점에 새 페이지 삽입)를 쓰지만, full table scan의 영향이 완전히 사라지진 않는다.

## 4. MyISAM vs InnoDB — 결정적 차이

| 엔진 | `SELECT COUNT(*)` 동작 |
|---|---|
| **MyISAM** | **O(1)** — 테이블 헤더에 row 개수를 캐시 |
| **InnoDB** | **O(N)** — MVCC 때문에 캐시 불가, 항상 스캔 |

InnoDB가 COUNT(*) 캐시를 못 하는 이유: 어떤 트랜잭션은 5분 전 스냅샷을 보고, 어떤 트랜잭션은 지금을 본다. 같은 시점에 두 트랜잭션이 "전체 row 개수"를 다르게 셀 수 있어 단일 카운터로 표현이 불가능. 그래서 InnoDB의 `COUNT(*)`는 "절대 빠른 연산"이 아니라 "**`SELECT *`보다는** 빠른 연산"이다.

## 5. 함정 — COUNT(*)도 느린 경우

- **적합한 secondary index가 없을 때**: clustered index 풀스캔 강제됨 → 여전히 느림
- **`WHERE` 절이 붙으면**: WHERE 컬럼의 인덱스를 타게 되어 의미가 달라짐. 인덱스 없으면 풀스캔
- **정확한 값이 필요 없으면**: `SHOW TABLE STATUS` / `information_schema.tables.TABLE_ROWS`로 근사값을 즉시 받을 수 있음 (단 통계 기반이라 부정확)

## 6. `COUNT(*)` vs `COUNT(1)` vs `COUNT(컬럼)`

자주 헷갈리는 부분.

| 표현 | 의미 |
|---|---|
| `COUNT(*)` | row 자체를 셈. 가장 명확한 표준 |
| `COUNT(1)` | 위와 동일 (상수 1을 평가해 NULL 아님을 확인) — 사실상 같음 |
| `COUNT(col)` | **`col`이 NULL이 아닌 row만 셈** — 그 컬럼 값을 실제로 봐야 함 |

`COUNT(1)`이 더 빠르다는 미신이 돌아다니지만, 현대 옵티마이저는 둘을 동일하게 처리한다. 의미가 가장 명확한 `COUNT(*)`를 쓰는 게 정답.

## 정리

`COUNT(*)`가 `SELECT *`보다 빠른 본질적인 이유는 **"읽어야 할 페이지가 적고, 보낼 데이터가 거의 없기 때문"**이다.

| 비용 축 | 차이 만드는 요인 |
|---|---|
| 디스크 I/O | 옵티마이저가 가장 작은 인덱스 선택 |
| 네트워크 | 결과 1 row vs 전체 row |
| 메모리 | buffer pool/클라이언트 모두 영향 |
| 엔진 특성 | MyISAM은 O(1), InnoDB는 O(N)이지만 그래도 SELECT *보단 빠름 |

운영에서는 **`SELECT *`를 풀스캔으로 쓰는 일을 피하는 것이 가장 큰 최적화**다. 정말 모든 컬럼이 필요한 게 아니라면 필요한 컬럼만 명시할 것 (covering index까지 활용 가능).
