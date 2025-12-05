package com.ivanrud.flow.controller;

import com.ivanrud.flow.model.Post;
import com.ivanrud.flow.model.User;
import com.ivanrud.flow.service.PostService;
import com.ivanrud.flow.service.PostLikeService;
import com.ivanrud.flow.repository.UserRepository;
import com.ivanrud.flow.dto.PostCreateDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
@CrossOrigin(origins = "http://localhost:5173")
public class PostRestController {
    private final PostService postService;
    private final PostLikeService postLikeService;
    private final UserRepository userRepository;

    public PostRestController(PostService postService,
            PostLikeService postLikeService,
            UserRepository userRepository) {
        this.postService = postService;
        this.postLikeService = postLikeService;
        this.userRepository = userRepository;
    }

    @PostMapping("/new")
    public ResponseEntity<Post> createPost(
            @RequestBody PostCreateDTO dto,
            Authentication authentication // JWT токен
    ) {

        String username = authentication.getName();
        Post post = postService.createPost(username, dto.getContent());
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean liked = postLikeService.toggleLike(user.getId(), id);
        return ResponseEntity.ok().body(liked);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Post>> getMyPosts(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(postService.getPostsByUsernameWithLikes(username, username));
    }
}
