---
title: 1992-python
tags:
  - algorithms
  - devideconquer
  - baekjoon
  - python
---
[백준 1992](https://www.acmicpc.net/problem/1992)

#### 문제 풀이 과정

#### 분할 정복을 사용한 이유
모든 원소를 비교하려면 반복문을 돌아야 한다. 그런데 만약 데이터의 크기가 10만 이상이라면 한번 비교할 때 시간적 부담이 커지게 된다.
따라서 분할 정복을 통해 작은 부분부터 해결하는 방식을 택했다.

#### 알고리즘
```
def quad(x):
	if x의 모든 원소가 0 or 1:
		return 0 or 1
	else:
	quads: [quad(q) for q in devided(x)]
		return str(quads)
```


#### 코드

```
from sys import stdin as s


n=int(s.readline())
A=[]
for _ in range(n):
    A.append(list(map(int,s.readline().strip())))

def quad(x):
    if len(x)==1:
        return str(x[0][0])

    y=len(x)//2
    x00=quad([i[:y] for i in x[:y]])
    x01=quad([i[y:] for i in x[:y]])
    x10=quad([i[:y] for i in x[y:]])
    x11=quad([i[y:] for i in x[y:]])
    
    quads=[x00,x01,x10,x11]
    flag=True
    before=x00
    for i in range(4):
        if before!=quads[i]:
            flag=False
            break
        before=quads[i]

    if flag and len(x00)==1:
        return x00
        

    else:
        res="".join(quads)
        return f"({res})"

print(quad(A))
```

