// backend/src/main/java/com/servicesphere/service/impl/VendorServiceImpl.java
package com.servicesphere.service.impl;

import com.servicesphere.dto.request.VendorProfileRequest;
import com.servicesphere.dto.response.VendorResponse;
import com.servicesphere.entity.User;
import com.servicesphere.entity.Vendor;
import com.servicesphere.exception.ResourceNotFoundException;
import com.servicesphere.exception.UnauthorizedException;
import com.servicesphere.mapper.VendorMapper;
import com.servicesphere.repository.UserRepository;
import com.servicesphere.repository.VendorRepository;
import com.servicesphere.service.VendorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final VendorMapper vendorMapper;

    @Override
    @Transactional
    public VendorResponse createProfile(VendorProfileRequest request, String email) {
        User user = getUserByEmail(email);

        if (vendorRepository.existsByUserId(user.getId())) {
            throw new UnauthorizedException("Vendor profile already exists. Use update instead.");
        }

        Vendor vendor = Vendor.builder()
                .user(user)
                .businessName(request.businessName())
                .description(request.description())
                .category(request.category())
                .phone(request.phone())
                .address(request.address())
                .city(request.city())
                .state(request.state())
                .pincode(request.pincode())
                .build();

        Vendor saved = vendorRepository.save(vendor);
        log.info("Vendor profile created: vendorId={} userId={}", saved.getId(), user.getId());
        return vendorMapper.toVendorResponse(saved);
    }

    @Override
    @Transactional
    public VendorResponse updateProfile(VendorProfileRequest request, String email) {
        User user = getUserByEmail(email);
        Vendor vendor = getVendorByUserId(user.getId());

        vendor.setBusinessName(request.businessName());
        vendor.setDescription(request.description());
        vendor.setCategory(request.category());
        vendor.setPhone(request.phone());
        vendor.setAddress(request.address());
        vendor.setCity(request.city());
        vendor.setState(request.state());
        vendor.setPincode(request.pincode());

        return vendorMapper.toVendorResponse(vendorRepository.save(vendor));
    }

    @Override
    public VendorResponse getMyProfile(String email) {
        User user = getUserByEmail(email);
        Vendor vendor = getVendorByUserId(user.getId());
        return vendorMapper.toVendorResponse(vendor);
    }

    @Override
    public VendorResponse getVendorById(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + vendorId));
        return vendorMapper.toVendorResponse(vendor);
    }

    @Override
    public Page<VendorResponse> getAllVendors(Pageable pageable) {
        return vendorRepository.findByActiveTrue(pageable).map(vendorMapper::toVendorResponse);
    }

    @Override
    public Page<VendorResponse> getVendorsByCategory(String category, Pageable pageable) {
        return vendorRepository.findByCategoryIgnoreCaseAndActiveTrue(category, pageable)
                .map(vendorMapper::toVendorResponse);
    }

    @Override
    public Page<VendorResponse> searchVendors(String keyword, Pageable pageable) {
        return vendorRepository.searchVendors(keyword, pageable).map(vendorMapper::toVendorResponse);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Vendor getVendorByUserId(Long userId) {
        return vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found. Please create one first."));
    }
}