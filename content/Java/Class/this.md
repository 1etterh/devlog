---
tags:
  - java
  - class
  - instance
---
> `this`는 맥락에 따라 다양한 의미를 지닌다.
# Cases
##### 1. Method를 호출한 객체를 의미하는 경우
![[content/Java/Class/assets/super_1.png]]
##### 2.  생성자가 타 생성자를 이용하는 경우
```Java
public User(String id, String pwd, String name) { 
    this.id = id;  
    this.pwd = pwd;  
    this.name = name;  
}
    
public User(String id, String pwd, String name, java.util.Date enrollDate) {   
        this(id, pwd, name); //위의 생성자를 사용   
        this.enrollDate = enrollDate;  
    }
```


# references
### 15.8.3. `this`

The keyword `this` may be used as an expression in the following contexts:

- in the body of an instance method of a class ([§8.4.3.2](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.4.3.2 "8.4.3.2. static Methods"))
    
- in the body of a constructor of a class ([§8.8.7](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.8.7 "8.8.7. Constructor Body"))
    
- in an instance initializer of a class ([§8.6](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.6 "8.6. Instance Initializers"))
    
- in the initializer of an instance variable of a class ([§8.3.2](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.3.2 "8.3.2. Field Initialization"))
    
- in the body of an instance method of an interface, that is, a default method or a non-`static` `private` interface method ([§9.4](https://docs.oracle.com/javase/specs/jls/se17/html/jls-9.html#jls-9.4 "9.4. Method Declarations"))

references: [_docs.oracle.com_](https://docs.oracle.com/en/java/javase/17/)

