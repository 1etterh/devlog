---
title: "[Python] AST관련 기본 개념정리"

tags:
  - python
  - interpreter
  - ast
  - algorithms
---
#### 참고자료
1. [geeksforgeeks.org](https://www.geeksforgeeks.org/types-of-issues-and-errors-in-programming-coding/)
2. [docs.python.org](https://docs.python.org/ko/3/library/ast.html)
3. [en.wikipedia.org](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
#### 알고리즘 분석
1. 목표: 코드 내에 존재하는 변수, 함수, 클래스 추적
2. 입력: 코드, 테스트 데이터
3. 출력: 시각화된 변수 값
#### AST
1. _명칭_ : Abstract Syntax Tree(추상 구문 트리)
2. _기능_ : 소스 코드를 추상화 하여 트리 형태로 나타냄. 
3. 트리의 노드: 소스 코드에 존재하는 객체
4. 로직만 표현할 수 있기 때문에 실행 값은 따로 구해야함.
5. visit~: ~가 선언됐다는 뜻. dfs순회
6. visit _loop_ : _loop_가 인식됐음을 표시. _loop_ 의 반복횟수는 상관없음. (실제 실행이 아니기 때문)
7. walk: bfs 순회, 타 노드와의 관계에 상관 없을 때 사용


#### Python AST
1. Python에 내장된 ast 관련 라이브러리
2. _[Abstract Grammar](https://docs.python.org/3/library/ast.html#abstract-grammar)_
3. _ast.parse()_ : ast생성 및 컴파일. ast Object 반환
4. _ast.dump()_ : _ast.parse_ 에서 생성된 결과물을 string으로 변환
5. _ast.NodeVisitor_ : ast에서 생성된 노드를 방문하는 클래스
6. _ast.generic_visit()_ : 자식 노드에 visit() 모두 실행
7. _ast.NodeTransformer()_ : node의 값 변경을 허용하는 NodeVisitor의 subclass

#### Example
###### example.py
```
def compute(x, y):
    result = x + y
    return result
class Example:
    def method(self):
        pass
x=0
for i in range(5):
    compute(i, i+1)
    x+=i
```


1. _ast.parse(code)_

```
<ast.Module object at 0x0000024D99C3B370>
```

2. _ast.dump(parsed_code)_

```
Module(
    body=[
        FunctionDef(
            name='compute',
            args=arguments(
                posonlyargs=[],
                args=[
                    arg(arg='x'),
                    arg(arg='y')],
                kwonlyargs=[],
                kw_defaults=[],
                defaults=[]),
            body=[
                Expr(
                    value=Call(
                        func=Name(id='print', ctx=Load()),
                        args=[
                            Constant(value='Function: compute, Line number: 2')],
                        keywords=[])),
                Assign(
                    targets=[
                        Name(id='result', ctx=Store())],
                    value=BinOp(
                        left=Name(id='x', ctx=Load()),
                        op=Add(),
                        right=Name(id='y', ctx=Load()))),
                Expr(
                    value=Call(
                        func=Name(id='print', ctx=Load()),
                        args=[
                            Constant(value='Variable: result updated to ='),
                            BinOp(
                                left=Name(id='x', ctx=Load()),
                                op=Add(),
                                right=Name(id='y', ctx=Load()))],
                        keywords=[])),
                Return(
                    value=Name(id='result', ctx=Load()))],
            decorator_list=[]),
        ClassDef(
            name='Example',
            bases=[],
            keywords=[],
            body=[
                Expr(
                    value=Call(
                        func=Name(id='print', ctx=Load()),
                        args=[
                            Constant(value='Class: Example, Line number: 6')],
                        keywords=[])),
                FunctionDef(
                    name='method',
                    args=arguments(
                        posonlyargs=[],
                        args=[
                            arg(arg='self')],
                        kwonlyargs=[],
                        kw_defaults=[],
                        defaults=[]),
                    body=[
                        Expr(
                            value=Call(
                                func=Name(id='print', ctx=Load()),
                                args=[
                                    Constant(value='Function: method, Line number: 7')],
                                keywords=[])),
                        Pass()],
                    decorator_list=[])],
            decorator_list=[]),
        Assign(
            targets=[
                Name(id='x', ctx=Store())],
            value=Constant(value=0)),
        Expr(
            value=Call(
                func=Name(id='print', ctx=Load()),
                args=[
                    Constant(value='Variable: x updated to ='),
                    Constant(value=0)],
                keywords=[])),
        For(
            target=Name(id='i', ctx=Store()),
            iter=Call(
                func=Name(id='range', ctx=Load()),
                args=[
                    Constant(value=5)],
                keywords=[]),
            body=[
                Expr(
                    value=Call(
                        func=Name(id='print', ctx=Load()),
                        args=[
                            Constant(value='Loop iteration with i ='),
                            Name(id='i', ctx=Load())],
                        keywords=[])),
                Expr(
                    value=Call(
                        func=Name(id='compute', ctx=Load()),
                        args=[
                            Name(id='i', ctx=Load()),
                            BinOp(
                                left=Name(id='i', ctx=Load()),
                                op=Add(),
                                right=Constant(value=1))],
                        keywords=[])),
                AugAssign(
                    target=Name(id='x', ctx=Store()),
                    op=Add(),
                    value=Name(id='i', ctx=Load()))],
            orelse=[])],
    type_ignores=[])
    
```

