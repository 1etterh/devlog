> 분산형 버전 관리 시스템
> GIT 과 [[GITHUB]]은 다름
> [Git 설명 자료](https://rogerdudler.github.io/git-guide/index.ko.html)

![[Git.png]]
# GIT 용어 정리

### Working Directory(Working Tree)
>실제 작업공간(파일 시스템)
### INDEX(Staging Area)
> COMMIT할 파일을 지정
### [[Local Repository]]
> 1. `.git` 폴더
> 2. Working Dir에 .git을 만들면 한 폴더 내에서 Local Repo, Working Dir 두가지 기능 가능
> 3. 추적하는 코드(TRACKED FILES)를 `.git`에 저장
### BRANCH
> 안전하게 격리된 상태에서 코드를 변경할 때 사용
> 개발이 완료되면 `main`에 병합
> Local Repository의 Branch와 원격 Repository의 Branch구분

### Remote Repository
>Local Repository에서 버전 관리한 코드들을 저장할 원격 저장소
### [[GITHUB]]
> Git으로 관리하는 코드를 저장하는 원격 저장소의 한 종류
### ORIGIN
> Remote Repository의 주소를 담은 변수

## [[Version Tracking]]
> 1. _Modified_
> 2. _Staged_
> 3. _Committed_