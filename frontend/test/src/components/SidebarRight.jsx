import { Box, Heading, VStack } from '@chakra-ui/react'

export default function SidebarRight() {
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
                <Heading fontSize={{ base: "md", md: "lg" }}>My Groups</Heading>
            </Box>
            <Box
                w="300px"
                bg="white"
                borderLeft="1px solid"
                borderColor="gray.200"
                p={4}
                borderRadius="xl"
            >
                <Heading fontSize={{ base: "md", md: "lg" }}>Recommended Groups</Heading>
            </Box>
        </VStack>
    )
}
