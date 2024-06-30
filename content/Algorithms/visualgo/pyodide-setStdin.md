---
title: pyodide-setStdin
tags:
  - pyodide
  - vuejs
---
#### 참고자료
1. [Pyodide.org](https://pyodide.org/en/stable/usage/streams.html)


#### pyodide.setStdin
1. stdin을 지정할 수 있음(redirection)
2. . Pyodide 공식 문서에서는 두 가지 예를 보여준다.
	1. Stdin Handler
	2. Read Handler

###### 1. Stdin Handler 

리턴값:
1. 텍스트 전체
2. utf8 인코딩된 char의 배열
3. 0~255 수 
4. undefined / null

```
class StdinHandler {
  constructor(results, options) {
    this.results = results;
    this.idx = 0;
    Object.assign(this, options);
  }
  stdin() {
    return this.results[this.idx++];
  }
}

pyodide.setStdin(
  new StdinHandler(["a", "bcd", "efg"]),
);
pyodide.runPython(`
    assert input() == "a"
    assert input() == "bcd"
    assert input() == "efg"
    # after this, further attempts to read from stdin will return undefined which
    # indicates end of file
    with pytest.raises(EOFError, match="EOF when reading a line"):
        input()
`);

```


###### 2. Read Handler-Uint8Array

```
const fs = require("fs");
const tty = require("tty");
class NodeReader {
  constructor(fd) {
    this.fd = fd;
    this.isatty = tty.isatty(fd);
  }

  read(buffer) {
    return fs.readSync(this.fd, buffer);
  }
}

const fd = fs.openSync("input.txt", "r");
py.setStdin(new NodeReader(fd));

```


###### 1번의 경우를 활용하여 다음과 같이 코드를 작성했다.

```
<template>
  <div>
    <Codemirror
    v-model:value="code"
    :options="cmOptions"
    border
    placeholder="Enter your code here..."
    :height="200"
    @change="change"
    id="editor"
  />
  </div>
  <Button @click="runCode()" v-bind:disabled="pyodide==null">Run</Button>
  <p v-if="pyodide==null">Please wait...</p>
  <input type="file" @change="handleFiles" multiple>
  <ul>  
  <li v-for="file in files" :key="file.name">{{ file.name }}</li>
  </ul>
</template>
<script>
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/python/python.js";
import "codemirror/theme/material-ocean.css";
import "codemirror/addon/display/placeholder.js";

import {ref} from 'vue';

export default {
name: 'Editor',
components: {
Codemirror,
},

data(){
  return{
    pyodide:null,
    files:[]
  }
}
,
setup(){
  const code = ref(`3**3`);
  return{
    code,
    cmOptions:
    {
      styleActiveLine: true,
      lineNumbers: true,
      mode:"text/x-python",
      theme:"material-ocean",
      }
          }
        }

      ,

mounted(){this.$loadScript('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js')
.then(() => {
    console.log('Script loaded');
    this.initPyodide();
  })

},

  

methods:{
  async initPyodide(){
    this.pyodide = await window.loadPyodide();
    console.log(this.pyodide.runPython(this.code));
  },

  runCode(){
    let res = this.pyodide.runPython(this.code);
    console.log(res);
    // this.pyodide.setStdin();
    if(this.files.length>0){
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target.result;
          this.pyodide.setStdin(new StdinHandler(contents.split()));
          this.pyodide.runPython(
            `
            from sys import stdin as s
            print(s.readlines())
            `
          );
        };
        reader.readAsText(file);
      }
    }
      },
  handleFiles(e){
    this.files = e.target.files;
    console.log(this.files);
}
}
}

class StdinHandler{
  constructor(results,options){
    this.results = results;
    this.idx = 0;
    Object.assign(this,options);
  }
  stdin(){
    return this.results[this.idx++];
  }
}

  

</script>

  

<style scoped>

  

</style>
```


