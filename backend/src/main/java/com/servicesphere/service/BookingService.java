// backend/src/main/java/com/servicesphere/service/BookingService.java
package com.servicesphere.service;

import com.servicesphere.dto.request.BookingRequest;
import com.servicesphere.dto.response.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request, String email);
    BookingResponse cancelBooking(Long bookingId, String email);
    Page<BookingResponse> getMyBookings(String email, Pageable pageable);
    Page<BookingResponse> getVendorBookings(String email, Pageable pageable);
    List<BookingResponse> getVendorConfirmedBookings(String email);
    BookingResponse getBookingById(Long bookingId, String email);
}