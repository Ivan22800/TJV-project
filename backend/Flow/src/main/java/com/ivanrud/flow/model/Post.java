package com.ivanrud.flow.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Entity
@Table(name = "posts")
public class Post {

    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Size(max = 1000, min = 1)
    @JsonProperty("text")
    @NotBlank(message = "Post cannot be empty")
    private String postContent;

    @Getter
    private int likes;

    @Getter
    private Long time;

    @Getter
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