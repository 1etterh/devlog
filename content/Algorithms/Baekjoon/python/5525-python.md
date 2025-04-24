---
title: 5525-python
tags:
  - algorithms
  - dynamicprogramming
  - dp
  - baekjoon
---
[백준 5525](https://www.acmicpc.net/problem/5525)

#### 문제 설명
P(n)=N+1개의 I와 N 개의 O가 번갈아 나오는 문자열
ex) P(1)=IOI
I와 O로만 이루어진 문자열 내에 P(n)이 몇개 있는지 계산하시오
#### 입력
```
n#P(n)
m#문자열S의 길이
S#문자열
```

처음 문제를 봤을때,,, 안될 걸 알면서도 브루트 포스로 풀어버렸다. 결과는 50점.

역시 제대로 된 알고리즘을 짜야겠다 싶어서 생각을 해봤다.

#### 문제 풀이
1. 문자열 속의 P(1)을 구하는 법

	O가 등장했을 때, 앞뒤로 I가 있어야 P(1)이 성립한다.
	따라서 S(n-1), S(n), S(n+1)을 비교해야된다.
2. 문자열 속의 P(n)을 구하는 법
	1. P(n) 시작점 설정
		P(1)이 등장한 후 연속적으로 OIOI가 입력되면 P(n)이 될 수 있다. 따라서 Boolean 변수 flag을 정해두고, P(n)이 시작될 때 True, P(n)이 끝날 때 flag을 False로  부여하였다.
	2. P(n) 종료점 설정
		S(n)과 S(n-1)이 같으면 flag을 False로 바꾼다.

#### 코드

```
from sys import stdin as s

n=int(s.readline())#Pulse수열

m=int(s.readline())#비교수열의 길이

A=list(s.readline())#비교수열

lens=[]

cnt = 0

flag=False

for i in range(1,m-1):
    if A[i]=='O':

        if A[i-1]=='I' and A[i+1]=='I':

            if flag:

                cnt+=1

            else:

                flag=True

                lens.append(cnt)

                cnt=1

    if A[i-1]==A[i]:

        flag=False

    # print(i,A[i],flag,cnt)

if cnt:

    lens.append(cnt)

x=0

# print(lens)

  

for l in lens:

    if n<=l:

        x+=(l-n+1)

print(x)

# print(lens)

```

