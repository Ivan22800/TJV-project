package com.ivanrud.flow.service;

import com.ivanrud.flow.model.Post;
import com.ivanrud.flow.model.User;
import com.ivanrud.flow.repository.PostRepository;
import com.ivanrud.flow.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Post createPost(String username, String content) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = new Post();
        post.setAuthor(user);
        post.setPostContent(content);
        post.setTime(System.currentTimeMillis());

        return postRepository.save(post);
    }

    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByAuthor_IdOrderByTimeDesc(userId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUsername(String username) {
        return postRepository.findByAuthor_UsernameOrderByTimeDesc(username);
    }
}
