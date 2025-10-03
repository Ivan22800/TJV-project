import { Box, Button, VStack } from "@chakra-ui/react"
import { MdRssFeed, MdOutlineGroup } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";


const menuItems = [
    { path: "/feed", label: "Feed", icon: <MdRssFeed /> },
    { path: "/groups", label: "My Groups", icon: <MdOutlineGroup /> },
    { path: "/feed-my-posts", label: "My Profile", icon: <CgProfile /> },
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
                            colorScheme="teal"
                            color={active ? "teal.500" : "gray.600"}
                            fontWeight={active ? "semibold" : "normal"}
                            bg={active ? "teal.50" : "transparent"}
                            _hover={{
                                bg: active ? "teal.100" : "gray.100",
                                color: active ? "teal.600" : "gray.700"
                            }}
                            _active={{
                                bg: "teal.100",
                                color: "teal.700"
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
                    colorScheme="teal"
                    variant="solid"
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: "teal.600" }}
                    borderRadius="xl"
                >
                    Create Post
                </Button>
            </VStack>
        </Box>
    );
}
