# 개발 Tool, Framework

1. 기획 및 일정관리 : Jira 활용
    1. Confluence에 작성한 DDD를 Jira의 작업목록과 연결하여 개발과 기획을 동기화
    2. 개발 일정 관리 기능에 대한 이해도 향상
2. 형상 관리: GitLab 활용
    1. GitLab의 Elastic Search를 활용 및 개발
    2. 개발 일정관리 기능에 대한 이해도 향
3. 백엔드: Java + Kotlin(일부) / Spring Boot
    1. 기존에 Java로만 프로젝트를 진행할 때 가장 힘들었던 부분이 VCS 연동이었는데, 관련 데이터를 저장하는 VO에 새로운 속성이 추가되거나 삭제되는 일이 잦았기 때문이다.
    2. 이를 해결하기 위해 Kotlin을 도입하여 유연하게 Data를 관리하고자 한다.
        
4. 프론트엔드: Vue.js
    1. 기존 프로젝트에서 사용하였고, 이미 구조화가 잘 되어있음
        

## 기획

1. 디자인 방식: DDD 설계
    1. 도메인간의 관계 및 이벤트 종류 파악
    2. Confluence의 whiteboard 기능을 함께 활용하면 구현과 기획의 일치율을 증가시킬 수 있음
2. ERP 요소 제거: 꾸준히 사용 및 리펙토링을 해보기 위해 ERP적인 요소를 제거하고 직접 프로젝트를 사용해볼 생각이다.

## 구현

기존의 구현 내용에 개선할 점을 추가했다.


| **기술**          | **활용**                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spring Boot     | 1. RestController를 통한 Rest API 구현<br>    <br>2. 도메인 기반의 계층형 아키텍처 적용<br>    <br>    1. Application Layer: 사용자 요청 처리<br>        <br>    2. Domain Layer: 핵심 비즈니스 로직 처리<br>        <br>    3. Infrastructure Layer: 외부 시스템 통합<br>        <br>3. CQRS 패턴을 통한 데이터 처리<br>    <br>    1. Command (JPA): 데이터 변경 작업<br>        <br>    2. Query (MyBatis): 데이터 변경 없는 단순 조회                                                                |
| Spring Data JPA | 1. 계층별 Aggregate 분리를 통해 데이터 유효성 검증<br>    <br>2. ORM을 통한 객체 지향적 데이터 관리                                                                                                                                                                                                                                                                                                                                                           |
| MyBatis         | 1. Dynamic Query를 통해 복잡한 조회 요구사항 처리<br>    <br>2. XML Mapper와 Mapper Interface를 분리하여 가독성 확보 및 namespace 중복 방지                                                                                                                                                                                                                                                                                                                    |
| GitHub API      | 1. Backend: OAuth2기반 인증 관리<br>    <br>    1. Secret Key를 Backend에 저장 후 Frontend가 요청한 경우에 한하여 Access Token 발급<br>        <br>    2. Installation Id 보호를 위해 Client에는 Installation의 순서 반환<br>        <br>2. Frontend: GitHub 데이터 요청<br>    <br>    1. 사용자의 요청에 따라 필요한 경우에 한하여 Backend에 Token을 요청하고 반환된 Token은 State 변수로 관리하여 CSRF 방지<br>        <br>    2. Github API 공식 라이브러리인Oktokit과 GraphQL을 활용하여 데이터 요청의 안정성과 효율성 향상           |
| Vue.js          | 1. 아키텍처: 3계층 구조<br>    <br>    1. Views Layer: UI 컴포넌트<br>        <br>    2. Store Layer: State 관리<br>        <br>    3. API Layer: 외부 API와 통신<br>        <br>2. 플러그인 모듈화<br>    <br>    1. plugins 디렉토리를 통해 플러그인 설정 분리<br>        <br>    2. main.js에서 통합 import<br>        <br>3. 라우터 모듈화<br>    <br>    1. 도메인별 독립적인 router 파일 구성<br>        <br>    2. Index.js에서 도메인 router import<br>        <br>4. 반응형 레이아웃: Prime Vue 활용 |
