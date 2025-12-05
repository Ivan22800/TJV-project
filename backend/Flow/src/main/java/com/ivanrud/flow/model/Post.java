package com.ivanrud.flow.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 1000, min = 1)
    @JsonProperty("text")
    @NotBlank(message = "Post cannot be empty")
    private String postContent;

    private int likes;

    private Long time;

    private Long likesCount = 0L;

    @Transient
    private Boolean likedByMe = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "posts", "hibernateLazyInitializer", "handler" })
    private User author;

    public Post() {
    }

    public Post(String post, int likes) {
        this.postContent = post;
        this.likes = likes;
    }
}