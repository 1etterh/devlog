---
tags:
  - jdbc
  - java
  - database
---
> 기존의 statement의 발전된 형태

# Prepared Statement
1. 쿼리 성능 향상(파싱, 컴파일, 캐싱 재사용)
2. SQL Injection 방어 가능

### Place Holder
> Query의 일부를 ? 로 표기하여 후에 ?값을 변수처럼 사용할 수 있다.
# Syntax

```Java
String query = "select * from employee where emp_id = ? AND ENT_YN = ?";   // ?: place holder  
  
try {  
    con = getConnection();  
    pstmt = con.prepareStatement(query);  
    pstmt.setString(1, empId);  
    pstmt.setString(2, entYn);  
    rset = pstmt.executeQuery();  
  
    while (rset.next()) {  
        System.out.printf("%s, %s\n", rset.getString("emp_id"), rset.getString("emp_name"));  
    }  
} catch (SQLException e) {  
    throw new RuntimeException(e);  
} finally {  
    close(rset);  
    close(pstmt);  
    close(con);  
}
```