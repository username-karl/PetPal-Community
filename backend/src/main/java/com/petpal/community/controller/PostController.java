package com.petpal.community.controller;

import com.petpal.community.model.Post;
import com.petpal.community.model.PostLike;
import com.petpal.community.model.User;
import com.petpal.community.repository.PostLikeRepository;
import com.petpal.community.service.PostService;
import com.petpal.community.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @GetMapping
    public List<Post> getAllPosts(@RequestParam(required = false) Long userId,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        List<Post> posts;
        if (userId != null) {
            // Return approved posts + user's own posts (regardless of status)
            posts = postService.getVisiblePostsForUser(userId);
        } else {
            // Default: return only approved posts
            posts = postService.getApprovedPosts();
        }

        // Sort posts based on parameter
        switch (sort) {
            case "popular":
                posts.sort((a, b) -> Integer.compare(b.getLikes(), a.getLikes()));
                break;
            case "hot":
                posts.sort((a, b) -> Integer.compare(
                        b.getComments() != null ? b.getComments().size() : 0,
                        a.getComments() != null ? a.getComments().size() : 0));
                break;
            case "views":
                posts.sort((a, b) -> Integer.compare(b.getViews(), a.getViews()));
                break;
            case "newest":
            default:
                posts.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
                break;
        }
        return posts;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(post);
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Post> incrementViewCount(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        post.setViews(post.getViews() + 1);
        return ResponseEntity.ok(postService.savePost(post));
    }

    @GetMapping("/pending")
    public List<Post> getPendingPosts() {
        return postService.getPendingPosts();
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @RequestParam Long userId) {
        return userService.findById(userId).map(user -> {
            post.setAuthor(user);
            // Admin posts are auto-approved
            if ("Admin".equals(user.getRole())) {
                post.setStatus("APPROVED");
            } else {
                post.setStatus("PENDING");
            }
            return ResponseEntity.ok(postService.createPost(post));
        }).orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, @RequestParam(required = false) Long userId) {
        if (userId != null) {
            // Check if user is admin or owner
            return userService.findById(userId).map(user -> {
                Post post = postService.getPostById(id);
                boolean isAdmin = "Admin".equals(user.getRole());
                boolean isOwner = post.getAuthor() != null && post.getAuthor().getId().equals(userId);

                if (isAdmin || isOwner) {
                    postService.deletePost(id);
                    return ResponseEntity.ok().build();
                }
                return ResponseEntity.status(403).body("Not authorized to delete this post");
            }).orElse(ResponseEntity.badRequest().build());
        }
        // Fallback for backward compatibility
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post updatedPost,
            @RequestParam Long userId) {
        Post existingPost = postService.getPostById(id);
        if (existingPost == null) {
            return ResponseEntity.notFound().build();
        }
        // Verify ownership
        if (existingPost.getAuthor() == null || !existingPost.getAuthor().getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        // Update fields
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        if (updatedPost.getCategory() != null) {
            existingPost.setCategory(updatedPost.getCategory());
        }
        return ResponseEntity.ok(postService.savePost(existingPost));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Post> approvePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.approvePost(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Post> rejectPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.rejectPost(id));
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }

    @Transactional
    @PutMapping("/{id}/like")
    public ResponseEntity<Post> toggleLikePost(@PathVariable Long id, @RequestParam Long userId) {
        Post post = postService.getPostById(id);

        // Check if user already liked this post
        var existingLike = postLikeRepository.findByUserIdAndPostId(userId, id);

        if (existingLike.isPresent()) {
            // Unlike: remove the like
            postLikeRepository.deleteByUserIdAndPostId(userId, id);
            post.setLikes(Math.max(0, post.getLikes() - 1));
        } else {
            // Like: add the like
            postLikeRepository.save(new PostLike(userId, id));
            post.setLikes(post.getLikes() + 1);
        }

        return ResponseEntity.ok(postService.savePost(post));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Post> addComment(@PathVariable Long id,
            @RequestBody com.petpal.community.model.Comment comment, @RequestParam Long userId) {
        return userService.findById(userId).map(user -> {
            Post post = postService.getPostById(id);
            comment.setAuthor(user);
            comment.setPost(post);
            post.getComments().add(comment);
            return ResponseEntity.ok(postService.savePost(post));
        }).orElse(ResponseEntity.badRequest().build());
    }
}
