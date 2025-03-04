---
tags:
  - chatting
  - springboot
  - project
  - mongodb
  - nosql
draft: false
title: 1. [MongoDB] 설정
---

WebSocket 기본적인 사용은 [[ChattingStory_0]]에서 해봤으므로 MongoDB 설정 과정을 정리함.

# 1. Dependencies

![[Pasted image 20250303163527.png]]

> build.gradle에 dependencies 추가

```gradle title="build.gradle"
// MongoDB  
implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
```

# 2. Configuration
> MongoDB Compass shell에서 chattingstory Connection을 위해 읽기, 쓰기 권한이 있는 유저를 생성

```cmd
use admin

db.createUser({ user: "chattingstory", pwd: "chattingstory", roles: [ { role: "readWrite", db: "chattingstorydb" } ] })
```

application.yml에 connection 정보 추가
```yml title="application.yml"
spring:
  data:
    mongodb:
      uri: mongodb://chattingstory:chattingstory@localhost:27017/chattingstorydb?authSource=admin
```

MongoConfig에 Connection , MongoTemplate @Bean 등록
```Java title="MongoConfig.java"
  
@Configuration  
@RequiredArgsConstructor  
public class MongoConfig {  
    @Value("${spring.data.mongodb.uri}")  
    private final String uri;  
  
    @Bean  
    public MongoTemplate mongoTemplate(MongoClient mongoClient){  
        return new MongoTemplate(mongoClient, "chattingstorydb");  
    }  
  
    @Bean  
    public MongoClient mongoClient(){  
        return MongoClients.create(uri);  
    }  
}
```



# 3. Terms
> MongoDB의 용어를 정리해봤다.

| MongoDB           | RDBMS         | 설명                 |
| ----------------- | ------------- | ------------------ |
| Connection        | Connection    | 데이터베이스에 연결된 상태     |
| Database          | Database      | 데이터 저장소의 최상위 단위    |
| Collection        | Table         | 관련 데이터를 그룹화하는 구조   |
| Document          | Row/Tuple     | 데이터의 개별 레코드        |
| Field             | Column        | 데이터의 속성 또는 값       |
| _id               | Primary Key   | 각 레코드의 고유 식별자      |
| Embedded Document | -             | 문서 내에 포함된 하위 문서 구조 |
| Index             | Index         | 검색 성능을 향상시키는 구조    |
| Query             | SQL           | 데이터를 검색하는 방식       |
| Aggregation       | Join/Group by | 데이터 집계 및 처리 방식     |
# 4. Document
> Spring Data로 관리할 MongoDB 객체

ChattingStoryDB의 Message Collection에 저장할 ChattingMessage 클래스를 생성
```Java title="ChattingMessage.Java"
@Document(collection="message")  
public class ChattingMessage {  
  
    @Id  
    private String id;  
    private String roomId;  
    private String senderId;  
    private String content;  
    private LocalDateTime createdAt;  
    private MessageType type;  
  
}
```

# 5. Repository
> MongoDB에 저장된 영속성 데이터 관리

```Java title="ChatMessageRepository.Java"
@Repository  
public interface ChatMessageRepository extends MongoRepository<ChattingMessage, String> {  
    List<ChattingMessage> findByRoomIdOrderByCreatedAtDesc(String roomId, Pageable pageable);
}
```
# References
1. [MongoDB-Connections](https://www.mongodb.com/docs/drivers/java/sync/upcoming/fundamentals/connection/connect/#std-label-connect-to-mongodb)
2. [MongoDB-MongoClient](https://www.mongodb.com/docs/drivers/java/sync/upcoming/fundamentals/connection/mongoclientsettings/)
3. [SpringBoot-MongoInstance](https://docs.spring.io/spring-data/mongodb/reference/mongodb/configuration.html)
4. [SpringBoot-TemplateAPI](https://docs.spring.io/spring-data/mongodb/reference/mongodb/template-api.html)
5. [SpringData-MongoDB](https://spring.io/guides/gs/accessing-data-mongodb)


