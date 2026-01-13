import { Input, Container, VStack, Group, HStack, Avatar, Button, Text, Box } from "@chakra-ui/react"
import { LuSearch, LuCheck, LuUserPlus } from "react-icons/lu"
import { useState, useCallback, useContext } from "react"
import { useUser } from "../context/UserContext";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { FollowingButton } from "./FollowingButton";


export function UserCard({ user }) {
    return (
        <Box
            w="100%"
            bg="white"
            p={4}
            borderRadius="xl"
            boxShadow="sm"
            transition="all 0.2s"
            _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
            borderWidth="1px"
            borderColor="gray.100"
        >
            <HStack justify="space-between">
                <HStack
                    as={Link}
                    to={`/feed/profile/${user.username}`}
                    spacing={4}
                    flex="1"
                    _hover={{ textDecoration: "none" }}
                >
                    <Avatar.Root size="lg">
                        <Avatar.Image src={user.avatar} />
                        <Avatar.Fallback name={user.name} />
                    </Avatar.Root>
                    <VStack align="start" gap={0}>
                        <Text fontWeight="bold" fontSize="md">{user.name}</Text>
                        <Text color="gray.500" fontSize="sm">{user.username}</Text>
                    </VStack>
                </HStack>

                <FollowingButton targetUsername={user.username} initialFollowing={user.isFollowing} />
            </HStack>
        </Box>
    )
}


export default function Subscriptions() {
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers] = useState([])
    const token = localStorage.getItem('token');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const abortControllerRef = import.meta.env.SSR ? { current: null } : { current: null };

    const debouncedSearch = useCallback(
        debounce((query, controller) => {
            fetch("http://localhost:8080/api/users/search?query=" + query, {
                signal: controller.signal,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    const formattedUsers = data.map(u => ({
                        id: u.id,
                        name: `${u.firstName} ${u.lastName}`,
                        username: u.username,
                        avatar: u.avatarUrl ? `http://localhost:8080${u.avatarUrl}` : "https://bit.ly/broken-link",
                        isFollowing: u.following
                    }));
                    setUsers(formattedUsers);
                })
                .catch(err => {
                    if (err.name !== 'AbortError') console.error(err);
                });
        }, 500),
        [token]
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        if (value.trim() === "") {
            debouncedSearch.cancel();
            setUsers([]);
            return;
        }

        const newController = new AbortController();
        abortControllerRef.current = newController;

        debouncedSearch(value, newController);
    };

    return (
        <Box w="100%" px={0}>
            <VStack spacing={6} align="stretch">
                <Box position="sticky" top={0} zIndex={10} pb={4} pt={0}>
                    <Group w="100%" size="lg">
                        <Box
                            position="absolute"
                            zIndex={2}
                            left={3}
                            top="50%"
                            transform="translateY(-50%)"
                            color="gray.400"
                            pointerEvents="none"
                        >
                            <LuSearch size={20} />
                        </Box>
                        <Input
                            pl={10}
                            placeholder="Search by name or username..."
                            bg="white"
                            borderWidth="0"
                            boxShadow="sm"
                            borderRadius="xl"
                            _focus={{ boxShadow: "md", ring: 2, ringColor: "purple.100" }}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e)}
                        />
                    </Group>
                </Box>
                <VStack spacing={3}>
                    {filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </VStack>
            </VStack>
        </Box>
    )
}
