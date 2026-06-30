// backend/src/main/java/com/servicesphere/controller/SlotController.java
package com.servicesphere.controller;

import com.servicesphere.dto.request.SlotGenerationRequest;
import com.servicesphere.dto.response.ApiResponse;
import com.servicesphere.dto.response.SlotResponse;
import com.servicesphere.service.SlotService;
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
@RequestMapping("/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> generateSlots(
            @Valid @RequestBody SlotGenerationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<SlotResponse> slots = slotService.generateSlots(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Slots generated successfully", slots));
    }

    @GetMapping("/available/{serviceId}")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getAvailableSlots(
            @PathVariable Long serviceId) {
        return ResponseEntity.ok(ApiResponse.success(slotService.getAvailableSlots(serviceId)));
    }

    @GetMapping("/all/{serviceId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getAllSlots(
            @PathVariable Long serviceId) {
        return ResponseEntity.ok(ApiResponse.success(slotService.getAllSlots(serviceId)));
    }

    @DeleteMapping("/{slotId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(
            @PathVariable Long slotId,
            @AuthenticationPrincipal UserDetails userDetails) {
        slotService.deleteSlot(slotId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Slot deleted", null));
    }
}