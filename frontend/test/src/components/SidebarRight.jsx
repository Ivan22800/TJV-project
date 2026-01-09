import { Box, Heading, VStack, HStack, Avatar, Text } from '@chakra-ui/react'

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
                <Heading fontSize={{ base: "md", md: "lg" }}>My Subscriptions</Heading>
                <Box mt={2}>
                    <HStack mb={1} spacing={3}>
                        <Avatar.Root boxSize="30px">
                            <Avatar.Fallback name="Segun Adebayo" />
                            <Avatar.Image src="https://cdn4.iconfinder.com/data/icons/avatar-1-2/100/Avatar-16-512.png" />
                        </Avatar.Root>
                        <VStack align="start" spacing={0}>
                            <Heading size="sm">Creative Coders</Heading>
                        </VStack>
                    </HStack>
                </Box>
            </Box>
        </VStack>
    )
}
