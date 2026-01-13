package com.ivanrud.flow.repository;

import com.ivanrud.flow.model.Post;
import com.ivanrud.flow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthor_IdOrderByTimeDesc(Long userId);

    List<Post> findByAuthor_UsernameOrderByTimeDesc(String username);

    @Query("SELECT p FROM Post p WHERE p.author = :user OR p.author IN " +
            "(SELECT s.following FROM Subscription s WHERE s.follower = :user) " +
            "ORDER BY p.time DESC")
    List<Post> findPostsByFollowedUsers(@Param("user") User user);

    long countByAuthor_Username(String username);
}
