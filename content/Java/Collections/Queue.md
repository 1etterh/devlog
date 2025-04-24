> 선입선출 구조 <br/>
> FIFO : First In First Out

# Syntax
> Queue는 Interface라서 이들의 서브타입인  LinkedList를 통해 객체를 생성한다.

```Java
Queue<String> queue = new LinkedList<>();
```

##### offer
> Queue의 끝에 원소 추가

```Java
queue.offer("first");
```
##### poll
> 가장 앞의 원소를 꺼냄

```Java
String str = queue.poll();
```
##### peek
> 맨 앞의 원소를 확인(안 꺼냄)
```Java
String str2 = queue.peek();
```
# [[Priority Queue]]
> 우선순위가 있는 Queue <br/>
> 일반적으로 binary heap을 사용


