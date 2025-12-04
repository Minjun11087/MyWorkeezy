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
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // 🔥 토큰 검증 제외할 URL (화이트리스트)
    private static final List<String> WHITELIST = List.of(
            "/api/auth/login",
            "/api/auth/refresh",
            "/api/search",
            "/api/search/",       // 🔥 추가
            "/api/search/**",     // 🔥 가장 중요
            "/api/programs/cards"
    );


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        System.out.println("📌 JwtFilter 요청 경로: " + requestURI);

        // 🔥 1) 화이트리스트 URL은 JWT 검증 스킵
        for (String pattern : WHITELIST) {
            if (pathMatcher.match(pattern, requestURI)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        // 🔥 2) 화이트리스트 아니면 토큰 검증
        String token = resolveToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}