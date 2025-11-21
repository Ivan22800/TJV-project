package com.ivanrud.flow.controller;

import com.ivanrud.flow.model.Post;
import com.ivanrud.flow.service.PostService;
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

    public PostRestController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/new")
    public ResponseEntity<Post> createPost(
            @RequestBody PostCreateDTO dto,
            Authentication authentication // JWT токен
    ) {
        // Debug: проверяем что приходит в DTO
        System.out.println("Received DTO: userId=" + dto.getUserId() + ", content=" + dto.getContent());

        String username = authentication.getName();
        Post post = postService.createPost(username, dto.getContent());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Post>> getMyPosts(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(postService.getPostsByUsername(username));
    }
}
