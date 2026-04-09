---
tags:
  - http
  - web
draft: true
description: 
title:
---
> Hyper Text Transfer Protocol

# HTTP
> HTML과 같은 하이퍼미디어 전송을 위한 Application 계층 프로토콜

### 1. HTTP 특징
#### state less(무상태성)
> 서버가 클라이언트의 상태를 보존하지 않음

#### connect less(무연결성)
> 응답이 완료되면 클라이언트와 서버의 연결이 끊어짐

### 2. Session & Cookie
> Http 연결의 비 연결성, 비 상태성을 해결하기 위한 방법

|         | class/interface | 위치 (브라우저 vs 서버) | 생성 시점            | 소멸 시점                   |
| ------- | --------------- | --------------- | ---------------- | ----------------------- |
| servlet | HttpServlet     | 서버              | 요청 시, 컨테이너에 의해   | 응답을 완료하면                |
| filter  | Filter          | 서버              | 요청 시, 컨테이너에 의해   | 응답을 완료하면                |
| session | HttpSession     | 서버              | 클라이언트가 최초 요청 시   | 클라이언트가 종료되거나, 세션 만료 시   |
| cookie  | Cookie          | 브라우저            | 서버가 클라이언트에 전송할 때 | 설정된 만료 기간이 지나면 또는 삭제될 때 |

### 3. Http Request, Response
#### 1. Request
> Client(브라우저)에 의해 전송되는 메시지
#### 2. Response
>Request에 대한 서버의 응답

### 4. [HTTP 진화 과정](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Evolution_of_HTTP)

![[Pasted image 20250410153933.png]]

#### 1. HTTP/1.0
1. 각 요청/응답에 대해 별도의 TCP 연결
2. 여러 요청을 연속해서 보내는 경우 단일 TCP 연결을 공유하는 것보다 비효율적임
#### 2. HTTP/1.1
> 1.0의 비효율성 개선을 위해 파이프라이닝/지속적인 연결 개념 도입

#### 3. HTTP/2
> 단일 연결 상에서 메시지 다중 전송(multiplex) 기능 추가

## 관련 문서
- [[HTTPS|HTTPS]] - HTTP의 암호화 버전
- [[Servlet|Servlet]] - HTTP 기반 Java 동적 웹 기술
- [[OSI 7 Layer|OSI 7 Layer]] - HTTP가 위치하는 네트워크 계층 모델
- [[HTTP|Servlet HTTP]] - Servlet에서의 HTTP 처리
- [[Spring Framework|Spring Framework]] - HTTP 요청을 처리하는 프레임워크

# References

1. [MDN Guides - Http Overview](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Overview)