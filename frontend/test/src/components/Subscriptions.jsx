import { Input, Container, VStack, Group, HStack, Avatar, Button, Text, Box } from "@chakra-ui/react"
import { LuSearch, LuCheck, LuUserPlus } from "react-icons/lu"
import { useState, useCallback } from "react"
import { debounce } from "lodash";


function UserCard({ user }) {
    const [following, setFollowing] = useState(user.isFollowing)

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
                <HStack spacing={4}>
                    <Avatar.Root size="lg">
                        <Avatar.Image src={user.avatar} />
                        <Avatar.Fallback name={user.name} />
                    </Avatar.Root>
                    <VStack align="start" gap={0}>
                        <Text fontWeight="bold" fontSize="md">{user.name}</Text>
                        <Text color="gray.500" fontSize="sm">{user.username}</Text>
                    </VStack>
                </HStack>

                <Button
                    size="sm"
                    width="100px"
                    borderRadius="xl"
                    variant={following ? "outline" : "solid"}
                    colorScheme={following ? "gray" : "purple"}
                    bg={following ? "transparent" : "purple.500"}
                    color={following ? "gray.600" : "white"}
                    borderColor={following ? "gray.300" : "transparent"}
                    _hover={{
                        bg: following ? "gray.50" : "purple.600",
                        borderColor: following ? "gray.400" : "transparent"
                    }}
                    onClick={() => setFollowing(!following)}
                >
                    {following ? (
                        <HStack gap={1}>
                            <LuCheck /> <Text>Following</Text>
                        </HStack>
                    ) : (
                        <HStack gap={1}>
                            <LuUserPlus /> <Text>Follow</Text>
                        </HStack>
                    )}
                </Button>
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

    const debouncedSearch = useCallback(
    debounce((query) => {
        fetch("http://localhost:8080/auth/users/search?query=" + query, {
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
                isFollowing: false 
            }));
            setUsers(formattedUsers);
        });
    }, 500),
    []
);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value); 
        debouncedSearch(value); 
    };

    return (
        <Container maxW="container.lg" py={6}>
            <VStack spacing={6} align="stretch">
                <Box position="sticky" top={0} zIndex={10} pb={4} pt={2}>
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
        </Container>
    )
}
