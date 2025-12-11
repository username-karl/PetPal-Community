package com.petpal.community.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "report")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(nullable = false)
    private String reason; // spam, harassment, inappropriate, misinformation, other

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, REVIEWED, DISMISSED

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    private LocalDateTime reviewedAt;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
