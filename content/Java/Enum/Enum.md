---
tags:
  - java
  - enum
  - datatype
---
> 관련있는 상수 집합(ex. 요일, 알파벳, ...)
# enum의 장점
1. 싱글톤 인스턴스
2. 동일비교 ㅇ
3. name(), toString() 사용 가능
4. enumSet()
5. 타입 안정성 보장
### Syntax

_WeekDay.java_

```Java
public enum WeekDay {  
/* enum 적인 성질 */
    SUN,  
    MON,  
    TUE,  
    WED,
    THU,
    FRI,
    SAT;  
  
    /* Class적인 성질 */  
    public String getNameToLowerCase(){  
        return this.name().toLowerCase();  
    }  
}
```

_Application.java_
```Java
public class Application {
public static void main(String[] args){

// 0부터 시작하는 인덱싱 체계
System.out.println(WeekDay.FRI.ordinal());

// toString(), name() 사용 가능
System.out.println(WeekDay.FRI.name()); //FRI
System.out.println(WeekDay.FRI.toString()); //FRI

// Singleton이라 같은 enum은 동일 객체임
WeekDay wd1 = WeekDay.FRI;
WeekDay wd2 = WeekDay.FRI;

System.out.println(WeekDay.FRI.getNameToLowerCase()); //fri

// EnumSet<Enum>
EnumSet<WeekDay> weekDays = EnumSet.allOf(WeekDay.class);
Iterator<WeekDay> iterator = weekDays.iterator();
while(iterator.hasNext()){
WeekDay day = iterator.next();
System.out.println(day); 
}

// values()
WeekDay[] weekDays = WeekDay.values();
for(WeekDay day : weekDays){
System.out.println(day.name());
System.out.println(day.ordinal());
		}
	}
}
```


### Singleton
> Enum 사용시 선언해둔 enum의 수만큼 생성자가 호출됨