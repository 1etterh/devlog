---
tags:
  - java
  - db
  - jdbc
---
> Java Database Connectivity <br/>
> Java에서 데이터 소스(DB)에 접근 가능하도록 하는 Programming API


### JDBC 설정
1. [MVN Repository](https://mvnrepository.com/)에서 MySQL검색(MariaDB와 호환가능) 
2. MySQL Connector Java의 Gradle에서 복사한 내용(현재 프로젝트는 8.0.28 사용)을 build.gradle 에 붙여넣기
3. 설정에 들어가서 File Encodings을 UTF-8로 변경

```
dependencies {  
    testImplementation platform('org.junit:junit-bom:5.10.0')  
    testImplementation 'org.junit.jupiter:junit-jupiter'  
  
    implementation 'mysql:mysql-connector-java:8.0.28'  
}
```

### Syntax

_JDBCTemplate.java_

```Java
package com.ohgiraffers.common;  
  
import java.io.FileReader;  
import java.io.IOException;  
import java.sql.*;  
import java.util.Properties;  
  
public class JDBCTemplate {  
    public static Connection getConnection() {  
        Properties prop = new Properties();  
        Connection con = null;  
        try {  
            prop.load(new FileReader("src/main/java/com/ohgiraffers/config/connection-info.properties"));  
            String driver = prop.getProperty("driver");  
            String url = prop.getProperty("url");  
            String user = prop.getProperty("user");  
            String password = prop.getProperty("password");  
  
            Class.forName(driver);  
            con = DriverManager.getConnection(url, user, password);  
  
            /* 설명. DML 실행시 자동 커밋이 아닌 수동 커밋(for: rollback)을 하겠다는 의미 */  
            con.setAutoCommit(false);  
            System.out.println("con : " + con);  
        } catch (IOException e) {  
            throw new RuntimeException(e);  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        } catch (ClassNotFoundException e) {  
            throw new RuntimeException(e);  
        }  
        return con;  
    }  
  
    public static void close(Connection con) {  
        try {  
            if (con != null && !con.isClosed()) con.close();  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    public static void close(Statement st) {  
        try {  
            if (st != null && !st.isClosed()) st.close();  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    public static void close(ResultSet rs) {  
        try {  
            if (rs != null && !rs.isClosed()) rs.close();  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    public static void commit(Connection con) {  
        try {  
            if (con != null && !con.isClosed())  
                con.commit();  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    public static void rollback(Connection con) {  
        try {  
            if (con != null && !con.isClosed())  
                con.rollback();  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
}
```
### 확인
1. 연동할 DB의 port 번호
2. 계정 정보(id, pw)
3. DB 이름(ex: menudb)

### [[statement]]


