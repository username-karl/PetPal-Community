package com.petpal.community.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminder")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime date;

    private String type;

    private String recurrence; // 'None', 'Daily', 'Weekly', 'Monthly'

    private boolean completed;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonIgnoreProperties({ "reminders", "owner" })
    private Pet pet;

    // Expose petId directly in JSON for easier frontend consumption
    @JsonProperty("petId")
    public Long getPetId() {
        return pet != null ? pet.getId() : null;
    }
}
