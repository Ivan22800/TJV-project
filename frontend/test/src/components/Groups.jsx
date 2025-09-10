import { Box, Text, VStack, Heading } from "@chakra-ui/react"

export default function Groups() {
    return (
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
                <Heading size="lg" mb={4}>My Groups</Heading>
            </VStack>
        </Box>
    )
}

