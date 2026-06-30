// backend/src/main/java/com/servicesphere/dto/response/ServiceResponse.java
package com.servicesphere.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Public-facing service response.
 */
public record ServiceResponse(
        Long id,
        Long vendorId,
        String vendorBusinessName,
        String name,
        String description,
        BigDecimal price,
        Integer durationMinutes,
        String imageUrl,
        boolean active,
        LocalDateTime createdAt
) {}