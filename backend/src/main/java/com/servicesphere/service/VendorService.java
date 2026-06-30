// backend/src/main/java/com/servicesphere/service/VendorService.java
package com.servicesphere.service;

import com.servicesphere.dto.request.VendorProfileRequest;
import com.servicesphere.dto.response.VendorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VendorService {
    VendorResponse createProfile(VendorProfileRequest request, String email);
    VendorResponse updateProfile(VendorProfileRequest request, String email);
    VendorResponse getMyProfile(String email);
    VendorResponse getVendorById(Long vendorId);
    Page<VendorResponse> getAllVendors(Pageable pageable);
    Page<VendorResponse> getVendorsByCategory(String category, Pageable pageable);
    Page<VendorResponse> searchVendors(String keyword, Pageable pageable);
}