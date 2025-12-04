package com.together.workeezy.auth.security;

import com.together.workeezy.auth.jwt.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        System.out.println("📌 JwtFilter 요청 경로: " + uri);
        System.out.println("Authorization HEADER = " + request.getHeader("Authorization"));


//        String requestURI = request.getRequestURI();
//        System.out.println("📌 JwtFilter 요청 경로: " + requestURI);

        // 모든 OPTIONS 요청은 인증 스킵 (CORS Preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // 인증 제외 경로
        if (uri.equals("/api/auth/logout") ||
                uri.equals("/api/auth/refresh")) {

            System.out.println("➡️ 인증 스킵 (public API): " + uri);
            filterChain.doFilter(request, response);
            return;
        }

        // 요청 헤더 전체 출력
        System.out.println("=== Request Headers ===");
        var headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String header = headerNames.nextElement();
            System.out.println(header + ": " + request.getHeader(header));
        }
        System.out.println("=======================");

        // 이미 인증된 상태면 다시 인증할 필요 없음
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            // Authorization 헤더에서 토큰 꺼내기
            String token = resolveToken(request);

            // 토큰 유효성 확인
            if (token != null && jwtTokenProvider.validateToken(token)) {
                // 인증 객체 생성
                Authentication authentication = jwtTokenProvider.getAuthentication(token);

                // request 기반 details 세팅 (IP, 세션 등)
                UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) authentication;
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContextHolder에 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("✅ 인증 성공: " + authentication.getName());
            } else {
                System.out.println("❌ 토큰 없음 또는 유효하지 않음");
            }
        }
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");

        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
