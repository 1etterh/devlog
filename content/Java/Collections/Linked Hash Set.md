---
tags:
  - java
  - collections
  - list
  - set
---
> 중복 제거 + 순서 유지

# Syntax

```Java
Set<String> lSet = new LinkedHashSet<String>();  
lSet.add("ramen");  
lSet.add("pork");  
lSet.add("kimchi");  
lSet.add("friedEgg");  
lSet.add("soup");  
```

#### add()
> 새로운 요소 추가

# 반복

```Java
Iterator<String> iterator = lSet.iterator();  

while (iterator.hasNext()) {  
    System.out.print(iterator.next()+", ");  
}
```