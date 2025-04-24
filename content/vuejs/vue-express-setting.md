---
title: "[vuejs, expressJs] 프로젝트 세팅"
tags:
  - nodejs
  - vuejs
  - express
---
#### 코드 에디터: VS Code
#### 프로젝트 폴더 생성


![[vue-settings.png]]

##### 1. 백엔드용 폴더 생성(server)

![[vue-express-server.png]]
###### 백엔드 폴더로 이동
```
C:\Dev\visualgo>cd server
```

###### Express, Nodemon 설치

```
npm i express
npm i nodemon
```



###### 기본 코드 작성
```
//server.js
const express=require('express')

const app = express()

const port = 8080;

app.listen(port, () => {

    console.log(`Server running at http://localhost:${port}/`);

});
```

###### nodemon으로 실행
nodemon으로 실행하면 코드를 수정하고 저장만 하면 알아서 변경사항을 적용해줘서 편리하다.

```
C:\Dev\vue\proj\server>nodemon server.js
```

![[expressjs settings.png]]
아직 요청 설정을 안해서 이렇게 뜸

##### 프론트엔드 세팅
###### vue로 프로젝트 생성
1. 프로젝트 폴더로 이동
```
C:\Dev\vue\proj\server>cd ..	
```

2. vue 설치
```
npm install -g @vue/cli # vue 설치
```

3. vue 프로젝트 생성(이름은 알아서)
```
vue create client
```


1. 생성된 vue 프로젝트로 이동
```
cd client
```


5. vue 프로젝트 빌드
```
npm run build
```


빌드가 완료되면 다음과 같이 dist 폴더에 하위 항목들이 생김
	
	![[vue-build.png]]

###### express와 vue 연동
```
//server.js
const express=require('express');

const app = express();

const port=8080;

const path=require('path');

app.listen(port, () => {

    console.log(`Server running at http://localhost:${port}/`);

});

console.log(path.__dirname)

app.use('/',express.static(path.join(__dirname,"../client/dist")));

app.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname,'client/dist/index.html'));

});
```

###### 서버 디렉토리로 이동해서 제대로 돌아가는지 확인
```
nodemon server.js
```

![[content/vuejs/assets/vue-express.png]]

#### vue 파일을 수정하면 build 후 server.js 실행


#### 컴포넌트 이름 오류 발생시
vue3부터는 컴포넌트 이름을 반드시 2단어 이상으로 작성하게 만들었다. 이게 싫으면 frontend 폴더 내의 packages.json의 rules를 다음과 같이 수정하면 됨
```
    "rules": {
      "vue/multi-word-component-names": "off"
    }
```
