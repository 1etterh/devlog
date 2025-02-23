# 담당
## 도메인
1. Project, Workspace, Cardboard, Card, Project Member(내부 도메인)
2. GitHub App Installation(외부 도메인)

## 프로젝트 기반
1. Backend 개발 전반에 사용할 ResponseDTO, Global Exception Handler 작성
2. Frontend 개발 전반에 사용할 전역 css, 프로젝트 세팅 작성
3. DDD 기반 ERD 설계

## 구현 기능
### 1. [[Github App 설치|GitHub App Installation]]
1. 보안을 위해 Backend Server에 Secret Key를 저장한 후 필요한 경우에 한하여 Installation Token 발급
2. Installation Id가 노출되지 않도록 Client에는 Installation index 전송
### 2. Project - User
1. M:N 관계를 가진 Domain 처리
2. 중간 테이블(ProjectMember)을 생성하여 M:N 관계를 표시하고 참여 상태 저장
3. Project에 관련된 요청은 ProjMember 서비스를 거친 후 ProjService에 도달
### 3. [[Syncday Security|Security]]
1. JWT 구현을 통해 AccessToken, Refresh 토큰 검증
2. SecurityProperties 클래스를 통해 보안에 관련된 설정 관리


# 기술 스택

| **기술**          | **활용**                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spring Boot     | 1. RestController를 통한 Rest API 구현<br>    <br>2. 도메인 기반의 계층형 아키텍처 적용<br>    <br>    1. Application Layer: 사용자 요청 처리<br>        <br>    2. Domain Layer: 핵심 비즈니스 로직 처리<br>        <br>    3. Infrastructure Layer: 외부 시스템 통합<br>        <br>3. CQRS 패턴을 통한 데이터 처리<br>    <br>    1. Command (JPA): 데이터 변경 작업<br>        <br>    2. Query (MyBatis): 데이터 변경 없는 단순 조회                                                                |
| Spring Data JPA | 1. 계층별 Aggregate 분리를 통해 데이터 유효성 검증<br>    <br>2. ORM을 통한 객체 지향적 데이터 관리                                                                                                                                                                                                                                                                                                                                                           |
| MyBatis         | 1. Dynamic Query를 통해 복잡한 조회 요구사항 처리<br>    <br>2. XML Mapper와 Mapper Interface를 분리하여 가독성 확보 및 namespace 중복 방지                                                                                                                                                                                                                                                                                                                    |
| GitHub API      | 1. Backend: OAuth2기반 인증 관리<br>    <br>    1. Secret Key를 Backend에 저장 후 Frontend가 요청한 경우에 한하여 Access Token 발급<br>        <br>    2. Installation Id 보호를 위해 Client에는 Installation의 순서 반환<br>        <br>2. Frontend: GitHub 데이터 요청<br>    <br>    1. 사용자의 요청에 따라 필요한 경우에 한하여 Backend에 Token을 요청하고 반환된 Token은 State 변수로 관리하여 CSRF 방지<br>        <br>    2. Github API 공식 라이브러리인Oktokit과 GraphQL을 활용하여 데이터 요청의 안정성과 효율성 향상           |
| Vue.js          | 1. 아키텍처: 3계층 구조<br>    <br>    1. Views Layer: UI 컴포넌트<br>        <br>    2. Store Layer: State 관리<br>        <br>    3. API Layer: 외부 API와 통신<br>        <br>2. 플러그인 모듈화<br>    <br>    1. plugins 디렉토리를 통해 플러그인 설정 분리<br>        <br>    2. main.js에서 통합 import<br>        <br>3. 라우터 모듈화<br>    <br>    1. 도메인별 독립적인 router 파일 구성<br>        <br>    2. Index.js에서 도메인 router import<br>        <br>4. 반응형 레이아웃: Prime Vue 활용 |
