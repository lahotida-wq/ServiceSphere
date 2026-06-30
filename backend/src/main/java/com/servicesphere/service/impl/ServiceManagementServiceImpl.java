// backend/src/main/java/com/servicesphere/service/impl/ServiceManagementServiceImpl.java
package com.servicesphere.service.impl;

import com.servicesphere.dto.request.ServiceRequest;
import com.servicesphere.dto.response.ServiceResponse;
import com.servicesphere.entity.Service;
import com.servicesphere.entity.User;
import com.servicesphere.entity.Vendor;
import com.servicesphere.exception.ResourceNotFoundException;
import com.servicesphere.exception.UnauthorizedException;
import com.servicesphere.mapper.ServiceMapper;
import com.servicesphere.repository.ServiceRepository;
import com.servicesphere.repository.UserRepository;
import com.servicesphere.repository.VendorRepository;
import com.servicesphere.service.ServiceManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Slf4j
public class ServiceManagementServiceImpl implements ServiceManagementService {

    private final ServiceRepository serviceRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final ServiceMapper serviceMapper;

    @Override
    @Transactional
    public ServiceResponse addService(ServiceRequest request, String email) {
        Vendor vendor = getVendorByEmail(email);

        Service service = Service.builder()
                .vendor(vendor)
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .durationMinutes(request.durationMinutes())
                .build();

        Service saved = serviceRepository.save(service);
        log.info("Service added: serviceId={} vendorId={}", saved.getId(), vendor.getId());
        return serviceMapper.toServiceResponse(saved);
    }

    @Override
    @Transactional
    public ServiceResponse updateService(Long serviceId, ServiceRequest request, String email) {
        Vendor vendor = getVendorByEmail(email);
        Service service = serviceRepository.findByIdAndVendorId(serviceId, vendor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found or does not belong to you."));

        service.setName(request.name());
        service.setDescription(request.description());
        service.setPrice(request.price());
        service.setDurationMinutes(request.durationMinutes());

        return serviceMapper.toServiceResponse(serviceRepository.save(service));
    }

    @Override
    public ServiceResponse getServiceById(Long serviceId) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + serviceId));
        return serviceMapper.toServiceResponse(service);
    }

    @Override
    public List<ServiceResponse> getServicesByVendor(Long vendorId) {
        return serviceRepository.findByVendorIdAndActiveTrue(vendorId)
                .stream().map(serviceMapper::toServiceResponse).toList();
    }

    @Override
    public List<ServiceResponse> getMyServices(String email) {
        Vendor vendor = getVendorByEmail(email);
        return serviceRepository.findByVendorIdAndActiveTrue(vendor.getId())
                .stream().map(serviceMapper::toServiceResponse).toList();
    }

    @Override
    @Transactional
    public void deleteService(Long serviceId, String email) {
        Vendor vendor = getVendorByEmail(email);
        Service service = serviceRepository.findByIdAndVendorId(serviceId, vendor.getId())
                .orElseThrow(() -> new UnauthorizedException("Service not found or does not belong to you."));
        service.setActive(false);
        serviceRepository.save(service);
        log.info("Service soft-deleted: serviceId={}", serviceId);
    }

    private Vendor getVendorByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return vendorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found. Please create one first."));
    }
}