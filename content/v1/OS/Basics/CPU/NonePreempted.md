---
draft: true
---

>일단 CPU를 잡으면 CPU burst가 완료될 때 까지 CPU를 선점(preemption)당하지 않음


### 1. FCFS(First Come, First served)
> 가장 먼저 온 작업을 가장 먼저 처리하는 알고리즘(비선점)
> 길게 수행되는 프로세스 때문에 준비 큐에서 오래 기다리는 현상(Convoy effect) 발생

### 2. SJF(Shortest Job First)
> 각 프로세스의 다음번 CPU Burst time을 스케줄링에 활용
> CPU burst time이 가장 짧은 프로세스를 가장 먼저 스케줄

#### 문제점
1. starvation
2. cpu burst time을 알 수 없음(exponential averaging)
	1. T(n+1) = a\*T(n) + (1-a)\*T'(n)
	2. T: 실제 Cpu burst time, T': Cpu burst time의 추정치, 0<=a<=1
	3. T(n+1) = a\*T(n) + (1-a)\*a\*T(n-1) + ... +(1-a)\^t\*a\*T(n-j) + ... + (1-a)\^(n+1)\*T'(0)
	4. 후속 term은 선행 term보다 적은 가중치 값을 가짐
