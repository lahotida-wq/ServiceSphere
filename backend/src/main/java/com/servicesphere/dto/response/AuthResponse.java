package com.servicesphere.dto.response;

/**
 * Returned by {@code /auth/signup} and {@code /auth/login} on success.
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserResponse user
) {
}