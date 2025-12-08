package com.petpal.community.controller;

import com.petpal.community.model.Post;
import com.petpal.community.model.PostLike;
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
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, @RequestParam Long userId) {
        return userService.findById(userId).map(user -> {
            post.setAuthor(user);
            return ResponseEntity.ok(postService.createPost(post));
        }).orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
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
