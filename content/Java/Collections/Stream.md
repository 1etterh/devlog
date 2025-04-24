---
tags:
  - java
  - stream
  - collections
---
# Stream
> Collections의 각 요소를 하나씩 순회하면서 처리 <br/>
> 필요시 병렬 처리 가능 <br/>

#### Stream 특징
1. 원본을 변경하지 않는 읽기 전용
2. iterator처럼 한번 쓰면 사라짐
3. 최종 연산의 호출 전까지 중간 연산이 처리되지 않음

#### Stream 종류
##### 1. 생성
1. Arrays.stream()
2. Builder
3. iterate
##### 2. 가공(Intermediate Operator)
> 연결되어 파이프라인 형성, 터미널 작업이 호출될 때 까지 대기
> 터미널 작업이 결과를 생성할 때 필요한 경우에만 실행됨
> cf.`method chaining`
1. filter: 결과 필터링
2. map: 결과에 추가적인 연산
3. flatMap: 다차원 배열같은걸 1차원 배열같은걸로 변환
4. sorted(Comparator): 정렬
##### 5. 결과(Terminal Operator)
> 전체 파이프라인의 실행을 트리거함
1. reduce
2. collect


