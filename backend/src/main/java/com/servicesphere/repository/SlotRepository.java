// backend/src/main/java/com/servicesphere/repository/SlotRepository.java
package com.servicesphere.repository;

import com.servicesphere.entity.Slot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    @Query("""
        SELECT s FROM Slot s
        JOIN FETCH s.service
        WHERE s.service.id = :serviceId
        AND s.active = true
        ORDER BY s.startTime ASC
        """)
    List<Slot> findByServiceIdAndActiveTrueOrderByStartTimeAsc(
            @Param("serviceId") Long serviceId);

    @Query("""
        SELECT s FROM Slot s
        JOIN FETCH s.service
        WHERE s.service.id = :serviceId
        AND s.booked = false
        AND s.active = true
        AND s.startTime > :after
        ORDER BY s.startTime ASC
        """)
    List<Slot> findByServiceIdAndBookedFalseAndActiveTrueAndStartTimeAfterOrderByStartTimeAsc(
            @Param("serviceId") Long serviceId,
            @Param("after") LocalDateTime after);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdWithLock(@Param("id") Long id);

    boolean existsByServiceIdAndStartTimeBetween(
            Long serviceId, LocalDateTime start, LocalDateTime end);
}