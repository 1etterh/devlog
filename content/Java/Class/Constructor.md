---
tags:
  - class
  - instance
  - this
---
> 인스턴스를 생성하기 위해 사용하는 Class 명과 동일한 이름을 가진 함수이다.<br/>
> 반환형이 없으며, 기본 생성자와 매개변수가 있는 생성자로 나눌 수 있다.
# Syntax
```Java
public User(){  // 기본 생성자 
}

public User(String id, String pwd, String name) {
	// 매개변수를 활용한 생성자
    this.id = id;  
    this.pwd = pwd;  
    this.name = name;  
}
```

- 객체를 생성할 때는 생성자들 중에 하나만 실행된다.
- 타 생성자가 있으면 기본 생성자가 자동으로 생성되지 않는다.
- 클래스와 이름이 동일하고 자신이 속한 클래스의 객체를 생성하는 곳에 쓰인다.  
- 얘가 없으면 객체 생성이 안돼서 안 적으면 알아서 JVM이 기본생성자를 만들어주지만, 타 생성자 함수를 작성하면 기본 생성자 작성이 되지 않기 때문에 습관적으로 기본 생성자를 만들어두는 것이 좋다. 


# this
> 생성자 내부의 [[this]]는 해당 생성자를 통해 생성될 객체를 의미한다.
```Java
public User(String id, String pwd, String name) { 
    this.id = id;  
    this.pwd = pwd;  
    this.name = name;  
}
    
public User(String id, String pwd, String name, java.util.Date enrollDate) {   
        this(id ,pwd, name);  //첫 줄에 this()를 쓰면 위의 생성자를 활용할 수 있다.
        this.enrollDate = enrollDate;  
    }
```



- 생성자 내부의 [[Super]] ()은 부모 생성자를 활용한다는 의미이다.


# [[Java Bean]]
> JSP에서 사용되는 표준 액션 태그로 접근할 수 있게 만든 자바 클래스 형태.
##### 단축키
> `alt` + `insert`