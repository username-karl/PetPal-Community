package com.petpal.community.controller;

import com.petpal.community.model.Reminder;
import com.petpal.community.service.PetService;
import com.petpal.community.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "http://localhost:3000")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private PetService petService;

    @GetMapping
    public List<Reminder> getReminders(@RequestParam Long petId) {
        return reminderService.getRemindersByPet(petId);
    }

    @PostMapping
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder, @RequestParam Long petId) {
        return petService.getPetById(petId).map(pet -> {
            reminder.setPet(pet);
            return ResponseEntity.ok(reminderService.createReminder(reminder));
        }).orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Reminder> toggleReminder(@PathVariable Long id) {
        Reminder updated = reminderService.toggleCompletion(id);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.ok().build();
    }
}
