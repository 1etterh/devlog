---
title: Convention
description: Structured Query Language
tags:
  - sql
---

>SQL의 가독성을 위해 지키는 형식
>SQL이 길어질 수록 Convention의 중요성이 강조된다.

1. 기본 Query

```SQL
SELECT  ~~~
  FROM  ~~~
 WHERE  ~~~
```

2. [[SUBQUERY]]

```SQL
SELECT
  FROM ( SELECT
		   FROM
		  WHERE 
		  -- 가독성을 위해 subquery는 들여쓰기를 한다.
		  )
 WHERE 
```