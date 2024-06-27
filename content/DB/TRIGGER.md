>테이블의 변경 사항을 감지 후 자동으로 실행 
>업무 무결성을 유지하고 복잡한 비즈니스 로직을 처리한다.

## TRIGGER의 종류
### BEFORE
> 이벤트가 발생하기 전에 실행되며 데이터의 유효성 검사나 변형에 주로 사용됨
### AFTER
> 이벤트가 발생한 후에 실행되며, 로깅, 알림 전송등의 작업에 적합


#### Syntax

```
DELIMITER //

CREATE OR REPLACE TRIGGER [트리거명]
	BEFORE|AFTER [이벤트 타입] 
				   -- INSERT UPDATE DELETE REPLACE
	ON [테이블]
	FOR EACH ROW   -- 매 행마다 실행하라는 뜻
		
BEGIN  -- 여기에 프로시져 작성
	UPDATE [테이블]
	SET 
	WHERE -- 변경할 ROW 지정
END //

DELIMITER ;
```

#### TRIGGER 확인

```SQL
SHOW TRIGGERS;
```


