---
tags:
  - jpa
  - java
  - jdbc
  - db
draft: false
---
> 경량 영속성 도메인 객체
> Relational Database의 한 테이블의 행(row)를 의미함

## Entity Manager
1. Entity Manager가 엔티티를 저장하는 공간으로, 엔티티를 보관하고 관리한다.
2. Entity Manager가 생성될 때 하나의 영속성 컨텍스트가 만들어진다.
3. Entity Manager는 하나의 영속성 컨텍스트만 가질 수 있다.
## Entity Life Cycle
![[Pasted image 20241224122610.png]]

1. 비영속(new/transient): Entity가 영속성 컨텍스트와 전혀 관계가 없는 상태
2. 영속(managed): Entity가 영속성 컨텍스트에 저장된 상태
3. 준영속(detached): 영속성 컨텍스트에 저장되었다가 분리된 상태
4. 삭제(removed): Entity가 삭제된 상태
5. 병합(merge): 준영속 상태의 엔티티가 다시 영속 상태로 변경됨