package com.ivanrud.flow.service;

import com.ivanrud.flow.model.User;
import com.ivanrud.flow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Loading user by username: " + username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("User not found in database: " + username);
                    return new UsernameNotFoundException("User Not Found with username: " + username);
                });

        System.out.println("User found: " + user.getUsername() + ", password hash length: " +
                (user.getPassword() != null ? user.getPassword().length() : "null"));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList()
        );
    }
}
