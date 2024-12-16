package com.example.turfbooking.repository;

import com.example.turfbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByDate(LocalDate date);
    List<Booking> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
