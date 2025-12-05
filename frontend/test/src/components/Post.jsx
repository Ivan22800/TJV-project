import { Box, Text, VStack, HStack, Separator, Avatar, Dialog, Portal, CloseButton, Input, Button } from "@chakra-ui/react"
import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";



export default function Post({ id, time, author, text, likesCount, likedByMe }) {
    const [likes, setLikes] = useState(likesCount || 0);
    const [liked, setLiked] = useState(likedByMe || false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const token = localStorage.getItem('token');

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

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8080/post/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            const isLiked = await response.json();

            setLiked(isLiked);
            setLikes(isLiked ? likes + 1 : likes - 1);

        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const addNewComment = () => {
        if (!commentText.trim()) return;
        const newComment = {
            id: crypto.randomUUID(),
            time: Date.now(),
            author: "John Pork",
            text: commentText
        };
        setComments([newComment, ...comments]);
        setCommentText("");
    };
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
                    <Avatar.Image src="https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png" />
                </Avatar.Root>
                <VStack align="start" spacing={0} flex="1">
                    <Text fontWeight="bold" fontSize="md">{author?.username || author}</Text>
                    <Text fontSize="xs" color="gray.500">{formatTime(time)}</Text>
                </VStack>
            </HStack>
            <Text fontSize="md" mt={3} whiteSpace="pre-wrap">{text}</Text>
            <Separator my={2} />
            <HStack spacing={8} mt={2}>
                <HStack spacing={2} cursor="pointer" onClick={handleLike}>
                    {liked ? (
                        <AiFillHeart color="#f472b6" size={22} />
                    ) : (
                        <AiOutlineHeart color="gray" size={22} />
                    )}
                    <Text fontWeight="medium">{likes}</Text>
                </HStack>

                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <HStack spacing={2} cursor="pointer">
                            <BiCommentDetail color="gray" size={22} />
                            <Text fontWeight="medium">0</Text>
                        </HStack>
                    </Dialog.Trigger>

                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content bg="white" borderRadius="xl" p={4} w={{ base: "90%", md: "600px" }}>
                                <Dialog.Header fontWeight="bold">Comments</Dialog.Header>

                                <Dialog.Body>
                                    <VStack align="stretch" spacing={3}>
                                        {/* Comments will be displayed here */}
                                        <Text color="gray.500">No comments yet...</Text>
                                        <HStack align="stretch" spacing={2} mt={4}>
                                            <Input placeholder="Write a comment..." borderRadius="xl" onChange={e => setCommentText(e.target.value)} />
                                            <Button
                                                bg="purple.500"
                                                color="white"
                                                borderRadius="xl"
                                                alignSelf="flex-end"
                                                _hover={{ bg: "purple.600" }}
                                                onClick={addNewComment}>
                                                Post
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </Dialog.Body>

                                <Dialog.CloseTrigger asChild>
                                    <CloseButton position="absolute" top="8px" right="8px" />
                                </Dialog.CloseTrigger>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </HStack>
        </Box>
    )
}
