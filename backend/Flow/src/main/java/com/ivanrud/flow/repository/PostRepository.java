package com.ivanrud.flow.repository;

import com.ivanrud.flow.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthor_IdOrderByTimeDesc(Long userId);

    List<Post> findByAuthor_UsernameOrderByTimeDesc(String username);

    long countByAuthor_Username(String username);
}
