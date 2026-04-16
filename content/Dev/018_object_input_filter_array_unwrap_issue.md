---
title: ObjectInputFilter에서 List.of 역직렬화가 REJECT 되는 이슈
type: error
tags: [error, java, serialization, object_input_filter, deserialization]
draft: true
---

## 증상

배포 시스템에서 멀티파트로 업로드된 `deploy.dat`(ObjectOutputStream으로 직렬화된 DTO)를 역직렬화하는 과정에서 아래 예외가 발생했다.

```
java.io.InvalidClassException: filter status: REJECTED
    at java.io.ObjectInputStream.filterCheck(ObjectInputStream.java:1409)
    at java.io.ObjectInputStream.checkArray(ObjectInputStream.java:1438)
    at java.util.CollSer.readObject(ImmutableCollections.java:1439)
    at java.io.ObjectStreamClass.invokeReadObject(...)
    at java.io.ObjectInputStream.readSerialData(...)
    at java.io.ObjectInputStream.readOrdinaryObject(...)
```

## 배경 코드

JEP 290 ObjectInputFilter를 문자열 패턴으로 구성해 DTO만 허용하고 나머지는 차단하는 구조였다.

```java
private static final String UPLOAD_DATA_FILTER =
    "com.example.dto.*;java.util.*;!*";

try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(datFile))) {
    ois.setObjectInputFilter(
        ObjectInputFilter.Config.createFilter(UPLOAD_DATA_FILTER));
    uploadDto = (UploadDto) ois.readObject();
}
```

DTO는 `List<UserDto>` 필드를 가지고 있고, 테스트용 생성기에서 `List.of(...)`로 리스트를 만들었다.

## 원인 분석

### 1차 원인 — `java.lang.*` 미허용

`!*` 는 "나머지 전부 REJECT" 를 의미한다. 허용 목록에 `java.lang.*`이 없기 때문에 `java.lang.Long`, `java.lang.String` 같은 기본 클래스가 차단된다.

### 2차 원인 — `List.of()`의 내부 직렬화 프록시

`List.of(...)`로 만든 리스트는 직렬화 시 `java.util.CollSer`라는 프록시 객체를 통해 쓰여진다. `CollSer.readObject`는 내부에 요소들을 담은 **`Object[]`** 를 먼저 읽는데, 이때 `ObjectInputStream.checkArray`가 호출된다.

여기서 필터는 배열 클래스 자체(`[Ljava.lang.Object;`)를 `serialClass`로 받는다. 문자열 패턴은 이 이름을 매칭할 수 없고, `allowFilter`의 predicate 기반 구성도 배열을 **자동으로 언래핑하지 않는다**.

```mermaid
sequenceDiagram
    participant OIS as ObjectInputStream
    participant CollSer
    participant Filter as ObjectInputFilter

    OIS->>CollSer: readObject()
    CollSer->>OIS: read Object[]
    OIS->>Filter: checkArray([Ljava.lang.Object;, length)
    Filter-->>OIS: REJECTED
    OIS-->>CollSer: InvalidClassException
```

## 해결

문자열 패턴을 버리고 `ObjectInputFilter.allowFilter`를 프로그래매틱으로 구성하되, predicate 내부에서 배열을 직접 언래핑한다.

```java
private static final ObjectInputFilter UPLOAD_DATA_FILTER = ObjectInputFilter.allowFilter(
    isAllowedClass("com.example.dto.", "java.util.", "java.lang."),
    ObjectInputFilter.Status.REJECTED);

private static final ObjectInputFilter TEMP_DATA_FILTER = ObjectInputFilter.allowFilter(
    isAllowedClass("com.example.dto.", "java.util.", "java.lang.", "java.time."),
    ObjectInputFilter.Status.REJECTED);

private static Predicate<Class<?>> isAllowedClass(String... prefixes) {
    return cls -> {
        Class<?> base = cls;
        while (base.isArray()) base = base.getComponentType();
        if (base.isPrimitive()) return true;
        String name = base.getName();
        for (String p : prefixes) {
            if (name.startsWith(p)) return true;
        }
        return false;
    };
}
```

### 포인트

- `while (base.isArray()) base = base.getComponentType();` — 다차원 배열까지 대응
- `base.isPrimitive()` — `byte[]` 같은 기본형 배열의 component는 `byte.class`이므로 명시적으로 통과
- prefix 기반이라 서브패키지까지 자연스럽게 포함(`java.util.ImmutableCollections$ListN` 등)

## 확인 지점 — 왜 String은 통과됐는가

`java.lang.String`은 `ObjectInputStream`이 `TC_STRING` 태그를 통해 특수 처리하고, 일반 클래스 디스크립터 경로를 거치지 않는 경우가 많다. 그래서 필터에 `java.lang.*`이 없어도 문자열은 겉으로는 문제를 일으키지 않는 것처럼 보인다. 하지만 `Long`, `Object[]`, 기타 boxed 타입은 정상 경로를 타기 때문에 필터에서 걸린다.

## 교훈

- JEP 290 필터에서 `!*`로 엄격 차단할 때는 `java.lang.*`, `java.util.*`, 배열 component 처리를 반드시 같이 설계해야 한다.
- 문자열 패턴(`createFilter`)은 배열/모듈을 표현하기 어색하므로, 조건이 조금만 복잡해져도 **프로그래매틱 `allowFilter`** 가 훨씬 안전하고 가독성 좋다.
- `allowFilter`가 배열을 언래핑해 줄 것이라는 기대는 버리고 predicate 내부에서 직접 처리한다.
- 테스트 시 `List.of(...)`, `Map.of(...)` 같이 프록시가 끼어드는 컬렉션은 일반 `ArrayList`와 직렬화 경로가 다르다는 점을 기억한다.
