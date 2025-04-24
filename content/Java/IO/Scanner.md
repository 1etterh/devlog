---
tags:
  - java
---
# Scanner 종류


#### next()
1. 공백 또는 개행문자를 취급하지 않고 그 전까지만 버퍼에서 가져옴
2. 공백으로 구분된 값을 입력받을 때 사용가능

#### nextLine()
1. nextLline(): 공백이나 스페이스를 모두 입력으로 받음
2. 버퍼에 있는 개행(Enter)를 처리할 수 있음
3. nextLine()이 아닌 Scanner 메소드를 활용하다 nextLine()을 쓰면 nextLine()을 통해 버퍼의 `\n`을 처리해야함.


#### char
1. Scanner 클래스에 nextChar은 없음
2. 대신 sc.next().charAt(0)로 받음

```Java
/* 목차 5. 문자형 입력받기 - nextChar은 없다...  */  
System.out.println("아무 문자나 하나만 입력하세요");  
				
				//메소드 체이닝 - 메소드 뒤에 계속 이어서 메소드를 적용가능
char answer = sc.next().charAt(0);          // 피카츄  
System.out.println("answer = " + answer);   //피
```



