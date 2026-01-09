import { Box, Button, VStack } from "@chakra-ui/react"
import { MdRssFeed, MdOutlineGroup } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { LiaUserFriendsSolid } from "react-icons/lia";

const menuItems = [
    { path: "/feed", label: "Feed", icon: <MdRssFeed /> },
    // { path: "/feed/groups", label: "My Groups", icon: <MdOutlineGroup /> },
    { path: "/feed/subscriptions", label: "Subscriptions", icon: <LiaUserFriendsSolid /> },
    { path: "/feed/my-posts", label: "My Profile", icon: <CgProfile /> }
];

export default function SidebarLeft() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path || (path === "/feed" && location.pathname === "/");

    return (
        <Box
            w="300px"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            p={4}
            borderRadius="xl"
            display="inline-block"
        >
            <VStack align="stretch" spacing={3}>
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Button
                            key={item.path}
                            as={Link}
                            to={item.path}
                            variant="ghost"
                            colorScheme="purple"
                            color={active ? "purple.500" : "gray.600"}
                            fontWeight={active ? "semibold" : "normal"}
                            bg={active ? "purple.50" : "transparent"}
                            _hover={{
                                bg: active ? "purple.100" : "gray.100",
                                color: active ? "purple.600" : "gray.700"
                            }}
                            _active={{
                                bg: "purple.100",
                                color: "purple.700"
                            }}
                            justifyContent="flex-start"
                            borderRadius="xl"
                        >
                            {item.icon}{item.label}
                        </Button>
                    );
                })}
                <Box h={4} />
                <Button
                    colorScheme="purple"
                    variant="solid"
                    bg="purple.500"
                    color="white"
                    _hover={{ bg: "purple.600" }}
                    borderRadius="xl"
                >
                    Create Post
                </Button>
            </VStack>
        </Box>
    );
}
