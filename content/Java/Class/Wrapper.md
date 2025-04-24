---
tags:
  - java
  - class
  - object
---
> 기본형 데이터를 인스턴스화 해야 할 때 사용하는 클래스

# Wrapper Class
> 특정 메소드가 인스턴스만 객체로 받는 경우 사용한다.
```Java
public static void anyMethod(Object obj){    
    /* 설명. 출력 -> Object의 toString()에서 Integer의 toString()이 실행됨(동적 바인딩) */  
    System.out.println("obj : " + obj);  
}
```

## 래퍼 클래스 종류

| **기본 타입** | **래퍼 클래스** |
| --------- | ---------- |
| byte      | Byte       |
| short     | Short      |
| int       | Integer    |
| long      | Long       |
| float     | Float      |
| double    | Double     |
| char      | Character  |
| boolean   | Boolean    |
# 박싱과 언박싱
1. 기본 타입을 Wrapper 클래스의 인스턴스화 하는 것을 Boxing(박싱)이라고 한다.
2. Wrapper 클래스의 인스턴스를 기본 타입으로 변환하는 것을 언박싱이라고 한다.

### Instance

##### 1. Literal
```Java
Integer boxingInt = (Integer)20; 
Integer boxingInt2 = 20;
```
 리터럴 선언이므로 `constant pool에` 저장되고 둘의 주소는 같다.
```Java
System.out.println(System.identityHashCode(boxingInt)); // 918221580
System.out.println(System.identityHashCode(boxingInt2));// 918221580
```
##### 2. Constructor
```Java
Integer wrapperInt = Integer.valueOf(20); // returns instance of Integer
```

##### boxing - unboxing
```Java
Integer autoBoxingInt = 20; // auto-boxing
int autoUnboxingInt = autoBoxingInt; //auto-unboxing
System.out.println(autoBoxingInt); // 20
System.out.println(autoUnboxingInt); // 20
```

##### auto boxing vs upcasting
1. `auto boxing` : 리터럴 값과 참조형 사이의 형 변환
2. `up casting` : 상위 클래스로의 형 변환