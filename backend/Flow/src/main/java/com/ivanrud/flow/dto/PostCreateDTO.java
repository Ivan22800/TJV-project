package com.ivanrud.flow.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateDTO {
    private Long userId;      // кто пишет пост
    private String content;   // текст поста
}