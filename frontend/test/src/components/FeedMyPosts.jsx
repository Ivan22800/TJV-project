import { Box, Text, VStack, Avatar, HStack, Heading, Separator, Portal, CloseButton, Dialog, Button } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useUser } from '../context/UserContext';
import { Link } from "react-router-dom"
import MyPosts from "./MyPosts";
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

export default function FeedMyPosts() {
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState("User");
    const [postCount, setPostCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const token = localStorage.getItem('token');

    const { user } = useUser();

    const refreshAllData = async () => {
        if (!token) return;

        try {
            const resPosts = await fetch('http://localhost:8080/post/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resPosts.ok) setPosts(await resPosts.json());

            const resFollowersCount = await fetch('http://localhost:8080/api/subscriptions/countFollowers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resFollowersCount.ok) setFollowersCount(await resFollowersCount.json());

            const resFollowingCount = await fetch('http://localhost:8080/api/subscriptions/countFollowing', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resFollowingCount.ok) setFollowingCount(await resFollowingCount.json());

            const resFollowers = await fetch('http://localhost:8080/api/subscriptions/followers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resFollowers.ok) setFollowers(await resFollowers.json());

            const resFollowing = await fetch('http://localhost:8080/api/subscriptions/following', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resFollowing.ok) setFollowing(await resFollowing.json());
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const handleDeletePost = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setPostCount(prev => prev - 1);
    };

    useEffect(() => {
        refreshAllData();
    }, [token]);

    useEffect(() => {
        if (!user?.username || !token) return;

        fetch(`http://localhost:8080/post/count/${user.username}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(count => setPostCount(count));
    }, [user, token]);

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
                            <HStack spacing={2} align="center">
                                <DialogWindow
                                    people={followers}
                                    title="Followers"
                                    onStatusChange={refreshAllData}
                                    trigger={
                                        <Text fontSize="sm" cursor="pointer" _hover={{ color: "purple.500" }}>
                                            <Text as="span" fontWeight="bold" color="black">{followersCount}</Text> Followers
                                        </Text>
                                    }
                                />


                                <DialogWindow
                                    people={following}
                                    title="Following"
                                    onStatusChange={refreshAllData}
                                    trigger={
                                        <Text fontSize="sm" cursor="pointer" _hover={{ color: "purple.500" }}>
                                            <Text as="span" fontWeight="bold" color="black">{followingCount}</Text> Following
                                        </Text>
                                    }
                                />


                                <Text fontSize="m">Posts: {postCount}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.map(post => (
                    <MyPosts
                        key={post.id}
                        id={post.id}
                        time={post.time}
                        author={post.author}
                        text={post.text}
                        likesCount={post.likesCount}
                        likedByMe={post.likedByMe}
                        onDelete={handleDeletePost}
                    />
                ))}
            </VStack>
        </>
    )
}
