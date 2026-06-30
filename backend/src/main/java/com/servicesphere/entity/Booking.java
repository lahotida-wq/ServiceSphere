// backend/src/main/java/com/servicesphere/entity/Booking.java
package com.servicesphere.entity;

import com.servicesphere.constant.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

/**
 * A confirmed booking made by a Customer for a specific Slot.
 * Concurrency is handled at the Slot level using pessimistic locking.
 */
@Entity
@Table(
        name = "bookings",
        indexes = {
                @Index(name = "idx_bookings_customer_id", columnList = "customer_id"),
                @Index(name = "idx_bookings_slot_id", columnList = "slot_id"),
                @Index(name = "idx_bookings_status", columnList = "status")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false, unique = true)
    private Slot slot;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "status", nullable = false, length = 20)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}