// backend/src/main/java/com/servicesphere/service/impl/ReviewServiceImpl.java
package com.servicesphere.service.impl;

import com.servicesphere.dto.request.ReviewRequest;
import com.servicesphere.dto.response.ReviewResponse;
import com.servicesphere.entity.Review;
import com.servicesphere.entity.User;
import com.servicesphere.entity.Vendor;
import com.servicesphere.exception.ResourceNotFoundException;
import com.servicesphere.exception.UnauthorizedException;
import com.servicesphere.mapper.ReviewMapper;
import com.servicesphere.repository.ReviewRepository;
import com.servicesphere.repository.UserRepository;
import com.servicesphere.repository.VendorRepository;
import com.servicesphere.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository  reviewRepository;
    private final UserRepository    userRepository;
    private final VendorRepository  vendorRepository;
    private final ReviewMapper      reviewMapper;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String email) {
        User customer = getUserByEmail(email);
        Vendor vendor = vendorRepository.findById(request.vendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        if (reviewRepository.existsByCustomerIdAndVendorId(customer.getId(), vendor.getId())) {
            throw new UnauthorizedException("You have already reviewed this vendor.");
        }

        Review review = Review.builder()
                .customer(customer)
                .vendor(vendor)
                .rating(request.rating())
                .comment(request.comment())
                .build();

        Review saved = reviewRepository.save(review);
        updateVendorRating(vendor);
        log.info("Review created: reviewId={} vendorId={}", saved.getId(), vendor.getId());
        return reviewMapper.toReviewResponse(saved);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request, String email) {
        User customer = getUserByEmail(email);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You can only edit your own reviews.");
        }

        review.setRating(request.rating());
        review.setComment(request.comment());
        Review updated = reviewRepository.save(review);
        updateVendorRating(review.getVendor());
        return reviewMapper.toReviewResponse(updated);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, String email) {
        User customer = getUserByEmail(email);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("You can only delete your own reviews.");
        }

        Vendor vendor = review.getVendor();
        reviewRepository.delete(review);
        updateVendorRating(vendor);
    }

    @Override
    public Page<ReviewResponse> getVendorReviews(Long vendorId, Pageable pageable) {
        return reviewRepository.findByVendorId(vendorId, pageable)
                .map(reviewMapper::toReviewResponse);
    }

    @Override
    public Page<ReviewResponse> getMyReviews(String email, Pageable pageable) {
        User customer = getUserByEmail(email);
        return reviewRepository.findByCustomerId(customer.getId(), pageable)
                .map(reviewMapper::toReviewResponse);
    }

    private void updateVendorRating(Vendor vendor) {
        Double avg   = reviewRepository.findAverageRatingByVendorId(vendor.getId());
        Long   count = reviewRepository.countByVendorId(vendor.getId());
        vendor.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        vendor.setTotalReviews(count != null ? count.intValue() : 0);
        vendorRepository.save(vendor);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}