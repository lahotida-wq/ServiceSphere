// backend/src/main/java/com/servicesphere/dto/request/ReviewRequest.java
package com.servicesphere.dto.request;

import jakarta.validation.constraints.*;

public record ReviewRequest(

        @NotNull(message = "Vendor ID is required")
        Long vendorId,

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        Integer rating,

        @Size(max = 1000, message = "Comment must not exceed 1000 characters")
        String comment
) {}