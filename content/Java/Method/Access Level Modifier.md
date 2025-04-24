---
tags:
  - class
  - java
  - overriding
---
> 접근 가능한 범위 (public, protected, default, private)


# 접근제어자 종류
1. public : 어디서나 접근 가능
2. protected : 상속관계이거나 같은 패키지에서 접근 가능
3. default : 같은 패키지에서만 접근 가능
4. private : 같은 클래스 내부에서만 접근 가능




## Class 접근제어자
1. final : 상속 불가(더이상 자식 클래스를 생성하지 않음)
2. private

## Method 접근제어자
> 4가지 모두 사용 가능

## 비교

| Modifier  | Class | Package | Subclass | World |
| --------- | ----- | ------- | -------- | ----- |
| public    | Y     | Y       | Y        | Y     |
| protected | Y     | Y       | Y        | N     |
| `(blank)` | Y     | Y       | N        | N     |
| private   | Y     | N       | N        | N     |

![[content/JAVA/Method/assets/access_level.png]]

###### references:
> [**_docs.oracle.com_**](https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html)
