---
title: 1406-python
tags:
  - stack
  - algorithms
  - baekjoon
---
[백준 1406](https://www.acmicpc.net/problem/1406)
#### 문제 요약
1. 길이가 L인 문자열에 가능한 커서의 위치: L+1가지 경우
2. 입력에 따라 커서가 이동하거나 문자 입력/삭제
3. 모든 명령어를 수행한 후 편집기에 입력된 문자열을 출력

#### 입력형식

```
A # 문자열
M #명령어의 개수
for _ in range(M):
	명령어
```


#### 문제 풀이
1. 커서를 기준으로 A,B 두개의 스택 할당
2. 명령어에 따라 A,B 스택의 원소를 계산
3. 커서는 A의 끝에 위치한 것으로 설정

| command | action                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------ |
| L       | A                                                                                                      |
| D       | 커서를 오른쪽으로 한 칸 옮김 (커서가 문장의 맨 뒤이면 무시됨)                                                                   |
| B       | 커서 왼쪽에 있는 문자를 삭제함 (커서가 문장의 맨 앞이면 무시됨)  <br>삭제로 인해 커서는 한 칸 왼쪽으로 이동한 것처럼 나타나지만, 실제로 커서의 오른쪽에 있던 문자는 그대로임 |
| P $     | $라는 문자를 커서 왼쪽에 추가함                                                                                     |

#### 입력예시

![[content/Algorithms/Baekjoon/python/assets/1406.png]]


#### 명령어 수행

#### 유사코드
```
for _ in range(m):
	if command == 'L':
		B.append(A.pop())
	if command == 'D':
		A.append(B.pop())
	if command =='B':
		A.pop()
	if command == 'P $':
		A.append($)


print(A+B.reverse())
```

#### 코드
```
from sys import stdin as s

from collections import deque
A=deque(s.readline().rstrip()) #left side
B=deque() #right side
M=int(s.readline())

x=len(A)

cnt = 0

for _ in range(M):
    a=s.readline().rstrip()
    cnt+=1
    if a == 'L':
        if A:
            B.append(A.pop())
    if a == 'D':
        if B:
            A.append(B.pop())
    if a == 'B':
        if A:
            A.pop()
    if a[0]=='P':
        A.append((a.split(' ')[1]))

print("".join(A)+"".join(reversed(B)))
```

