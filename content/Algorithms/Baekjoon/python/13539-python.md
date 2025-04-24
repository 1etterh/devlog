---
title: 13549-python
tags:
  - bfs
  - dynamicprogramming
  - python
  - baekjoon
---
[백준 13549](https://www.acmicpc.net/problem/13549)

#### 문제 조건
1. times[n]: n까지 걸리는 시간
2. times[n-1], times[n+1] = times[n]+1
3. times[2*n] = times[n]
![[content/Algorithms/Baekjoon/python/assets/13539.png]]
#### 풀이
bfs와 dp사용


1. 인접한 점 구하기
2. 인접한 점의 거리 구하기


#### 유사 코드

```
size=len(dp)
def search(p):
	dq=deque([p])
	while dq:
	x = dq.popleft()
	adj = [x*2,x-1,x+1] #순간이동을 가장 앞에 배치
	for ad in adj:
		if ad in 0~size
		if dp[ad]==-1:
			dp[ad]=#
```



#### 코드
```
from sys import stdin as s
from collections import deque
n,k=map(int,s.readline().split())
size=max(n,k)+2
dp=[-1]*(size)
dp[n]=0
def search(p):
    dq=deque([p])
    while dq:
        x=dq.popleft()
        adj=[x*2,x-1,x+1]
        for ad in adj:
            if -1<ad<size:
                if adj.index(ad)==0:
                    if dp[ad]==-1:
                        dp[ad]=dp[x]
                        dq.append(ad)
                else:
                    if dp[ad]==-1:
                        dp[ad]=dp[x]+1
                        dq.append(ad)
search(n)
print(dp[k])
```