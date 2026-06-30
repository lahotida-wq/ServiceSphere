// backend/src/main/java/com/servicesphere/mapper/VendorMapper.java
package com.servicesphere.mapper;

import com.servicesphere.dto.response.VendorResponse;
import com.servicesphere.entity.Vendor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VendorMapper {

    @Mapping(source = "user.id", target = "userId")
    VendorResponse toVendorResponse(Vendor vendor);
}