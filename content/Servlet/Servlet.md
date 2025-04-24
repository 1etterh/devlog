---
tags:
  - java
  - servlet
draft: false
---
> 자바의 동적 웹 페이지 생성 기술

![[content/Servlet/assets/Servlet_00.png]]


## Settings
#### 1. 프로젝트 생성
1. Generators: Jakarta EE
2. Template: Web Application
3. Build: Gradle
![[content/Servlet/assets/Servlet_01.png]]

#### 2. 프로젝트 세팅
1. Edit Configurations
2. VM options: `-Dfile.encoding=UTF-8`
3. Deployment: Application context 수정(Context Root)
![[content/Servlet/assets/Servlet_02.png]]
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
