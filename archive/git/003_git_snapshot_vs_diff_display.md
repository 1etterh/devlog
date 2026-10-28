---
title: Git이 snapshot 저장이라면 diff는 통째로 표시되나?
type: archive
tags: [archive, git, version_control, storage, diff]
draft: true
---

**Q**: Git은 파일이 바뀌면 해당 파일을 통째로 snapshot해서 버전을 기록한다고 알고 있다. 그럼 100줄짜리 코드의 10번째 줄에 2줄이 추가되면 `git diff`는 100줄이 바뀐 걸로 표시되는가, 아니면 2줄만 표시되는가?

**A**: **저장 모델과 diff 표시는 완전히 독립된 개념**이다. diff는 변경된 2줄만 보여준다.

| 구분 | 동작 |
|---|---|
| 저장 (storage) | 파일이 바뀔 때마다 그 파일 전체를 새 blob 객체로 저장 (snapshot) |
| diff (presentation) | 두 snapshot을 표시 시점에 비교해 변경된 부분만 계산 (기본 Myers 알고리즘) |

즉 100줄 중 2줄이 추가되면:
- 내부 저장소: 102줄짜리 blob이 새로 생성되어 통째로 저장됨
- `git diff` 출력: `+` 2줄과 주변 context 몇 줄만 표시

저장소가 비대해지지 않게 하는 두 메커니즘:

1. **Content-addressable + 중복 제거**: blob 키는 내용의 SHA-1 해시. 동일 내용 파일은 기존 blob을 재사용하므로 중복 저장이 없다.
2. **Pack file의 delta 압축**: `git gc` 또는 push/clone 시 비슷한 blob들을 묶어 packfile로 만들 때 delta(증분) 압축이 적용된다. 디스크상 최종 형태는 사실상 증분에 가깝다.

핵심 정리:

- 개념 모델: snapshot (파일 단위 통째 저장)
- 사용자 시각: diff는 변경된 줄만 (표시 시점에 계산)
- 디스크 효율: 해시 중복 제거 + packfile delta 압축

SVN/CVS 같은 delta 기반 VCS와 달리, Git은 **개념상 snapshot이지만 표시·전송 시 diff/delta를 활용**하는 하이브리드 구조다.
