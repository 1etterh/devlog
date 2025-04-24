---
title: 2447-python
tags:
  - recursion
  - python
  - java
---
#### 문제
[백준 2447번](https://www.acmicpc.net/problem/2447)

#### 문제 조건
1. 입력값 N은 $3^x$ (0<x, x는 정수)
2. 크기 3의 패턴은 가운데에 공백이 있고, 가운데를 제외한 모든 칸에 별이 하나씩 있다.
3. N이 3보다 큰 경우 크기 N의 패턴은 가운데에 있는 (N/3) x (N/3)의 정사각형을 크기 (N/3)의 패턴으로 둘러싼 형태이다.

#### 알고리즘(유사 코드)
```
def draw(x):
	if x==1:
		return ["*"]
	else:
	before = draw(x//3)
	now = [draw*3, draw+blank+draw, darw*3]
```

#### 생각할 점
1. 패턴 3개를 이어 붙이기 위해서는 패턴의 각 행을 3번더해야 한다.
2. 만약 패턴을 그냥 이어붙인다면 줄바꿈 때문에 출력이 불가능하다.
3. 따라서 행을 단위로 재귀를 실행하는 것이 가장 효율적이다.

#### 코드

```
from sys import stdin as s
N=int(s.readline())

def draw(x):
    if x==1:
        return ["*"]
    before=draw(x//3)
    now = []
    for star in before:
        now.append(star*3)
       
    for star in before:
        now.append(star+" "*(x//3)+star)
   
    for star in before:
        now.append(star*3)
       
    return now
        
Stars = draw(N)
print("\n".join(Stars))
```
