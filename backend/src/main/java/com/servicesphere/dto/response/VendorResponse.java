// backend/src/main/java/com/servicesphere/dto/response/VendorResponse.java
package com.servicesphere.dto.response;

import java.time.LocalDateTime;

/**
 * Public-facing vendor profile response.
 */
public record VendorResponse(
        Long id,
        Long userId,
        String businessName,
        String description,
        String category,
        String phone,
        String address,
        String city,
        String state,
        String pincode,
        String profileImageUrl,
        String coverImageUrl,
        Double averageRating,
        Integer totalReviews,
        boolean active,
        LocalDateTime createdAt
) {}