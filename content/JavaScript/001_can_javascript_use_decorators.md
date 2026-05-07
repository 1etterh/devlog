---
title: JavaScript도 decorator로 어노테이션처럼 동작을 부여할 수 있을까?
type: question
tags: [question, javascript, decorator, typescript, tc39, annotation]
draft: false
---

## 의문

Java에는 `@Override`, `@Transactional` 같은 어노테이션이 있다. 단순 메타데이터부터 트랜잭션 시작/종료 같은 실행 흐름 변경까지 다양하게 쓰인다. **JavaScript에도 비슷하게 `@무엇`을 붙여서 메서드나 클래스 동작을 바꿀 수 있을까?**

## 답

가능하다. JavaScript에도 **decorator**라는 기능이 있고, `@`로 클래스·메서드·필드 등에 붙여 동작을 변형하거나 메타데이터를 부여할 수 있다. 다만 두 가지 주의할 점이 있다.

1. **두 종류의 decorator가 공존한다** — 오래된 TypeScript `experimentalDecorators` 방식과, TC39 Stage 3로 표준화된 modern decorator 방식. 시그니처가 달라 호환되지 않으며 프로젝트당 하나만 선택해야 한다.
2. **순수 메타데이터(어노테이션)** 같은 개념은 일급 시민이 아니다. JS decorator는 본질적으로 **함수**이며, 클래스가 정의될 때 호출되어 능동적으로 변형한다. "그냥 메타데이터만 붙이고 싶다"면 별도 metadata proposal을 함께 써야 한다.

## 두 종류의 decorator 비교

| 구분 | Legacy (Experimental) | Stage 3 (Modern) |
|---|---|---|
| 출처 | TypeScript `experimentalDecorators` 옵션 | TC39 표준 제안 (Stage 3) |
| 활성 사용처 | Angular, NestJS, TypeORM, class-validator, MobX | TypeScript 5.0+, Babel 7.x 신규 코드 |
| 시그니처 | `(target, key, descriptor) => any` | `(value, context) => any` |
| 메타데이터 | `reflect-metadata` 라이브러리 의존 | TC39 decorator metadata 별도 proposal |
| 파라미터 데코레이터 | 지원 (`@Inject` 등) | 미지원 (별도 proposal) |
| 함수 데코레이터 | 미지원 | 미지원 (별도 proposal) |

호환되지 않으므로, Angular/NestJS 생태계로 가면 legacy를 쓰고, 새 라이브러리는 Stage 3로 작성하는 흐름이다.

## 적용 가능한 위치 (Stage 3 기준)

| 대상 | 지원 | 비고 |
|---|:---:|---|
| class | ✅ | 클래스 전체를 wrap/replace |
| method | ✅ | 메서드를 wrap/replace |
| getter / setter | ✅ | 접근자에 적용 |
| field | ✅ | 필드 초기값을 후처리 |
| `accessor` field | ✅ | get/set 자동 생성 + 데코레이트 |
| 일반 함수 | ❌ | 별도 proposal로 분리됨 |
| 파라미터 | ❌ | 별도 proposal |

`@deco`는 **클래스 멤버에만** 붙는다. 일반 함수에는 못 붙이고, 파라미터에도 못 붙는다 (Angular의 `@Inject(...) param` 같은 문법은 legacy 한정).

## 무엇을 할 수 있는가

- **메서드 wrapping** — 로깅, 권한 체크, 캐싱, 트랜잭션 같은 AOP 패턴
- **클래스 변환** — mixin 적용, 컴포넌트 registry에 자동 등록
- **메타데이터 부여** — DI 컨테이너, ORM의 `@Column`, validation의 `@IsEmail` 등이 쓰는 패턴
- **필드 초기화 후처리** — observable화, 반응형 변환

## Java annotation과의 본질적 차이

| 측면 | Java annotation | JS decorator |
|---|---|---|
| 본질 | 메타데이터 (선언적) | 함수 (능동적 변형) |
| 적용 시점 | 컴파일 타임에 메타로 박혀 reflection으로 읽음 | 클래스 정의 평가 시점에 즉시 호출 |
| "그냥 태그만 달기" | annotation 자체로 가능 | decorator 함수 안에서 metadata API 따로 호출 |
| 파라미터 적용 | 가능 (`@RequestParam` 등) | Stage 3에선 불가 (legacy만 가능) |

그래서 Java처럼 "어노테이션이 곧 메타데이터"라는 모델을 JS에서 그대로 쓰려면, decorator + decorator metadata proposal 또는 `reflect-metadata`를 함께 묶는 식으로 흉내낸다.

## 정리

- JS에도 decorator가 있고 클래스 멤버에 `@`로 붙일 수 있다
- 단, **legacy(TS 옵션)** 와 **Stage 3(표준)** 두 갈래가 공존하고 시그니처가 다르다
- 일반 함수와 파라미터에는 (아직) 못 붙는다
- "선언만 하면 끝"인 Java 어노테이션 감성이 아니라, **함수가 호출되어 클래스를 변형한다**는 모델이다
