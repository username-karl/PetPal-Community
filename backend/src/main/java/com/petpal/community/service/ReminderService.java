package com.petpal.community.service;

import com.petpal.community.model.Reminder;
import com.petpal.community.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public List<Reminder> getRemindersByPet(Long petId) {
        return reminderRepository.findByPetId(petId);
    }

    public Reminder createReminder(Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    public Reminder toggleCompletion(Long id) {
        return reminderRepository.findById(id).map(reminder -> {
            reminder.setCompleted(!reminder.isCompleted());
            return reminderRepository.save(reminder);
        }).orElse(null);
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }
}
