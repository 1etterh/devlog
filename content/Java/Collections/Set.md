> 중복을 허락하지 않는 자료구조 <br/>
> 순서가 없다.


# Syntax
```Java
HashSet<String> hset = new HashSet<>();  
hset.add("Java");

```

> Hash~: hash를 이용해 검색 속도 향상

# 반복문
> Set은 인덱스 개념이 없어 iterator를 활용해야 한다.
```Java
Iterator<String> iterator = hset.iterator();  
while (iterator.hasNext()) {  
    System.out.print(iterator.next() + ", ");  
}
```


### Set 계열 자료구조
#### [[Linked Hash Set]]
> 중복 제거 + 순서 유지

#### [[Tree Set]]