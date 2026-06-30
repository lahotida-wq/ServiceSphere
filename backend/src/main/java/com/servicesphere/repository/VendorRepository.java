// backend/src/main/java/com/servicesphere/repository/VendorRepository.java
package com.servicesphere.repository;

import com.servicesphere.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    Page<Vendor> findByActiveTrue(Pageable pageable);

    Page<Vendor> findByCategoryIgnoreCaseAndActiveTrue(String category, Pageable pageable);

    @Query("""
        SELECT v FROM Vendor v
        WHERE v.active = true
        AND (
            LOWER(v.businessName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(v.category)  LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(v.city)      LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        """)
    Page<Vendor> searchVendors(@Param("keyword") String keyword, Pageable pageable);
}