---
tags:
  - java
  - servlet
draft: false
---
> 자바의 동적 웹 페이지 생성 기술

![[Servlet/assets/Servlet_00.png]]


## Settings
#### 1. 프로젝트 생성
1. Generators: Jakarta EE
2. Template: Web Application
3. Build: Gradle
![[Servlet/assets/Servlet_01.png]]

#### 2. 프로젝트 세팅
1. Edit Configurations
2. VM options: `-Dfile.encoding=UTF-8`
3. Deployment: Application context 수정(Context Root)
![[Servlet/assets/Servlet_02.png]]
## Terms

#### [[HTTP]]
> Hypertext Transfer Protocol
> Web에서 데이터를 주고받는 서버-클라이언트 모델 프로토콜
#### WAS
> Web Application Server
#### [[JSP]]
> 동적 웹 페이지 생성을 단순화하는 기술

#### [[Tomcat]]
> Servlet을 관리하는 컨테이너

#### [[LifeCycle]]
> Servlet의 생성과 소멸 사이에 실행되는 함수들의 순서

#### [[Forward]]

#### [[Redirect]]

#### [[Filter]]
> Container가 관리함

## 관련 문서
- [[Spring Framework|Spring Framework]] - Servlet 기반의 웹 프레임워크
- [[000_HTTP 개요|HTTP 개요]] - 웹 통신 프로토콜
- [[HTTPS|HTTPS]] - HTTP의 암호화 버전
- [[OSI 7 Layer|OSI 7 Layer]] - 네트워크 계층 모델 (Application Layer)
- [[RequestMapping|Spring RequestMapping]] - Spring MVC의 요청 매핑
