---
tags:
  - database
  - db
  - sql
---
>테이블을 활용한 가상 테이블
>Query 상태로 저장


# VIEW의 목적
1. DBA(DataBaseAdministrator)가 개발자에게 보여주기 위한 값만 추출하려 하는 경우
2. Column 이름을 바꿔주는 경우
3. 원본 테이블을 참조하여 보여주는 용도
4. 보여지는 것은 실제 테이블(Base Table)의 값이다.
5. Caching을 통한 성능 향상

# Syntax
```SQL
CREATE OR REPLACE VIEW v_menu -- 만들거나 대체하거나 하라는 뜻
AS
SELECT 
	    menu_name AS '메뉴명'
	   ,menu_price AS '메뉴 단가'
  FROM tbl_menu;

DESC v_menu;
```


#### VIEW 권한
1. VIEW를 통한 DML은 불가능한 것이 원칙이지만, DBMS별로 권한이 다름
2. MariaDB는 VIEW에서의 DML이 가능하다.