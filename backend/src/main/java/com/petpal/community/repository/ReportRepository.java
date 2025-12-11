package com.petpal.community.repository;

import com.petpal.community.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(String status);

    List<Report> findByPostId(Long postId);

    List<Report> findByReporterId(Long reporterId);

    boolean existsByPostIdAndReporterId(Long postId, Long reporterId);
}
