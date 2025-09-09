import { Flex, Box, Input, Image, InputGroup, Heading } from "@chakra-ui/react";
import { Avatar, Menu, Portal } from "@chakra-ui/react"
import logo from "../assets/logo.svg";
import { LuSearch } from "react-icons/lu";

export default function NavBar() {
  return (
    <Flex bg="white" justify="space-between" align="center" h="60px" boxShadow="md" px={4}>
      <Box w="150px">
        <Heading fontWeight="bold" textAlign="left" fontSize="xl">
          <Image src={logo} alt="Logo" boxSize="30px" display="inline-block" mr={2} />
          Flow
        </Heading>
      </Box>

      <Box flex="1" display="flex" justifyContent="center">
        <InputGroup startElement={<LuSearch />} maxW="450px" textAlign="center">
          <Input placeholder="Search..." borderRadius="full" bg="gray.200" />
        </InputGroup>
      </Box>

      <Box w="150px" display="flex" justifyContent="flex-end">
        <Menu.Root positioning={{ placement: "right-end" }}>
          <Menu.Trigger rounded="full" focusRing="outside">
            <Avatar.Root size="sm">
              <Avatar.Fallback name="Segun Adebayo" />
              <Avatar.Image src="https://bit.ly/sage-adebayo" />
            </Avatar.Root>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="account">Account</Menu.Item>
                <Menu.Item value="settings">Settings</Menu.Item>
                <Menu.Item value="logout">Logout</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
    </Flex>
  );
}
