---
tags:
  - database
  - modeling
---
### 정규화(Normalization)
> Normalization is a technique that can help you avoid data anomalies and other problems with managing your data.<br/>
> 데이터의 **안정성**과 **확장성**을 도모하기 위한 데이터베이스 설계 기법

_안정성_
- **함수 종속을** 기반으로 데이터의 성격에 맞는 Entity가 도출되어 모델 구조를 정의할 수 있다.
_확장성_
- 데이터의 정체성이 그대로 반영되어 업무가 수정되거나 추가되어도 엔터티에 반영하기가 수월해진다.
**_함수 종속_**
- 릴레이션 내에 존재하는 속성간의 종속성을 의미
- 대표속성(식별자)이 나머지 속성을 유일하게 식별할 수 있다면 대표속성과 나머지 속성 사이에는 연관관계가 성립하고 이것을 함수 종속이라고 한다.
- 속성간의 종속성을 나눌 때 기준이 되는 결정자(Determinant)와 결정자의 값에 의해 유일하게 식별될 수 있는 값을 종속자(Dependent)라고 한다.

### 정규화의 종류
1. [[제 1정규형]]
2. 제 2정규형
3. 제 3정규형
4. BCNF
5. 제 4정규형
6. 제 5정규형




###### reference: [mariadb.com](https://mariadb.com/kb/en/database-normalization-overview/)
