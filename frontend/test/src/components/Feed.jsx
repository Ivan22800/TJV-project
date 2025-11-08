import { Box, Text, VStack } from "@chakra-ui/react"
import { Textarea, Avatar, HStack, Button } from "@chakra-ui/react"
import React, { useState } from 'react';
import Post from "./Post";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");

    const addNewPost = () => {
        if (!postText.trim()) return;
        const newPost = {
            id: crypto.randomUUID(), 
            time: Date.now(),
            author: "John Pork",
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
                        onClick={addNewPost}
                    >
                        Publish
                    </Button>

                </VStack>
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.map(post => (
                    <Post key={post.id} id={post.id} time={post.time} author={post.author} text={post.text} />
                ))}
            </VStack>
        </>

    )
}
