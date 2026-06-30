// backend/src/main/java/com/servicesphere/repository/ServiceRepository.java
package com.servicesphere.repository;

import com.servicesphere.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    @Query("""
        SELECT s FROM Service s
        JOIN FETCH s.vendor
        WHERE s.vendor.id = :vendorId
        AND s.active = true
        """)
    List<Service> findByVendorIdAndActiveTrue(@Param("vendorId") Long vendorId);

    @Query("""
        SELECT s FROM Service s
        JOIN FETCH s.vendor
        WHERE s.id = :id
        AND s.vendor.id = :vendorId
        """)
    Optional<Service> findByIdAndVendorId(@Param("id") Long id, @Param("vendorId") Long vendorId);

    boolean existsByIdAndVendorId(Long id, Long vendorId);
}