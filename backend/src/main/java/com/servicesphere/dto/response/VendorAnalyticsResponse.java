// backend/src/main/java/com/servicesphere/dto/response/VendorAnalyticsResponse.java
package com.servicesphere.dto.response;

import java.util.List;

/**
 * Analytics summary for a vendor's dashboard.
 */
public record VendorAnalyticsResponse(
        long totalBookings,
        long confirmedBookings,
        long cancelledBookings,
        long totalSlots,
        long bookedSlots,
        long availableSlots,
        double occupancyRate,
        List<DailyBookingStat> dailyStats
) {
    public record DailyBookingStat(String date, long count) {}
}