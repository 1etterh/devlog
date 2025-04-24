---
title: 8979-python
tags:
  - algorithms
  - sort
  - baekjoon
---
[백준 8979](https://www.acmicpc.net/problem/8979)
#### 문제
올림픽은 참가에 의의가 있기에 공식적으로는 국가간 순위를 정하지 않는다. 그러나, 많은 사람들이 자신의 국가가 얼마나 잘 하는지에 관심이 많기 때문에 비공식적으로는 국가간 순위를 정하고 있다. 두 나라가 각각 얻은 금, 은, 동메달 수가 주어지면, 보통 다음 규칙을 따라 어느 나라가 더 잘했는지 결정한다.

1. 금메달 수가 더 많은 나라 
2. 금메달 수가 같으면, 은메달 수가 더 많은 나라
3. 금, 은메달 수가 모두 같으면, 동메달 수가 더 많은 나라 

각 국가는 1부터 N 사이의 정수로 표현된다. 한 국가의 등수는 (자신보다 더 잘한 나라 수) + 1로 정의된다. 만약 두 나라가 금, 은, 동메달 수가 모두 같다면 두 나라의 등수는 같다. 예를 들어, 1번 국가가 금메달 1개, 은메달 1개를 얻었고, 2번 국가와 3번 국가가 모두 은메달 1개를 얻었으며, 4번 국가는 메달을 얻지 못하였다면, 1번 국가가 1등, 2번 국가와 3번 국가가 공동 2등, 4번 국가가 4등이 된다. 이 경우 3등은 없다. 

각 국가의 금, 은, 동메달 정보를 입력받아서, 어느 국가가 몇 등을 했는지 알려주는 프로그램을 작성하시오.

#### 입력
```
n,k # 국가의 수, 등수를 알고싶은 국가
#각 국가는 1부터 n사이의 정수로 표현됨
for _ in range(n):
	국가이름,금,은,동
```

#### 문제 풀이
1. 금메달, 은메달, 동메달을 기준으로 내림차순 정렬
2. 만약 동점인 국가가 있는 경우 rank의 값은 그대로 있어야 한다.

```
import sys

n,k = map(int, sys.stdin.readline().split())

medals=[]

for _ in range(n):

    a,b,c,d=map(int,sys.stdin.readline().split())

    medals.append([a,b,c,d])

rank=[0]*(n+1)

medals.sort(key = lambda x:(x[1],x[2],x[3]), reverse =True)

r=1

same=False

for i in range(n):

    num,x,y,z=medals[i]

    if not same:

        rank[num]=i+1

        r=i+1

    else:

        rank[num]=r

    if(i<n-1):

        same = True if medals[i][1:]==medals[i+1][1:] else False

  

print(rank[k])

```

### 후기
동점인 경우와 동점을 확인하는 부분만 잘 신경 쓰면 금방 풀 수 있다.