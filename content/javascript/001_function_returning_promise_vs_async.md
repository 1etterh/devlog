---
title: Promise를 돌려주는 함수는 async 함수인가
type: question
tags: [question, javascript, promise, async_await, request_dedup]
draft: true
---

## 의문

지도 경계 파일을 받는 함수를 이렇게 짰다. 같은 파일을 동시에 여러 번 요청해도 한 번만 받도록, 받는 중인 요청을 `Map`에 등록해 둔다.

```ts
const loading = new Map<string, Promise<Data>>();

const loadChildren = (path = ''): Promise<Data> => {
  let p = loading.get(path);
  if (p) return p;
  p = fetch(urlOf(path)).then(res => res.json());
  loading.set(path, p);
  return p;
};
```

반환 타입이 `Promise<Data>`인데, `async`는 붙어 있지 않다. 그럼 이 함수는 **비동기 함수인가?** 아니면 `loading`에 등록만 하면 끝나니 **동기 함수인가?**

## 답: 함수는 동기로 끝나고, "나중에 담길 값"을 바로 돌려준다

- 네트워크 응답은 언제 올지 모른다. 그래서 `fetch`는 응답을 기다리지 않고 **결과가 오면 채워질 상자(Promise)**를 즉시 돌려준다.
- `loadChildren`은 그 상자를 `loading`에 등록하고 그대로 반환한다. 여기까지는 **호출하는 순간 동기로 끝난다.**
- **데이터 자체는 동기로 받을 수 없다.** 쓰는 쪽은 `await`(또는 `.then`)로 상자가 채워질 때까지 기다려야 한다.

```ts
const data = await loadChildren('KR');  // 상자가 채워지면 꺼냄
const box  = loadChildren('KR');        // await 없으면 Promise 자체 → box.features 는 undefined
```

| 시점 | 일어나는 일 |
|---|---|
| 호출 직후 (동기) | 등록된 상자 확인 → 없으면 요청 보내기 → 상자를 `loading`에 등록 → 상자 반환 |
| 응답이 온 뒤 (나중에) | `.then` 콜백 실행 → 상자에 데이터가 채워짐 → `await` 하던 쪽이 이어서 실행 |

중복 요청을 막을 수 있는 이유도 이것이다. **등록이 동기로 끝나니까**, 바로 이어서 같은 path로 호출해도 이미 등록된 같은 상자를 받는다.

## async를 붙이면 달라지나

`async`는 **반환값을 항상 Promise로 감싸는 표시**다. 원래 Promise를 돌려주는 함수라면 쓰는 쪽에서는 차이가 없다.

같은 path로 연달아 두 번 호출해서 확인했다 (가짜 fetch, 10ms 뒤 응답).

| 버전 | 두 호출이 같은 Promise? | 실제 요청 수 |
|---|---|---|
| `async` 없음 | 같음 | 1 |
| `async` 붙임, 함수 안에 `await` 없음 | 다름 (매번 새로 감쌈) | 1 |
| `async` 붙임, `loading.set` **앞에** `await` 있음 | 다름 | **2** |

- `async`를 붙여도 함수 안에 `await`가 없으면 등록까지 한 번에 실행되므로 중복 방지는 그대로 된다. Promise 객체가 매번 새로 감싸질 뿐, 같은 값으로 채워진다.
- **`loading.set`보다 앞에 `await`가 있으면** 함수가 거기서 멈추고, 그 사이 두 번째 호출이 아직 등록되지 않은 Map을 보고 요청을 또 보낸다. 등록은 항상 `await`보다 먼저 와야 한다.
- `async`를 붙이면 `return Promise.resolve(null)` 대신 `return null`이라고 써도 된다. 자동으로 감싸지기 때문이다. 시그니처에서 "기다려야 하는 함수"라는 게 바로 보인다는 장점도 있다.

## 관련 개념

| 표현 | 뜻 |
|---|---|
| `Promise<T>` | 나중에 `T`가 채워질(또는 실패할) 상자. 상태: pending → fulfilled / rejected |
| `.then(ok, fail)` | 상자가 채워지면 / 실패하면 실행할 콜백을 등록. 새 Promise를 돌려준다 |
| `async function` | 반환값을 Promise로 감싸고, 안에서 `await`를 쓸 수 있게 한다 |
| `await p` | `p`가 채워질 때까지 **이 함수만** 멈춘다. 다른 코드(다른 호출)는 그 사이에 실행된다 |
| 동기 / 비동기 | 함수가 결과를 **돌려주는 시점**의 차이. Promise를 돌려주는 함수도 호출 자체는 동기로 끝난다 |
