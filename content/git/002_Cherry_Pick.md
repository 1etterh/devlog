---
title: Git Cherry-Pick으로 특정 커밋만 가져오기
type: question
tags: [git, cherry-pick, branch]
draft: true
---

## Cherry-Pick이란

다른 브랜치의 **특정 커밋 하나만** 현재 브랜치에 적용하는 명령어다. merge처럼 브랜치 전체를 합치는 것이 아니라, 원하는 커밋만 골라서 가져온다.

## 기본 사용법

```bash
# 현재 브랜치에 특정 커밋 적용
git cherry-pick <커밋 해시>
```

### 실제 예시

```bash
# develop 브랜치로 이동
git checkout develop

# shk 브랜치의 특정 커밋만 가져오기
git cherry-pick 2aac884b057082a4e381170a015c7652d8f7ba51
```

## 주요 옵션

| 옵션 | 설명 |
|------|------|
| `--no-commit` (`-n`) | 커밋하지 않고 변경사항만 스테이징에 올림 |
| `--edit` (`-e`) | 커밋 메시지를 수정할 수 있도록 에디터 열기 |
| `--abort` | 충돌 발생 시 cherry-pick 취소 |
| `--continue` | 충돌 해결 후 cherry-pick 계속 진행 |

## 여러 커밋을 한 번에 가져오기

```bash
# 연속된 커밋 범위 (A는 미포함, B는 포함)
git cherry-pick A..B

# 개별 커밋 여러 개
git cherry-pick <해시1> <해시2> <해시3>
```

## 충돌 발생 시

```bash
# 1. 충돌 파일 수정
# 2. 수정 완료 후
git add .
git cherry-pick --continue

# 또는 cherry-pick 자체를 취소
git cherry-pick --abort
```

## 주의사항

- cherry-pick은 새로운 커밋을 생성한다 (원본 커밋과 해시가 다름)
- 같은 커밋을 여러 번 cherry-pick하면 중복 변경이 생길 수 있다
- 나중에 브랜치를 merge할 때 충돌이 발생할 가능성이 있으므로, 남용하지 않는 것이 좋다
