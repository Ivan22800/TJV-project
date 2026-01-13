package com.ivanrud.flow.controller;

import com.ivanrud.flow.dto.PostResponseDto;
import com.ivanrud.flow.dto.UserResponseDto;
import com.ivanrud.flow.model.Post;
import com.ivanrud.flow.model.User;
import com.ivanrud.flow.service.PostService;
import com.ivanrud.flow.service.PostLikeService;
import com.ivanrud.flow.repository.UserRepository;
import com.ivanrud.flow.dto.PostCreateDto;

import com.ivanrud.flow.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/post")
@CrossOrigin(origins = "http://localhost:5173")
public class PostRestController {
        private final PostService postService;
        private final PostLikeService postLikeService;
        private final UserRepository userRepository;
        private final SubscriptionService subscriptionService;

        public PostRestController(PostService postService,
                        PostLikeService postLikeService,
                        UserRepository userRepository,
                        SubscriptionService subscriptionService) {
                this.postService = postService;
                this.postLikeService = postLikeService;
                this.userRepository = userRepository;
                this.subscriptionService = subscriptionService;
        }

        @PostMapping("/new")
        public ResponseEntity<PostResponseDto> createPost(
                        @RequestBody PostCreateDto dto,
                        Authentication authentication // JWT токен
        ) {
                String username = authentication.getName();
                Post post = postService.createPost(username, dto.getContent());

                User author = post.getAuthor();
                UserResponseDto authorDto = new UserResponseDto(
                                author.getId(),
                                author.getUsername(),
                                author.getEmail(),
                                author.getFirstName(),
                                author.getLastName(),
                                author.getAvatarUrl(),
                                false);

                PostResponseDto response = PostResponseDto.builder()
                                .id(post.getId())
                                .text(post.getPostContent())
                                .time(post.getTime())
                                .likesCount(post.getLikesCount() != null ? post.getLikesCount().intValue() : 0)
                                .author(authorDto)
                                .likedByMe(post.getLikedByMe() != null ? post.getLikedByMe() : false)
                                .build();
                return ResponseEntity.ok(response);
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
        public ResponseEntity<List<PostResponseDto>> getMyPosts(Authentication authentication) {
                String username = authentication.getName();
                List<Post> posts = postService.getPostsByUsernameWithLikes(username, username);

                List<PostResponseDto> responseList = posts.stream()
                                .map(post -> {
                                        User author = post.getAuthor();
                                        UserResponseDto authorDto = new UserResponseDto(
                                                        author.getId(),
                                                        author.getUsername(),
                                                        author.getEmail(),
                                                        author.getFirstName(),
                                                        author.getLastName(),
                                                        author.getAvatarUrl(),
                                                        false);

                                        return PostResponseDto.builder()
                                                        .id(post.getId())
                                                        .text(post.getPostContent())
                                                        .time(post.getTime())
                                                        .likesCount(post.getLikesCount() != null
                                                                        ? post.getLikesCount().intValue()
                                                                        : 0)
                                                        .author(authorDto)
                                                        .likedByMe(post.getLikedByMe() != null ? post.getLikedByMe()
                                                                        : false)
                                                        .build();
                                })
                                .toList();
                return ResponseEntity.ok(responseList);
        }

        @GetMapping("/feed")
        public ResponseEntity<List<PostResponseDto>> getFeedPosts(Authentication authentication) {
                String username = authentication.getName();
                List<Post> posts = postService.getSubscriptionFeed(username);

                List<PostResponseDto> responseList = posts.stream()
                                .map(post -> {
                                        User author = post.getAuthor();
                                        boolean isItMe = author.getUsername().equals(username);

                                        UserResponseDto authorDto = new UserResponseDto(
                                                        author.getId(),
                                                        author.getUsername(),
                                                        author.getEmail(),
                                                        author.getFirstName(),
                                                        author.getLastName(),
                                                        author.getAvatarUrl(),
                                                        !isItMe);

                                        return PostResponseDto.builder()
                                                        .id(post.getId())
                                                        .text(post.getPostContent())
                                                        .time(post.getTime())
                                                        .likesCount(post.getLikesCount() != null
                                                                        ? post.getLikesCount().intValue()
                                                                        : 0)
                                                        .author(authorDto)
                                                        .likedByMe(post.getLikedByMe() != null ? post.getLikedByMe()
                                                                        : false)
                                                        .build();
                                })
                                .toList();

                return ResponseEntity.ok(responseList);
        }

        @GetMapping("/user/{username}")
        public ResponseEntity<List<PostResponseDto>> getPostsByUsername(
                        @PathVariable String username,
                        Authentication authentication) {
                String currentUsername = authentication != null ? authentication.getName() : null;
                List<Post> posts = postService.getPostsByUsernameWithLikes(username, currentUsername);

                List<PostResponseDto> responseList = posts.stream()
                                .map(post -> {
                                        User author = post.getAuthor();
                                        UserResponseDto authorDto = new UserResponseDto(
                                                        author.getId(),
                                                        author.getUsername(),
                                                        author.getEmail(),
                                                        author.getFirstName(),
                                                        author.getLastName(),
                                                        author.getAvatarUrl(),
                                                        false);

                                        if (currentUsername != null) {
                                                authorDto.setFollowing(subscriptionService.isFollowing(currentUsername,
                                                                author.getUsername()));
                                        }

                                        return PostResponseDto.builder()
                                                        .id(post.getId())
                                                        .text(post.getPostContent())
                                                        .time(post.getTime())
                                                        .likesCount(post.getLikesCount() != null
                                                                        ? post.getLikesCount().intValue()
                                                                        : 0)
                                                        .author(authorDto)
                                                        .likedByMe(post.getLikedByMe() != null ? post.getLikedByMe()
                                                                        : false)
                                                        .build();
                                })
                                .toList();

                return ResponseEntity.ok(responseList);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> deletePost(
                        @PathVariable("id") Long postId,
                        Authentication authentication) {
                postService.deletePost(postId, authentication.getName());
                return ResponseEntity.ok().build();
        }

        @GetMapping("/count/{username}")
        public long getUserPostCount(@PathVariable String username) {
                return postService.getCountPostsByUsername(username);
        }
}
