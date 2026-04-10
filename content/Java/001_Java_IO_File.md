---
title: java.io.File은 디스크 파일인가 메모리 파일인가
type: question
tags: [java, file, io, input_stream, filesystem]
draft: false
---

## 질문

`java.io.File`은 디스크에 저장된 파일을 의미하는가?

## 답변

`java.io.File`은 디스크 상의 파일 또는 디렉토리 **경로를 가리키는 참조 객체**다.

```java
File file = new File("/tmp/test.txt");

file.getAbsolutePath()  // → 경로 문자열
file.exists()           // → 실제 존재 여부
file.length()           // → 바이트 크기
```

`File` 객체를 생성한다고 실제 파일이 만들어지는 것은 아니다. 경로만 들고 있는 객체이며, 실제 파일 존재 여부는 `exists()`로 확인해야 한다.

## File vs InputStream vs byte[]

| 구분 | 설명 |
|------|------|
| `java.io.File` | 디스크 파일/디렉토리의 **경로 참조** |
| `InputStream` | 파일 **내용을 읽는** 스트림 |
| `byte[]` | 파일 내용이 **메모리에 올라간** 상태 |

## 절대경로는 어디 기준인가

`file.getAbsolutePath()`는 **JVM이 실행 중인 머신의 로컬 파일 시스템** 경로다.

- 로컬 개발 → `/Users/<username>/...`
- 베타/프로덕션 서버 → `/tmp/armeria-xxxx.tmp` (해당 서버의 디스크)

각 서버의 파일 시스템 안에서의 경로이며, 다른 서버에서는 접근할 수 없다.

## 관련 문서
- [[IO|Java IO]]
- [[Scanner]]
