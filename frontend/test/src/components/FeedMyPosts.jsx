import { Box, Text, VStack } from "@chakra-ui/react"
import { Textarea, Avatar, HStack, Button } from "@chakra-ui/react"
import React, { useState } from 'react';
import MyPosts from "./MyPosts";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");

    const addNewPost = () => {
        if (!postText.trim()) return;
        const newPost = {
            id: crypto.randomUUID(),
            time: Date.now(),
            author: "George Floyd",
            text: postText
        };
        setPosts([newPost, ...posts]);
        setPostText("");
    };
    return (
        <>
            <Box
                flex="1"
                w="100%"
                maxW={{ base: "100%", md: "800px" }}
                mx="auto"
                p={{ base: 2, md: 6 }}
                borderRadius="xl"
                bg="white"
                boxShadow="md"
                minH="100px"
            >
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.map(post => (
                    <MyPosts key={post.id} id={post.id} time={post.time} text={post.text} />
                ))}
            </VStack>
        </>

    )
}
