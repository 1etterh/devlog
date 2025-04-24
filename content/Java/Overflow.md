---
tags:
  - java
---
> 자료가 저장할 수 있는 값의 범위를 벗어나는 경우 발생한 Carry를 버림처리하고 sign bit를 반전시켜 최소값으로 순환하는 현상(Runtime Error) <br/>
> 반대말은 Underflow

```Java
byte num1 = 126;  
                         
//기존의 num1 변수에 있던 값에 1을 더해 다시 대입한다. ++이 효율이 조금 더 좋음  
num1++;        
System.out.println("num1 = " + num1);   //127  
num1++;  
System.out.println("num1 = " + num1);   // -128  
num1++;  
System.out.println("num1 = " + num1);   // -127  
  
  
/* 설명 - 언더플로우 */  
System.out.println();  
num1--;  
System.out.println("num1 = " + num1);   //-128  
num1--;  
System.out.println("num1 = " + num1);   //127  
num1--;  
System.out.println("num1 = " + num1);   //126
```
