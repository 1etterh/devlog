---
tags:
  - database
  - db
  - sql
  - transaction
---
>논리적 일의 단위
>중간에 하나라도 실패하면 전부 다 취소해야됨
>roll back, commit


# 범위
> 하나의 TRANSACTION의 범위를 설정해야 한다
> 프로세스의 시작과 끝을 명확히 지정

### Syntax

```SQL

START TRANSACTION; -- transaction 범위 설정
INSERT 
  INTO tbl_menu
VALUES 
(NULL,'바나나해장국',8500,4,'Y'); -- 이력

UPDATE tbl_menu
   SET menu_name = '수정된메뉴'
 WHERE menu_code = 5; -- 내역
 
SELECT * FROM tbl_menu;

-- ROLLBACK;
COMMIT;
-- 시작: start transaction 
-- 끝: commit/rollback 둘 중 하나

-- start transaction이 없는 경우 앞에서 마지막 커밋까지의 범위로 롤백

```

# auto commit 
> MySQL은 기본적으로 auto commit(자동커밋)이 설정되어 있으므로 수동으로 조절하고 싶다면 autocommit 설정을 바꿔주어야 한다.


##### auto commit 활성화

```SQL
SET autocommit = 1; 
-- 또는 
SET autocommit = ON; 
```

##### auto commit 비활성화

```SQL
-- auto commit 비활성화
SET autocommit = 0; 
-- 또는 
SET autocommit = OFF;
```


# COMMIT
> Commit 이후에는 ROLLBACK을 해도 적용 X

```SQL
START TRANSACTION;

SELECT * FROM tbl_menu;
INSERT INTO tbl_menu VALUES (null, '바나나해장국', 8500, 4, 'Y');
UPDATE tbl_menu SET menu_name = '수정된 메뉴' WHERE menu_code = 5;
DELETE FROM tbl_menu WHERE menu_code = 7;

-- COMMIT; 
ROLLBACK;
```

### [[ACID 원칙]]
