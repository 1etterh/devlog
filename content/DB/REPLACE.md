> insert 시 primary key(null x, 중복 x, 이후 수정 x) 또는 unique key(중복 x)에 충돌이 발생하지 않도록 replace를 통해 중복된 데이터는 덮어쓰기 가능
> 충돌이 발생하지 않으면  INSERT 

```SQL
REPLACE
   INTO tbl_menu
 VALUES 
 (
 17
 ,'참기름소주'
 ,5000
 ,10
 ,'Y'
 );
```

- INTO 생략 가능
```SQL
REPLACE tbl_menu
 VALUES 
 (
 17
 ,'참기름소주'
 ,5000
 ,10
 ,'Y'
 );
```


#### REPLACE에 의한 [[TRIGGER]]
```SQL
BEFORE INSERT;
BEFORE DELETE; -- only if a row is being deleted
AFTER DELETE -- only if a row is being deleted
AFTER INSERT;
```