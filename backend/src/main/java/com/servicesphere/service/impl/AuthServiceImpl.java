package com.servicesphere.service.impl;

import com.servicesphere.config.JwtProperties;
import com.servicesphere.dto.request.LoginRequest;
import com.servicesphere.dto.request.SignupRequest;
import com.servicesphere.dto.response.AuthResponse;
import com.servicesphere.entity.User;
import com.servicesphere.exception.EmailAlreadyExistsException;
import com.servicesphere.exception.InvalidCredentialsException;
import com.servicesphere.mapper.UserMapper;
import com.servicesphere.repository.UserRepository;
import com.servicesphere.security.JwtService;
import com.servicesphere.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("Processing signup for email={}", request.email());

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(
                    "An account with email '" + request.email() + "' already exists");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Signup successful: userId={} role={}", savedUser.getId(), savedUser.getRole());

        return buildAuthResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login for email={}", request.email());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException ex) {
            log.warn("Login failed for email={}: bad credentials", request.email());
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        log.info("Login successful: userId={}", user.getId());
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtProperties.getAccessTokenExpirationMs() / 1000,
                userMapper.toUserResponse(user)
        );
    }
}