---
tags:
  - project
  - syncday
  - github
draft: false
---
# Git Hub 연동
> GitHub 연동을 통해 서로의 진행 상황을 확인하기 용이하도록 만듦

## 활용 API
1. Backend: [GitHub API for Java](https://github-api.kohsuke.org/)
2. Frontend: [oktokit.js](https://github.com/octokit/octokit.js)

## GitHub 연동 구조
1. 보안을 위해 Backend Server에 Secret Key를 저장한 후 필요한 경우에 한하여 Installation Token 발급
2. Installation Id가 노출되지 않도록 Client에는 Installation index 전송

### GithubApp 설치 과정
![[Pasted image 20241221165300.png]]

1. 사용자의 Github App 설치 요청
2. Installation id, Setup Action 수신
3. 설치자의 정보를 함께 저장하기 위해 callback을 frontend에서 수신 후, 유저의 정보와 installation 정보를 backend에 전송
4. Installation Token을 프론트엔드에서 수신하고, oktokit을 통해 필요한 데이터 요청
5. client에서는 최소한의 정보만 state로 관리