import { Box, Button, VStack } from "@chakra-ui/react"
import { MdRssFeed, MdOutlineGroup } from "react-icons/md";
import { CgNotes } from "react-icons/cg";


export default function SidebarLeft() {
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
                <Button variant="ghost" justifyContent="flex-start" borderRadius="xl"><MdRssFeed />Feed</Button>
                <Button variant="ghost" justifyContent="flex-start" borderRadius="xl"><MdOutlineGroup />My Groups</Button>
                <Button variant="ghost" justifyContent="flex-start" borderRadius="xl"><CgNotes />My Posts</Button>
                <Box h={4} />
                <Button
                    colorScheme="blue"
                    variant="solid"
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: "blue.600" }}
                    borderRadius="xl"
                >
                    Create Post
                </Button>
            </VStack>
        </Box>
    )
}
