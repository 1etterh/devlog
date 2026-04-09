---
tags:
  - spring
  - propagationoption
draft: true
---
> 다중 사용자 환경에서 데이터 일관성, 무결성을 보장하고 동시성을 관리하기 위한 방법

## Propagation Option(전파행위 옵션)
> Method 호출과 관련된 [[TRANSACTION|트랜잭션]] 동작 정의

## Isolation Level(격리 수준)
> 한 [[TRANSACTION|트랜잭션]]의 작업이 다른 트랜잭션의 작업과 격리되는 정도를 제어

## 관련 문서
- [[TRANSACTION|DB 트랜잭션]] - 트랜잭션의 기본 개념과 SQL 구문
- [[ACID 원칙|ACID 원칙]] - 트랜잭션의 4가지 속성
- [[001_read_committed_non_repeatable_read|READ_COMMITTED와 Non-Repeatable Read]]
- [[JPA|JPA]] - 영속성 컨텍스트 기반 트랜잭션 관리
- [[AOP|AOP]] - @Transactional이 동작하는 기반 기술

## references
1. [Spring Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html)
2. [JPA(Java Persistence API) Documentation](https://docs.oracle.com/javaee/6/tutorial/doc/bnbpz.html)
3. [MySQL Transaction and Locking Documentation](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-model.html)
4. [PostgreSQL Isolation Levels](https://www.postgresql.org/docs/current/transaction-iso.html)