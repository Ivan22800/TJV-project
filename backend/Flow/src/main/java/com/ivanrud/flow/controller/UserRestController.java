package com.ivanrud.flow.controller;

import com.ivanrud.flow.service.UserService;
import com.ivanrud.flow.model.User;
import com.ivanrud.flow.dto.RegisterRequest;
import com.ivanrud.flow.dto.UserResponse;
import com.ivanrud.flow.dto.LoginUserDTO;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getPassword(),
                registerRequest.getEmail(),
                registerRequest.getFirstName(),
                registerRequest.getLastName());

        User registeredUser = userService.registerUser(user);

        UserResponse userResponse = new UserResponse(
                registeredUser.getId(),
                registeredUser.getUsername(),
                registeredUser.getEmail(),
                registeredUser.getFirstName(),
                registeredUser.getLastName());

        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@RequestBody LoginUserDTO loginUserDTO) {
        UserResponse user = userService.loginUser(loginUserDTO);
        return ResponseEntity.ok(user);
    }
}
