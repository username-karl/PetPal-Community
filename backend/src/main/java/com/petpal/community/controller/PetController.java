package com.petpal.community.controller;

import com.petpal.community.model.Pet;
import com.petpal.community.model.User;
import com.petpal.community.service.PetService;
import com.petpal.community.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    public ResponseEntity<Pet> createPet(@RequestBody Pet pet, @RequestParam Long userId) {
        return userService.findById(userId).map(user -> {
            pet.setOwner(user);
            return ResponseEntity.ok(petService.createPet(pet));
        }).orElse(ResponseEntity.badRequest().build());
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
