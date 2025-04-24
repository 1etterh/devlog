---
title: vue-codemirror
tags:
  - vuejs
  - codemirror
---
# Codemirror
Web browser에서 동작하는 코드 에디터 컴포넌트
#### 설치

 ###### 1. npm

```
npm install codemirror-editor-vue3 codemirror@^5 -S
```


###### 2. main.js 수정

```
import { createApp } from 'vue'
import App from './App.vue'
import { InstallCodemirro } from 'codemirror-editor-vue3';
import LoadScript from 'vue-plugin-load-script'
const app=createApp(App);
app.use(LoadScript);
app.use(InstallCodemirro,{componentName:'CodeMirror'});
app.mount('#app');
```

###### 3. Editor.vue 수정

```
<template>
  <CodeMirror
  v-model:value="code"
  :options="{
    mode: 'python',
    theme: 'material',
    lineNumbers: true
  }"
  :height="200"
  />
  <div>Editor</div>
</template>
<script>
export default {
name: 'Editor',
components: {
},
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

# references
1. [_codemirror-editor-vue3_](https://www.npmjs.com/package/codemirror-editor-vue3)
