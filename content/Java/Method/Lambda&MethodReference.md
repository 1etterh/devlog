---
tags:
  - lambda
  - java
  - methodreference
---
# 1. Lambda
> Method를 -> 로 표시함
#### Lamba 사용 조건
> Lambda를 활용하기 위한 인터페이스는 추상 메소드를 단 하나만 가져야 함. <br/> 
> (cf. Functional Interface)

#### Syntax
_Calculator.java_
```Java
@FunctionalInterface  
public interface Calculator {  
    int sumTwoNumbers(int first, int second);  
}
```

_Application.java_
```Java
public class Application {  
 
    public static void main(String[] args) {  
		// anonymous class
        Calculator c1 = new Calculator() {  
            @Override  
            public int sumTwoNumbers(int first, int second) {       
                return first + second;  
            }  
        };  
		// anonymous function
        Calculator c2 = (x, y) -> x + y; 
        System.out.println("10 + 20 = " + c3.sumTwoNumbers(10, 20));  
    
	    // lambda function
	    Calculator c3 = (x, y) -> x + y;
	    System.out.println("c3.sumTwoNumbers(x, y) = " + c3.sumTwoNumbers(10,20));
    }  
    
}
```


#### @FunctionalInterface
> 하나의 추상 메소드만 갖는 인터페이스 <br/>
> Lambda식은 Functional Interface를 통해서만 사용될 수 있다.
##### 1. Consumer<\T>
> accept() : 리턴값이 없음
##### 2. Supplier
> get~() : 매개변수 없이 값만 리턴
##### 3. Function<\T, R>
> apply~(): 다양한 매개변수와 리턴타입
##### 4. Operator<\T>
> applyAs~(): 매개변수와 동일한 타입으로 리턴
##### 5. Predicate<\T>
> test() : boolean타입 반환
# 2. Method Reference
> 람다식이 아닌 일반 메소드를 참조하는 방법 <br/>
> 함수형 인터페이스의 매개변수 타입/갯수/반환형과 메소드의 매개변수 타입/갯수/반환형이 같아야함

