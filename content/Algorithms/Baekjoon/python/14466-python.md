---
title: 14466-python
tags:
  - 백준
  - algorithms
  - bfs
  - baekjoon
---
[백준 14466](https://www.acmicpc.net/problem/14466)
#### 문제 설명

N x N 크기의 농장
소: K마리
길: R개
길을 건너지 않으면 만날 수 없는 소가 몇 쌍인지 구해야 된다.(빨간 x가 길이라고 치자.)


![[content/Algorithms/Baekjoon/python/assets/14466.png]]
#### 풀이과정
cows 배열에 속한 모든 소들에 대하여 소들이 속한 구역을 찾는다.
1. bfs에서는 소가 갈 수 있는 길을 모두 소의 번호로 채운다.
2. 만약 소가 이미 다른 구역에 속해있다면 그 소는 건너뛴다.
![[content/Algorithms/Baekjoon/python/assets/14466_2.png]]

c1,c2: 갈 수 있는 모든 칸에 표시.

c3:c2에 속하므로 건너뛰고 계산.

###### 유사 코드:
```
res = 0
for c in cows:
	x,y = c
	if 소 번호=plain(소의 위치): #소가 다른 영역에 소속되어있지 않은 경우
		nCows = bfs(x,y) #bfs는 같은 영역의 소의 수를 리턴
		res+=nCows*(k-nCows)# nCows를 제외한 다른 소들은 만날 수 없으므로 nCows*(k-nCows)만큼의 수를 더해줌

print(res//2)#중복 제거
 ```

#### 풀이과정중 발생한 문제
처음에는 시간 초과가 발생했다.
이유를 알기 위해 다른 정답 코드들의 while문의 수를 계산해봤는데, while문의 횟수는 차이가 없었다. (오히려 내 코드가 더 적음...)
왼쪽이 내 코드, 오른쪽이 다른 정답의 코드이다.
확실히 while문이 돌아간 총 횟수는 내 코드가 더 적다. 그러나 처리 시간은 5배정도 더 걸렸다.
![[content/Algorithms/Baekjoon/python/assets/14466_1.png]]
역시 간단한 알고리즘 결과 비교는 엑셀이 짱...

while문이 실행된 횟수:
1. 내 코드

	![[content/Algorithms/Baekjoon/python/assets/14466_3.png]]
2. 다른 정답 코드:

	
![[content/Algorithms/Baekjoon/python/assets/14466_4.png]]

bfs 함수 자체의 문제 보다는 내부에 비교하는 로직이 잘못된 것 같아 다시 bfs 내부의 실행 시간을 확인해보니 bfs 내부에 있던 비교문에 문제가 있었다.

###### 오답 코드(시간 초과)
```
#생략

roads=[]
for _ in range(r):
r1,c1,r2,c2=map(int,input().split())
	roads.append([r1,c1,r2,c2])
#생략

def bfs(x,y):
	queue=[[x,y]]
	while queue:
		지금위치=queue.pop(0)
		if 지금위치,다음위치 not in roads:#이부분에서 시간 초과
			queue.append(다음위치)
#생략
```


###### 정답 코드
```
생략
roads=defaultdict(list)
for _ in range(r):
r1,c1,r2,c2=map(int,input().split())
roads[(r1,c1)]=[r2,c2]
roads[(r2,c2)]=[r1,c1]

#생략
def bfs(x,y):
	queue=[[x,y]]
	while queue:
	지금위치=queue.pop(0)
	if 다음위치 not in roads[지금위치]:
	queue.append(다음위치)
		
```
dictionary의 키 값으로 tuple을 넣을 수 없을 줄 알았는데 가능하다는 것을 알게 되었다..! 엄청난 발견
또 하나 발견한 점은 bfs함수 내부에서 global 변수를 쓰면 처리 시간이 더더더 늘어난다는거..?
###### 기존(시간 오래걸림)
```
def bfs():
#생략. x= 같은 구역에 있는 소의 수
global cnt
cnt+=x*(k-x)
```

###### 수정한 코드(빠름)
```
def bfs():
#생략, x= 같은 구역에 있는 소의 수
return x

result = 0
for c in cows:
	#생략.
	tmp=bfs(c)
	result+=tmp*(k-tmp)
```


#### 코드

```
from collections import deque, defaultdict
from sys import stdin as s

n,k,r=map(int,s.readline().split())# plain, cows, roads
roads=defaultdict(list)
cows=[]
rDir=[1,-1,0,0]
cDir=[0,0,1,-1]

plain=[[-1]*(n+1) for _ in range(n+1)]

for _ in range(r):
    r1,c1,r2,c2=map(int,s.readline().split())
    roads[(r1,c1)].append((r2,c2))
    roads[(r2,c2)].append((r1,c1))

for i in range(k):
    r,c=map(int, s.readline().split())
    plain[r][c]=i
    cows.append([r,c])

def bfs(x,y,i):
    dq=deque()
    g=0
    dq.append([x,y])
    while dq:
        r,c=dq.popleft()
        if [r,c] in cows:
            g+=1
        for d in range(4):
            nr,nc=r+rDir[d], c+cDir[d]
            if 0<nr<=n and 0<nc<=n and plain[nr][nc]!=i and (nr,nc) not in roads[(r,c)]:
                plain[nr][nc]=i
                dq.append([nr,nc])
    return g
cnt = 0
for i in range(k):
    x,y=cows[i]
    if plain[x][y]==i:
        tmp=bfs(x,y,i)
        cnt+=tmp*(k-tmp)
print(cnt//2)
```

#### 결과

![[content/Algorithms/Baekjoon/python/assets/14466_5.png]]
