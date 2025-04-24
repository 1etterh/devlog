---
tags:
  - object
  - class
  - java
---
> 모든 클래스의 조상


# Object
1. 다양한 메소드로 구성되어 있다.
2. 모든 클래스는 Object 클래스를 상속하고 있으므로 Object 안에 있는 메소드를 사용할 수 있다.
3. Object가 가진 메소드를 [[Overriding|오버라이딩]] 해서 사용하는 것도 가능하다.

## Methods
> Object의 주요 메소드는 다음과 같다.

| Method                     |                                          |
| -------------------------- | ---------------------------------------- |
| boolean equals(Object obj) | 전달받은 객체와 같은지 확인한다.(동일하면 true, 다르면 false) |
| int hashCode()             | 객체의 정보를 이용하여 해시코드를 반환한다.                 |
| String toString()          | 객체의 정보를 문자열로 반환한다.                       |
#### 1. Object.equals()

> Object가 처음 물려주는 equals() 메소드는 동일 비교용이다.(주소값 비교)

##### 동일객체와 동등객체
1. 동일 객체: 주소가 동일한 인스턴스
2. 동등 객체: 주소가 다르더라도 지정한 필드값이 같은 객체



##### @equals()
> Object의 equals를 [[Overriding|오버라이드]] 하여 지정된 필드가 같은 값을 가지는지(동등) 확인할 수 있다.
> 일반적으로 hash값을 먼저 비교하여 시간을 단축한 후 필드 값을 비교해나가는 방식을 취한다.

![[content/Java/Class/assets/equals_hash.png]]
```Java
@Override  
public boolean equals(Object o) {  
    if (this == o) return true;  
    if (o == null || getClass() != o.getClass()) return false;  
    BookDTO bookDTO = (BookDTO) o;  
    return price == bookDTO.price && Objects.equals(title, bookDTO.title) && Objects.equals(author, bookDTO.author);  
}
```


#### 2. Object.hashCode()
> 객체를 식별하는 값.

1. Object.hashCode(): 객체의 메모리값을 이용
2. @hashCode(): 오버라이딩을 통해 필드값을 기준으로 해시코드 생성
3. @hashCode(): 동등객체 비교를 위한 재정의시 메모리 주소와는 상관 없다.
##### @hashCode()

```Java
@Override  
public int hashCode() {  
    return Objects.hash(title, author, price); 
}
```
#### 3. Object.toString()
> 인스턴스의 정보를 문자열로 반환하는 메소드 <br/>
> Object.toString()은 `클래스 이름`@`인스턴스주소` 를 반환한다.

##### @toString()
> Object의 toString()을 오버라이드하여 인스턴스 안의 값을 확인할 수 있다.



