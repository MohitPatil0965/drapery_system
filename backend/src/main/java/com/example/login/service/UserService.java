package com.example.login.service;

import com.example.login.model.User;
import com.example.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean toggleUserBlock(Long userId, String adminUsername) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Prevent admin from blocking themselves
            if (user.getUsername().equals(adminUsername)) {
                return false;
            }
            user.setBlocked(!user.isBlocked());
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
