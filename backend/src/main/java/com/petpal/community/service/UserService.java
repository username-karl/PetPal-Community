package com.petpal.community.service;

import com.petpal.community.model.User;
import com.petpal.community.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // TODO: Add password hashing
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        // TODO: Add proper authentication
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password));
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    if (updatedUser.getName() != null)
                        user.setName(updatedUser.getName());
                    if (updatedUser.getLocation() != null)
                        user.setLocation(updatedUser.getLocation());
                    if (updatedUser.getBio() != null)
                        user.setBio(updatedUser.getBio());
                    if (updatedUser.getAvatarUrl() != null)
                        user.setAvatarUrl(updatedUser.getAvatarUrl());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
