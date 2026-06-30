// backend/src/main/java/com/servicesphere/service/ReviewService.java
package com.servicesphere.service;

import com.servicesphere.dto.request.ReviewRequest;
import com.servicesphere.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest request, String email);
    ReviewResponse updateReview(Long reviewId, ReviewRequest request, String email);
    void deleteReview(Long reviewId, String email);
    Page<ReviewResponse> getVendorReviews(Long vendorId, Pageable pageable);
    Page<ReviewResponse> getMyReviews(String email, Pageable pageable);
}