package com.ivanrud.flow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PostResponseDto {
    private Long id;
    private String text;
    private Long time;
    private int likesCount;
    private boolean likedByMe;
    private UserResponseDto author;
}
