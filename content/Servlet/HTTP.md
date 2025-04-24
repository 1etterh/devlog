---
tags:
  - http
  - servlet
draft: true
---
> Hypertext Transfer Protocol

# 특징
#### 1. state less(무상태성)
> servlet간의 연결이 없음

#### 2. connect less(무연결성)
> 응답이 완료되면 클라이언트와 서버의 연결이 끊어짐


# Session & Cookie
> Http 연결의 비 연결성, 비 상태성을 해결하기 위한 방법

|         | class/interface | 위치 (브라우저 vs 서버) | 생성 시점            | 소멸 시점                   |
| ------- | --------------- | --------------- | ---------------- | ----------------------- |
| servlet | HttpServlet     | 서버              | 요청 시, 컨테이너에 의해   | 응답을 완료하면                |
| filter  | Filter          | 서버              | 요청 시, 컨테이너에 의해   | 응답을 완료하면                |
| session | HttpSession     | 서버              | 클라이언트가 최초 요청 시   | 클라이언트가 종료되거나, 세션 만료 시   |
| cookie  | Cookie          | 브라우저            | 서버가 클라이언트에 전송할 때 | 설정된 만료 기간이 지나면 또는 삭제될 때 |
