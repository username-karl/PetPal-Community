package com.petpal.community.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String category;

    private LocalDateTime timestamp;

    private int likes;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
