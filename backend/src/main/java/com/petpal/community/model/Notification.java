package com.petpal.community.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private String type; // POST_APPROVED, NEW_COMMENT, REMINDER_DUE, SYSTEM

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    private String link; // Optional: where to navigate when clicked

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    // Convenience constructor
    public Notification(Long userId, String message, String type, String link) {
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.link = link;
        this.read = false;
    }
}
