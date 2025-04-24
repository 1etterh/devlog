---
title: 1725-python
tags:
  - stack
  - python
---
## 문제
#### [백준 1725](https://www.acmicpc.net/problem/1725)

히스토그램 내부에 그릴 수 있는 가장 큰 직사각형의 넓이를 구하라.

#### 입력

```
N # 히스토그램 가로칸의 수
for _ in range(N):
	칸의 높이
```

#### 풀이

```
H: 히스토그램
LEFT: H[i]의 높이를 가질 수 있는 가장 왼쪽의 인덱스
RIGHT: H[i]의 높이를 가질 수 있는 가장 오른쪽의 인덱스
```

#### 조건

1. H[i]의 높이를 가질 수 있으려면 H[i]보다 크거나 같아야 한다.
2. LEFT: H[i]보다 크거나 같은 요소의 index중 가장 큰값
3. RIGHT: H[i]보다 크거나 같은 요소의 index중 가장 작은값
4. LEFT,RIGHT에는 자기 자신의 index도 포함해야 한다. (한 칸인 경우)
6. 따라서 탐색 과정에서 자신보다 작은 요소의 인덱스의 바로 전 인덱스를 저장하는 방식을 사용했다.

![[content/Algorithms/Baekjoon/python/assets/1725.png]]
#### 알고리즘(LEFT, RIGHT)

```
LEFT = [0]*N
RIGHT = [N-1]*N
#자기 자신보다 작은 요소가 없는 경우 LEFT는 0,
#RIGHT는 N-1을 가지게 됨.

#RIGHT
stk = deque()
for i in range(N):
	while stk and H[i]<H[stk[-1]]:
		RIGHT[stk.pop()]=i-1 
		# H[stk[-1]] < H[i] : i-1이 가장 오른쪽 요소가 됨
	stk.append(i)


#LEFT
stk=deque()
for i in range(N-1,-1,-1):
    while stk and H[i] < H[stk[-1]]:
		LEFT[stk.pop()]=i+1
    stk.append(i)
```

## 코드

```python
from sys import stdin as s

from collections import deque

s=open(r'Baekjoon\1725\input.txt')

N = int(s.readline())

H=[0]*N

for i in range(N):

    H[i]=int(s.readline())

  

#RIGHT: 높이가 H[i]가 될 수 있는 요소중 가장 오른쪽

#LEFT: 높이가 H[i]가 될 수 있는 요소중 가장 왼쪽

  

LEFT = [0]*N

RIGHT = [N-1]*N

  

#LEFT

stk=deque()

for i in range(N-1,-1,-1):

    while stk and H[i] < H[stk[-1]]:

        LEFT[stk.pop()]=i+1

    stk.append(i)

#RIGHT

stk = deque()

for i in range(N):

    while stk and H[i] < H[stk[-1]]:

        RIGHT[stk.pop()]=i-1

    stk.append(i)

  
  

print(*LEFT)

print(*RIGHT)

area = 0

for i in range(N):

    height = H[i]

    width= RIGHT[i]-LEFT[i]+1

    if area<width*height:

        area = width*height

print(area)
```