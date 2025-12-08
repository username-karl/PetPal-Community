package com.petpal.community.repository;

import com.petpal.community.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByTimestampDesc();

    List<Post> findByAuthor_IdOrderByTimestampDesc(Long userId);
}
