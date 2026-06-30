// backend/src/main/java/com/servicesphere/service/impl/AnalyticsServiceImpl.java
package com.servicesphere.service.impl;

import com.servicesphere.dto.response.VendorAnalyticsResponse;
import com.servicesphere.entity.User;
import com.servicesphere.exception.ResourceNotFoundException;
import com.servicesphere.repository.UserRepository;
import com.servicesphere.repository.VendorAnalyticsRepository;
import com.servicesphere.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final VendorAnalyticsRepository analyticsRepository;
    private final UserRepository userRepository;

    @Override
    public VendorAnalyticsResponse getVendorAnalytics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        long totalBookings     = analyticsRepository.countTotalByVendorUserId(user.getId());
        long confirmedBookings = analyticsRepository.countConfirmedByVendorUserId(user.getId());
        long cancelledBookings = analyticsRepository.countCancelledByVendorUserId(user.getId());
        long totalSlots        = analyticsRepository.countTotalSlotsByVendorUserId(user.getId());
        long bookedSlots       = analyticsRepository.countBookedSlotsByVendorUserId(user.getId());
        long availableSlots    = totalSlots - bookedSlots;
        double occupancyRate   = totalSlots > 0 ? (bookedSlots * 100.0 / totalSlots) : 0.0;

        // Last 14 days
        LocalDateTime from = LocalDateTime.now().minusDays(14);
        List<Object[]> raw = analyticsRepository.findDailyBookingStats(user.getId(), from);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM");
        List<VendorAnalyticsResponse.DailyBookingStat> dailyStats = raw.stream()
                .map(row -> new VendorAnalyticsResponse.DailyBookingStat(
                        row[0].toString(),
                        ((Number) row[1]).longValue()))
                .toList();

        return new VendorAnalyticsResponse(
                totalBookings, confirmedBookings, cancelledBookings,
                totalSlots, bookedSlots, availableSlots,
                Math.round(occupancyRate * 10.0) / 10.0,
                dailyStats);
    }
}