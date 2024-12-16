package com.example.turfbooking.service;

import com.example.turfbooking.model.User;
import com.example.turfbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Register user method with basic validation
    public void registerUser(User user) {
        // You could include password hashing and validation logic here (e.g., check if the email is unique)
        userRepository.save(user);  // Save user to the database
    }

    // Method to find a user by their email address
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Additional service methods can be added for functionality like login, updating user details, etc.
}
