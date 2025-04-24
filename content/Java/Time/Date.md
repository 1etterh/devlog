---
tags:
  - java
  - API
  - time
---
> 컴퓨터 시스템의 시간을 가진 인스턴스를 생성한다. (deprecated)

#### 특징
1. 자바에서 가장 처음 제공된 시간 관련 API이다.
2. 그리니치 천문대 기준 1970년 1월 1일 00시 00분을 시작점으로 한다.
3. 서울과의 시차로 인해 서울은 1970년 1월 1일 9시 00분이 시작점이다.

### Syntax
```Java
java.util.Date today = new java.util.Date(); // 컴퓨터 시스템 시간을 가진 객체 생성

// long type 시간: 1721472028988
System.out.println("long type 시간: " + today.getTime()); 

// longtype 시간을 활용한 Date : Thu Jan 01 09:00:00 KST 1970
System.out.println("longtype 시간을 활용한 Date : " + new java.util.Date(0L));

// 현재시간 활용한 Date: Sat Jul 20 19:40:28 KST 2024
System.out.println("현재시간 활용한 Date: " + new java.util.Date(today.getTime()));
```

#### Simple Data Format
> 사용자가 원하는 format형태로 시간을 변형할 수 있다.

```Java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy년 M월 dd일 HH:mm:ss E요일");  
String todayFormat = sdf.format(today); // 매개변수 : Date

// todayFormat = 2024년 7월 20일 19:40:28 토요일
System.out.println("todayFormat = " + todayFormat);
```
### java.sql.Date

```Java
/* java.util.Date - > java.sql.Date (Down Casting) */
java.util.Date today2 = new java.util.Date();  
java.sql.Date sqlDate = new java.sql.Date(today2.getTime());      

System.out.println("today2 : " + today2);// today2 : Sat Jul 20 19:40:29 KST 2024
System.out.println("sqlDate : " + sqlDate); // sqlDate : 2024-07-20


/* java.sql.Date -> java.util.Date (Up Casting) */  
java.util.Date utilDate = sqlDate;  
System.out.println("utilDate : " + utilDate); // utilDate : 2024-07-20
```