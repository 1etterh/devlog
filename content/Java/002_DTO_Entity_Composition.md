---
title: DTO에 Entity 객체를 포함하는 구조 설계
type: question
tags: [Java, DTO, Entity, Composition, Spring]
draft: true
---

## DTO에 Entity를 포함하는 패턴

DTO(Data Transfer Object)에 단순 필드(String, Long 등) 대신 Entity 객체 자체를 포함시키는 구조가 있다.

### 변경 전

```java
@Data
public class UserFileDto {
    private String userId;
    private String fileKey;
    private AmspMultipart file;
}
```

### 변경 후

```java
@Data
public class UserFileDto {
    private User user;
    private Attach attach;
    private String fileKey;
    private AmspMultipart file;
}
```

## 언제 사용하는가

- **Entity의 여러 필드가 필요할 때**: userId만이 아니라 User의 type, serviceId 등 다양한 정보가 함께 필요한 경우
- **연관 Entity를 함께 전달할 때**: User와 Attach 정보를 한 DTO로 묶어서 서비스 레이어로 전달
- **중복 필드 방지**: Entity의 필드를 DTO에 하나씩 펼치면 중복이 발생하고 유지보수가 어려워짐

## 주의사항

- **null 체크**: Entity가 null일 수 있으므로 접근 시 null-safe 처리 필요
  ```java
  dto.getUser() != null ? dto.getUser().getId() : null
  ```
- **순환 참조**: Jackson 직렬화 시 Entity 간 양방향 관계가 있으면 `@JsonIgnore` 등으로 처리
- **레이어 분리**: Controller → Service 전달용 DTO에는 Entity를 넣어도 되지만, API 응답용 DTO에는 필요한 필드만 노출하는 것이 권장됨
