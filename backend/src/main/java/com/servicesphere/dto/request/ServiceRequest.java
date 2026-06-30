// backend/src/main/java/com/servicesphere/dto/request/ServiceRequest.java
package com.servicesphere.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Payload for creating or updating a Service under a Vendor.
 */
public record ServiceRequest(

        @NotBlank(message = "Service name is required")
        @Size(max = 150)
        String name,

        @Size(max = 1000)
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        @Digits(integer = 8, fraction = 2, message = "Invalid price format")
        BigDecimal price,

        @NotNull(message = "Duration is required")
        @Min(value = 5, message = "Duration must be at least 5 minutes")
        @Max(value = 480, message = "Duration cannot exceed 480 minutes")
        Integer durationMinutes
) {}