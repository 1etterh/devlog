---
tags:
  - java
  - exception
  - error
---
> two types of Exception Handling

### 예외 처리 방식
> 두가지 예외 처리 방식이 있음
#### 1. try-catch
1. `try` : 예외가 발생할 가능성이 있는 코드를 작성하는 블럭
2. `catch` : try에서 발생한 예외 객체를 처리하는 블럭
3. `finally` : 예외 발생 여부와 상관없이 실행될 코드를 작성하는 블럭

##### Syntax
```Java
ExceptionTest et = new ExceptionTest();  
    try {  
        et.checkEnoughMoney(20000,50000);  
    }catch(Exception e) {  
        System.out.println("유효성 검사시 문제 발생");  
    }finally{ 
        System.out.println("finally block");  
    }
      
    System.out.println("System exit");
```
#### 2. throws
> 기존에 작성된 예외 Class의 객체를 상위 메소드에 위임하는 방식이다. 

```Java
public void checkEnoughMoney(int price, int money) throws Exception{  
	if(money>=price){  
            System.out.println(price + ": checked");  
            return;  
        }    
	throw new Exception("돈이 부족...");  //돈이 부족한 경우
}
```


### 사용자 정의형 예외 클래스
> Exception 클래스를 상속하여 사용자 지정 예외 클래스를 정의할 수 있음

_UserDefinedException.java_
```Java
public class UserDefinedException extends Exception{
	public UserDefinedException(String message){
	super(message);}
}
```

_ExceptionTest.java_
```Java
public static void createUserDefinedException(){
	throw new UserDefinedException("UserDefinedException");
}
```

_Application.java_
```Java
try{
ExceptionTest.createUserDefinedException();
} catch (UserDefinedException e){
System.out.println(e.getMessage());
}
```

