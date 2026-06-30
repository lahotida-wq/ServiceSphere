// backend/src/main/java/com/servicesphere/dto/response/ReviewResponse.java
package com.servicesphere.dto.response;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long customerId,
        String customerName,
        Long vendorId,
        String vendorBusinessName,
        Integer rating,
        String comment,
        LocalDateTime createdAt
) {}