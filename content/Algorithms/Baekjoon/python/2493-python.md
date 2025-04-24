---
title: 2493-python
tags:
  - stack
  - algorithms
---
[백준 2493번](https://www.acmicpc.net/problem/2493)

#### 문제 조건
1. 1~N번의 탑이 있음(A)
2. "A[i]"에서 발사된 레이저의 수신 조건
	1. "A[i]"보다 큼
	2.  "A[i]"보다 왼쪽에 있음
	3. 가장 오른쪽
3. 왼큰수 구하면 됨

#### 입력 형식

```
N #탑의 수
A # 탑 정보
```





#### 알고리즘
```
stk=[] #index 저장
B=[0]*N
for i in range(N-1,-1,-1):
	while A[i]<A[stk[-1]]:
		B[i]=stk.pop()+1 # 탑의 번호가 1부터 시작함
	stk.append(i)
```


#### 코드
```
from sys import stdin as s


N=int(s.readline())
stk=[]
B=[0]*N

for i in range(N-1,-1,-1):
    while stk and A[stk[-1]] < A[i] :
        B[stk.pop()]=i+1
    stk.append(i)
    
print(*B)
```

