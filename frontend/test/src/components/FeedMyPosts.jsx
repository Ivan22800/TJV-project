import { Box, Text, VStack } from "@chakra-ui/react"
import { Avatar, HStack } from "@chakra-ui/react"
import MyPosts from "./MyPosts";

export default function FeedMyPosts() {
    const posts = [
        {
            id: "1",
            time: Date.now() - 1000000,
            text: "This is my first post!"
        },
        {
            id: "2",
            time: Date.now() - 500000,
            text: "Loving this new social media app."
        },
        {
            id: "3",
            time: Date.now() - 200000,
            text: "Anyone up for a virtual hangout?"
        }
    ];

    return (
        <>
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
                    <HStack align="start" spacing={4}>
                        <Avatar.Root boxSize="80px">
                            <Avatar.Fallback name="Segun Adebayo" />
                            <Avatar.Image src="https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png" />
                        </Avatar.Root>
                        <VStack align="start" spacing={0} flex="1">
                            <Text fontSize="l">John Pork</Text>
                            <HStack spacing={2}>
                                <Text fontSize="m">Posts: 10</Text>
                                <Text fontSize="m">Followers: 100</Text>
                                <Text fontSize="m">Following: 50</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>
            <VStack align="stretch" spacing={4} my="4">
                {posts.map(post => (
                    <MyPosts key={post.id} id={post.id} time={post.time} text={post.text} />
                ))}
            </VStack>
        </>

    )
}
