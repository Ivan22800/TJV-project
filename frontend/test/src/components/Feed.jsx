import { Box, Text, VStack } from "@chakra-ui/react"
import { Textarea, Avatar, HStack, Button } from "@chakra-ui/react"
import React, { useState, useEffect } from 'react';
import Post from "./Post";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");
    const token = localStorage.getItem('token');

    const newPost = async () => {
        if (!postText.trim()) return;
        try {
            const response = await fetch('http://localhost:8080/post/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: postText,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            const createdPost = await response.json();
            setPosts([createdPost, ...posts]);
            setPostText("");
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('http://localhost:8080/post/my', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data);
        };
        fetchPosts();
    }, []);

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
                minH="100px">
                <VStack align="stretch" spacing={4}>
                    <HStack align="start" spacing={4}>
                        <Avatar.Root boxSize="40px">
                            <Avatar.Fallback name="Segun Adebayo" />
                            <Avatar.Image src="https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png" />
                        </Avatar.Root>
                        <Textarea
                            resize="none"
                            placeholder="What's new?"
                            border="0px"
                            minH="40px"
                            fontSize="md"
                            outline="none"
                            value={postText}
                            onChange={e => setPostText(e.target.value)}
                        />
                    </HStack>
                    <Button
                        bg="purple.500"
                        color="white"
                        borderRadius="xl"
                        alignSelf="flex-end"
                        _hover={{ bg: "purple.600" }}
                        onClick={newPost}
                    >
                        Publish
                    </Button>

                </VStack>
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.map(post => (
                    <Post key={post.id} id={post.id} time={post.time} author={post.author} text={post.text} likesCount={post.likesCount} likedByMe={post.likedByMe}/>
                ))}
            </VStack>
        </>

    )
}
