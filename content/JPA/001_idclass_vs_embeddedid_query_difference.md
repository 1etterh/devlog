---
title: JPA 복합키 @IdClass vs @EmbeddedId - 실제 SQL 쿼리 차이가 있을까?
type: question
tags: [JPA, Hibernate, 복합키, IdClass, EmbeddedId, CompositeKey]
draft: true
---

## 질문

JPA에서 복합키를 구현할 때 `@IdClass`와 `@EmbeddedId` 두 가지 방식이 있는데, 실제 생성되는 SQL 쿼리에 차이가 있는가?

## 결론: SQL 차이 없음

Hibernate는 두 방식 모두 **동일한 SQL**을 생성한다. DDL, 단건 조회, 부분 키 조회 등 모든 경우에서 최종 SQL은 같다.

## DDL

두 방식 모두 동일한 테이블을 생성한다:

```sql
CREATE TABLE order_item (
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    quantity INT,
    PRIMARY KEY (order_id, item_id)
);
```

## 조회 쿼리

단건 조회, 부분 키 조회 모두 동일한 SQL이 생성된다:

```sql
-- 단건 조회
SELECT * FROM order_item WHERE order_id = ? AND item_id = ?

-- 부분 키 조회
SELECT * FROM order_item WHERE order_id = ?
```

## 차이가 나는 부분: JPQL 작성 방식

SQL이 아닌 JPQL 문법에서 필드 접근 경로가 달라진다:

```java
// @IdClass - 엔티티 필드에 직접 접근
@Query("SELECT o FROM OrderItem o WHERE o.orderId = :orderId")

// @EmbeddedId - 복합키 객체를 거쳐 접근
@Query("SELECT o FROM OrderItem o WHERE o.id.orderId = :orderId")
```

하지만 이것도 최종적으로 동일한 SQL로 변환된다.

## 코드 레벨 차이 비교

| 구분 | @IdClass | @EmbeddedId |
|---|---|---|
| PK 필드 위치 | 엔티티에 직접 선언 | 복합키 클래스에 위임 |
| JPQL 접근 | `o.orderId` | `o.id.orderId` |
| 키 객체 활용 | 조회 시에만 사용 | 키를 하나의 객체로 다룸 |
| 생성 SQL | 동일 | 동일 |

## 선택 기준

성능 차이가 없으므로 팀 컨벤션과 코드 가독성으로 선택하면 된다:

- **@IdClass**: JPQL이 깔끔하고 엔티티 필드에 바로 접근 가능
- **@EmbeddedId**: 복합키를 하나의 객체로 다루기 편하고, 키 자체를 파라미터로 전달하기 용이
