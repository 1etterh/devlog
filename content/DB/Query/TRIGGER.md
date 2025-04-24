---
tags:
  - database
  - db
  - sql
---
> 테이블에 이벤트가 발생할 때 실행되는(혹은 `트리거` 되는) 명령문의 세트
>테이블의 변경 사항을 감지 후 자동으로 실행 
>데이터의 무결성을 유지하고 복잡한 비즈니스 로직을 처리한다.

# TRIGGER의 종류
### BEFORE
> 이벤트가 발생하기 전에 실행되며 데이터의 유효성 검사나 변형에 주로 사용됨
### AFTER
> 이벤트가 발생한 후에 실행되며, 로깅, 알림 전송등의 작업에 적합


#### TRIGGER를 발생시키는 조건
1. INSERT
2. DELETE
3. UPDATE
4. [[REPLACE]](DELETE 후 INSERT)

> TRUNCATE는 어떤 TRIGGER도 실행시키지 않음




# Syntax

```
DELIMITER // -- DELIMITER: 구분자

CREATE OR REPLACE TRIGGER [트리거명]
	BEFORE|AFTER [이벤트 타입] 
				   -- INSERT UPDATE DELETE 
	ON [테이블]
	FOR EACH ROW   -- 매 행마다 실행하라는 뜻
		
BEGIN  -- 여기에 프로시져 작성
	UPDATE [테이블]
	SET 
	WHERE -- 변경할 ROW 지정
END //

DELIMITER ;
```

# TRIGGER 확인 명령

###### 1. Triggers 확인

```SQL
SHOW TRIGGERS;
```


###### 2. TRIGGER 제거
```SQL
DROP TRIGGER [트리거이름];
```

###### 3. TRIGGER QUERY 확인

```SQL
SHOW CREATE TRIGGER [트리거 이름];
```