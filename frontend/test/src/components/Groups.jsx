import { Box, Text, Heading, HStack, VStack, Avatar } from "@chakra-ui/react"

export default function Groups() {
    return (
        <Box
            flex="1"
            w="100%"
            maxW={{ base: "100%", md: "600px" }}
            mx="auto"
            p={{ base: 2, md: 4 }}
            borderRadius="xl"
            bg="white"
            boxShadow="md"
            minH="60px"
        >
            <HStack mb={2} spacing={3}>
                <Avatar.Root boxSize="60px">
                    <Avatar.Fallback name="Segun Adebayo" />
                    <Avatar.Image src="https://cdn4.iconfinder.com/data/icons/avatar-1-2/100/Avatar-16-512.png" />
                </Avatar.Root>
                <VStack align="start" spacing={0}>
                    <Heading size="sm">Creative Coders</Heading>
                    <Text fontSize="xs" color="gray.600">
                        A community of developers sharing ideas, projects, and coding tips.
                    </Text>
                </VStack>
            </HStack>
        </Box>
    )
}
