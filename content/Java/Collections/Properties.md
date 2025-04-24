---
tags:
  - java
  - hashmap
  - collections
---
> key, value 모두 String인 HashMap <br/>
> Generic Type을 별도로 요구하지 않음 <br/>
> 주로 설정파일 관련된 파일 입출력에 사용됨


# Syntax

#### 1. 설정 정보 출력
```Java
Properties prop = new Properties(); 
prop.setProperty("driver", "oracle.jdbc.Driver");  
prop.setProperty("url", "jdbc:oracle:thin:@localhost:1521:XE");  
prop.setProperty("user", "swcamp");  
prop.setProperty("password", "swcamp");

try {  
//            prop.store(new FileOutputStream("driver.dat"),"jdbc driver");  
            prop.storeToXML(new FileOutputStream("driver.xml"), "jdbc driver xml version");  
        } catch (IOException e) {  
            throw new RuntimeException(e);  
        }
```

#### 2. 설정 정보 불러오기

```Java
 Properties prop2 = new Properties();  
        System.out.println();  
        System.out.println("prop2 : " + prop2);  
        try {  
//            prop2.load(new FileInputStream("driver.dat"));  
            prop2.loadFromXML(new FileInputStream("driver.xml"));  
        } catch (IOException e) {  
            throw new RuntimeException(e);  
        }

System.out.println("prop2.getProperty(\"driver\") = " + prop2.getProperty("driver"));  
System.out.println("prop2.getProperty(\"url\") = " + prop2.getProperty("url"));  
System.out.println("prop2.getProperty(\"user\") = " + prop2.getProperty("user"));  
System.out.println("prop2.getProperty(\"password\") = " + prop2.getProperty("password"));
```