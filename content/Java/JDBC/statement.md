---
tags:
  - jdbc
  - java
  - database
---
> SQL 쿼리를 DB에 전달 후 결과 반환

# Result Set
> Statement의 결과를 저장 <br/>
> while문 안에서 rset은 한 행을 의미하며, while 루프의 다음 턴으로 넘어갈 때 다음 행이 출력된다.

1. DML: 결과 값으로 int 반환
2. Select: 결과 값으로 rows 반환
### Syntax
```Java
Connection con = getConnection();  
System.out.println("con : " + con);  
   
Statement stmt = null;     
ResultSet rset = null;       
  
try {  
    stmt = con.createStatement();  
    rset = stmt.executeQuery("select * from employee");  
    while (rset.next()) {       // while문 안에서 rset은 한 행임 -> while문 루프가 넘어갈 때 다음 행  
        String id = rset.getString("EMP_ID");  
        String name = rset.getString("EMP_NAME");  
        int salary = rset.getInt("SALARY");  
        System.out.println("id : " + id + " name : " + name + " salary : " + salary);  
  
    }  
} catch (SQLException e) {  
    throw new RuntimeException(e);  
} finally{  
    /* 역순으로 각 스트림을 닫는다. */  
    close(rset);  
    close(stmt);  
    close(con);  
}
```


# [[Prepared Statement]]
> 기존의 Statement의 발전된 형태

# Transaction
> 논리적인 일의 단위 <br/> 
> 모든 작업이 완료되면 commit을, 중간에 실패하면 rollback을 실행