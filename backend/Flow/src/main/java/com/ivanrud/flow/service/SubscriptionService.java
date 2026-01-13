package com.ivanrud.flow.service;

import com.ivanrud.flow.dto.UserResponseDto;
import com.ivanrud.flow.model.Subscription;
import com.ivanrud.flow.model.User;
import com.ivanrud.flow.repository.SubscriptionRepository;
import com.ivanrud.flow.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

        private final SubscriptionRepository subscriptionRepository;
        private final UserRepository userRepository;

        public void follow(String followerUsername, String followingUsername) {
                User follower = userRepository.findByUsername(followerUsername).orElseThrow(
                                () -> new IllegalArgumentException("Follower not found"));

                User following = userRepository.findByUsername(followingUsername)
                                .orElseThrow(() -> new IllegalArgumentException("User to follow not found"));

                if (subscriptionRepository.existsByFollowerAndFollowing(follower, following)) {
                        throw new IllegalArgumentException("Already following this user");
                }

                Subscription subscription = new Subscription();
                subscription.setFollower(follower);
                subscription.setFollowing(following);
                subscriptionRepository.save(subscription);
        }

        public void unfollow(String followerUsername, String followingUsername) {
                User follower = userRepository.findByUsername(followerUsername).orElseThrow(
                                () -> new IllegalArgumentException("Follower not found"));

                User following = userRepository.findByUsername(followingUsername)
                                .orElseThrow(() -> new IllegalArgumentException("User to follow not found"));

                Subscription subscription = subscriptionRepository.findByFollowerAndFollowing(follower, following)
                                .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));

                subscriptionRepository.delete(subscription);
        }

        public boolean isFollowing(String followerUsername, String followingUsername) {
                User follower = userRepository.findByUsername(followerUsername).orElseThrow(
                                () -> new IllegalArgumentException("Follower not found"));

                User following = userRepository.findByUsername(followingUsername)
                                .orElseThrow(() -> new IllegalArgumentException("User to follow not found"));

                return subscriptionRepository.existsByFollowerAndFollowing(follower, following);
        }

        public List<UserResponseDto> getFollowing(String username, String viewerUsername) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                final User viewer = viewerUsername != null ? userRepository.findByUsername(viewerUsername).orElse(null)
                                : null;

                return subscriptionRepository.findByFollower(user)
                                .stream()
                                .map(Subscription::getFollowing)
                                .map(u -> UserResponseDto.builder()
                                                .id(u.getId())
                                                .username(u.getUsername())
                                                .email(u.getEmail())
                                                .firstName(u.getFirstName())
                                                .lastName(u.getLastName())
                                                .avatarUrl(u.getAvatarUrl())
                                                .isFollowing(viewer != null && subscriptionRepository
                                                                .existsByFollowerAndFollowing(viewer, u))
                                                .build())
                                .toList();
        }

        public List<UserResponseDto> getFollowers(String username, String viewerUsername) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                final User viewer = viewerUsername != null ? userRepository.findByUsername(viewerUsername).orElse(null)
                                : null;

                return subscriptionRepository.findByFollowing(user)
                                .stream()
                                .map(Subscription::getFollower)
                                .map(u -> UserResponseDto.builder()
                                                .id(u.getId())
                                                .username(u.getUsername())
                                                .email(u.getEmail())
                                                .firstName(u.getFirstName())
                                                .lastName(u.getLastName())
                                                .avatarUrl(u.getAvatarUrl())
                                                .isFollowing(viewer != null && subscriptionRepository
                                                                .existsByFollowerAndFollowing(viewer, u))
                                                .build())
                                .toList();
        }
}
