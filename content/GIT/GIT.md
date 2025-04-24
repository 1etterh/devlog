---
tags:
  - git
---
> 분산형 버전 관리 시스템<br/>
> GIT 과 [[GITHUB]]은 다름<br/>
> [Git 설명 자료](https://rogerdudler.github.io/git-guide/index.ko.html)

![[Git.png]]
# Terms

### GIT
#### Working Directory(Working Tree)
>실제 작업공간(파일 시스템)
#### INDEX(Staging Area)
> COMMIT할 파일을 지정
#### [[Local Repository]]
> 1. `.git` 폴더
> 2. Working Dir에 .git을 만들면 한 폴더 내에서 Local Repo, Working Dir 두가지 기능 가능
> 3. 추적하는 코드(TRACKED FILES)를 `.git`에 저장
#### BRANCH
> 안전하게 격리된 상태에서 코드를 변경할 때 사용
> 개발이 완료되면 `main`에 병합
> Local Repository의 Branch와 원격 Repository의 Branch구분
#### [[HEAD]]
> 현재 있는 로컬브랜치를 가리키는 특수 포인터

#### [[content/GIT/Object|Object]]
> 저장소의 내용을 나타내는 기본 데이터 구조


### Github
#### Remote Repository
>Local Repository에서 버전 관리한 코드들을 저장할 원격 저장소
#### [[GITHUB]]
> Git으로 관리하는 코드를 저장하는 원격 저장소의 한 종류
> 노마드코더의 비유: Git - 커피 Github - 카페
#### ORIGIN
> Remote Repository의 주소를 담은 변수

# [[Version Tracking]]
> 1. _Modified_
> 2. _Staged_
> 3. _Committed_



# Refs
1. [_GIT Docs_](https://git-scm.com/book/ko/v2/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-Git-%EA%B8%B0%EC%B4%88):  Git 공식문서
2. [_git.git_](https://git.kernel.org/pub/scm/git/git.git): Git 소스코드
3. [git-internals](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain): .git 폴더 내부 설명

