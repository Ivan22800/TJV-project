import { Flex, Box, Image, HStack } from "@chakra-ui/react";
import { Avatar, Menu, Portal } from "@chakra-ui/react"
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box bg="white" px={4} boxShadow="sm" position="sticky" top={0} zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <HStack fontWeight="bold" fontSize="xl" color="teal.500" cursor="pointer" onClick={() => navigate('/feed')}>
            <Image src={logo} alt="Logo" boxSize="30px" />
            <Box color="#319795">Flow</Box>
          </HStack>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
          </HStack>
        </HStack>

        <Flex alignItems="center">
          <Menu.Root positioning={{ placement: "right-end" }}>
            <Menu.Trigger rounded="full" focusRing="outside">
              <Avatar.Root size="sm">
                <Avatar.Fallback name={user ? `${user.firstName} ${user.lastName}` : "User"} />
                <Avatar.Image src={user?.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : "https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png"} />
              </Avatar.Root>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="settings" onClick={() => navigate('/settings')}>
                    Settings
                  </Menu.Item>
                  <Menu.Item value="logout" onClick={handleLogout}>Logout</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Flex>
    </Box>
  );
}
