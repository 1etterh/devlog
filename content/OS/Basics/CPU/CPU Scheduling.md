> [[#^3a1e69|CPU를 효율적으로 활용]]하기 위해 스케줄링 알고리즘을 통해 효율적으로 [[프로세스]]를 선택함

## 1. CPU 성능 척도

^3a1e69

> Performance Index(= Performance Measure, 성능 척도)

1. CPU utilization(이용률 ft. [[CPU Burst Time]])
2. Throughput(처리량)
3. Turnaround time(소요시간, 변환시간): CPU사용 시간 + CPU 대기 시간 총합
4. Waiting time(대기 시간): 기다린 시간의 합(5의 합)
5. Response time(응답시간): cpu 쓰러 줄에 대기중 처음으로 쓸 때 까지 걸리는 시간

> 1, 2는 시스템 입장, 3,4,5는 사용자 입장

## 2. CPU Scheduling의 종류

### 1. Single Processor Scheduling

### 2. [[Multi Processor Scheduling]]

> CPU가 여러개인 경우 스케줄링은 더욱 복잡해짐

### 3. [[Real-Time Scheduling]]

### 4. [[Thread Scheduling]]

## 3. CPU Scheduling Algorithms

### 1. [[Preempted]]\(선점형\)

### 2. [[NonePreempted]]\(비선점형\)

### 3. SJF

> SJF + 선점형 : SRTF

## 4. Algorithm Evaluation

### 1. Queueing models

> 확률 분포로 주어지는 arrival rate와 service rate 등을 통해 각종 performance index 값을 계산

### 2. Implementation(구현) & Measurement(성능 측정)

> 실제 시스템에 알고리즘을 구현하여 실제 작업(workload)에 대해 성능을 측정 비교

### 3. Simulation(모의 실험)

> 알고리즘을 모의 프로그램으로 작성 후 trace를 입력으로 하여 결과 비교

## 5. CPU Scheduler & Dispatcher

### CPU Scheduler

> Ready 상태의 프로세스 중에서 이번에 CPU를 줄 프로세스를 고름

### Dispatcher

> CPU 제어권을 CPU scheduler에 의해 선택된 프로세스에게 넘긴다
> 이 과정을 contet switching(문맥 교환)라고 한다

### 6. CPU 스케줄링이 필요한 경우

> 프로세스에 상태 변화가 발생

1. Running -> Blocked(ex. syscall)
2. Running -> Ready(ex. timer interrupt)
3. Blocked -> Ready(ex. IO 완료 후 interrupt)
4. Terminate

1, 4에서의 스케줄링은 nonpreemptive(비선점)
나머지는 preemptive(선점)
