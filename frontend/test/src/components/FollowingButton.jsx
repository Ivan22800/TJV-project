import { useState, useEffect } from "react"
import { Button, HStack, Text } from "@chakra-ui/react"
import { LuCheck, LuUserPlus } from "react-icons/lu"
import { useUser } from '../context/UserContext';

export function FollowingButton({ targetUsername, initialFollowing, onStatusChange }) {
    const [following, setFollowing] = useState(initialFollowing)
    const { fetchFollowing, user } = useUser();

    useEffect(() => {
        setFollowing(initialFollowing);
    }, [initialFollowing]);

    if (user?.username === targetUsername) return null;

    const handleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:8080/api/subscriptions/follow/${targetUsername}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            fetchFollowing();
            setFollowing(true);
            if (onStatusChange) onStatusChange();
        }
    }

    const handleUnfollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:8080/api/subscriptions/unfollow/${targetUsername}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            fetchFollowing();
            setFollowing(false);
            if (onStatusChange) onStatusChange();
        }
    }

    return (
        <Button
            size="xs"
            width="90px"
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
            onClick={(e) => {
                if (following) {
                    handleUnfollow(e);
                } else {
                    handleFollow(e);
                }
            }}
        >
            {following ? (
                <HStack gap={1}>
                    <LuCheck size="12px" /> <Text fontSize="xs">Following</Text>
                </HStack>
            ) : (
                <HStack gap={1}>
                    <LuUserPlus size="12px" /> <Text fontSize="xs">Follow</Text>
                </HStack>
            )}
        </Button>
    )
}
