---
tags:
  - chatting
  - project
  - websocket
  - springboot
draft: false
title: 2. [WebSocket] 컨트롤러, 서비스 구현
---
> WebSocket 설정

# 1. Dependencies
> WebSocket 관련 라이브러리 추가

```gradle title="build.gradle"

implementation 'org.springframework.boot:spring-boot-starter-websocket'
implementation 'org.springframework:spring-messaging'
```

# 2. Configuration
[[ChattingStory_0]] 에서 작성한 Configuration에 FrontendUrl을 추가해줬다.

```Java title="WebSocketConfig.Java"
  
@Configuration  
@EnableWebSocketMessageBroker  
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {  
    @Value("${app.frontend-url}")  
    private String frontendUrl;  
  
    @Override  
    public void configureMessageBroker(MessageBrokerRegistry registry) {  
  
        // client가 /topic/.. 으로 시작하는 주제를 구독  
        registry.enableSimpleBroker("/topic");  
  
        // client가 /app/.. 으로 시작하는 엔드포인트로 메시지를 전송할 수 있음  
        registry.setApplicationDestinationPrefixes("/app");  
    }  
  
    @Override  
    public void registerStompEndpoints(StompEndpointRegistry registry) {  
  
        registry.addEndpoint("/ws")  
                .setAllowedOrigins(frontendUrl)  
                .withSockJS();  
    }  
}

```

> [!info]
> 1. Message Broker:  Application간의 통신을 중개하는 소프트웨어 컴포넌트발신자(Producer)로부터 메시지를 받아 수신자(Consumer)에게 전달하는 중간 매개체 역할 수행
>1. Message Broker Registry: Message Broker 설정 등록 및 관리
>2. StompEndpointRegistry: Client와 WebSocket 연결을 맺기 위한 Endpoint 등록 및 관리


# 3. Controller
>  통신 프로토콜을 기준으로 다음과 같이 컨트롤러를 생성했다.

```Java title="ChattingWSController.Java"
@RequiredArgsConstructor  
@Controller  
public class ChattingWSController {  
  
    private final ChattingService chattingService;  
    private final SimpMessagingTemplate messagingTemplate;  
  
    @MessageMapping("/send-message")  
    public void sendMessage(@Payload ChattingMessage chattingMessage) {  
        ChattingMessage savedMessage = chattingService.sendMessage(chattingMessage);  
        messagingTemplate.convertAndSend("/topic/room/" + chattingMessage.getRoomId(), savedMessage);  
    }  
  
}
```

```Java title="ChattingRestController.Java"
@RequiredArgsConstructor  
@RestController  
@RequestMapping("/api/chat")  
public class ChattingRestController {  
  
    private final ChattingService chattingService;  
  
    @GetMapping("/room/{roomId}/messages")  
    public ResponseDTO<?> getRoomMessages(  
            @PathVariable String roomId,  
            @RequestParam(defaultValue = "0") int page,  
            @RequestParam(defaultValue = "20") int size) {  
        return ResponseDTO.ok(chattingService.getChatMessages(roomId, page, size));  
    }  
}
```

> [!info] @Controller vs @RestController
> 1. @Controller: @Component의 특정 유형임을 명시하는 annotation
> 	- 주로 View를 반환하는 전통적인 Spring MVC Controller에 사용됨
> 	- Messaging 요청 처리에도 사용 가능
> 	- Spring Boot Guide를 보면 Messaging 요청에 @Controller을 사용
> 2. @RestController: @Controller + @ResponseBody
> 	- 모든 메서드에 자동으로 @ResponseBody가 적용되어 Http 응답 본문에 사용
> 	- 주로 RESTful 웹 서비스에서 JSON/XML 형태의 데이터를 반환할 때 사용됨


# 4. Service
> Chatting, ChattingRoom 저장을 위해 간단한 Service 작성

```Java title="ChattingService.Java"

@Slf4j  
@RequiredArgsConstructor  
@Service  
public class ChattingService {  
  
    private final SimpMessagingTemplate messagingTemplate;  
    private final ChatMessageRepository chatMessageRepository;  
  

    public ChattingMessage sendMessage(ChattingMessage chattingMessage) {  
        if (chattingMessage.getType() == null) {  
            chattingMessage.setType(MessageType.CHAT);  
        }  
  
chattingMessage.setCreatedAt(LocalDateTime.now());  
  
        chattingMessage = chatMessageRepository.save(chattingMessage);  
  
        messagingTemplate.convertAndSend("/topic/chat/" + chattingMessage.getRoomId(), chattingMessage);  
        log.debug("chattingMessage: {}", chattingMessage);  
        return chattingMessage;  
    }  
  
    public List<ChattingMessage> getChatMessages(String roomId, int page, int size) {  

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));  
        return chatMessageRepository.findByRoomIdOrderByCreatedAtDesc(roomId, pageRequest);  
    }  
  
}
```

# References
1. [SpringDoc-messaging-stomp-websocket](https://spring.io/guides/gs/messaging-stomp-websocket)
