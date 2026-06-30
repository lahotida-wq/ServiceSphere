// backend/src/main/java/com/servicesphere/entity/Review.java
package com.servicesphere.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * A review left by a Customer for a Vendor after a booking.
 */
@Entity
@Table(
        name = "reviews",
        indexes = {
                @Index(name = "idx_reviews_vendor_id",   columnList = "vendor_id"),
                @Index(name = "idx_reviews_customer_id", columnList = "customer_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_review_customer_vendor",
                        columnNames = {"customer_id", "vendor_id"})
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "rating", nullable = false)
    private Integer rating; // 1–5

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;
}