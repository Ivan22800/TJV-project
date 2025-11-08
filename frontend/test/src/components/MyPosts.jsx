import { Box, Text, VStack, HStack, Separator } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/react"
import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";



export default function Post({ id, time, text }) {
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

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

    function handleLike() {
        if (liked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setLiked(!liked);
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
                    <Avatar.Image src="https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png" />
                </Avatar.Root>
                <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="xs" color="gray.500">{formatTime(time)}</Text>
                </VStack>
            </HStack>
            <Text fontSize="md" mt={3} whiteSpace="pre-wrap">{text}</Text>
            <Separator my={2} />
            <HStack spacing={8} mt={2}>
                <HStack spacing={2} cursor="pointer" onClick={handleLike}>
                    {liked ? (
                        <AiFillHeart color="#ed4956" size={22} />
                    ) : (
                        <AiOutlineHeart color="gray" size={22} />
                    )}
                    <Text fontWeight="medium">{likes}</Text>
                </HStack>
                <HStack spacing={2} cursor="pointer">
                    <BiCommentDetail color="gray" size={22} />
                    <Text fontWeight="medium">0</Text>
                </HStack>
            </HStack>
        </Box>
    )
}
