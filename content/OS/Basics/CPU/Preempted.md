---
draft: true
---

> 현대 운영체제가 쓰는 방식
> 알고리즘에 의해 프로세스의 작업 중단 및 다른 프로세스 실행 가능


### 1. RR(Round Robin)
> 일반적으로 SJF보다 average turnaround time이 길지만, response time은 더 짧다.

1. 각 프로세스는 동일한 크기의 할당 시간(**time quantum**)을 가짐
	(일반적으로 10 - 100 ms)
2. 할당 시간이 지나면 프로세스는 선점(preempted) 당하고 ready queue의 제일 뒤에 가서 다시 줄을 선다
3. n개의 프로세스가 ready queue에 있고, 할당 시간이 q time unit인 경우, 각 프로세스는 최대 q time unit 단위로 CPU 시간의 1/n을 얻는다.
	=> 어떤 프로세스도 (n-1)q time unit이상 기다리지 않음
4. Performance
	1. q large => FCFS
	2. q small => context switch overhead가 커짐
5. CPU 사용 시간이 다른 job이 혼합된 경우 효과적임 

### 2. Multi Level Queue
1. Ready Queue를 여러개로 분할
	1. foreground(interactive)
	2. background(batch - no human interaction)
2. 각 큐는 독립적인 스케줄링 알고리즘을 가짐
	1. foreground - RR
	2. background - FCFS
3. 큐에 대한 스케줄링이 필요
	1. Fixed priority scheduling
		1. serve all from foreground then from background
		2. possibility of starvation
	2. Time slice
		1. 각 큐에 CPU time을 적절한 비율로 할당
		2. Eg. 80% to RR, 20% to background in FCFS

### 3. Multilevel Feedback Queue
1. 프로세스가 다른 큐로 이동 가능(cf. Multi Level Queue는 불가능)
2. aging을 이와 같은 방식으로 구현할 수 있다
3. Multilevel-feedback-queue scheduler를 정의하는 parameter들
	1. Queue의 수
	2. 각 queue의 scheduling algorithm
	3. process를 상위 큐로 보내는 기준
	4. process를 하위 큐로 내쫓는 기준
	5. 프로세스가 CPU 서비스를 받으려 할 때 들어갈 큐를 결정하는 기준
##### Example of Multilevel Feedback Queue
Three Queues
1. Q0 - time quantum 8 ms
2. Q1 - time quantum 16 ms
3. Q2 - FCFS
Scheduling
4. new job이 queue Q0로 들어감
5. CPU를 8ms동안 수행
6. 8ms내로 다 끝내지 못하면 Q1으로 내려감
7. Q1에서 기다렸다가 CPU를 16ms동안 수행
8. 16ms내로 다 끝내지 못하면 Q2로 내려감


### 4. SRTF(SJF + Preemption)
> 현재 수행중인 프로세스의 남은 burst time보다 더 짧은 CPU burst time을 가지는 새로운 프로세스가 도착하면 CPU를 빼앗긴다
### 5. Priority Scheduling(우선순위 스케줄링)
> A priority number(integer) is associated with each process
> highest priority를 가진 프로세스에 CPU 할당

1. SJF는 일종의 priority scheduling
2. 문제점: Starvation
3. 해결책: Aging