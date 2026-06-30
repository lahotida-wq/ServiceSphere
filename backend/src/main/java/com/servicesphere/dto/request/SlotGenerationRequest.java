// backend/src/main/java/com/servicesphere/dto/request/SlotGenerationRequest.java
package com.servicesphere.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Request to auto-generate slots for a service on given dates.
 * e.g. generate 30-min slots from 09:00 to 18:00 for next 7 days.
 */
public record SlotGenerationRequest(

        @NotNull(message = "Service ID is required")
        Long serviceId,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @NotNull(message = "Work start time is required")
        LocalTime workStartTime,

        @NotNull(message = "Work end time is required")
        LocalTime workEndTime,

        @NotNull(message = "Break start time is required (use workStartTime if no break)")
        LocalTime breakStartTime,

        @NotNull(message = "Break end time is required (use workStartTime if no break)")
        LocalTime breakEndTime
) {}