---
title: "[vuejs] Codemirror 코드 브라우저에서 실행"

tags:
  - "#vuejs"
  - codemirror
---
# CodeMirror
브라우저 내에서 코드 에디터처럼 동작하는 UI 컴포넌트

#### V-model
1. v-bind와 v-on을 조합하여 작동함
2. 입력 받은 데이터를 알아서 적용해줌
3. 한국어는 안되는듯

#### CodeMirror에 V-model 적용
```
    <Codemirror
    v-model:value="code"
    :options="cmOptions"
    border
    placeholder="Enter your code here..."
    :height="200"
    @change="change"
    id="editor"
  />
```

1. v-model:value="code": 입력이 들어오면 code라는 변수에 값을 저장한다.
2. CodeMirror에 입력된 값은 this.code로 접근한다.

#### Pyodide로 Code 실행

```
runCode(){
    let res = this.pyodide.runPython(this.code);
    console.log(res);
  }
```

