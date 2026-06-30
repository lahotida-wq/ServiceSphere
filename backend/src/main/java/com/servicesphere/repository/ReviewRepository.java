// backend/src/main/java/com/servicesphere/repository/ReviewRepository.java
package com.servicesphere.repository;

import com.servicesphere.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
        SELECT r FROM Review r
        JOIN FETCH r.customer
        JOIN FETCH r.vendor
        WHERE r.vendor.id = :vendorId
        ORDER BY r.createdAt DESC
        """)
    Page<Review> findByVendorId(@Param("vendorId") Long vendorId, Pageable pageable);

    @Query("""
        SELECT r FROM Review r
        JOIN FETCH r.customer
        JOIN FETCH r.vendor
        WHERE r.customer.id = :customerId
        ORDER BY r.createdAt DESC
        """)
    Page<Review> findByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

    Optional<Review> findByCustomerIdAndVendorId(Long customerId, Long vendorId);

    boolean existsByCustomerIdAndVendorId(Long customerId, Long vendorId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.vendor.id = :vendorId")
    Double findAverageRatingByVendorId(@Param("vendorId") Long vendorId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.vendor.id = :vendorId")
    Long countByVendorId(@Param("vendorId") Long vendorId);
}