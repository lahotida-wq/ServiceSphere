// backend/src/main/java/com/servicesphere/service/impl/SlotServiceImpl.java
package com.servicesphere.service.impl;

import com.servicesphere.dto.request.SlotGenerationRequest;
import com.servicesphere.dto.response.SlotResponse;
import com.servicesphere.entity.Service;
import com.servicesphere.entity.Slot;
import com.servicesphere.entity.User;
import com.servicesphere.entity.Vendor;
import com.servicesphere.exception.ResourceNotFoundException;
import com.servicesphere.exception.UnauthorizedException;
import com.servicesphere.mapper.SlotMapper;
import com.servicesphere.repository.ServiceRepository;
import com.servicesphere.repository.SlotRepository;
import com.servicesphere.repository.UserRepository;
import com.servicesphere.repository.VendorRepository;
import com.servicesphere.service.SlotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Slf4j
public class SlotServiceImpl implements SlotService {

    private final SlotRepository slotRepository;
    private final ServiceRepository serviceRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final SlotMapper slotMapper;

    @Override
    @Transactional
    public List<SlotResponse> generateSlots(SlotGenerationRequest request, String email) {
        Service service = getServiceAndVerifyOwnership(request.serviceId(), email);

        List<Slot> slots = new ArrayList<>();
        LocalDate current = request.startDate();

        while (!current.isAfter(request.endDate())) {
            LocalTime cursor = request.workStartTime();

            while (cursor.plusMinutes(service.getDurationMinutes())
                    .compareTo(request.workEndTime()) <= 0) {

                // Skip break window
                if (!cursor.isBefore(request.breakStartTime())
                        && cursor.isBefore(request.breakEndTime())) {
                    cursor = request.breakEndTime();
                    continue;
                }

                LocalDateTime start = LocalDateTime.of(current, cursor);
                LocalDateTime end = start.plusMinutes(service.getDurationMinutes());

                // Skip if slot already exists for this window
                boolean exists = slotRepository.existsByServiceIdAndStartTimeBetween(
                        service.getId(),
                        start.minusSeconds(1),
                        end.minusSeconds(1));

                if (!exists) {
                    slots.add(Slot.builder()
                            .service(service)
                            .startTime(start)
                            .endTime(end)
                            .build());
                }

                cursor = cursor.plusMinutes(service.getDurationMinutes());
            }
            current = current.plusDays(1);
        }

        List<Slot> saved = slotRepository.saveAll(slots);
        log.info("Generated {} slots for serviceId={}", saved.size(), service.getId());
        return saved.stream().map(slotMapper::toSlotResponse).toList();
    }

    @Override
    public List<SlotResponse> getAvailableSlots(Long serviceId) {
        return slotRepository
                .findByServiceIdAndBookedFalseAndActiveTrueAndStartTimeAfterOrderByStartTimeAsc(
                        serviceId, LocalDateTime.now())
                .stream().map(slotMapper::toSlotResponse).toList();
    }

    @Override
    public List<SlotResponse> getAllSlots(Long serviceId) {
        return slotRepository
                .findByServiceIdAndActiveTrueOrderByStartTimeAsc(serviceId)
                .stream().map(slotMapper::toSlotResponse).toList();
    }

    @Override
    @Transactional
    public void deleteSlot(Long slotId, String email) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found: " + slotId));

        verifySlotOwnership(slot, email);

        if (slot.isBooked()) {
            throw new UnauthorizedException("Cannot delete a slot that is already booked.");
        }

        slot.setActive(false);
        slotRepository.save(slot);
    }

    private Service getServiceAndVerifyOwnership(Long serviceId, String email) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + serviceId));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found."));

        if (!service.getVendor().getId().equals(vendor.getId())) {
            throw new UnauthorizedException("This service does not belong to your vendor profile.");
        }
        return service;
    }

    private void verifySlotOwnership(Slot slot, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found."));
        if (!slot.getService().getVendor().getId().equals(vendor.getId())) {
            throw new UnauthorizedException("This slot does not belong to your vendor profile.");
        }
    }
}