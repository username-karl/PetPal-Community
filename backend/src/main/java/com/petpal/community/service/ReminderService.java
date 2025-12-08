package com.petpal.community.service;

import com.petpal.community.model.Reminder;
import com.petpal.community.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public List<Reminder> getRemindersByPet(Long petId) {
        return reminderRepository.findByPet_Id(petId);
    }

    public Reminder createReminder(Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    public Reminder toggleCompletion(Long id) {
        return reminderRepository.findById(id).map(reminder -> {
            boolean wasCompleted = reminder.isCompleted();
            reminder.setCompleted(!wasCompleted);

            // If marking as complete and has recurrence, schedule next one
            if (!wasCompleted && reminder.getRecurrence() != null && !reminder.getRecurrence().equals("None")) {
                scheduleNextReminder(reminder);
            }

            return reminderRepository.save(reminder);
        }).orElse(null);
    }

    private void scheduleNextReminder(Reminder original) {
        Reminder next = new Reminder();
        next.setTitle(original.getTitle());
        next.setType(original.getType());
        next.setPet(original.getPet());
        next.setRecurrence(original.getRecurrence());
        next.setCompleted(false);

        LocalDateTime nextDate = original.getDate();
        switch (original.getRecurrence()) {
            case "Daily":
                nextDate = nextDate.plusDays(1);
                break;
            case "Weekly":
                nextDate = nextDate.plusWeeks(1);
                break;
            case "Monthly":
                nextDate = nextDate.plusMonths(1);
                break;
        }
        next.setDate(nextDate);
        reminderRepository.save(next);
    }

    public void deleteReminder(Long id) {
        reminderRepository.deleteById(id);
    }
}
