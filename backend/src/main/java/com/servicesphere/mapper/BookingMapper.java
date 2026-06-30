// backend/src/main/java/com/servicesphere/mapper/BookingMapper.java
package com.servicesphere.mapper;

import com.servicesphere.dto.response.BookingResponse;
import com.servicesphere.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(source = "customer.id",                    target = "customerId")
    @Mapping(source = "customer.fullName",              target = "customerName")
    @Mapping(source = "customer.email",                 target = "customerEmail")
    @Mapping(source = "slot.id",                        target = "slotId")
    @Mapping(source = "slot.startTime",                 target = "slotStartTime")
    @Mapping(source = "slot.endTime",                   target = "slotEndTime")
    @Mapping(source = "slot.service.id",                target = "serviceId")
    @Mapping(source = "slot.service.name",              target = "serviceName")
    @Mapping(source = "slot.service.vendor.id",         target = "vendorId")
    @Mapping(source = "slot.service.vendor.businessName", target = "vendorBusinessName")
    BookingResponse toBookingResponse(Booking booking);
}