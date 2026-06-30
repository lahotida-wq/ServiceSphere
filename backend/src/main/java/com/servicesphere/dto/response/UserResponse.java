package com.servicesphere.dto.response;

import com.servicesphere.constant.Role;

import java.time.LocalDateTime;

/**
 * Public-facing representation of a {@link com.servicesphere.entity.User}.
 * Deliberately omits the password hash.
 */
public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        LocalDateTime createdAt
) {
}