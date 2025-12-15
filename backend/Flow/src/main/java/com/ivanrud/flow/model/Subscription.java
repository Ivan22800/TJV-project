package com.ivanrud.flow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Entity
@Table(name = "subscriptions")
public class Subscriptions {

    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "follower_id")
//    private User follower;
//
//    @ManyToOne
//    @JoinColumn(name = "following_id")
//    private User following;

    private LocalDateTime createdAt = LocalDateTime.now();
}
