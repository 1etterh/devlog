---
title: .gitignore에 추가해도 변경사항에 계속 뜨는 이유
type: question
tags: [git, gitignore, tracked-files]
draft: false
---

## 문제

`.gitignore`에 특정 파일/폴더를 무시하도록 설정했는데, git changes에 계속 표시되는 경우가 있다.

## 원인

**이미 git이 추적(tracked) 중인 파일은 `.gitignore`에 추가해도 무시되지 않는다.**

`.gitignore`는 **아직 추적되지 않은(untracked) 파일**에만 적용된다. 한 번이라도 `git add`되어 추적이 시작된 파일은 `.gitignore` 규칙과 무관하게 계속 변경사항이 감지된다.

## 해결 방법

### 1. git 캐시에서 제거 (파일은 유지)

```bash
# 단일 파일
git rm --cached <파일명>

# 디렉토리 전체
git rm -r --cached <디렉토리명>
```

`--cached` 옵션을 사용하면 로컬 파일은 삭제되지 않고, git의 추적 목록에서만 제거된다.

### 2. 전체 캐시 초기화 후 재추가

많은 파일을 한꺼번에 처리해야 할 때:

```bash
git rm -r --cached .
git add .
git commit -m "chore: re-apply .gitignore rules"
```

이렇게 하면 `.gitignore` 규칙이 모든 파일에 다시 적용된다.

## 확인 방법

파일이 실제로 무시되는지 확인:

```bash
git check-ignore -v <파일경로>
```

출력이 있으면 무시되고 있는 것, 없으면 무시되지 않는 것이다.

## 주의사항

- `.gitignore` 파일 자체는 보통 git으로 추적하는 것이 권장된다. 팀원 모두가 같은 ignore 규칙을 공유해야 하기 때문이다.
- `git rm --cached`로 제거한 파일은 다음 커밋에서 "deleted" 상태로 기록된다. 원격 저장소에서도 삭제되므로, 팀 작업 시 주의가 필요하다.

## 관련 문서
- [[GIT]]
- [[COMMIT]]
