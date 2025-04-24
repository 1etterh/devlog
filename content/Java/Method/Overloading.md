---
tags:
  - java
  - method
  - class
  - overloading
---
> 동일한 메소드 이름으로 다양한 종류의 매개변수에 따라 처리해야 하는 경우 적용하는 기술을 오버로딩이라고 한다.

# 오버로딩 조건
1. 매개변수 타입, 갯수, 순서를 다르게 작성하여 하나의 클래스 내에 동일한 이름의 메소드를 여러개 작성할 수 있다. 
2. 메소드의 헤드부에 있어 시그니쳐를 제외한 부분이 다르게 작성되는 것은 인정하지 않는다.
3. 메소드 id가 동일하다.
#### 메소드 시그니쳐(Method Signature)
> 메소드 명과 파라미터 선언부 부분을 메소드의 시그니쳐라고 한다.

![[content/JAVA/Method/assets/method_signature.png]]


### Overriding 예시
```Java
public void test(){}  

public void test(int num){}

/* 설명. 매개변수의 갯수가 달라지는 경우 */  
public void test(int num,int num2){}

/* 설명. 매개변수의 이름은 시그니쳐에 해당하지 않으므로 오버라이딩에 해당하지 않는다. */  
//    public void test(int num2, int num1){}

/* 설명. 매개변수의 타입이 달라지는 경우 */  
public void test(int num,String str){}

/* 설명. 매개변수의 순서가 달라지는 경우(타입만 고려) */  
public void test(String str, int num){}

```

###### Overriding vs Overloading 구분