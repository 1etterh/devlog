---
tags:
  - vue
  - stomp
  - websocket
  - project
  - chatting
  - chattingstory
draft: true
description: 
title: 3. [Vue.js] 채팅 테스트용 화면 구성
---
> Spring Documentation에 있는 Html 예제를 Vue로 변환해봤다.

# 1. Vue 프로젝트 생성
```cmd
npm create vue@latest
```
> vue-router, pinia 설치도 같이 하면 좋음

# 2. 필요 라이브러리 설치
> 예제에서 @stomp/stompjs 모듈이 import 되어 있어서 설치함

```cmd
npm i @stomp/stompjs
```


# 3. 화면 구성
> 설명을 위해 template과 script 태그 영역을 분리했음
#### 1. template
```vue title="App.vue"
<template>
    <div class="chat-container">
        <div class="connection-controls">
            <button @click="connect" :disabled="isConnected">연결</button>
            <button @click="disconnect" :disabled="!isConnected">연결 해제</button>
            <span v-if="isConnected" class="status-connected">연결됨</span>
            <span v-else class="status-disconnected">연결 안됨</span>
        </div>
  
        <div class="message-container" ref="messageContainer">
            <div v-for="(message, index) in messages" :key="index" class="message">
                <span class="sender">{{ message.senderId }}:</span>
                <span class="content">{{ message.content }}</span>
            </div>
        </div>
  

        <div class="input-container">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="메시지 입력..." :disabled="!isConnected" />
            <button @click="sendMessage" :disabled="!isConnected">전송</button>
        </div>
    </div>

</template>

```

#### 2. script
> roomId, userId는 테스트를 위해 미리 백엔드에 만들어둔 값을 사용했다.

```vue title='App.vue'
<script setup>
import * as StompJS from '@stomp/stompjs';
import { onBeforeUnmount, ref } from 'vue';

// 반응형 상태 정의

const messages = ref([]);

const newMessage = ref('');

const messageContainer = ref(null);

const isConnected = ref(false);

const roomId = '67c581e1473928720b59294f';
const userId = '1';

const stompClient = new StompJS.Client({
    brokerURL: `ws://localhost:5000/ws`
});


stompClient.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    isConnected.value = true;
    stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        messages.value.push(receivedMessage);
        scrollToBottom();
    });

};



stompClient.onWebSocketError = (error) => {

    console.error('Error with websocket', error);

    isConnected.value = false;

};

  

// STOMP 에러 콜백

stompClient.onStompError = (frame) => {

    console.error('Broker reported error: ' + frame.headers['message']);

    console.error('Additional details: ' + frame.body);

    isConnected.value = false;

};

// Add connection failure callback

stompClient.onWebSocketClose = (closeEvent) => {

    console.log('WebSocket connection closed:', closeEvent);

    isConnected.value = false;

};

  

// Add reconnect logic

stompClient.beforeConnect = () => {

    console.log('Attempting to connect...');

};

// 연결

const connect = () => {

    stompClient.activate();

};

  

// 연결 해제

const disconnect = () => {

    stompClient.deactivate();

    isConnected.value = false;

    console.log('Disconnected');

};

  

// 메시지 전송

const sendMessage = () => {

    if (!newMessage.value.trim() || !isConnected.value) return;

  

    stompClient.publish({

        destination: '/app/send-message',

        body: JSON.stringify({

            roomId: roomId,

            senderId: userId,

            content: newMessage.value,

            timestamp: new Date().toISOString()

        })

    });

  

    newMessage.value = '';

};

  

// 스크롤 아래로

const scrollToBottom = () => {

    setTimeout(() => {

        if (messageContainer.value) {

            messageContainer.value.scrollTop = messageContainer.value.scrollHeight;

        }

    }, 50);

};

  

// 컴포넌트 언마운트 시 연결 해제

onBeforeUnmount(() => {

    if (isConnected.value) {

        disconnect();

    }

});

</script>

```

이제 고도화 해야겠지...