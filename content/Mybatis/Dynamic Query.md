---
tags:
  - mybatis
draft: false
description:
---
> 동적으로 제어할 수 있는 SQL 구문을 작성하는 MyBatis의 기능

## Mybatis XML 지원 구문 종류

1. if
2. choose(when, otherwise)
3. trim(where, set)
4. foreach
## Syntax

### 1. OGNL
> Object Graph Navigation Language<br>
> single quotation('') 구간의 값은 literal값으로 보고 그게 아닌 이름은 객체의 필드 또는 변수로 인식하게 작성하는 기법

1. gte(>=) : greater than equal 
2. gt(>) : greater than 
3. lte(<=) : less than equal 
4. lt(<) : less than 
5. eq(\==): equal
6. neq(!=) : not equal


## Example

### 1. if
```xml
<select id="findActiveBlogWithTitleLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE state = ‘ACTIVE’
  <if test="title != null">
    AND title like #{title}
  </if>
</select>
```
### 2. Choose(when, otherwise)
> if-else, switch문과 비슷한 기능
```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
```

### 3. trim, where, set
> 알아서 Where절을 SQL 문법에 맞게 완성해줌

#### 1. Query 1
```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE
  <if test="state != null">
    state = #{state}
  </if>
  <if test="title != null">
    AND title like #{title}
  </if>
  <if test="author != null and author.name != null">
    AND author_name like #{author.name}
  </if>
</select>
```

위와 같은 Dynamic Query가 있다고 치자.

1. 어떤 조건에도 해당하지 않는 경우
```SQL
SELECT 
	   \*
  FROM BLOG
 WHERE
```

2. 두 번째 조건만 해당되는 경우
```SQL
SELECT * FROM BLOG
WHERE
AND title like ‘someTitle’
```

3. 모두 잘못된 SQL 구문이기 때문에 에러가 발생한다.
#### 2. Query 2 - where
```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  <where>
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
  </where>
</select>
```

#### 3. Query 3 - trim
```xml
<trim prefix="WHERE" prefixOverrides="AND |OR ">
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
</trim>
```
#### 4. set
> UPDATE의 SET 구문을 동적으로 생성

```xml
<update id="updateAuthor">
  UPDATE Author
  <set>
    <if test="username != null">username = #{username},</if>
    <if test="password != null">password = #{password},</if>
    <if test="email != null">email = #{email},</if>
  </set>
  WHERE id = #{id}
</update>
```
#### trim
```xml
<trim prefix="SET" suffixOverrides=",">
  <set>
    <if test="username != null">username = #{username},</if>
    <if test="password != null">password = #{password},</if>
    <if test="email != null">email = #{email},
</if>
	</set>
  WHERE id = #{id}
</trim>
```

### foreach
> collection 객체에 대한 반복처리

#### example
```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  <where>
    <foreach item="item" index="index" collection="list"
        open="ID in (" separator="," close=")" nullable="true">
          #{item}
    </foreach>
  </where>
</select>
```
## references
1. [Mybatis-dynamic sql](https://mybatis.org/mybatis-3/ko/dynamic-sql.html)