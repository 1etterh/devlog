---
title: 1167-python
tags:
  - tree
  - dfs
  - graph
  - bfs
  - search
  - algorithms
---
[트리의 지름](https://www.acmicpc.net/problem/1167)

사용 개념: 트리, 그래프, 깊이 우선 탐색, 너비 우선 탐색/tree, graph, dfs, bfs, search

##### 문제
트리의 지름이란, 트리에서 임의의 두 점 사이의 거리 중 가장 긴 것을 말한다. 트리의 지름을 구하는 프로그램을 작성하시오

##### 입력 형식

첫 줄에는 정점의 개수 n
그 다음 n줄에는 정점 번호, 거리, -1이 주어진다.
이를 식으로 나타내면 다음과 같다.
```
n   # 정점의 개수 n
	for _ in range(n):
		v x1 y1 x2 y2 ... xn yn -1
		#정점 번호 v, v와 xn의 거리 yn
```

##### 출력
첫 줄에 트리의 지름 출력
##### 문제 풀이
1. 우선 Tree에 각 정점의 정보를 저장
2. 임의의 한 점(아무거나)에 대하여 가장 먼 점(start)을 구함
3. start에서 다시 가장 먼 점을 계산
4. 거리 계산 방법은 dfs, bfs 상관 없음

###### 1. dfs

```
import sys

sys.setrecursionlimit(10**9)

n = int(sys.stdin.readline()) #정점의 개수

tree=[[] for _ in range(n+1)] #정점이 1부터 n까지 있으므로 길이가 n+1인 트리 생성.

for _ in range(n):
	arr=list(map(int,sys.stdin.readline().split()))

    v=arr.pop(0) # 정점 v

    arr.pop(-1) # 마지막에 붙은 -1 제거

    for i in range(0,len(arr),2): # 0에서 len(arr)까지 2의 간격으로 거리 저장

        tree[v].append([arr[i],arr[i+1]])

  
dist = [-1]*(n+1) #1에서 각 점까지의 거리 저장

dist[1]=0 

#dfs(x): x번째 노드에서 실행, dist[x]: 1과 x의 거리
def dfs(x):

    for d in tree[x]:

        a,b=d # x,a의 거리 = b

        if dist[a]==-1:

            dist[a]=dist[x]+b #1에서 a의 거리= 1에서 x까지의 거리 + x에서 a까지의 거리

            dfs(a) #a노드에서 다시 dfs

dfs(1)

start = dist.index(max(dist))

dist = [-1]*(n+1)

dist[start]=0

dfs(start)
print(max(dist))


```




###### 2. bfs

```
import sys

sys.setrecursionlimit(10**9)

  

n = int(sys.stdin.readline())

tree=[[] for _ in range(n+1)]

for _ in range(n):

    arr=list(map(int,sys.stdin.readline().split()))

    v=arr.pop(0)

    arr.pop(-1)

    for i in range(0,len(arr),2):

        tree[v].append([arr[i],arr[i+1]])

  

dist = [-1]*(n+1)

dist[1]=0

def bfs(s):

    queue = [s] #start node

    while queue:

        x=queue.pop(0)

        for d in tree[x]: #x번째 node의 거리 정보들

            a,b = d #dist(a,x)=b

            if dist[a]==-1:

                dist[a]=dist[x]+b #dist(1,a) = dist(1,x)+dist(x,a)

                queue.append(a)

bfs(1)

# print(dist)

start= dist.index(max(dist))

dist = [-1]*(n+1)

dist[start]=0

bfs(start)

print(max(dist))
```