package com.together.workeezy.config;

import com.together.workeezy.auth.security.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // 인증 매니저
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // JWT는 필요 x
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 허용
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // JWT 방식에서는 서버가 세션을 만들지 않음 REST API는 STATELESS

                // 경로별 권한 설정
                .authorizeHttpRequests(auth -> auth

                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                .requestMatchers("/health", "/api/health").permitAll()

                                .requestMatchers("/api/auth/login").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                                .requestMatchers("/api/auth/refresh").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()

                                .requestMatchers("/api/auth/logout").authenticated()

                                .requestMatchers("/actuator/**").permitAll()

                                .requestMatchers("/api/programs/**").permitAll()
                                .requestMatchers("/api/search/**").permitAll()

                                .requestMatchers("/api/reviews/**").permitAll()
                                .requestMatchers("/api/recommendations/**").permitAll()

                                .requestMatchers("/api/payments/**").authenticated()

                                .anyRequest().permitAll() // <-- 현재는 이렇게 해야 로그인 테스트됨
                        
                )
                .formLogin(login -> login.disable()) // 기본 로그인 form X
                .httpBasic(basic -> basic.disable()); // 브라우저 인증 팝업 X (Basic Auth)

        // JWT 필터가 스프링 필터 체인 앞에서 토큰 인증 처리
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS React 허용
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 허용 Origin
        config.setAllowedOrigins(List.of(
                "https://www.workeezy.cloud",
                "https://workeezy.cloud",
                "https://workeezy-react.vercel.app",
                "http://localhost:5173"
        ));

        // 허용 메서드 / 헤더
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        // 쿠키(Refresh Token) 허용
        config.setAllowCredentials(true);

        // 프론트에서 Authorization 헤더 접근 허용
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 테스트 끝나고 반드시 삭제
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.debug(false);
    }
}
