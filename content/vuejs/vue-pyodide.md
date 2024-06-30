---
title: vue-pyodide
tags:
  - "#vuejs"
  - brython
---
#### 참고자료
1. [Brython.info](https://brython.info/)
2. [vue-pythonpad-runner](https://github.com/pythonpad/vue-pythonpad-runner)
3. [Pyodide](https://pyodide.org/en/stable/usage/index.html)

### 브라우저용 Python 라이브러리

#### Pyodide vs Brython
1. _Pyodide_  
	1. 전체 Python 인터프리터를 WebAssembly로 컴파일하여 브라우저에서 실제 Python 바이트 코드 실행.
	2. Numpy, Pandas와 같은 Python 생태계 라이브러리 사용이 가능하여 브라우저 내에서 기본적인 Python처럼 활용 가능
	3. 초기 로딩 시간이 길어질 수 있음
	4. 브라우저에서 파이썬 코드를 컴파일하고 실행한다고 보면 될듯
2. _Brython_
	1. Python 코드를 즉시 JavaScript로 변환.
	2. Pyodide에 비해 로딩 시간이 짧음
	3. 복잡한 Python라이브러리 사용 불가
	4. 파이썬을 Javascript로 번역한 후 브라우저에서 실행한다고 생각하면 될듯

#### Pyodide 선택 이유
알고리즘 시간복잡도를 계산할 때 브라우저의 Javascript 성능에 관계 없이 결과를 얻기 위하여 _Pyodide_ 선택
#### Component에 Pyodide 추가 

###### 1. vue-plugin-load-script 설치

```
npm install --save vue-plugin-load-script@^2.x.x
```

###### 2. main.js 수정

_main.js_
```
import { createApp } from 'vue'
import App from './App.vue'
import LoadScript from 'vue-plugin-load-script'
const app=createApp(App);
app.use(LoadScript);
app.mount('#app');
```

###### 3. Python을 실행할 Vue Component 생성

_Editor.vue_
```
<template>
  <div>Editor</div>
</template>
<script>
export default {
name: 'Editor',
mounted(){
this.$loadScript('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js')
  .then(() => {
    console.log('Script loaded');
    this.initPyodide();
  })
},
methods:{
  async initPyodide(){
    let pyodide = await window.loadPyodide();
    console.log(pyodide.runPython("1+2"));
  }
}
}
</script>
<style>

</style>
```





#### 해결 과정
1. index.html에 직접 script 태그를 생성하면 build 과정에서 오류가 생긴다.
2. 따라서 Script Loader 플러그인 설치 후 사용해야함
