---
tags:
  - mybatis
  - java
---
> 쿼리가 정의된 Mapper 파일 <br/>
> Configuration에 등록해야 사용 가능하다.

## Syntax
### 1. Mapper.java(Interface)
```Java
public interface MenuMapper {  

@Results(id="menuResultMap", value = {  
        @Result(id = true, property = "menuCode", column = "MENU_CODE"),  
        @Result(property = "menuName", column = "MENU_NAME"),  
        @Result(property = "menuPrice", column = "MENU_PRICE"),  
        @Result(property = "categoryCode", column = "CATEGORY_CODE"),  
        @Result(property = "orderableStatus", column = "ORDERABLE_STATUS")  
})  
@Select("""  
    SELECT
                 MENU_CODE           
                ,MENU_NAME
			    ,MENU_PRICE
			    ,CATEGORY_CODE
			    ,ORDERABLE_STATUS
      FROM       TBL_MENU""")  

List<MenuDTO> selectAllMenus();
}
```


### 2. Mapper.xml
```xml
<!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.apache.ibatis.submitted.rounding.Mapper">
  <resultMap type="org.apache.ibatis.submitted.rounding.User" id="usermap">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <result column="funkyNumber" property="funkyNumber"/>
    <result column="roundingMode" property="roundingMode"/>
  </resultMap>

  <select id="getUser" resultMap="usermap">
    select * from users
  </select>
  <insert id="insert">
      insert into users (id, name, funkyNumber, roundingMode) values (
        #{id}, #{name}, #{funkyNumber}, #{roundingMode}
      )
  </insert>

  <resultMap type="org.apache.ibatis.submitted.rounding.User" id="usermap2">
    <id column="id" property="id"/>
    <result column="name" property="name"/>
    <result column="funkyNumber" property="funkyNumber"/>
    <result column="roundingMode" property="roundingMode" typeHandler="org.apache.ibatis.type.EnumTypeHandler"/>
  </resultMap>
  <select id="getUser2" resultMap="usermap2">
    select * from users2
  </select>
  <insert id="insert2">
      insert into users2 (id, name, funkyNumber, roundingMode) values (
        #{id}, #{name}, #{funkyNumber}, #{roundingMode, typeHandler=org.apache.ibatis.type.EnumTypeHandler}
      )
  </insert>

</mapper>
```


### 3. Mapper Interface + XML Mapper
> xml 방식과 java config방식 두 가지를 혼용하는 방식

##### 장점
1. 쿼리를 xml로 분리하여 가독성이 높다.
2. namespace를 한번만 써도 된다.
##### 규칙
1. mapper interface와 mapper xml 파일이 동일한 경로에 위치
	1. interface 경로(java/com/example/section03/remix/MenuMapper.java)
	2. xml mapper 경로(resources/com/example/section03/remix/MenuMapper.xml)
2. mapper Interface와 mapper xml 파일 이름 동일
3. xml파일의 namespace에 mapper용 interface의 풀 클래스 명 작성
4. mapper용 인터페이스의 추상 메소드명이 실행될 xml파일의 쿼리 id와 동일
