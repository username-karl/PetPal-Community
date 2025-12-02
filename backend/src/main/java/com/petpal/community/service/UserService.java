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
}
