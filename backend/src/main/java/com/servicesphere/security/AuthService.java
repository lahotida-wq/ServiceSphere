package com.servicesphere.service;

import com.servicesphere.dto.request.LoginRequest;
import com.servicesphere.dto.request.SignupRequest;
import com.servicesphere.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
}