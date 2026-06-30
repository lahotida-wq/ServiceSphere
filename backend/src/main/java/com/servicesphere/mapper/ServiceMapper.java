// backend/src/main/java/com/servicesphere/mapper/ServiceMapper.java
package com.servicesphere.mapper;

import com.servicesphere.dto.response.ServiceResponse;
import com.servicesphere.entity.Service;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ServiceMapper {

    @Mapping(source = "vendor.id", target = "vendorId")
    @Mapping(source = "vendor.businessName", target = "vendorBusinessName")
    ServiceResponse toServiceResponse(Service service);
}