---
tags:
  - troubleshooting
  - githubapi
  - java
  - oktokit
---
## 문제
GitHub의 공식 Library인 Oktokit은 Javascript를 통해 사용할 수 있기 때문에 Spring Boot로 Backend를 구축하기 위하여 GitHub API For Java를 활용하는 과정에서 발생한 문제이다.

1. 보안을 위해 백엔드(Java)에서 Github의 데이터를 수신 후 Frontend에 전송하고자 함.
 2. Github Installation Token을 통해 프로젝트 리스트를 요청했으나 사용하려는 메소드가 Deprecated되어 동작하지 않음.
 3. Github API for Java만으로 문제를 해결하기에는 프로젝트 기한이 짧음
	 1. 직접 contribute하거나
	 2. 이슈 등록 후 해결되길 기다리기
	 3. -> 둘 다 기대하기 힘들다.

## 목표
보안을 위해 Backend에 GitHub의 Secret Key와 Installation Id를 저장하고, 예정된 기능인 GitHub 연동을 정상적으로 구현하는 것.
## 해결 방법
1. GitHub API For Java를 활용하여 JWT와 GitHub Installation Token을 생성
2. Github 공식 API인 Oktokit을 활용하기 위해 Vue.js에 Oktokit 설치
3. Frontend에서 필요한 경우에 한하여 Token 요청
4. 반환된 Token은 State 변수로 관리하여 CSRF 공격에 대비 

## 결과
1. GitHub의 인증 정보는 Backend에만 저장
2. 정보 은닉을 위해 Frontend에는 installation Id 대신 installation Index 반환
3. Oktokit을 활용하여 예정된 기능 정상 구현

# refs
1. [GitHub API For Java](https://github-api.kohsuke.org/)
2. [Oktokit](https://github.com/octokit)
