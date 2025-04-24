> key : value 쌍(Entry)을 저장하는 자료구조

# Syntax

```Java
Map<Integer, String> hMap = new HashMap<>();

hMap.put(12, "red apple");
```

# Terms
#### entry
> key + value 쌍

#### key
> 중복되지 않는 식별자(Primary Key 같은 것)
> 동등 기준으로 중복 판단 (cf. [[Set]])



# 반복
#### 1. keySet() 활용

```Java
Set<String> keys = hMap2.keySet();  
Iterator<String> iterator = keys.iterator();  
while (iterator.hasNext()) {  
    String key = iterator.next();  
    System.out.printf("(%s, %s)\n", key, hMap2.get(key));  
}
```


#### 2. entrySet() 활용

```Java
Set<Map.Entry<String, String>> entrySet = hMap2.entrySet();  
Iterator<Map.Entry<String, String>> iterEntry = entrySet.iterator();  
while (iterEntry.hasNext()) {  
    Map.Entry<String, String> entry = iterEntry.next();  
    System.out.println();  
    System.out.printf("(%s, %s)", entry.getKey(), entry.getValue());  
  
}
```

### [[Properties]]
> key, value 모두 String인 HashMap