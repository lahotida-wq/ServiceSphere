// backend/src/main/java/com/servicesphere/service/impl/BookingServiceImpl.java
package com.servicesphere.service.impl;

import com.servicesphere.constant.BookingStatus;
import com.servicesphere.dto.request.BookingRequest;
import com.servicesphere.dto.response.BookingResponse;
import com.servicesphere.entity.Booking;
import com.servicesphere.entity.Slot;
import com.servicesphere.entity.User;
import com.servicesphere.exception.ResourceNotFoundException;
import com.servicesphere.exception.SlotNotAvailableException;
import com.servicesphere.exception.UnauthorizedException;
import com.servicesphere.mapper.BookingMapper;
import com.servicesphere.repository.BookingRepository;
import com.servicesphere.repository.SlotRepository;
import com.servicesphere.repository.UserRepository;
import com.servicesphere.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String email) {
        User customer = getUserByEmail(email);

        // Pessimistic lock — prevents double booking
        Slot slot = slotRepository.findByIdWithLock(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found: " + request.slotId()));

        if (slot.isBooked()) {
            throw new SlotNotAvailableException(
                    "This slot is already booked. Please choose another time.");
        }

        if (!slot.isActive()) {
            throw new SlotNotAvailableException("This slot is no longer available.");
        }

        slot.setBooked(true);
        slotRepository.save(slot);

        Booking booking = Booking.builder()
                .customer(customer)
                .slot(slot)
                .status(BookingStatus.CONFIRMED)
                .notes(request.notes())
                .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created: bookingId={} customerId={} slotId={}",
                saved.getId(), customer.getId(), slot.getId());

        return bookingMapper.toBookingResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String email) {
        User user = getUserByEmail(email);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());
        boolean isVendorOwner = booking.getSlot().getService()
                .getVendor().getUser().getId().equals(user.getId());

        if (!isCustomer && !isVendorOwner) {
            throw new UnauthorizedException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new SlotNotAvailableException("Booking is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.getSlot().setBooked(false);
        slotRepository.save(booking.getSlot());
        Booking updated = bookingRepository.save(booking);

        log.info("Booking cancelled: bookingId={}", bookingId);
        return bookingMapper.toBookingResponse(updated);
    }

    @Override
    public Page<BookingResponse> getMyBookings(String email, Pageable pageable) {
        User customer = getUserByEmail(email);
        return bookingRepository
                .findByCustomerIdOrderByCreatedAtDesc(customer.getId(), pageable)
                .map(bookingMapper::toBookingResponse);
    }

    @Override
    public Page<BookingResponse> getVendorBookings(String email, Pageable pageable) {
        User user = getUserByEmail(email);
        return bookingRepository
                .findByVendorUserId(user.getId(), pageable)
                .map(bookingMapper::toBookingResponse);
    }

    @Override
    public List<BookingResponse> getVendorConfirmedBookings(String email) {
        User user = getUserByEmail(email);
        return bookingRepository
                .findByVendorUserIdAndStatus(user.getId(), BookingStatus.CONFIRMED)
                .stream().map(bookingMapper::toBookingResponse).toList();
    }

    @Override
    public BookingResponse getBookingById(Long bookingId, String email) {
        User user = getUserByEmail(email);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());
        boolean isVendorOwner = booking.getSlot().getService()
                .getVendor().getUser().getId().equals(user.getId());

        if (!isCustomer && !isVendorOwner) {
            throw new UnauthorizedException("You are not authorized to view this booking.");
        }

        return bookingMapper.toBookingResponse(booking);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}