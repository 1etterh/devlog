---
title: 10799-python
tags:
  - algorithms
  - stack
---
[백준 10799번](https://www.acmicpc.net/problem/10799)

#### 입력형식
```
A='((())))()()()(()()())'
```

#### 레이저
```
if A[i-1]+A[i]=='()' #laser
```

#### 쇠막대기
```
stk=[]
for i in range(len(A)):
	if not laser:
		stk.append(A[i])
```

#### 레이저와 쇠 막대기의 관계

![](10799.png)

```
1. 레이저: 쇠막대기 만날 때마다 +1
2. 쇠막대기: 끝나면 +1
stk : <Stack>  #쇠막대기의 정보 저장
for x in A:
	if laser:
		answer+=(number of stk)
	if stick ends: answer+=1

```


#### 코드
```
from sys import stdin as s

from collections import deque

A=s.readline()

n=len(A)

stk=deque([A[0]])

cnt = 0 # nlasers

res=0 # nsticks

for i in range(1,n):

    # print(f"turns #{i}")

    if A[i-1]+A[i]=='()':

        stk.pop()

        res+=len(stk)

    else:

        stk.append(A[i])

    if 1<len(stk) and stk[-2]+stk[-1]=='()':

        stk.pop()

        stk.pop()

        res+=1

print(res)
```