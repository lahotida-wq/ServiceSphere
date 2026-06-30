// backend/src/main/java/com/servicesphere/controller/VendorController.java
package com.servicesphere.controller;

import com.servicesphere.dto.request.VendorProfileRequest;
import com.servicesphere.dto.response.ApiResponse;
import com.servicesphere.dto.response.VendorResponse;
import com.servicesphere.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    // ── Vendor profile management (VENDOR only) ──────────────────────────────

    @PostMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<VendorResponse>> createProfile(
            @Valid @RequestBody VendorProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        VendorResponse response = vendorService.createProfile(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vendor profile created", response));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<VendorResponse>> updateProfile(
            @Valid @RequestBody VendorProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        VendorResponse response = vendorService.updateProfile(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile updated", response));
    }

    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<VendorResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(vendorService.getMyProfile(userDetails.getUsername())));
    }

    // ── Public discovery endpoints ────────────────────────────────────────────

    @GetMapping("/{vendorId}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(@PathVariable Long vendorId) {
        return ResponseEntity.ok(ApiResponse.success(vendorService.getVendorById(vendorId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getAllVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<VendorResponse> result;

        if (keyword != null && !keyword.isBlank()) {
            result = vendorService.searchVendors(keyword.trim(), pageable);
        } else if (category != null && !category.isBlank()) {
            result = vendorService.getVendorsByCategory(category.trim(), pageable);
        } else {
            result = vendorService.getAllVendors(pageable);
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}