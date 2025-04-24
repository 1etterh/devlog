---
title: 12789-python
tags:
  - stack
  - python
---
#### 문제
[백준 12789](https://www.acmicpc.net/problem/12789)

#### 문제 조건

1. 학생들이 줄을 서 있음
2. 스택을 사용하여 순서대로 정렬할 수 있으면 Nice, 아니면 Sad를 출력


#### 알고리즘

1. 첫번째 학생부터 마지막 학생까지 한 바퀴 돌면서 한번 간식을 받을 수 있는지 확인 ( while index < N )
2. 간식을 받을 수 있는 사람의 번호: order, 1부터 시작.
3. Queue의 맨 앞의 사람이 간식을 받을 수 있는 경우: order+=1, index+=1
4. Stack의 맨 앞의 사람이 간식을 받을 수 있는 경우: order+=1 이 경우 Queue의 첫번째 학생은 아직 검사되지 않았으므로 index를 증가시키지 않는다.
5. 간식을 받을 수 없는 경우: index+=1, Stack에 해당 학생 저장


![[content/Algorithms/Baekjoon/python/assets/12789.png]]

#### 예제




![[content/Algorithms/Baekjoon/python/assets/12789-2.png]]
#### 코드

```
from sys import stdin as s

from collections import deque

  

N=int(s.readline())

A=list(map(int,s.readline().split()))

stk = deque()

i = 0

order = 1

while(i<N):

    if order == A[i]:

        i+=1

        order+=1

    elif stk and stk[-1]==order:

        stk.pop()

        order+=1

    else:

        stk.append(A[i])

        i+=1

  

while stk:

    if stk[-1]!=order:

        break

    else:

        stk.pop()

        order+=1

  
  

if order == N+1:

    print("Nice")

else:

    print("Sad")
```