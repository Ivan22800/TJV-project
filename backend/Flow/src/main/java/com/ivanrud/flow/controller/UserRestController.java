package com.ivanrud.flow.controller;

import com.ivanrud.flow.dto.*;
import com.ivanrud.flow.service.UserService;
import com.ivanrud.flow.model.User;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import com.ivanrud.flow.security.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserRestController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserRestController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody RegisterRequestDto registerRequest) {
        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getPassword(),
                registerRequest.getEmail(),
                registerRequest.getFirstName(),
                registerRequest.getLastName());

        User registeredUser = userService.registerUser(user);

        UserResponseDto userResponse = new UserResponseDto(
                registeredUser.getId(),
                registeredUser.getUsername(),
                registeredUser.getEmail(),
                registeredUser.getFirstName(),
                registeredUser.getLastName(),
                registeredUser.getAvatarUrl());

        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> loginUser(@RequestBody LoginUserDto loginUserDTO) {
        UserResponseDto user = userService.loginUser(loginUserDTO);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{username}/change-password")
    public String changePassword(
            @PathVariable String username,
            @RequestBody ChangePasswordDto dto) {
        userService.changePassword(username, dto.getOldPassword(), dto.getNewPassword());
        return "Password updated successfully";
    }

    @PatchMapping("/{username}/update-profile")
    public UpdateProfileDto updateProfile(@PathVariable String username, @RequestBody UpdateProfileDto dto) {
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

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        UserResponseDto userResponse = userService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<UserResponseDto>> getUserByUsername(@RequestParam String query) {
        List<UserResponseDto> userResponses = userService.searchUsers(query);
        return ResponseEntity.ok(userResponses);
    }
}
