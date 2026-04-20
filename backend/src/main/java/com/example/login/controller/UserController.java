package com.example.login.controller;

import com.example.login.model.User;
import com.example.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/{id}/toggle-block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> toggleBlock(@PathVariable Long id, Authentication authentication) {
        String adminUsername = authentication.getName();
        boolean success = userService.toggleUserBlock(id, adminUsername);
        if (success) {
            return ResponseEntity.ok("User status updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to update user status (you cannot block yourself or user not found)");
        }
    }
}
