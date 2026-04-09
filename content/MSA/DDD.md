---
tags:
  - ddd
  - domain
draft: true
description:
---
> Domain Driven Design

# DDD 설계 과정(작성중)

### 1. Event Storming
1. 조회 빼고 이벤트 작성(DML만 고려) - 서로 간섭하지 않기... 
2. event: 과거형으로 작성 (~~ 발생함)
3. 중복 제거
4. 시간 순으로 배치(좌우)
5. 배타적 관계 : 위아래로 배치
6. DDD: 유비쿼터스 언어(모두가 이해할 수 있음)로 해야됨 - 기획자, 모델러, 개발자, 도메인 관계자...
7. External System(외부 모듈) 작성
8. Command: 요청-> 현재형, transaction
9. hotspot: 후에 남아있으며 안됨...-> 댓글같은거(나중에 합의 후 삭제)
10. Actor: command를 날리는 주체
11. Aggregate 작성 cf. root aggregate -> bounded context
### 2. Bounded Context

#### Bounded Context 도출
1. Aggregate중 가장 핵심이 되는 주체를 Root Aggregate로 설정한다.(컨텍스트)
2. 이후 Bounded Context를 기준으로 MicroService로 분할된다.
3. 이후 도메인을 기반으로 Command와 Query를 분리할 수 있다.

#### 외부 Bounded Context 요청 정의
1. Domain 내부에서 해결할 수 없는 문제는 타 Bounded Context의 Command에 요청
2. Subdomain끼리 통신

### 3. Context Mapping
1. Context끼리 통신 관계를 정의한다.
2. 실선(동기 통신), 점선(비동기 통신)

# 용어
1. **Domain Event**
    - **도메인 내에서 중요한 사건이나 변화를 나타내는 사건이**다. 이벤트는 특정 상태의 변화를 나타내며, 대개는 **과거 시제로 이름**이 지어진다. 예: **`OrderPlaced`**, **`ProductShipped`**.
2. **External System**
    - 도메인의 외부에 있는 시스템. DDD 시스템은 종종 **다른 외부 시스템과 상호 작용**해야 한다. 이런 상호 작용은 통합 이벤트나 인터페이스를 통해 이루어 진다.
3. **Command**
    - **시스템에 특정한 동작이나 행동을 수행하도록 요청**하는 메시지이다. 커맨드는 대개 명령형과 현재 시제로 이름이 지어진다. 예: **`PlaceOrder`**, **`ShipProduct`**.
4. **Hot Spot**
    - 도메인 모델 내에서 **변경이나 확장성이 빈번하게 발생할 것으로 예상되는 영역이**다. 이러한 핫 스팟은 모델의 유연성과 확장성에 큰 영향을 미칠 수 있다.
5. **Actor**
    - **도메인이나 시스템과 상호 작용하는 사용자나 시스템**을 나타낸다. 액터는 특정 역할이나 책임을 가질 수 있다.
6. **Aggregate**
    - **관련된 객체와 엔터티의 클러스터**로, 외부 객체들과의 **일관성 경계**를 제공한다. **어그리게이트 루트**는 해당 애그리게이트의 **대표 엔터티**로서, **외부 객체가 해당 어그리게이트와 상호 작용할 때 사용된**다.
    - 이벤트에 의해 영향 받는 객체를 의미한다.
7. **Policy**
    - **특정한 조건이 충족될 때 어떤 행동이나 연산이 발생해야 하는지를 정의한 규칙이나 지침**이다. 정책은 비즈니스 로직을 표현하는 데 중요한 역할을 한다.
8. **Read Model**
    - CQRS (Command Query Responsibility Segregation) 아키텍처에서 사용되는 패턴 중 하나로, 시스템의 쿼리 모델을 나타낸다. **읽기 모델은 데이터를 사용자에게 보여주는 데 최적화**되어 있다.


# Domain
> 비즈니스 영역에서 해결하고자 하는 문제, 관심사

# references