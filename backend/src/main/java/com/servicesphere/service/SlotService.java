// backend/src/main/java/com/servicesphere/service/SlotService.java
package com.servicesphere.service;

import com.servicesphere.dto.request.SlotGenerationRequest;
import com.servicesphere.dto.response.SlotResponse;

import java.util.List;

public interface SlotService {
    List<SlotResponse> generateSlots(SlotGenerationRequest request, String email);
    List<SlotResponse> getAvailableSlots(Long serviceId);
    List<SlotResponse> getAllSlots(Long serviceId);
    void deleteSlot(Long slotId, String email);
}