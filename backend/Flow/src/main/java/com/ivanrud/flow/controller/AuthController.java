package com.ivanrud.flow.controller;

import com.ivanrud.flow.model.User;
import com.ivanrud.flow.repository.UserRepository;
import com.ivanrud.flow.security.JwtUtil;
import com.ivanrud.flow.dto.RegisterRequest;
import com.ivanrud.flow.dto.LoginUserDTO;
import com.ivanrud.flow.dto.UserResponse;
import com.ivanrud.flow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtil jwtUtils;
    @Autowired
    UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginUserDTO loginUserDTO) {
        try {
            System.out.println("Attempting to authenticate user: " + loginUserDTO.getUsername());

            // Проверяем, существует ли пользователь
            if (!userRepository.existsByUsername(loginUserDTO.getUsername())) {
                System.out.println("User not found: " + loginUserDTO.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password");
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginUserDTO.getUsername(),
                            loginUserDTO.getPassword()));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtils.generateToken(userDetails.getUsername());
            System.out.println("Authentication successful for user: " + loginUserDTO.getUsername());
            return ResponseEntity.ok(token);
        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials for user: " + loginUserDTO.getUsername());
            System.out.println("Exception details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        } catch (UsernameNotFoundException e) {
            System.out.println("Username not found: " + loginUserDTO.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        } catch (Exception e) {
            System.out.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Username is already taken!");
            }

            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Email is already registered!");
            }

            // Create new user's account
            String encodedPassword = encoder.encode(registerRequest.getPassword());
            System.out.println("Registering user: " + registerRequest.getUsername());
            System.out.println("Password encoded, hash length: " + encodedPassword.length());

            User newUser = new User(
                    registerRequest.getUsername(),
                    encodedPassword,
                    registerRequest.getEmail(),
                    registerRequest.getFirstName(),
                    registerRequest.getLastName());
            userRepository.save(newUser);
            System.out.println("User registered successfully: " + registerRequest.getUsername());
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // Извлекаем токен из заголовка Authorization
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Missing or invalid authorization header");
            }

            String token = authHeader.substring(7); // Убираем "Bearer "

            // Проверяем и извлекаем username из токена
            if (!jwtUtils.validateJwtToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid or expired token");
            }

            String username = jwtUtils.getUsernameFromToken(token);

            // Получаем пользователя по username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            UserResponse userResponse = new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName());

            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            System.out.println("Error getting current user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error getting user: " + e.getMessage());
        }
    }
}
