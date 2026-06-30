// backend/src/main/java/com/servicesphere/mapper/ReviewMapper.java
package com.servicesphere.mapper;

import com.servicesphere.dto.response.ReviewResponse;
import com.servicesphere.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(source = "customer.id",           target = "customerId")
    @Mapping(source = "customer.fullName",      target = "customerName")
    @Mapping(source = "vendor.id",             target = "vendorId")
    @Mapping(source = "vendor.businessName",   target = "vendorBusinessName")
    ReviewResponse toReviewResponse(Review review);
}