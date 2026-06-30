// backend/src/main/java/com/servicesphere/dto/request/BookingRequest.java
package com.servicesphere.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Payload for creating a new Booking.
 */
public record BookingRequest(

        @NotNull(message = "Slot ID is required")
        Long slotId,

        @Size(max = 500, message = "Notes must not exceed 500 characters")
        String notes
) {}