import { Box, Text, VStack } from "@chakra-ui/react"
import { Textarea, Avatar, HStack, Button } from "@chakra-ui/react"
import React, { useState } from 'react';
import MyPosts from "./MyPosts";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState("");

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
                <VStack align="stretch" spacing={4}>
                    <HStack align="start" spacing={4}>
                        <Avatar.Root boxSize="80px">
                            <Avatar.Fallback name="Segun Adebayo" />
                            <Avatar.Image src="https://upload.wikimedia.org/wikipedia/commons/6/68/Joe_Biden_presidential_portrait.jpg" />
                        </Avatar.Root>
                        <VStack align="start" spacing={0} flex="1">
                            <Text fontSize="l">Name</Text>
                            <HStack spacing={2}>
                                <Text fontSize="m">Posts: 10</Text>
                                <Text fontSize="m">Followers: 100</Text>
                                <Text fontSize="m">Following: 50</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.map(post => (
                    <MyPosts key={post.id} id={post.id} time={post.time} text={post.text} />
                ))}
            </VStack>
        </>

    )
}
