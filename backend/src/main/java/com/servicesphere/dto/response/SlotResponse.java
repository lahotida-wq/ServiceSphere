// backend/src/main/java/com/servicesphere/dto/response/SlotResponse.java
package com.servicesphere.dto.response;

import java.time.LocalDateTime;

/**
 * Public-facing slot response.
 */
public record SlotResponse(
        Long id,
        Long serviceId,
        String serviceName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        boolean booked,
        boolean active
) {}