---
tags:
  - github
  - syncday
  - oauthapp
  - githubapp
  - troubleshooting
draft: false
---
> SyncDay와 Github 연동 과정에서 사용한 GitHub Apps 정리

# Github Apps
> Github는 두 가지의 Application을 제공한다.(Github App, OAuth App)

|         | Github App                                                                                           | OAuth App                                                              |
| ------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 토큰      | 설치 토큰, 개인 토큰                                                                                         | personal access token                                                  |
| 토큰 수명   | 짧음(보안 강화)                                                                                            | 긺                                                                      |
| 설치 권한   | 조직 소유자, repo 관리자                                                                                     | 계정 소유자                                                                 |
| 웹훅      | GithubApp 설정에서 중앙 집중식 Webhook 등록 후 하나의 endpoint에서 활용 가능<br>[[Github App vs OAuth App#^0d80c4\|참고자료]] | 각 repo, org에 개별적으로 설정해야 함<br>[[Github App vs OAuth App#^7deaa4\|참고자료]] |
| 트래픽률 제한 | Repo와 org 사용자 수로 확장                                                                                  | 낮음, 확장X                                                                |
| App 권한  | 세분화된 권한 설정 가능                                                                                        |                                                                        |
| 라이프사이클  | Org단위                                                                                                | 개인단위                                                                   |

## Github App
> 두 가지 App 중에 Github App을 사용하기로 결정한 이유
1. SyncDay는 ERP이며, 사용자 보다는 업무가 중심이 되기 때문에 개인의 설치 여부에 국한되지 않는 Github App을 선택하였음
2. 세분화된 권한 설정 및 짧은 Token 수명을 통해 보안 강화
3. 중앙 집중식 WebHook을 통해 이벤트 수신을 용이하게 하기 위함


## Github App vs OAuth App
> 개인을 타겟으로 한 서비스를 만들 때는 OAuth App, 팀이나 기업을 타겟으로 한 서비스를 만들 때는 Github App을 사용하는 것이 좋을 듯 하다.

### Github-App-Webhook
![[Pasted image 20241221163019.png]]
### discord-webhook
_디스코드 웹훅 url 등록_
1. repository -> 설정 -> webhook -> 디스코드에서 준 url 붙여넣기 
![[Pasted image 20241221162652.png]]
# refs
1. _[Differences between GitHub Apps and OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps)_