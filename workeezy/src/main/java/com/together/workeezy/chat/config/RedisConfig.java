package com.together.workeezy.chat.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    // 로그인 세션용
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        return template;
    }

    // 임시 저장용
    @Bean(name = "draftRedisTemplate")
    public RedisTemplate<String, Object> draftRedisTemplate() {

        // db 연결
        // 구현체 LettuceConnectionFactory
        LettuceConnectionFactory connectionFactory = new LettuceConnectionFactory();
        connectionFactory.setDatabase(1); // DB번호 1번
        connectionFactory.afterPropertiesSet(); // Spring으로 빈으로 관리하지 않는 Lettuce- 를 직접 초기화
        /*
        * .afterPropertiesSet(); 하는 일
        * Redis 연결 관련 설정값을 읽어서 실제 커넥션 풀 초기화 준비
        * 필요한 객체 등을 생성 및 연결 준비(ClientResources, RedisClient 등)
        * Redis 서버와의 연결을 위한 커넥션 팩토리 준비 완료
        *  => Lettuce- 의 설정이 다 끝났으니까 사용할 준비를 마치라고 신호를 주는 것!
        * 
        * 스프링이 자동으로 초기화 해주는 기본 RedisConnectionFactory는 수동호출 하지 않아도 됨
        * RedisConnectionFactory는 인터페이스고 LettuceConnectionFactory는 그걸 구현한 구체적인 구현체..
        * Lettuce는 실제로 Redis 서버와 TCP 연결을 열고, 연결 풀을 관리하고, 명령 실행하는 주체!
        * Lettuce는 비동기/논블로킹 Netty 기반 Redis 클라이언트
        * => 내부적으로 I/O를 효율적으로 처리하고, connection pooling도 지원
        *
        * Spring Boot 기본 의존성에는 기본으로 Lettuce가 포함되어 있어서 별도 설정없이 자동으로 Lettuce가 선택됨.
        * RedisTemplate
               ⬇️ (연결 요청)
            RedisConnectionFactory ← 인터페이스 (표준)
               ⬇️ (구현)
            LettuceConnectionFactory ← 실제로 Redis에 연결
               ⬇️
            Redis 서버
            *
            * 결국 로그인이나 임시저장이나 Lettuce를 사용하는건데, 차이는 스프링이 자동관리하는지 직접새로 만드는지임.
            * 둘다 Lettuce를 사용하면서 디비번호를 지정하나, 한명은 기본으로 제공하는 Redis팩토리(자동으로 디비번호 설정)을 사용하고 한 명은
            * Lettuce를 사용하면서 디비번호를 명시해주면 결국엔 같은 방식임!
        * */
        // 키:문자열, 값:객체인 레디스 템플릿 생성
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 해당 템플릿에 커넥션 공장을 설정하는데, 위에서 만든 Lettuce 커낵션 팩토리로 설정
        template.setConnectionFactory(connectionFactory);

        // Json 직렬화 설정
        // Redis에 값을 넣고/ 빼는 대 JSON으로 직렬화/ 역질렬화 해주는 직렬기 serializer 만듦
        // 왜 object? => 임시저장에 여러타입 (dto나 map )이 올 수 ㅣㅇㅅ으니 아무타입이나 처리하겠다는 뜻!
        // 그래서 나중에 복원할 때 원래타입 정보가 JSON 안에 있어야함..
        Jackson2JsonRedisSerializer<Object> serializer  = new Jackson2JsonRedisSerializer<>(Object.class);


        // RedisTemplate에서 JSON으로 데이터를 안전하게 저장하기 위해 설정하는 구간
        // Redis는 문자열 기반 저장소라 우리의 자바객체들을 넣으려면 JSON으로 바꿔서 문자열로 저장해야함!
        // 그걸 도와주는게 ObjectMapper과 Jason2~Serializer.
        /// 잭슨의 핵심 엔진인 변환기계 ObjectMapper를 하나 만듦
        //ReservationDraft라는 객체가 있으면 이게 "{"userName":"홍길동"}" 이런 JSON 문자열로 변환
        // 또 Redis에서 꺼낼때 JSON 을 객체로 자동으로 바꿔줌.
        // JSON <-> 객체 변환을 실제로 수행하는 ObjectMapper!
        ObjectMapper objectMapper = new ObjectMapper();

        // 기계가 데이터를 JSON으로 바꿀 때 객체의 타입 정보도 같이 붙게 만드는 설정
        // 왜 필요해?
        // 임시저장할 때(Redis), value를 Object로 저장하기때문에 이 객체가
        // Map일수도, List일 수 있는데 꺼낼 때 어떤 클래스 객체인지 알아야 복원할 수 있음!
        // 이 설정을 켜면, JSON에 이런 식으로 클래스 이름이 같이 들어감.
        /*
        *{
          "@class": "com.together.workeezy.dto.ReservationDraftDto",
          "userName": "홍길동",
          "company": "Workeezy"
            }
        */
        objectMapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance, // 웬만한 타입 다 허용해줄게
                ObjectMapper.DefaultTyping.NON_FINAL // String, Integer 같은 final 타입은 제외. final이 아닌 클래스(예: DTO, List 등)에 타입정보를 붙여라.
        );
        //이 ObjectMapper를 JSON 변환용으로 쓰게 해줘” 라는 뜻
        serializer.setObjectMapper(objectMapper);

        // Redis에 저장할 키/벨류 방식을 지정
        template.setKeySerializer(new StringRedisSerializer()); // 문자열 그대로 저장
        template.setValueSerializer(serializer); // 우리가 만든 Json 직렬기로 처리
        template.afterPropertiesSet(); // 이제 설정 끝났으니까 초기화 후 준비!
        return template;

        




    }
}
