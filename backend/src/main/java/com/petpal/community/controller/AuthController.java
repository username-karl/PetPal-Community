package com.petpal.community.controller;

import com.petpal.community.model.User;
import com.petpal.community.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userService.login(user.getEmail(), user.getPassword()).isPresent()) {
                return ResponseEntity.badRequest().body("User already exists");
            }
            user.setRole("Owner"); // Default role
            return ResponseEntity.ok(userService.registerUser(user));
        } catch (Exception e) {
            e.printStackTrace(); // Log to console
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, Object> payload) {
        try {
            String adminCode = (String) payload.get("adminCode");
            if (!"PETPAL_ADMIN_2024".equals(adminCode)) {
                return ResponseEntity.status(403).body("Invalid admin code");
            }

            String email = (String) payload.get("email");
            String password = (String) payload.get("password");
            String name = (String) payload.get("name");

            if (userService.login(email, password).isPresent()) {
                return ResponseEntity.badRequest().body("User already exists");
            }

            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setName(name);
            user.setRole("Admin");

            return ResponseEntity.ok(userService.registerUser(user));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return userService.login(email, password)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating user: " + e.getMessage());
        }
    }
}
