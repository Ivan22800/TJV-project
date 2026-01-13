package com.ivanrud.flow.controller;

import com.ivanrud.flow.dto.*;
import com.ivanrud.flow.service.SubscriptionService;
import com.ivanrud.flow.service.UserService;
import com.ivanrud.flow.model.User;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import com.ivanrud.flow.security.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserRestController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final SubscriptionService subscriptionService;

    public UserRestController(UserService userService, JwtUtil jwtUtil, SubscriptionService subscriptionService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.subscriptionService = subscriptionService;
    }

    @PatchMapping("/{username}/change-password")
    public String changePassword(
            @PathVariable String username,
            @RequestBody ChangePasswordDto dto) {
        userService.changePassword(username, dto.getOldPassword(), dto.getNewPassword());
        return "Password updated successfully";
    }

    @PatchMapping("/{username}/update-profile")
    public UpdateProfileDto updateProfile(@PathVariable String username, @Valid @RequestBody UpdateProfileDto dto) {
        User updatedUser = userService.updateProfile(username, dto.getFirstName(), dto.getLastName(), dto.getUsername(),
                dto.getEmail());
        String newToken = jwtUtil.generateToken(updatedUser.getUsername());

        return UpdateProfileDto.builder()
                .token(newToken)
                .message("Profile updated successfully")
                .build();
    }

    @PostMapping("/{username}/upload-avatar")
    public ResponseEntity<String> uploadAvatar(
            @PathVariable String username,
            @RequestParam("file") MultipartFile file) throws IOException {
        String avatarUrl = userService.uploadAvatar(username, file);

        return ResponseEntity.ok(avatarUrl);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        UserResponseDto userResponse = userService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponseDto>> getUserByUsername(
            @RequestParam String query,
            Authentication authentication) {

        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        List<UserResponseDto> userResponses = userService.searchUsers(query);
        String currentUsername = authentication.getName();

        List<UserResponseDto> filteredResults = userResponses.stream()
                .filter(u -> !u.getUsername().equals(currentUsername))
                .peek(foundUser -> {
                    boolean status = subscriptionService.isFollowing(currentUsername, foundUser.getUsername());
                    foundUser.setFollowing(status);
                })
                .toList();

        return ResponseEntity.ok(filteredResults);
    }

    @GetMapping("/info/{username}")
    public ResponseEntity<UserResponseDto> getUserInfo(
            @PathVariable String username,
            Authentication authentication) {
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserResponseDto userDto = new UserResponseDto(
                user.getId(),
                username,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getAvatarUrl(),
                false);

        if (authentication != null) {
            userDto.setFollowing(subscriptionService.isFollowing(authentication.getName(), username));
        }

        return ResponseEntity.ok(userDto);
    }
}
