import { Box, Heading, VStack, HStack, Avatar } from '@chakra-ui/react'
import { Link, useLocation } from "react-router-dom";
import { useUser } from '../context/UserContext';

export default function SidebarRight() {
    const { following } = useUser();

    return (
        <VStack align="stretch" spacing={3}>
            <Box
                w="300px"
                bg="white"
                borderLeft="1px solid"
                borderColor="gray.200"
                p={4}
                borderRadius="xl"
            >
                <Heading fontSize={{ base: "md", md: "lg" }}>My Subscriptions</Heading>
                <Box mt={2}>
                    {following.map(subscription => (
                        <HStack _hover={{ transform: "translateY(-1px)" }} key={subscription.id} mb={3} spacing={3} as={Link} to={`/feed/profile/${subscription.username}`}>
                            <Avatar.Root boxSize="30px">
                                <Avatar.Fallback name={subscription.username} />
                                <Avatar.Image src={`http://localhost:8080${subscription.avatarUrl}`} />
                            </Avatar.Root>
                            <VStack align="start" spacing={0}>
                                <Heading size="sm">{subscription.username}</Heading>
                            </VStack>
                        </HStack>
                    ))}
                </Box>
            </Box>
        </VStack>
    )
}
