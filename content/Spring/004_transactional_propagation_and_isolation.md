---
title: "@Transactional 전파행위(Propagation)와 격리수준(Isolation) 완전 정리"
type: question
tags: [Spring, Transactional, Propagation, Isolation, 트랜잭션, JPA]
draft: true
---

## Propagation (전파 행위)

트랜잭션이 이미 존재할 때 새 트랜잭션을 어떻게 합류/분리할지 결정한다.

### 7가지 옵션

| 옵션 | 기존 트랜잭션 있을 때 | 없을 때 | 사용 예시 |
|---|---|---|---|
| REQUIRED (기본값) | 기존에 합류 | 새로 생성 | 일반적인 서비스 메서드 |
| REQUIRES_NEW | 기존 일시 중단, 새로 생성 | 새로 생성 | 로그 저장 (본 작업 롤백돼도 로그는 남겨야 할 때) |
| NESTED | 기존 안에 savepoint 생성 | 새로 생성 | 부분 롤백이 필요한 하위 작업 |
| SUPPORTS | 기존에 합류 | 트랜잭션 없이 실행 | 읽기 전용 조회 |
| NOT_SUPPORTED | 기존 일시 중단, 트랜잭션 없이 실행 | 트랜잭션 없이 실행 | 외부 API 호출 |
| MANDATORY | 기존에 합류 | 예외 발생 | 반드시 트랜잭션 안에서 호출돼야 하는 메서드 |
| NEVER | 예외 발생 | 트랜잭션 없이 실행 | 절대 트랜잭션 안에서 호출되면 안 되는 메서드 |

### 실무 핵심

REQUIRED(같이 묶기)와 REQUIRES_NEW(분리하기) 두 개가 핵심이다. 나머지는 특수한 경우에만 사용한다.

## Isolation (격리 수준)

동시에 실행되는 트랜잭션 간에 데이터를 어디까지 볼 수 있는지 결정한다.

### 4가지 수준

| 격리 수준 | Dirty Read | Non-Repeatable Read | Phantom Read | 성능 |
|---|---|---|---|---|
| READ_UNCOMMITTED | 발생 | 발생 | 발생 | 최고 |
| READ_COMMITTED | 차단 | 발생 | 발생 | 높음 |
| REPEATABLE_READ | 차단 | 차단 | 발생 | 보통 |
| SERIALIZABLE | 차단 | 차단 | 차단 | 최저 |

### 동시성 문제 3가지

- **Dirty Read**: 커밋 안 한 데이터를 다른 트랜잭션이 읽음
- **Non-Repeatable Read**: 같은 행을 두 번 읽는 사이에 다른 트랜잭션이 UPDATE하여 값이 달라짐
- **Phantom Read**: 같은 조건으로 두 번 조회하는 사이에 다른 트랜잭션이 INSERT하여 행 수가 달라짐

### DB별 기본 격리 수준

| DB | 기본값 |
|---|---|
| MySQL (InnoDB) | REPEATABLE_READ |
| PostgreSQL | READ_COMMITTED |
| Oracle | READ_COMMITTED |

### 실무 기준

대부분 DB 기본값을 그대로 사용한다. 동시 수정이 치명적인 경우 격리 수준을 올리기보다 비관적 락(SELECT FOR UPDATE)이나 낙관적 락(@Version)으로 해결하는 것이 더 일반적이다.
