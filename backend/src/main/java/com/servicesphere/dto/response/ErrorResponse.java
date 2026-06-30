package com.servicesphere.dto.response;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error-response envelope produced by GlobalExceptionHandler.
 */
public record ErrorResponse(
        boolean success,
        String message,
        int status,
        LocalDateTime timestamp,
        List<String> errors
) {
}