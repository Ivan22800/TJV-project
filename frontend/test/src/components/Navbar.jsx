import { Flex, Box, Input, Image, InputGroup, Heading } from "@chakra-ui/react";
import { Avatar, Menu, Portal } from "@chakra-ui/react"
import logo from "../assets/logo.svg";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Очищаем токен из localStorage
    localStorage.removeItem('token');
    // Перенаправляем на страницу регистрации
    navigate('/');
  };

  return (
    <Flex bg="white" justify="space-between" align="center" h="60px" boxShadow="md" px={4}>
      <Box w="150px">
        <Heading fontWeight="bold" textAlign="left" fontSize="xl" cursor="pointer" onClick={() => navigate('/feed')}>
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
              <Avatar.Image src="https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png" />
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
      </Box>
    </Flex>
  );
}
