// backend/src/main/java/com/servicesphere/dto/response/BookingResponse.java
package com.servicesphere.dto.response;

import com.servicesphere.constant.BookingStatus;

import java.time.LocalDateTime;

/**
 * Full booking details returned to the client.
 */
public record BookingResponse(
        Long id,
        Long customerId,
        String customerName,
        String customerEmail,
        Long slotId,
        LocalDateTime slotStartTime,
        LocalDateTime slotEndTime,
        Long serviceId,
        String serviceName,
        Long vendorId,
        String vendorBusinessName,
        BookingStatus status,
        String notes,
        LocalDateTime createdAt
) {}