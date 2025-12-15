import { Box, Text, VStack } from "@chakra-ui/react"
import { Avatar, HStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useUser } from '../context/UserContext';
import MyPosts from "./MyPosts";

export default function FeedMyPosts() {
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState("User");
    const [postCount, setPostCount] = useState(0);
    const token = localStorage.getItem('token');

    const { user } = useUser();

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

    useEffect(() => {
        if (!user?.username) return;

        const fetchCount = async () => {
            const response = await fetch(`http://localhost:8080/post/count/${user.username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const count = await response.json();
            setPostCount(count);
        };

        fetchCount();
    }, [user]);


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
                            <Avatar.Fallback name={user ? `${user.firstName} ${user.lastName}` : "User"} />
                            <Avatar.Image src={user?.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : "https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png"} />
                        </Avatar.Root>
                        <VStack align="start" spacing={0} flex="1">
                            <Text fontSize="l" fontWeight="bold">{user?.firstName || "User"} {user?.lastName || "User"}</Text>
                            <HStack spacing={2}>
                                <Text fontSize="m">Posts: {postCount}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.map(post => (
                    <MyPosts key={post.id} id={post.id} time={post.time} author={post.author} text={post.text} likesCount={post.likesCount} likedByMe={post.likedByMe} />
                ))}
            </VStack>
        </>

    )
}
