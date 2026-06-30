// backend/src/main/java/com/servicesphere/repository/VendorAnalyticsRepository.java
package com.servicesphere.repository;

import com.servicesphere.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VendorAnalyticsRepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COUNT(b) FROM Booking b
        JOIN b.slot s JOIN s.service svc JOIN svc.vendor v
        WHERE v.user.id = :userId
        """)
    long countTotalByVendorUserId(@Param("userId") Long userId);

    @Query("""
        SELECT COUNT(b) FROM Booking b
        JOIN b.slot s JOIN s.service svc JOIN svc.vendor v
        WHERE v.user.id = :userId AND b.status = 'CONFIRMED'
        """)
    long countConfirmedByVendorUserId(@Param("userId") Long userId);

    @Query("""
        SELECT COUNT(b) FROM Booking b
        JOIN b.slot s JOIN s.service svc JOIN svc.vendor v
        WHERE v.user.id = :userId AND b.status = 'CANCELLED'
        """)
    long countCancelledByVendorUserId(@Param("userId") Long userId);

    @Query("""
        SELECT COUNT(s) FROM Slot s
        JOIN s.service svc JOIN svc.vendor v
        WHERE v.user.id = :userId AND s.active = true
        """)
    long countTotalSlotsByVendorUserId(@Param("userId") Long userId);

    @Query("""
        SELECT COUNT(s) FROM Slot s
        JOIN s.service svc JOIN svc.vendor v
        WHERE v.user.id = :userId AND s.active = true AND s.booked = true
        """)
    long countBookedSlotsByVendorUserId(@Param("userId") Long userId);

    @Query("""
        SELECT FUNCTION('DATE', s.startTime) as date, COUNT(b) as cnt
        FROM Booking b
        JOIN b.slot s JOIN s.service svc JOIN svc.vendor v
        WHERE v.user.id = :userId
        AND s.startTime >= :from
        AND b.status = 'CONFIRMED'
        GROUP BY FUNCTION('DATE', s.startTime)
        ORDER BY FUNCTION('DATE', s.startTime)
        """)
    List<Object[]> findDailyBookingStats(
            @Param("userId") Long userId,
            @Param("from") LocalDateTime from);
}