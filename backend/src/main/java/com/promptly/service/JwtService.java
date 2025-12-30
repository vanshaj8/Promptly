package com.promptly.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public String generateToken(Integer userId, String role, Integer brandId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .claim("user_id", userId)
                .claim("role", role)
                .claim("brand_id", brandId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public JwtClaims validateToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Integer userId = claims.get("user_id", Integer.class);
        String role = claims.get("role", String.class);
        Integer brandId = claims.get("brand_id", Integer.class);

        return new JwtClaims(userId, role, brandId);
    }

    public static class JwtClaims {
        private final Integer userId;
        private final String role;
        private final Integer brandId;

        public JwtClaims(Integer userId, String role, Integer brandId) {
            this.userId = userId;
            this.role = role;
            this.brandId = brandId;
        }

        public Integer getUserId() {
            return userId;
        }

        public String getRole() {
            return role;
        }

        public Integer getBrandId() {
            return brandId;
        }
    }
}

