---
tags:
  - algorithms
  - baekjoon
  - regex
  - regularexpression
  - 정규표현식
  - 정규식
draft: false
description:
---
## [문제 설명](https://www.acmicpc.net/problem/15725)

최고 차항의 차수가 1이며, 항의 개수가 최대 2개인 다항식을 미분한 결과를 출력한다.
변수는 항상 x로 주어진다.

## 풀이과정
### 입력이 상수인 경우
> 0 출력

### 입력에 변수(x)가 포함된 경우
> ax + b, a - bx, x, -x, ...

#### 정규식 분리
1. 연산자(+,-)를 포함한 형태로 일차항을 추출한다.
> 일차항이 뒤에 있는 경우 +,-를 포함한 형태로 추출해야 제대로 된 값을 찾을 수 있음
```python
x = re.findall(r"[-|+]?[0-9]*x",p)[0]
```
> 이 경우 +ax, ax, -ax, x, +x, -x 의 형태로 결과가 나온다.

2. x와 +를 제거
> 일차항을 미분하면 계수만 남으므로, x를 제거함과 동시에 불필요한 + 부호를 제거한다.
```python
x = re.sub(r'\+|x',"",x)
```

3. 계수의 절댓값이 1인 경우
> 빈 문자열, +, -만이 결과로 출력되므로 -1,1을 출력해준다.

```python
y = re.findall(r"-?[0-9]+",x)
    if len(y) == 0:
        if '-' in x:
            print(-1)
        else:
            print(1)
    else:
        print(x)
```
## 전체 코드
```Python
from sys import stdin as s

import re
s= open(r"Baekjoon\15275\input.txt")
p = s.readline().rstrip()

# 변수 x가 포함된 식
if 'x' in p:
   # 일차항 추출
	x = re.findall(r"[-|+]?[0-9]*x",p)[0]
    x = re.sub(r'\+|x',"",x)

	# 계수의 절대값이 1인 경우 확인
    y = re.findall(r"-?[0-9]+",x)
    if len(y) == 0:
        if '-' in x:
            print(-1)
        else:
            print(1)
    else:
        print(x)
# 상수만이 입력으로 주어진 경우
else:
    print(0)
```

## 후기
쉬워보이지만 예외 처리가 까다로운 문제였다.