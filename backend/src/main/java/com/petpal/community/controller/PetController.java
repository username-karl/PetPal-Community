package com.petpal.community.controller;

import com.petpal.community.model.Pet;
import com.petpal.community.model.User;
import com.petpal.community.service.PetService;
import com.petpal.community.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Pet> getPets(@RequestParam(required = false) Long userId) {
        // For simplicity, if userId is not provided, return empty or all (depending on
        // requirements)
        // In a real app, we'd get the user from the session/token
        if (userId != null) {
            return petService.getPetsByOwner(userId);
        }
        return List.of();
    }

    @PostMapping
    public ResponseEntity<?> createPet(@RequestBody Pet pet, @RequestParam Long userId) {
        try {
            // Validate required fields
            if (pet.getName() == null || pet.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Pet name is required");
            }
            if (pet.getType() == null || pet.getType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Pet type is required");
            }

            // Find user
            Optional<User> userOptional = userService.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found with id: " + userId);
            }

            // Set owner and save
            pet.setOwner(userOptional.get());
            Pet savedPet = petService.createPet(pet);
            return ResponseEntity.ok(savedPet);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating pet: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPet(@PathVariable Long id) {
        return petService.getPetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        Pet updated = petService.updatePet(id, pet);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok().build();
    }
}
