package com.ivanrud.flow.repository;

import com.ivanrud.flow.model.Subscription;
import com.ivanrud.flow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    boolean existsByFollowerAndFollowing(User follower, User following);

    Optional<Subscription> findByFollowerAndFollowing(User follower, User following);

    List<Subscription> findByFollower(User follower);

    List<Subscription> findByFollowing(User following);
}
