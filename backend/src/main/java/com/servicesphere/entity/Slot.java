// backend/src/main/java/com/servicesphere/entity/Slot.java
package com.servicesphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * A bookable time slot for a specific Service.
 * Once booked, isBooked = true and it cannot be double-booked.
 */
@Entity
@Table(
        name = "slots",
        indexes = {
                @Index(name = "idx_slots_service_id", columnList = "service_id"),
                @Index(name = "idx_slots_start_time", columnList = "start_time"),
                @Index(name = "idx_slots_is_booked", columnList = "is_booked")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Builder.Default
    @Column(name = "is_booked", nullable = false)
    private boolean booked = false;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}