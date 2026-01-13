package com.ivanrud.flow.controller;

import com.ivanrud.flow.dto.UserResponseDto;
import com.ivanrud.flow.model.User;
import com.ivanrud.flow.repository.SubscriptionRepository;
import com.ivanrud.flow.repository.UserRepository;
import com.ivanrud.flow.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/subscriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class SubscriptionController {
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;

    public SubscriptionController(UserRepository userRepository, SubscriptionRepository subscriptionRepository,
            SubscriptionService subscriptionService) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/follow/{username}")
    public ResponseEntity<?> follow(
            @PathVariable String username,
            Authentication authentication) {
        String followerUsername = authentication.getName();
        String followingUsername = username;

        subscriptionService.follow(followerUsername, followingUsername);

        return ResponseEntity.ok("Successfully followed " + username);
    }

    @PostMapping("/unfollow/{username}")
    public ResponseEntity<?> unfollow(
            @PathVariable String username,
            Authentication authentication) {
        String followerUsername = authentication.getName();
        String followingUsername = username;

        subscriptionService.unfollow(followerUsername, followingUsername);

        return ResponseEntity.ok("Successfully unfollowed " + username);
    }

    @GetMapping("/followers")
    public ResponseEntity<?> getFollowers(Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.getFollowers(authentication.getName(), authentication.getName()));
    }

    @GetMapping("/following")
    public ResponseEntity<?> getFollowing(Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.getFollowing(authentication.getName(), authentication.getName()));
    }

    @GetMapping("/is-following/{username}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable String username, Authentication auth) {
        return ResponseEntity.ok(subscriptionService.isFollowing(auth.getName(), username));
    }

    @GetMapping("/countFollowing")
    public ResponseEntity<Integer> countFollowing(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer followings = subscriptionRepository.countByFollower(user);
        return ResponseEntity.ok(followings);
    }

    @GetMapping("/countFollowers")
    public ResponseEntity<Integer> countFollowers(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer followers = subscriptionRepository.countByFollowing(user);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/count/followers/{username}")
    public ResponseEntity<Integer> countFollowers(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(subscriptionRepository.countByFollowing(user));
    }

    @GetMapping("/count/following/{username}")
    public ResponseEntity<Integer> countFollowing(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(subscriptionRepository.countByFollower(user));
    }

    @GetMapping("/follower/{username}")
    public ResponseEntity<List<UserResponseDto>> getFollowers(@PathVariable String username,
            Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.getFollowers(username, authentication.getName()));
    }

    @GetMapping("/following/{username}")
    public ResponseEntity<List<UserResponseDto>> getFollowing(@PathVariable String username,
            Authentication authentication) {
        return ResponseEntity.ok(subscriptionService.getFollowing(username, authentication.getName()));
    }
}
