// backend/src/main/java/com/servicesphere/repository/BookingRepository.java
package com.servicesphere.repository;

import com.servicesphere.constant.BookingStatus;
import com.servicesphere.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service svc
        JOIN FETCH svc.vendor v
        JOIN FETCH b.customer c
        WHERE b.customer.id = :customerId
        ORDER BY b.createdAt DESC
        """)
    Page<Booking> findByCustomerIdOrderByCreatedAtDesc(
            @Param("customerId") Long customerId, Pageable pageable);

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service svc
        JOIN FETCH svc.vendor v
        JOIN FETCH b.customer c
        WHERE v.user.id = :userId
        ORDER BY s.startTime ASC
        """)
    Page<Booking> findByVendorUserId(
            @Param("userId") Long userId, Pageable pageable);

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service svc
        JOIN FETCH svc.vendor v
        JOIN FETCH b.customer c
        WHERE v.user.id = :userId AND b.status = :status
        ORDER BY s.startTime ASC
        """)
    List<Booking> findByVendorUserIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") BookingStatus status);

    @Query("""
        SELECT b FROM Booking b
        JOIN FETCH b.slot s
        JOIN FETCH s.service svc
        JOIN FETCH svc.vendor v
        JOIN FETCH b.customer c
        WHERE b.slot.id = :slotId
        """)
    Optional<Booking> findBySlotId(@Param("slotId") Long slotId);

    boolean existsBySlotIdAndStatusNot(Long slotId, BookingStatus status);
}