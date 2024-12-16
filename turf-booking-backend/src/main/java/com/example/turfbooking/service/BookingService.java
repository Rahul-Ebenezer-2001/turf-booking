package com.example.turfbooking.service;

import com.example.turfbooking.model.Booking;
import com.example.turfbooking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Save the booking only if the slot is available on the selected date
    public Booking saveBooking(Booking booking) {
        if (isSlotAvailable(booking.getDate(), booking.getStartTime(), booking.getEndTime())) {
            return bookingRepository.save(booking);
        } else {
            throw new IllegalArgumentException("Slot already booked for the selected date and time");
        }
    }

    // Check if a slot is available on the specific date
    public boolean isSlotAvailable(LocalDate date, LocalTime startTime, LocalTime endTime) {
        // Retrieve bookings for the given date
        List<Booking> bookings = bookingRepository.findByDate(date);

        // Check each existing booking to see if there is any overlap
        for (Booking existingBooking : bookings) {
            if (timesOverlap(startTime, endTime, existingBooking.getStartTime(), existingBooking.getEndTime())) {
                return false;
            }
        }
        return true;
    }

    // Helper method to check for time overlaps between two time ranges
    private boolean timesOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }

    public List<Booking> DisplayAll(){
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found for id: " + id));
    }


    public Booking updateBooking(Long id, Booking updatedBooking) {
        // Fetch the existing booking by ID
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking with ID " + id + " not found"));

        // Check if the new slot is available excluding the current booking
        if (!isSlotAvailableExcludingCurrent(updatedBooking.getDate(), updatedBooking.getStartTime(),
                updatedBooking.getEndTime(), id)) {
            throw new IllegalArgumentException("Slot already booked for the selected date and time");
        }

        // Update the booking with new details
        existingBooking.setFirstName(updatedBooking.getFirstName());
        existingBooking.setPhoneNumber(updatedBooking.getPhoneNumber());
        existingBooking.setDate(updatedBooking.getDate());
        existingBooking.setStartTime(updatedBooking.getStartTime());
        existingBooking.setEndTime(updatedBooking.getEndTime());

        // Save the updated booking
        return bookingRepository.save(existingBooking);
    }

    public boolean isSlotAvailableExcludingCurrent(LocalDate date, LocalTime startTime, LocalTime endTime, Long bookingId) {
        // Retrieve bookings for the given date
        List<Booking> bookings = bookingRepository.findByDate(date);

        // Check each existing booking to see if there is any overlap
        for (Booking existingBooking : bookings) {
            // Skip the current booking ID
            if (!existingBooking.getId().equals(bookingId) &&
                    timesOverlap(startTime, endTime, existingBooking.getStartTime(), existingBooking.getEndTime())) {
                return false;
            }
        }
        return true;
    }


    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking with ID " + id + " not found"));
        bookingRepository.delete(booking);
    }


}
