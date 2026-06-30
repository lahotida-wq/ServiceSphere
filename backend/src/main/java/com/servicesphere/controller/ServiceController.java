// backend/src/main/java/com/servicesphere/controller/ServiceController.java
package com.servicesphere.controller;

import com.servicesphere.dto.request.ServiceRequest;
import com.servicesphere.dto.response.ApiResponse;
import com.servicesphere.dto.response.ServiceResponse;
import com.servicesphere.service.ServiceManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceManagementService serviceManagementService;

    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<ServiceResponse>> addService(
            @Valid @RequestBody ServiceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceResponse response = serviceManagementService.addService(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service added successfully", response));
    }

    @PutMapping("/{serviceId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long serviceId,
            @Valid @RequestBody ServiceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceResponse response = serviceManagementService.updateService(serviceId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service updated", response));
    }

    @DeleteMapping("/{serviceId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<Void>> deleteService(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal UserDetails userDetails) {
        serviceManagementService.deleteService(serviceId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service deleted", null));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getMyServices(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(serviceManagementService.getMyServices(userDetails.getUsername())));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getServicesByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(ApiResponse.success(serviceManagementService.getServicesByVendor(vendorId)));
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getServiceById(@PathVariable Long serviceId) {
        return ResponseEntity.ok(ApiResponse.success(serviceManagementService.getServiceById(serviceId)));
    }
}