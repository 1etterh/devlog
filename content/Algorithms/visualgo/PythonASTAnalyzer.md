---
title: Python-AST-Analyzer
tags:
  - ast
  - python
  - algorithms
  - analysis
---
#### _ast.NodeTransformer_
1. _ast.NodeVisitor_ 의 서브 클래스
2. 노드 값 변경 허용
3. *코드를 구조화* 
4. visit_어쩌구: 코드 구조상의 노드 방문, 변수값 저장
5. 실제 실행은 아니기 때문에 반복문 횟수만큼 반복되지 않음.

#### _PythonASTAnalyzer(ast.NodeTransformer)_
1. **custom** **subclass** of *ast.NodeTransformer*
2. _visit_ ~  : save variable names
3. used for understanding the overall structure of Algorithm code
4. since it is used for understanding overall structure of code, it doesn't track actual value on runtime
5. creates AST Tree that contains node id, node number, etc...
6. Github: [PythonASTAnalyzer](https://github.com/1etterh/PythonAlgorithmAnalyzer/blob/main/trackers/PythonASTAnalyzer.py)

#### _ValueTracker(ast.NodeTransformer)_
1. **custom subclass** of _ast.NodeTransformer_
2. used for observing real values of variables in runtime
3. visualizes each turns of loop through graphviz
4. results are saved in _/graphs/${YYYYMMDD_TT_MM_SS}_
5. Github: [ValueTracker](https://github.com/1etterh/PythonAlgorithmAnalyzer/blob/main/trackers/ValueTracker.py)


