// backend/src/main/java/com/servicesphere/service/ServiceManagementService.java
package com.servicesphere.service;

import com.servicesphere.dto.request.ServiceRequest;
import com.servicesphere.dto.response.ServiceResponse;

import java.util.List;

public interface ServiceManagementService {
    ServiceResponse addService(ServiceRequest request, String email);
    ServiceResponse updateService(Long serviceId, ServiceRequest request, String email);
    ServiceResponse getServiceById(Long serviceId);
    List<ServiceResponse> getServicesByVendor(Long vendorId);
    List<ServiceResponse> getMyServices(String email);
    void deleteService(Long serviceId, String email);
}