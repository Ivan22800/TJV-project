import SidebarLeft from "./SidebarLeft"
import Feed from "./Feed"
import SidebarRight from "./SidebarRight"
import { Box, Flex } from "@chakra-ui/react"

export default function Layout() {
    return (
        <Flex mt="40px" px={{ base: 2, md: 4 }} gap={{ base: 2, md: 4 }}>
            <Box w={{ base: "80px", md: "300px" }} ml={{ base: 2, md: 4 }}>
                <SidebarLeft />
            </Box>
            <Box flex="1">
                <Feed />
            </Box>
            <Box w={{ base: "80px", md: "300px" }} mr={{ base: 2, md: 4 }}>
                <SidebarRight />
            </Box>
        </Flex>
    )
}
