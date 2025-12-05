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
    private final PostLikeService postLikeService;

    public PostService(PostRepository postRepository,
            UserRepository userRepository,
            PostLikeService postLikeService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.postLikeService = postLikeService;
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

    /**
     * Получить посты с информацией о лайках текущего пользователя
     */
    public List<Post> getPostsByUsernameWithLikes(String username, String currentUsername) {
        // Получаем текущего пользователя
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Получаем посты
        List<Post> posts = postRepository.findByAuthor_UsernameOrderByTimeDesc(username);

        // Для каждого поста проверяем, лайкнул ли его текущий пользователь
        for (Post post : posts) {
            boolean liked = postLikeService.isPostLikedByUser(currentUser.getId(), post.getId());
            post.setLikedByMe(liked);
        }

        return posts;
    }
}
