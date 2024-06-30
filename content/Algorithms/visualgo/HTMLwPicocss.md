---
title: "[HTML,EJS] picocss 적용"

tags:
  - html
  - nodejs
  - picocss
---
#### 1. 기본 HTML환경 세팅

###### 1. 프로젝트 폴더 내에 Picocss 설치
```
C:\Dev\visualgo>npm install @picocss/pico
```

###### 2. 프로젝트 폴더 내에 HTML파일  작성
_index.html_
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="node_modules/@picocss/pico/css/pico.min.css">
</head>
<body>
    <h1>Hello, Pico CSS!</h1>
    <article>card</article>
  </body>
</html>
```

###### 3. server폴더 내에 express, nodemon 설치

```
C:\Dev\visualgo>npm i express
C:\Dev\visualgo>npm i nodemon
```

###### server.js 작성
```
const express=require('express');
const app = express();
const port=8080;
const path=require('path');
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}/`);
});
console.log(path.__dirname)
app.use('/',express.static(path.join(__dirname,"../")));
app.get('/',(req,res)=>{
res.sendFile(path.join(__dirname,'client/index.html'));
});
```

###### 5. 랜더링 확인
```
C:\Dev\visualgo>nodemon server.js
```





#### 2. EJS 환경 세팅

###### 1. EJS 설치
```
C:\Dev\visualgo\server>npm i ejs
```

###### 2. view engine 
_server.js_ :코드 추가
```
app.set('view engine','ejs');
```

###### 3. views 폴더 생성, index.ejs 생성

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="node_modules/@picocss/pico/css/pico.min.css">
</head>

<body>
    <h1>Pico CSS Test Page</h1>
    <article>card</article>
  </body>

</html>
```

###### 4. server.js 수정(index.html대신 index.ejs)
```
const express=require('express');
const app = express();
const port=8080;
const path=require('path');
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}/`);
});

app.set('view engine','ejs');
app.use('/',express.static(path.join(__dirname,"/")));
app.get('/',(req,res)=>{
res.render('index.ejs');
});

```


