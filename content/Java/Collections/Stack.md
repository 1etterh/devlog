> 후입선출(LIFO) 형태의 자료구조
# Syntax

```Java
Stack<Integer> integerStack = new Stack<>(); 
integerStack.push(1);  
integerStack.push(2);  
integerStack.push(3);  
integerStack.push(4);  
integerStack.push(5);

int x = integerStack.peek();
```

#### push()
> Stack의 맨 뒤에 새로운 요소 추가
### pop()
> Stack의 맨 뒤의 요소를 제거 후 리턴값으로 반환
#### peek()
> 맨 위의 요소를 리턴(제거X)