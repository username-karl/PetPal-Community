package com.petpal.community.service;

import com.petpal.community.model.Post;
import com.petpal.community.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByTimestampDesc();
    }

    public List<Post> getApprovedPosts() {
        return postRepository.findByStatusOrderByTimestampDesc("APPROVED");
    }

    public List<Post> getPendingPosts() {
        return postRepository.findByStatusOrderByTimestampDesc("PENDING");
    }

    public List<Post> getVisiblePostsForUser(Long userId) {
        // Returns approved posts + user's own posts (regardless of status)
        return postRepository.findByStatusOrAuthor_IdOrderByTimestampDesc("APPROVED", userId);
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByAuthor_IdOrderByTimestampDesc(userId);
    }

    public Post approvePost(Long id) {
        Post post = getPostById(id);
        post.setStatus("APPROVED");
        return postRepository.save(post);
    }

    public Post rejectPost(Long id) {
        Post post = getPostById(id);
        post.setStatus("REJECTED");
        return postRepository.save(post);
    }
}
