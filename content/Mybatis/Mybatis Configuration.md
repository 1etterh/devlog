---
tags:
  - mybatis
  - java
  - jdbc
---

> MyBatis 관련 설정 정보를 저장하는 클래스

## I. Configuration
##### i. Environment
> DB 환경설정 정보 <br/>
> transaction 관리와 커넥션 풀링을 위한 환경적인 설정
1. 환경 정보 이름
2. Transaction Manager Type
	1. JdbcTransactionFactory : 코드 작성을 통해 수동으로 커밋을 조작
	2. ManagedTransactionFactory : JDBC가 자동으로 커밋을 수행
3. Connection Pool
	1. PooledDataSource : ConnectionPool 사용
	2. UnpooledDataSource : ConnectionPool 사용하지 않음
##### ii. Configuration
> Environment 객체를 통해 생성
1. Environment 등록
2. Mapper 등록
##### iii. SqlSession
> Mybatis와 Java를 연동하기 위한 인터페이스<br/>
> cf. mapper, commands, transactions
1. SqlSessionFactory: SqlSession 객체를 생성하기 위한 팩토리 역할을 수행
2. SqlSessionFactoryBuilder: SqlSessionFactory를 생성함
##### iv. typeAlias
> Java Type에 대한 짧은 이름. 오직 XML에서만 사용되며, Typing을 줄이기 위해 존재함.

1. MybatisConfig.xml에 추가
```xml
<typeAliases>  
    <typeAlias type="com.ohgiraffers.section01.xmlconfig.MenuDTO" alias="MenuDTO"></typeAlias>  
</typeAliases>
```
2. Java 클래스 위에 @Alias 추가
```Java
@Alias("MenuDTO")
public class MenuDTO{
...
}
```

## Syntax
### 1. Java Configuration

_Template.java_
```Java
Environment environment = new Environment(
		"dev",  
        new JdbcTransactionFactory(),  
        new PooledDataSource(driver, url, user, password)  
);  
  
Configuration configuration = new Configuration(environment);  
configuration.addMapper(Mapper.class);      
  
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(configuration);  
SqlSession session = sqlSessionFactory.openSession(false);  
```

_Application.java_
```Java
menuMapper = sqlSession.getMapper(MenuMapper.class);
List<MenuDTO> menuList = menuMapper.selectAllMenus();
```


### 2. XML Configuration
_mybatis-config.xml_
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="org/mybatis/example/BlogMapper.xml"/>
  </mappers>
</configuration>
```



_Template.java_
```Java
private static SqlSessionFactory sqlSessionFactory;  
  
public static SqlSession getSqlSession() {  
    if (sqlSessionFactory == null) {  
        String resource = "com/example/section01/xmlconfig/mybatis-config.xml";  
  
        try {  
            InputStream inputStream = Resources.getResourceAsStream(resource);  
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);  
        } catch (IOException e) {  
            throw new RuntimeException(e);  
        }  
    }  
    return sqlSessionFactory.openSession(false);  
}
```

# refs
1. [Mybatis Configuration](https://mybatis.org/mybatis-3/ko/configuration.html)
2. 