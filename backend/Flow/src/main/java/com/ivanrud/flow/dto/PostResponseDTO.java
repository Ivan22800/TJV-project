package com.ivanrud.flow.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostResponseDTO {
    private Long id;
    private String content;
    private int likes;
    private String authorUsername;
    private Long authorId;
}
