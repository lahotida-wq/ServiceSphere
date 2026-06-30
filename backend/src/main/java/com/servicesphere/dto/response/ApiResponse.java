package com.servicesphere.dto.response;

import java.time.LocalDateTime;

/**
 * Standard success-response envelope returned by every controller.
 */
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        LocalDateTime timestamp
) {

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> success(T data) {
        return success("Success", data);
    }
}