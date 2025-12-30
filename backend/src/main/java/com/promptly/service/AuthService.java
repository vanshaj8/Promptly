package com.promptly.service;

import com.promptly.dto.LoginRequest;
import com.promptly.dto.LoginResponse;
import com.promptly.dto.UserDto;
import com.promptly.entity.User;
import com.promptly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getRole().name(),
                user.getBrandId()
        );

        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getBrandId(),
                user.getFullName(),
                user.getCreatedAt()
        );

        return new LoginResponse(token, userDto);
    }

    public UserDto getCurrentUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getBrandId(),
                user.getFullName(),
                user.getCreatedAt()
        );
    }
}

