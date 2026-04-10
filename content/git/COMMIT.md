---
tags:
  - git
draft: false
---
> [[Git]] 저장소에 디렉토리에 있는 모든 파일에 대한 스냅샷(Snapshot)을 기록하는 하나의 데이터 객체<br/>
> 각 파일 객체의 변화만을 저장함.


# definition
> commit이 작동하는 방식이 궁금해서 git.git 의 commit 소스코드를 읽어봤다.

_commit.h_
```C
struct commit {
	struct object object;
	timestamp_t date;
	struct commit_list *parents;

	/*
	 * If the commit is loaded from the commit-graph file, then this
	 * member may be NULL. Only access it through repo_get_commit_tree()
	 * or get_commit_tree_oid().
	 */
	struct tree *maybe_tree;
	unsigned int index;
};
```

### struct
> c언어의 구조체이며, 이 자체로 하나의 데이터 타입을 가진다. 자바의 클래스와 유사하지만 함수를 가질 수는 없다는 것이 차이점이 있다.


### struct commit
> [[git/Object|Object]] , timestamp의 날짜, 부모 커밋의 포인터, tree, index를 가지는 것을 확인할 수 있다.

# [git-commit-tree](https://git-scm.com/docs/git-commit-tree)
> git-scm.com의 내용을 나름대로 정리해봤다

##### Commit Object
##### 1. number of parents
> 보통 한개, 병합 결과인 경우 2, root 인 경우 0

##### 2. 

# Refs
1. [_git-scm.com/docs/git-commit_](https://git-scm.com/docs/git-commit)
2. [_git-commit#_examples](https://git-scm.com/docs/git-commit#_examples)
3. [_git-commit-tree_](https://git-scm.com/docs/git-commit-tree)
4. [Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)

