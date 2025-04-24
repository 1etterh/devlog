---
tags:
  - java
  - process
  - ram
  - thread
  - jvm
---
# [[Process]]

![[content/Java/assets/java_process.png]]

 - Application.Class(Byte Code): JVM이 이해할 수 있는 언어
 - binary Code: CPU가 이해할 수 있는 언어
# Java - Execution - Process
#### 1. Application.java
> java코드로 작성된 파일
#### 2. Application.class
> javac(Compiler)으로 컴파일된 바이트 코드
#### 3. Run-Time Data Areas 생성
> JVM은 `Application.class` 를 실행하면 Run-Time Data Area를 정의한다.
###### 3-1. Java Virtual Machine Stacks
1. 각 `thread`는 자신만의 Stack영역을 가진다.
2. thread는 호출된 함수를 frame으로 저장하고, 그 frame내에 해당 함수의 지역변수를 저장한다.
3. 함수가 너무 많이 쌓이면 Stack Overflow가 발생한다.
###### 3-2. Heap Area
1. Heap영역은 모든 thread에서 공유된다.
2. `reference type data`를 저장한다.
> JVM은 모든 스레드에서 공유되는 Heap 영역을 가지며, 이 영역에는 프로그램을 실행하면서 생성한 모든 객체를 저장한다. 
###### 3-3.  Method Area
1. Method 영역은 모든 thread에서 공유된다.
2. 전역변수, static 변수, 필드, 메서드 데이터와 같은 클래스별 구조와 클래스 및 인터페이스 초기화와 인스턴스 초기화에 사용되는 특수 메서드를 포함한 메서드 및 생성자 코드를 저장



# references: 
_java.lang.Method_, 
[_docs.oracle.com/The Structure of the Java Virtual Machine_](https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-2.html)
