---
title: 1967-python
tags:
  - algorithms
  - dfs
---
[백준 1967](https://www.acmicpc.net/problem/1967)

##### 문제
트리(tree)는 사이클이 없는 무방향 그래프이다. 트리에서는 어떤 두 노드를 선택해도 둘 사이에 경로가 항상 하나만 존재하게 된다. 이 때 임의의 두 정점 사이의 거리의 최댓값을 트리의 지름이라고 한다. 루트 노드의 번호는 항상 1이라고 가정한다.

##### 입력
```
n #노드의 개수
for _ in range(n-1):
	a,b,c#부모노드, 자식노드, 간선의 가중치
```

##### 문제 풀이
1. 1(root)에서 가장 먼 정점을 구한다.
2. 그 한 점에서 가장 먼 정점의 거리를 구한다.

```
import sys

sys.setrecursionlimit(10**9)

  

n = int(sys.stdin.readline())

  

tree = [[] for _ in range(n+1)]

  

for _ in range(n-1):

    a,b,c=map(int,sys.stdin.readline().split())

    tree[a].append([b,c])

    tree[b].append([a,c])


dist=[-1]*(n+1)

dist[1]=0

def dfs(x):

    for c in tree[x]:

        a,b = c

        if dist[a]==-1:

            dist[a]=dist[x]+b

            dfs(a)

dfs(1)

s=dist.index(max(dist))

dist=[-1]*(n+1)

dist[s]=0

dfs(s)

print(max(dist))
```