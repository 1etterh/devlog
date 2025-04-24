---
tags:
  - java
  - class
---
> 타 프레임워크와 호환을 위해 작성하는 규칙
# Java Bean 작성규칙
##### 필수사항
1. 특정 패키지에 속해있어야함(default 금지)
2. 필드의 접근제어자는 private로 선언해야함(캡슐화 적용)
3. 기본 생성자
4. 모든 필드에 public getter, setter 작성
##### 선택사항
1. 매개변수가 있는 생성자
2. 직렬화




# Java Bean 예시
```Java
  
public class UserDTO {  
      
    /* 필기.   
    *   1. 필드(멤버변수) */  
    private String id;  
    private String pwd;  
    private String name;  
  
    private java.util.Date enrollDate;  
  
     
    /* 필기 2. 생성자(기본생성자는 필수로 명시적 작성) */  
    public UserDTO(){}  
  
    public UserDTO(String id, String pwd, String name, Date enrollDate) {  
        this.id = id;  
        this.pwd = pwd;  
        this.name = name;  
        this.enrollDate = enrollDate;  
    }  
  
  
    /* 필기 3. 설정자(setter)와 접근자(getter) */  
    public String getId() {  
        return id;  
    }  
  
    public void setId(String id) {  
        this.id = id;  
    }  
  
    public String getPwd() {  
        return pwd;  
    }  
  
    public void setPwd(String pwd) {  
        this.pwd = pwd;  
    }  
  
    public String getName() {  
        return name;  
    }  
  
    public void setName(String name) {  
        this.name = name;  
    }  
  
    public Date getEnrollDate() {  
        return enrollDate;  
    }  
  
    public void setEnrollDate(Date enrollDate) {  
        this.enrollDate = enrollDate;  
    }  
  
    /* 필기 4. 모든 멤버 변수를 하나의 String 문자열로 반환하는 toString() */  
    @Override  
    public String toString() {  
        return "UserDTO{" +  
                "id='" + id + '\'' +  
                ", pwd='" + pwd + '\'' +  
                ", name='" + name + '\'' +  
                ", enrollDate=" + enrollDate +  
                '}';  
    }

```

