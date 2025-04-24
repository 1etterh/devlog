---
tags:
  - java
  - API
  - time
---

> 기존 Date의 문제점을 개선한 시간 자료형 패키지

#### Date 대비 개선점

1. TimeZone과 관련된 기능이 추가되었다.
2. 윤년 관련 기능이 내부적으로 추가되었다.
3. 날짜 및 시간 필드 개념을 추가해 메소드 수를 줄였다.

### Syntax

```Java
Calendar calendar = Calendar.getInstance();
System.out.println("calendar = " + calendar); // calendar = java.util.GregorianCalendar[time=1721474680734,ar ...이하 생략
```

> Calendar의 생성자는 protected 이므로 instanceOf를 통해 객체를 생성할 수 있다. 일반적으로 Calendar을 상속받은 GregorianCalendar 객체가 반환된다.

##### MONTH

> 0~11

##### 사용자 지정 날짜

```Java
Calendar today = new GregorianCalendar(2024, 7, 20, 20, 35, 0);
System.out.println("today : " + today); // today : java.util.GregorianCalendar[time... 이하 생략
```

##### Simple Data Format

> Calendar 객체도 Simple Data Format 을 활용하여 출력할 수 있다.

```Java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
String todayString = sdf.format(today.getTimeInMillis());
System.out.println("today : " + todayString); // today : 2024/08/20 20:35:00
```
