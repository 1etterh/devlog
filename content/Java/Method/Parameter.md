---
tags:
  - method
  - java
  - parameter
---
> 메소드 선언 괄호 안에 전달인자를 받기 위해 선언하는 변수

# 파라미터로 사용 가능한 자료형
1. 기본 자료형(_call by value_)
2. 기본 자료형 배열(_call by reference_)
3. 클래스 자료형(_call by reference_)
4. 클래스 자료형 배열(_call by reference_)
5. 가변인자


# call by value
> 리터럴 값을 전달하기 때문에 서로 다른 영역의 지역변수끼리는 서로 영향을 주지 않는다.

```Java
int num = 20;                                    //지역변수
System.out.println("Call by value 전: " + num); 
pt.testPrimitiveTypeParameter(num);             
System.out.println();  
System.out.println("Call by value 후: " + num);  

public void testPrimitiveTypeParameter(int num) { 
    num = 10;                                   
    System.out.println();  
    System.out.println("===== test Primitive Type Parameter () =====");  
    System.out.println("매개변수로 전달받은 값: " + num);  
}
```

_결과_
```
Call by value 전: 20

===== test Primitive Type Parameter () =====
매개변수로 전달받은 값: 10

Call by value 후: 20
```

# call by reference
> 참조형의 주소값을 전달하기 때문에 서로 다른 영역의 변수에 영향을 줄 수 있다.

```Java
int[] iArr = new int[]{1,2,3,4,5};  
System.out.println();  
System.out.println("Call by reference 전 : " + Arrays.toString((iArr)));  
pt.testPrimitiveTypeArrayParameter(iArr);
System.out.println();  
System.out.println("Call by reference 후 :" + Arrays.toString(iArr));  

public void testPrimitiveTypeArrayParameter(int[] iArr) {  
    iArr[0] = 100;  
    System.out.println();  
    System.out.println("===== test Primitive Type Array () =====");  
    System.out.println("매개변수로 전달받은 값 : "+ Arrays.toString(iArr));  
}

```

_결과_
```
Call by reference 전 : [1, 2, 3, 4, 5]
===== test Primitive Type Array () =====
매개변수로 전달받은 값 : [100, 2, 3, 4, 5]

Call by reference 후 :[100, 2, 3, 4, 5]
```