package com.ivanrud.flow.service;

import com.ivanrud.flow.model.Post;
import com.ivanrud.flow.model.PostLike;
import com.ivanrud.flow.model.User;
import com.ivanrud.flow.repository.PostLikeRepository;
import com.ivanrud.flow.repository.PostRepository;
import com.ivanrud.flow.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public PostLikeService(PostLikeRepository postLikeRepository,
            UserRepository userRepository,
            PostRepository postRepository) {
        this.postLikeRepository = postLikeRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public boolean toggleLike(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<PostLike> existingLike = postLikeRepository.findByUserIdAndPostId(userId, postId);

        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());

            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
            postRepository.save(post);

            return false;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostLike like = new PostLike();
        like.setUser(user);
        like.setPost(post);
        postLikeRepository.save(like);

        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);

        return true;
    }

    public boolean isPostLikedByUser(Long userId, Long postId) {
        return postLikeRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    public long getLikesCount(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }
}
