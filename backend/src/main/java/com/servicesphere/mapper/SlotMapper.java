// backend/src/main/java/com/servicesphere/mapper/SlotMapper.java
package com.servicesphere.mapper;

import com.servicesphere.dto.response.SlotResponse;
import com.servicesphere.entity.Slot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SlotMapper {

    @Mapping(source = "service.id", target = "serviceId")
    @Mapping(source = "service.name", target = "serviceName")
    SlotResponse toSlotResponse(Slot slot);
}