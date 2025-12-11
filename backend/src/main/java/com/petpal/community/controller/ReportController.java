package com.petpal.community.controller;

import com.petpal.community.model.Report;
import com.petpal.community.model.Post;
import com.petpal.community.model.User;
import com.petpal.community.repository.ReportRepository;
import com.petpal.community.service.PostService;
import com.petpal.community.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    // Get all pending reports (for admins/moderators)
    @GetMapping
    public List<Report> getAllReports(@RequestParam(required = false, defaultValue = "PENDING") String status) {
        if ("all".equalsIgnoreCase(status)) {
            return reportRepository.findAll();
        }
        return reportRepository.findByStatus(status.toUpperCase());
    }

    // Create a new report
    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Map<String, Object> body, @RequestParam Long userId) {
        Long postId = Long.valueOf(body.get("postId").toString());
        String reason = (String) body.get("reason");
        String description = (String) body.get("description");

        // Check if user already reported this post
        if (reportRepository.existsByPostIdAndReporterId(postId, userId)) {
            return ResponseEntity.badRequest().body("You have already reported this post");
        }

        Post post = postService.getPostById(postId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }

        return userService.findById(userId).map(user -> {
            Report report = new Report();
            report.setPost(post);
            report.setReporter(user);
            report.setReason(reason);
            report.setDescription(description);
            report.setStatus("PENDING");
            return ResponseEntity.ok(reportRepository.save(report));
        }).orElse(ResponseEntity.badRequest().build());
    }

    // Mark report as reviewed
    @PutMapping("/{id}/review")
    public ResponseEntity<Report> reviewReport(@PathVariable Long id,
            @RequestParam Long reviewerId,
            @RequestParam String action) {
        return reportRepository.findById(id).map(report -> {
            return userService.findById(reviewerId).map(reviewer -> {
                if ("dismiss".equalsIgnoreCase(action)) {
                    report.setStatus("DISMISSED");
                } else {
                    report.setStatus("REVIEWED");
                }
                report.setReviewedBy(reviewer);
                report.setReviewedAt(LocalDateTime.now());
                return ResponseEntity.ok(reportRepository.save(report));
            }).orElse(ResponseEntity.badRequest().build());
        }).orElse(ResponseEntity.notFound().build());
    }

    // Get reports for a specific post
    @GetMapping("/post/{postId}")
    public List<Report> getReportsForPost(@PathVariable Long postId) {
        return reportRepository.findByPostId(postId);
    }

    // Delete a report
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        if (reportRepository.existsById(id)) {
            reportRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
