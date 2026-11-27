---
title: Node MODULE_TYPELESS_PACKAGE_JSON 경고는 무엇인가
type: archive
tags: [archive, nodejs, esm, commonjs, package_json]
draft: true
---

> 개발 서버 실행 중 레이어 패키지 경로에서 아래 경고가 출력됨
>
> ```
> (node:39885) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///.../layer/... is not specified and it doesn't parse as CommonJS.
> Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
> To eliminate this warning, add "type": "module" to /.../layer/package.json.
> ```

에러가 아니라 Node가 띄우는 **성능 경고**예요. 무시하고 지나가도 앱 동작에는 영향이 없어요.

**왜 뜨나**
- Node는 `package.json`의 최상위 `"type"`을 보고 `.js`/`.ts` 파일을 CommonJS로 읽을지 ES 모듈로 읽을지 정해요.
- 레이어 패키지의 `package.json`에는 최상위 `"type"`이 없어요. 그 파일에 있는 `"type": "git"`은 `repository.type`이라 이것과는 상관없어요.
- 그래서 Node가 파일을 먼저 CommonJS로 읽다가 `import`/`export` 구문을 발견하고, ES 모듈로 다시 읽어요. 메시지의 "Reparsing as ES module"이 이 뜻이고, 같은 파일을 두 번 읽는 비용 때문에 경고를 띄우는 거예요.
- Node 22.7 이상(이 프로젝트는 24)에서 dev 실행 중 레이어의 `.ts`/`.js` 파일을 Node가 직접 불러올 때 나와요. 로그에서는 파일 경로가 잘려서 정확히 어느 파일인지는 확인하지 못했어요. `nuxt.config.ts` 같은 설정 파일일 가능성이 커 보여요.

**없애려면**
- 레이어 `package.json`에 `"type": "module"`을 추가하거나, 해당 파일 확장자를 `.mjs`/`.mts`로 바꾸면 돼요.
- 다만 둘 다 레이어 저장소를 고치는 일이라 승인이 필요해요. 레이어에 `require`/`module.exports`를 쓰는 `.js` 파일이 있으면 `"type": "module"` 때문에 깨질 수도 있어요.
- 결론적으로 이 경고 때문에 레이어를 건드릴 필요는 없어 보여요.
