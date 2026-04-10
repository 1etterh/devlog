---
tags:
  - java
  - db
  - mybatis
draft: false
---
# MyBatis
> Data의 CRUD를 보다 편하게 할 수 있도록 xml, java로 구조화하여 [[JDBC]]를 구현한 영속성 프레임워크


## MyBatis 설정
> MyBatis를 사용하기 위해서는 Configuration과 Mapper 설정이 필요하다.

### I. [[Mybatis Configuration|Configuration]]
> MyBatis 관련 설정 정보를 저장하는 클래스
### II. [[Mybatis Mapper|Mapper]]
> 사용하고자 하는 쿼리가 정의된 Mapper 파일 <br/>
> Configuration에 등록해야 사용 가능하다.
### III. Dependencies
> build.gradle에 추가

```gradle
// https://mvnrepository.com/artifact/org.mybatis/mybatis  
implementation 'org.mybatis:mybatis:3.5.6'  
// https://mvnrepository.com/artifact/mysql/mysql-connector-java  
implementation 'mysql:mysql-connector-java:8.0.28'
```


## 관련 문서
- [[JDBC|JDBC]] - MyBatis가 내부적으로 구현하는 API
- [[JPA|JPA]] - ORM 방식의 대안 영속성 기술
- [[Spring Framework|Spring Framework]] - MyBatis와 함께 사용하는 프레임워크
- [[SQL|SQL]] - MyBatis에서 작성하는 쿼리 언어
- [[Prepared Statement|PreparedStatement]] - JDBC의 SQL 실행 객체

# references
1. [MyBatis 시작하기](https://mybatis.org/mybatis-3/ko/getting-started.html)