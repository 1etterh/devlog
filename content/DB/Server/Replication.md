---
tags:
  - database
  - db
  - sql
---


> 2대 이상의 DBMS를 publisher-subscriber(or master-slave) 구조로 나누어 비동기 복제방식으로 데이터를 저장하는 방식

> publisher는 server-id를 1번으로 가지고 subscriber은 server-id를 2번 이상부터 가지게 되며 서로 고유하게 부여하여 작동시켜야된다.

![[Replica Set.png]]
#### Replica Set - Settings
- master: slave의 정보
- slave: master와 binary log file의 정보

#### 작동
1. master DB는 create, update, delete를 처리하고 binary log를 기록하여 서버로 전달
2. slave는 일정한 주기로 binary log를 master에게 전달받아 자신의 DB에 적용
3. slaveDB는 read만 가능
4. masterDB와 slaveDB의 역할을 분담하여 DB의 부하를 분산시킨다.
5. 후에 slave의 수가 늘어날 수 있다.

[_Mariadb.Docs_](https://mariadb.com/kb/en/replication-overview/)
