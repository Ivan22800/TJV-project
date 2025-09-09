import React from 'react'
import { Box, Text, VStack } from "@chakra-ui/react"
import { Avatar, HStack } from "@chakra-ui/react"

export default function Post({ time, author, text }) {
    function formatTime(timestamp) {
        const diff = Date.now() - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
    return (
        <Box
            flex="1"
            w="100%"
            maxW={{ base: "100%", md: "800px" }}
            mx="auto"
            p={{ base: 3, md: 6 }}
            borderRadius="xl"
            bg="white"
            boxShadow="md"
            minH="80px"
        >
            <HStack align="start" spacing={4}>
                <Avatar.Root boxSize="40px">
                    <Avatar.Fallback name="Segun Adebayo" />
                    <Avatar.Image src="https://bit.ly/sage-adebayo" />
                </Avatar.Root>
                <VStack align="start" spacing={0} flex="1">
                    <Text fontWeight="bold" fontSize="md">{author}</Text>
                    <Text fontSize="xs" color="gray.500">{formatTime(time)}</Text>
                </VStack>
            </HStack>
            <Text fontSize="md" mt={3}>{text}</Text>
        </Box>
    )
}
