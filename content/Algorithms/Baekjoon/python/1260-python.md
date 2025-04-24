---
title: 1260-python
tags:
  - 백준
  - bfs
  - algorithms
---

##### 문제
그래프를 DFS로 탐색한 결과와 BFS로 탐색한 결과를 출력하는 프로그램을 작성하시오. 단, 방문할 수 있는 정점이 여러 개인 경우에는 정점 번호가 작은 것을 먼저 방문하고, 더 이상 방문할 수 있는 점이 없는 경우 종료한다. 정점 번호는 1번부터 N번까지이다.

##### 입력
```
n,m,v #정점의 개수, 간선의 개수, 탐색을 시작할 정점의 번호
for _ in range(m):
	a,b #간선이 연결하는 두 정점의 번호
```

##### 문제 풀이
그래프를 정렬 후 dfs, bfs를 실행하면 된다.

```

import sys

sys.setrecursionlimit(10**9)

  
  

n,m,s = map(int, sys.stdin.readline().split())

graph = [[] for _ in range(n+1)]

  

for _ in range(m):

    a,b = map(int, sys.stdin.readline().split())

    graph[a].append(b)

    graph[b].append(a)

for i in range(m):

    graph[i].sort()

  


def dfs(x):

    print(x,end=' ')

    for y in graph[x]:

        if not v[y]:

            v[y]=True

            dfs(y)

  
  

def bfs(x):

    queue = [x]

    while queue:

        y=queue.pop(0)

        print(y,end=' ')

        for z in graph[y]:

            if not v[z]:

                v[z]=True

                queue.append(z)

v=[False]*(n+1) #정점 s에서 출발했을 때 방문 여부 
v[s]=True

dfs(s)

v=[False]*(n+1) #정점 s에서 출발했을 때 방문여부

v[s]=True

print()

bfs(s)

```