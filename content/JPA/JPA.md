---
tags:
  - java
  - jpa
draft: false
---
> Java Persistence API <br/>
> ORM   (Object Relational Mapping) API <br/>
> 자바의 객체지향 과 DB의 관계 지향 사이의 불일치와 제약사항을 해결

## 1. JPA 
### 특징
1. 영속성 컨텍스트가 [[content/JPA/Entity|엔티티]]를 생명주기를 통해 관리한다.
2. native SQL을 통해 직접 SQL을 해당 DB에 맞게 작성할 수도 있다.
3. DBMS별로 dialect를 제공한다.

#### 장점
1. SQL에 독립적으로 개발할 수 있다.
2. 캐시를 활용한 성능 최적화로 인해 트랜젝션을 처리하는 시간이 크게 단축된다.
#### 단점
1. 복잡한 SQL을 작성하기에는 적합하지 않다.
2. JPA를 이해하지 못하고 사용시 성능저하가 발생할 수 있다.

## 2.Mybatis와 JPA
#### 1. Mybatis
> 동적 SQL을 작성하고 매핑을 통해 Query의 결과를 Java Type으로 변경해준다.

#### 2. JPA
> 개발자가 쿼리를 작성하지 않고 CRUD 작업을 할 수 있다.

## 3. JPA 동작 방식
> JAVA Application과 JDBC사이에서 동작하며 내부적으로 JDBC API 활용

![[Pasted image 20241223170647.png]]

## 4. [[Persistence Context|영속성 컨텍스트]]
> JPA에서 엔티티를 저장하는 공간
## 5. [[content/JPA/Entity|Entity]]
> 영속성 컨텍스트에서 관리되는 도메인 객체 <br/>
## refs
1. [docs.oracle.com.JPA](https://docs.oracle.com/javaee/6/tutorial/doc/bnbpz.html)
