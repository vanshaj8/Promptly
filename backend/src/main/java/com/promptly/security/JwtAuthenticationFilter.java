package com.promptly.security;

import com.promptly.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                JwtService.JwtClaims claims = jwtService.validateToken(token);
                
                // Store claims in authentication details
                Map<String, Object> details = new HashMap<>();
                details.put("userId", claims.getUserId());
                details.put("role", claims.getRole());
                details.put("brandId", claims.getBrandId());
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    claims.getUserId(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + claims.getRole()))
                );
                authentication.setDetails(details);
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // Token is invalid, continue without authentication
            }
        }
        
        filterChain.doFilter(request, response);
    }
}

