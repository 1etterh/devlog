---
tags:
  - java
  - API
  - time
---
> java에서 가장 최근에 나온 time package

### Syntax

#### 1. Local Time

```Java
LocalTime timeNow = LocalTime.now();  
System.out.println(timeNow);  // 20:40:00.385581400
LocalTime timeNow2 = LocalTime.of(18,30,20);  
System.out.println(timeNow2); // 18:30:20
```

#### 2. Local Date
```Java
LocalDate dateNow = LocalDate.now();  
LocalDate dateOf = LocalDate.of(2024,7,19);  
System.out.println("dateNow = " + dateNow);  // dateNow = 2024-07-20
System.out.println("dateOf = " + dateOf);  // dateOf = 2024-07-19
```

#### 3. Local Date Time
```Java
LocalDateTime dateTimeNow = LocalDateTime.now();  
LocalDateTime dateTimeOf = LocalDateTime.of(dateNow,timeNow);  
System.out.println("dateTimeNow = " + dateTimeNow);  // dateTimeNow = 2024-07-20T20:40:00.410513800
System.out.println("dateTimeOf = " + dateTimeOf);  // dateTimeOf = 2024-07-20T20:40:00.385581400
```

#### 4. Zoned Date Time
```Java
ZonedDateTime zonedDateTime = ZonedDateTime.now();  
ZonedDateTime zonedDateTimeOf = ZonedDateTime.of(dateOf, timeNow2, ZoneId.of("Asia/Seoul"));  
System.out.println("zonedDateTime = " + zonedDateTime);   // zonedDateTimeNow = 2024-07-20T20:40:00.412504900+09:00[Asia/Seoul]
System.out.println("zonedDateTimeOf = " + zonedDateTimeOf);  // zonedDateTimeOf = 2024-07-19T18:30:20+09:00[Asia/Seoul]

ZonedDateTime zonedDateTime = ZonedDateTime.now();  
System.out.println("zonedDateTime = " + zonedDateTime);  
System.out.println("zone : " + zonedDateTime.getZone());  // zone : Asia/Seoul
System.out.println("시차 : " + zonedDateTime.getOffset()); // 시차 : +09:00
```




### Immutable
> Time 클래스는 불변객체이므로 값을 변경하면 새 객체가 생성되어 주소값이 바뀐다.

```Java
LocalDateTime localDateTime = LocalDateTime.now();  
System.out.println();  
System.out.println("localDateTime : " + localDateTime);  // localDateTime : 2024-07-20T20:46:52.406720100
System.out.println("address : " + System.identityHashCode(localDateTime));  // address : 989110044
  
LocalDateTime localDateTime2 = localDateTime.plusMinutes(30);  
System.out.println("30분 후 : " + localDateTime2);  // 30분 후 : 2024-07-20T21:16:52.406720100
System.out.println("hashCode : " + System.identityHashCode(localDateTime2)); // 주소값 : 1044036744
```

### Compare
> Time 클래스는 **같은 자료형**의 객체끼리 시간을 비교할 수 있다.

```Java 
LocalDate localDate = LocalDate.now();  
LocalDateTime localDateTime = LocalDateTime.now();  
ZonedDateTime zonedDateTime = ZonedDateTime.now();  
  
LocalDate past = LocalDate.of(2022,11,11);  
LocalDateTime future = LocalDateTime.of(2025,1,3,15,20,30);  
ZonedDateTime now = ZonedDateTime.now();  

System.out.println(localDate.isAfter(past));  // true
System.out.println(localDateTime.isBefore(future));  // true
System.out.println(zonedDateTime.isEqual(now));  // true
```


### Format

##### default pattern
> Time 패키지가 자동으로 인식할 수 있는 패턴

```Java
String timeNow = "14:05:10";  
String dateNow = "2022-10-12";  
  
LocalTime localTime = LocalTime.parse(timeNow);  
LocalDate localDate = LocalDate.parse(dateNow);  
LocalDateTime localDateTime = LocalDateTime.parse(dateNow + "T" + timeNow);  

System.out.println("localDate = " + localDate);  //localDate = 2022-10-12
System.out.println("localTime = " + localTime);  //localTime = 14:05:10
System.out.println("localDateTime = " + localDateTime); // localDateTime = 2022-10-12T14:05:10
```


#### Date Time Formatter
##### 1. parsing
> 사용자가 Time Package에 인식시킬 패턴을 지정한다. <br/>
> 아래와 같이 연도가 두자리 수로 입력되면 0~49는 2000년대, 50~99는 1900년대로 인식한다.
```Java
String timeNow2 = "14-05-10";  
String dateNow2 = "221005";
LocalTime localTime2 = LocalTime.parse(timeNow2, DateTimeFormatter.ofPattern("HH-mm-ss"));  
LocalDate localDate2 = LocalDate.parse(dateNow2, DateTimeFormatter.ofPattern("yyMMdd"));  
System.out.println("localDate2 = " + localDate2);  // localDate2 = 2022-10-05
System.out.println("localTime2 = " + localTime2); // localTime2 = 14:05:10
```

##### 2. ofPattern()
> Time 패키지의 날짜 및 시간을 원하는 문자열로 반환
```Java
String dateFormat = localDate2.format(DateTimeFormatter.ofPattern("yyyy.MM.dd")); 
String timeFormat = localTime2.format(DateTimeFormatter.ofPattern("HH:mm"));  

System.out.println("dateFormat = " + dateFormat);  // dateFormat = 2022.10.05
System.out.println("timeFormat = " + timeFormat);  // timeFormat = 14:05
```

