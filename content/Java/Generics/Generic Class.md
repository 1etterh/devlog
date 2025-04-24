---
tags:
  - java
  - class
  - generics
---
# Generics
> 데이터 타입을 일반화함 (up casting, down casting + boxing, unboxing) <br/>
# Generic Class
> 클래스에 타입을 전달하여 다양한 인스턴스를 생성할 수 있는 클래스 <br/>
> 자료형(DataType)을 전달인자처럼 넘겨줌 <br/>
> cf. 구현의 편의성, 자료형의 안정성

### Syntax

_GenericTest.java_
```Java
public class GenericTest<T> { // DataType 설정 
private T value;  
public T getValue() {  
return value;  
}  
public void setValue(T value) {  
this.value = value;  
}  
}
```

_Application.java_
```Java
GenericTest<Integer> gt = new GenericTest<Integer>();
```

### Generics Type
1. E : Element
2. T : Type
3. K : Key
4. V : Value
### Wildcard
> _메소드_ 의 매개변수로 받을 시 제네릭 클래스의 범위를 설정해주는 문법

#### Syntax
```Java
<?> : 모든 타입 허용
<? extends T> : T 이하의 타입
<? super T> : T 이상의 타입
```