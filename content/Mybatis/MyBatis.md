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


# references
1. [MyBatis 시작하기](https://mybatis.org/mybatis-3/ko/getting-started.html)