---
tags:
  - spring
  - jpa
  - db
draft: false
description:
---
> Spring, JPA 기반의 Repository 구축을 위해 인터페이스와 쿼리 메소드 제공
> QueryDSL 쿼리 지원 및 안전한 JPA 쿼리 처리

## Spring Data JPA Repositories
> Spring Data JPA Repository 인터페이스의 상속 구조

![[Pasted image 20241224124544.png]]

1. CRUD Repository: 주로 CRUD 기능 제공
2. PagingAndSortingRepository: 검색 및 검색 결과를 페이징 처리
3. 영속성 컨텍스트 flush및 batch에서 레코드 삭제와 같은 일부 JPA관련 추가 방법 제공
## Syntax

### 1. JpaRepository<Entity, PK>
> 관리하고자 하는 Entity와 PK를 Generic Type으로 넘겨준다.
```Java
public interfact MenuRepository extends JpaRepository<Menu, Long>
```
