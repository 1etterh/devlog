---
title: 15592-python
tags:
  - algorithms
  - bfs
  - graph
  - baekjoon
---
[백준 15591](https://www.acmicpc.net/problem/15591)

#### 문제
농부 존은 남는 시간에 MooTube라 불리는 동영상 공유 서비스를 만들었다. MooTube에서 농부 존의 소들은 재밌는 동영상들을 서로 공유할 수 있다. 소들은 MooTube에 1부터 N까지 번호가 붙여진 N (1 ≤ N ≤ 5,000)개의 동영상을 이미 올려 놓았다. 하지만, 존은 아직 어떻게 하면 소들이 그들이 좋아할 만한 새 동영상을 찾을 수 있을지 괜찮은 방법을 떠올리지 못했다.

농부 존은 모든 MooTube 동영상에 대해 “연관 동영상” 리스트를 만들기로 했다. 이렇게 하면 소들은 지금 보고 있는 동영상과 연관성이 높은 동영상을 추천 받을 수 있을 것이다.

존은 두 동영상이 서로 얼마나 가까운 지를 측정하는 단위인 “USADO”를 만들었다. 존은 N-1개의 동영상 쌍을 골라서 직접 두 쌍의 USADO를 계산했다. 그 다음에 존은 이 동영상들을 네트워크 구조로 바꿔서, 각 동영상을 정점으로 나타내기로 했다. 또 존은 동영상들의 연결 구조를 서로 연결되어 있는 N-1개의 동영상 쌍으로 나타내었다. 좀 더 쉽게 말해서, 존은 N-1개의 동영상 쌍을 골라서 어떤 동영상에서 다른 동영상으로 가는 경로가 반드시 하나 존재하도록 했다. 존은 임의의 두 쌍 사이의 동영상의 USADO를 그 경로의 모든 연결들의 USADO 중 최솟값으로 하기로 했다.

존은 어떤 주어진 MooTube 동영상에 대해, 값 K를 정해서 그 동영상과 USADO가 K 이상인 모든 동영상이 추천되도록 할 것이다. 하지만 존은 너무 많은 동영상이 추천되면 소들이 일하는 것이 방해될까 봐 걱정하고 있다! 그래서 그는 K를 적절한 값으로 결정하려고 한다. 농부 존은 어떤 K 값에 대한 추천 동영상의 개수를 묻는 질문 여러 개에 당신이 대답해주기를 바란다.

#### 입력

```
n,q #영상의 수, 질문의 수
for _ in range(n-1):
	p, q, r # 동영상 p,q가 r로 연결되어있음.

for _ in range(q):
	k, v 
	# 유사도가 k인 경우 동영상 v를 보는 소들에게 추천되는 영상의 수
```

#### 문제 요약
 1. 1~N까지 N개의 영상이 있음
 2. N개의 영상은 N-1개의 노드로 서로 연결되어 있음
 3. 임의의 두 영상의 유사도는 경로상의 유사도중 최솟값


![[15591 1.png]]

#### bfs
```
import sys

sys.setrecursionlimit(10**9)

n,q  = map(int,sys.stdin.readline().split())

usado=[[] for _ in range(n+1)]
#그래프사이의 연결관계와 거리를 나타내는 2d array. 영상의 번호가 1~N이므로 n+1개의 행을 만들어준다.
  

for _ in range(n-1):

    i,j,k=map(int,sys.stdin.readline().split())

    usado[i].append([j,k])
    usado[j].append([i,k])
    #dist(i,j)=k
   

cnt = 0

v=[False]*(n+1)
  
def bfs(x): #x에서 출발, i는 유사도의 최솟값

    v[x]=True

    queue=[x]

    while queue:

        a=queue.pop(0)

        for [a,b] in usado[a]:
        
            if not v[a] and i<=b: #방문한 적이 없는 노드에 한하여 usado가 i이상인 경우에만 queue에 추가. 
            #usado가 i보다 작은 경우에는 더이상 탐색할 필요가 없음
        
				v[a]=True
                
                global cnt
                
                cnt+=1

                queue.append(a)

for _ in range(q):

    i,j = map(int,sys.stdin.readline().split())

    v=[False]*(n+1)

    bfs(j)

    print(cnt)

    cnt=0
```

#### dfs(시간 초과)

```
import sys

sys.setrecursionlimit(10**9)

n,q  = map(int,sys.stdin.readline().split())

usado=[[] for _ in range(n+1)]

  

for _ in range(n-1):

    i,j,k=map(int,sys.stdin.readline().split())

    usado[i].append([j,k])

    usado[j].append([i,k])

cnt = 0

v=[False]*(n+1)

  

def backtrack(x):

    v[x]=True

    for link in usado[x]:

        a,b=link

        if i<=b and not v[a]:

            global cnt

            cnt+=1

            backtrack(a)


for _ in range(q):

    i,j = map(int,sys.stdin.readline().split())

    v=[False]*(n+1)

    backtrack(j)

    print(cnt)

    cnt=0

  

# for u in usado:

#     print(u)
```