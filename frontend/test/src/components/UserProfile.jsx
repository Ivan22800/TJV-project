import { Box, HStack, Avatar, Text, VStack, Heading, Separator, Portal, CloseButton } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Post from "./Post"
import { Link } from "react-router-dom"
import { Dialog } from "@chakra-ui/react"
import { FollowingButton } from "./FollowingButton";

function DialogWindow({ people, title, trigger, onStatusChange }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="white" borderRadius="xl" p={4} w={{ base: "90%", md: "600px" }}>
                        <Dialog.Header fontWeight="bold">{title}</Dialog.Header>
                        <Dialog.Body>
                            <VStack align="stretch" spacing={3}>
                                {people.map(person => (
                                    <HStack
                                        key={person.id}
                                        mb={3}
                                        spacing={3}
                                        justify="space-between"
                                        w="100%"
                                        borderRadius="xl"
                                        p={1}
                                    >
                                        <HStack
                                            as={Link}
                                            to={`/feed/profile/${person.username}`}
                                            spacing={3}
                                            onClick={() => setOpen(false)}
                                            flex="1"
                                        >
                                            <Avatar.Root boxSize="30px">
                                                <Avatar.Fallback name={person.username} />
                                                <Avatar.Image src={`http://localhost:8080${person.avatarUrl}`} />
                                            </Avatar.Root>
                                            <VStack align="start" spacing={0}>
                                                <Heading size="sm">{person.username}</Heading>
                                            </VStack>
                                        </HStack>
                                        <FollowingButton
                                            targetUsername={person.username}
                                            initialFollowing={person.following}
                                            onStatusChange={onStatusChange}
                                        />
                                    </HStack>
                                ))}
                            </VStack>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton position="absolute" top="8px" right="8px" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default function UserProfile() {
    const { username } = useParams();
    const token = localStorage.getItem('token');
    const [postCount, setPostCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const fetchUser = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/info/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchPosts = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/post/user/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchPostCount = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/post/count/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPostCount(data);
            }
        } catch (error) {
            console.error('Error fetching post count:', error);
        }
    };

    const fetchFollowersCount = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/subscriptions/count/followers/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFollowersCount(data);
            }
        } catch (error) {
            console.error('Error fetching followers count:', error);
        }
    };

    const fetchFollowingCount = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/subscriptions/count/following/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFollowingCount(data);
            }
        } catch (error) {
            console.error('Error fetching following count:', error);
        }
    };

    const fetchFollowing = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/subscriptions/following/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFollowing(data);
            }
        } catch (error) {
            console.error('Error fetching following:', error);
        }
    };

    const fetchFollowers = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/subscriptions/follower/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFollowers(data);
            }
        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    };

    const handleDeletePost = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setPostCount(prev => prev - 1);
    };

    const refreshData = async () => {
        if (!token) return;
        fetchUser(username);
        fetchPosts(username);
        fetchPostCount(username);
        fetchFollowersCount(username);
        fetchFollowingCount(username);
        fetchFollowing(username);
        fetchFollowers(username);
    };

    useEffect(() => {
        if (!token) return;
        fetchUser(username);
        fetchPosts(username);
        fetchPostCount(username);
        fetchFollowersCount(username);
        fetchFollowingCount(username);
        fetchFollowing(username);
        fetchFollowers(username);
    }, [username, token]);


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
                    <HStack align="center" justify="space-between" mb={4}>
                        <HStack align="center" spacing={4}>
                            <Avatar.Root boxSize="80px">
                                <Avatar.Fallback name={user ? `${user.firstName} ${user.lastName}` : "User"} />
                                <Avatar.Image src={user?.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : "https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png"} />
                            </Avatar.Root>
                            <VStack align="start" spacing={1}>
                                <HStack spacing={4} align="center">
                                    <Text fontSize="xl" fontWeight="bold">{user?.firstName || "User"} {user?.lastName || "User"}</Text>
                                    {user && (
                                        <FollowingButton
                                            targetUsername={user.username}
                                            initialFollowing={user.following}
                                            onStatusChange={refreshData}
                                        />
                                    )}
                                </HStack>
                                <HStack spacing={4} align="center" color="gray.600">
                                    <DialogWindow
                                        people={followers}
                                        title="Followers"
                                        onStatusChange={refreshData}
                                        trigger={
                                            <Text fontSize="sm" cursor="pointer" _hover={{ color: "purple.500" }}>
                                                <Text as="span" fontWeight="bold" color="black">{followersCount}</Text> Followers
                                            </Text>
                                        }
                                    />
                                    <DialogWindow
                                        people={following}
                                        title="Following"
                                        onStatusChange={refreshData}
                                        trigger={
                                            <Text fontSize="sm" cursor="pointer" _hover={{ color: "purple.500" }}>
                                                <Text as="span" fontWeight="bold" color="black">{followingCount}</Text> Following
                                            </Text>
                                        }
                                    />
                                    <Text fontSize="sm">
                                        <Text as="span" fontWeight="bold" color="black">{postCount}</Text> Posts
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>
                    </HStack>
                </VStack>
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.length === 0 ? (
                    <Text color="gray.500" textAlign="center" py={10}>No posts yet...</Text>
                ) : (
                    posts.map(post => (
                        <Post
                            key={post.id}
                            id={post.id}
                            time={post.time}
                            author={post.author}
                            text={post.text}
                            likesCount={post.likesCount}
                            likedByMe={post.likedByMe}
                            onDelete={handleDeletePost}
                        />
                    ))
                )}
            </VStack>
        </>
    )
}
