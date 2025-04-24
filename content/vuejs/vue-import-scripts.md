---
title: "[Vuejs] 외부 모듈 Import 하는 두 가지 방법"
tags:
  - vuejs
  - cdn
  - import
  - scriptloader
---
## 1. Script Element 생성하기

 _onMounted_ 내부에서 script 생성 후 HTML Head에 첨부

```vue
 <script>
//생략
 onMounted(async () => {

      const script = document.createElement('script');

      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';

      document.head.appendChild(script);

      script.onload = async () => {

        pyodide.value = await window.loadPyodide();

        console.log('Pyodide loaded');

      };

    });
//생략
 </script>
 
```



## 2. Vue-plugin-scriptLoader 설치


1. npm으로 설치

```cmd
npm install --save vue-plugin-load-script@^2.x.x
```

2. main.js 수정

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import LoadScript from 'vue-plugin-load-script'
const app=createApp(App);
app.use(LoadScript);
app.mount('#app');
```

3. VueComponent에서 $LoadScript 실행

```vue
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

개인적으로는 설치 없이 진행할 수 있는 1번이 좋은 것 같다.