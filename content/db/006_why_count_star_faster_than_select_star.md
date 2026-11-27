---
title: 왜 COUNT(*)는 SELECT *보다 빠른가
type: question
tags: [question, db, innodb, count, index, clustered_index, secondary_index, buffer_pool, mvcc]
draft: true
---

## 의문

`SELECT COUNT(*) FROM tb_users`와 `SELECT * FROM tb_users`는 직관적으로 둘 다 "전체 row를 다 봐야" 하니 비슷한 비용일 것 같다. 그런데 실제로는 `COUNT(*)`가 압도적으로 빠르다. 왜?

> 사전 지식: InnoDB의 B+ 트리·페이지 구조 → [[db/002_innodb_page_structure|InnoDB 페이지 구조]]

## 답: 읽는 페이지가 적고, 보내는 데이터가 거의 없다

비용이 갈리는 곳은 세 군데다.

| 단계 | `SELECT *` | `SELECT COUNT(*)` |
|---|---|---|
| 스캔할 인덱스 | **Clustered index (PK)**: leaf에 모든 컬럼 | **가장 작은 secondary index**: leaf에 인덱스 컬럼 + PK만 |
| 결과 row 수 | 전체 row | 1 row |
| 네트워크 전송량 | 수 MB ~ GB | 8 bytes |
| Buffer pool 영향 | 통째로 갈아엎음 | 거의 없음 |
| 클라이언트 메모리 | 모든 row 적재 | 정수 1개 |

### 1. 옵티마이저가 다른 인덱스를 고른다

InnoDB 테이블에는 두 종류의 B+ 트리가 있다.

| 종류 | leaf에 들어 있는 것 | 크기 |
|---|---|---|
| **Clustered index (PK)** | **모든 컬럼 값** (row 자체) | 큼 |
| **Secondary index** | 인덱스 컬럼 + PK 값 | 작음 |

```sql
SELECT * FROM tb_users;
-- 모든 컬럼이 필요 → clustered index leaf 전체 스캔

SELECT COUNT(*) FROM tb_users;
-- 개수만 필요 → 옵티마이저가 가장 작은 secondary index를 풀스캔
-- secondary index가 없으면 clustered index를 스캔 (그래도 컬럼 값은 안 꺼냄)
```

1천만 row 테이블 예시:

| 인덱스 | leaf 페이지 수 (16KB) |
|---|---|
| Clustered (PK + 컬럼 50개) | 약 200,000 pages (3.2GB) |
| Secondary `idx_status` | 약 8,000 pages (130MB) |

디스크 I/O만 25배 차이가 난다.

### 2. 전송 데이터량이 다르다

```
SELECT * FROM tb_users;        → 1천만 row × 모든 컬럼 = 수 GB
SELECT COUNT(*) FROM tb_users; → 1 row × 1 컬럼 = 8 bytes
```

DB 안에서 아무리 빨리 읽어도 결과를 직렬화해 네트워크로 보내고 클라이언트가 메모리에 올리는 비용이 남는다. `SELECT *`는 결과 전송에만 수 초~수십 초가 걸릴 수 있다.

### 3. Buffer pool을 오염시키지 않는다

```
정상 상태       buffer pool에 자주 쓰는(hot) 페이지가 캐시됨
SELECT * 실행   큰 테이블의 모든 페이지를 끌어옴 → LRU가 밀림 → hot 페이지 evict
끝난 후         다른 쿼리들이 다시 디스크에서 읽음 → 전체가 느려짐
```

InnoDB는 이를 줄이려고 **midpoint LRU**(새 페이지를 LRU의 약 3/8 지점에 삽입)를 쓰지만, 풀스캔 영향이 완전히 사라지지는 않는다.

## 그래도 InnoDB의 COUNT(*)는 O(N)이다

| 엔진 | `SELECT COUNT(*)` |
|---|---|
| **MyISAM** | **O(1)**: 테이블 헤더에 row 수를 저장 |
| **InnoDB** | **O(N)**: 항상 스캔 |

InnoDB가 row 수를 캐시하지 못하는 이유는 MVCC다. 어떤 트랜잭션은 5분 전 스냅샷을, 어떤 트랜잭션은 지금을 본다. 같은 순간에도 트랜잭션마다 "전체 row 수"가 달라서 카운터 하나로 표현할 수 없다 (스냅샷 개념은 [[db/001_read_committed_non_repeatable_read|READ_COMMITTED와 Non-Repeatable Read]]). 그래서 InnoDB의 `COUNT(*)`는 "빠른 연산"이 아니라 "**`SELECT *`보다는** 빠른 연산"이다.

## COUNT(*)도 느린 경우

- **secondary index가 없을 때**: clustered index를 풀스캔해야 한다.
- **`WHERE`가 붙을 때**: WHERE 컬럼의 인덱스를 타고, 인덱스가 없으면 풀스캔이다.
- **정확한 값이 필요 없을 때**: `information_schema.tables.TABLE_ROWS`나 `SHOW TABLE STATUS`로 근사값을 바로 받을 수 있다 (통계 기반이라 부정확).

## 관련 개념: COUNT의 세 가지 형태

| 표현 | 의미 |
|---|---|
| `COUNT(*)` | row 자체를 센다. 표준이고 의미가 가장 명확 |
| `COUNT(1)` | 상수 1이 NULL이 아닌 row를 센다 → `COUNT(*)`와 동일하게 처리됨 |
| `COUNT(col)` | **`col`이 NULL이 아닌 row만** 센다 → 컬럼 값을 실제로 읽어야 함 |

`COUNT(1)`이 더 빠르다는 말은 미신이다. 현대 옵티마이저는 둘을 똑같이 처리한다.

## 정리

| 비용 축 | 차이를 만드는 요인 |
|---|---|
| 디스크 I/O | 옵티마이저가 가장 작은 인덱스를 선택 |
| 네트워크 | 결과 1 row vs 전체 row |
| 메모리 | buffer pool과 클라이언트 양쪽 |
| 엔진 특성 | MyISAM은 O(1), InnoDB는 O(N)이지만 그래도 `SELECT *`보다 빠름 |

운영에서 가장 큰 최적화는 **풀스캔 `SELECT *`를 피하는 것**이다. 모든 컬럼이 필요한 게 아니라면 필요한 컬럼만 적는다 (covering index까지 활용할 수 있다).
