import { Box, HStack, Avatar, Text, VStack, Separator, Dialog, CloseButton, Portal, Button } from "@chakra-ui/react"
import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { LuTrash2 } from "react-icons/lu";
import { useUser } from "../context/UserContext";

export default function Post({ id, time, author, text, likesCount, likedByMe, onDelete }) {
    const { user: currentUser } = useUser();
    const [likes, setLikes] = useState(likesCount || 0);
    const [liked, setLiked] = useState(likedByMe || false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/post/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setDeleteDialogOpen(false);
                if (onDelete) onDelete(id);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const isAuthor = currentUser?.username === author?.username;

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
                    <Avatar.Fallback name={author ? `${author.firstName} ${author.lastName}` : "Unknown"} />
                    <Avatar.Image src={author?.avatarUrl ? `http://localhost:8080${author.avatarUrl}` : "https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png"} />
                </Avatar.Root>
                <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="xs" color="gray.500">{formatTime(time)}</Text>
                </VStack>
            </HStack>
            <Text fontSize="md" mt={3} whiteSpace="pre-wrap">{text}</Text>
            <Separator my={2} />
            <HStack justify="space-between" mt={2}>
                <HStack spacing={8}>
                    <HStack spacing={2} cursor="pointer" onClick={handleLike}>
                        {liked ? (
                            <AiFillHeart color="#f472b6" size={22} />
                        ) : (
                            <AiOutlineHeart color="gray" size={22} />
                        )}
                        <Text fontWeight="medium">{likes}</Text>
                    </HStack>
                </HStack>

                {isAuthor && (
                    <Dialog.Root placement="center" open={isDeleteDialogOpen} onOpenChange={(e) => setDeleteDialogOpen(e.open)}>
                        <Dialog.Trigger asChild>
                            <Box
                                cursor="pointer"
                                color="gray.400"
                                _hover={{ color: "red.500" }}
                                transition="all 0.2s"
                            >
                                <LuTrash2 size={18} />
                            </Box>
                        </Dialog.Trigger>
                        <Portal>
                            <Dialog.Backdrop />
                            <Dialog.Positioner>
                                <Dialog.Content borderRadius="xl">
                                    <Dialog.Header>
                                        <Dialog.Title>Delete post?</Dialog.Title>
                                    </Dialog.Header>
                                    <Dialog.Body>
                                        Are you sure you want to delete this post? This action cannot be undone.
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                            <Button variant="outline" borderRadius="xl">Cancel</Button>
                                        </Dialog.ActionTrigger>
                                        <Button
                                            onClick={handleDelete}
                                            bg="red.500"
                                            color="white"
                                            _hover={{ bg: "red.600" }}
                                            borderRadius="xl"
                                        >
                                            Delete
                                        </Button>
                                    </Dialog.Footer>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Portal>
                    </Dialog.Root>
                )}
            </HStack>
        </Box>
    );
}
