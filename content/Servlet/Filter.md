---
tags:
  - java
  - servlet
draft: true
---
> req, res의 전, 후처리 담당

# filter vs servlet
##### 공통점
1. Servlet Container가 관리함
2. req, res를 다른 객체에 토스함
##### 차이점
1. servlet은 Business Logic을 처리하거나 기능을 가짐
2. servlet은 클래스임
3. filter는 servlet의 전후 처리를 함
4. filter는 인터페이스임
5. filter는 체이닝을 함

