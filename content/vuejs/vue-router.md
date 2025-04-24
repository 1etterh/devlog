---
title: "[vuejs] vue-router 설치 및 적용"

tags:
  - vue
  - vuerouter
---
#### 1. 설치
```
npm i vue-router
```

#### 2. src에 router/, routes/index.js 생성



```
//index.js
import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/Login.vue";
const routes=[
    {
        path:'/login',
        component:Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
```

#### main.js에 추가
```
import router from "./router"
app.use(router)
```


#### App.vue에 추가

```
//App.vue
<router-link to = "/login">Login<router-link>
<router-view><router-view/>
```

1. router-view: router-link의 요소 랜더링


