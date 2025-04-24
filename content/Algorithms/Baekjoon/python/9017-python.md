---
title: 9017-python
tags:
  - 백준
  - 정렬
  - 딕셔너리
  - sort
  - list
  - dictionary
---


사용된 개념: 딕셔너리, 리스트, 조건문, 정렬/dictionary, list, sort, conditions

| 등수  | 1   | ~~2~~   | 3   | 4   | 5   | 6   | ~~7~~   | ~~8~~   | 9   | 10  | 11  | 12  | 13  | 14  | 15  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 팀   | A   | ~~B~~   | C   | C   | A   | C   | ~~B~~   | ~~D~~   | A   | A   | C   | A   | C   | C   | A   |
| 점수  | 1   | ~~n/a~~ | 2   | 3   | 4   | 5   | ~~n/a~~ | ~~n/a~~ | 6   | 7   | 8   | 9   | 10  | 11  | 12  |

#### 점수 계산 조건
1. 팀원이 6명 이상인 경우에만 점수 부여
2. 상위 4명의 점수의 합이 가장 작은 팀이 우승
3. 동점의 경우 5번째 주자가 가장 빨리 들어온 팀이 우승


-B,D팀은 6명 미만이므로 점수 계산에서 제외
-따라서 A,C팀의 점수만 계산하게 된다.
1. A팀의 점수: 1,4,5,6,7,9
	1. 상위 4명의 점수 합: 16
	2. 5번째 선수의 점수: 7
2. C팀의 점수: 2,3,5,8,10,11
	1. 상위 4명의 점수 합: 16
	2. 5번째 선수의 점수: 10
조건 2가 동일하므로 조건 3에 따라 A팀이 우승팀이 된다.

#### 문제 풀이 과정
1. collections.Counter 활용하여 **조건 1** 적용
2. for 반복문을 사용하여 각 팀의 **점수**(not 등수)를 배열로 표현
3. 상위 4명의 점수를 계산
4. 5번째 선수의 점수를 계산

```
import sys,collections

  

t= int(sys.stdin.readline()) #테스트 케이스의 갯수

  

for _ in range(t):

    n= int(sys.stdin.readline()) #선수의 수

    rank=list(map(int,sys.stdin.readline().split())) #각 팀의 등수를 배열에 저장

    cnt = dict(collections.Counter(rank)) #각 팀의 인원수

    # cnt ={1:6, 2:2, 3:6, 4:1} key: 팀명, value: 팀원수

  

    res={k:[] for k,v in cnt.items() if 6<=v}

    #팀원이 6명 이상인 경우에 한하여 점수를 저장하기 위한 dictionary 생성(조건 1)

    # res = {1:[],3:[]}

  

    #팀별로 점수 저장

    point = 1

    for r in rank:

        if r in res.keys():

            res[r].append(point)

            point+=1

    #res = {1: [1, 4, 6, 7, 9, 12], 3: [2, 3, 5, 8, 10, 11]}  

  

    #4등까지의 점수

    res2={k:sum(v[:4]) for k,v in res.items()}

    #res2={1: 18, 3: 18}

    #dictionary에는 sort기능이 없으므로

    res3=sorted(res2.items(), key = lambda x:x[1])

  
  

    # 조건 1을 만족하는 팀이 한팀인 경우

    if len(res3)==1:

        print(res3[0][0])

  

    # 조건 2에서 동점이 있는 경우, 5등의 점수를 비교

    elif res3[0][1]==res3[1][1]:

        ls={k:res[k][4] for k in res2.keys() if res2[k]==res3[0][1]}

        ls2 = sorted(ls.items(), key = lambda x: x[1])

        print(ls2[0][0])

    else:

        print(res3[0][0])


```

### 후기
점수의 조건이 까다로워서 번거로웠던 문제였다.
역시 이런 긴 문제는 조건을 잘 읽어야 빨리 풀리는 듯 하다.