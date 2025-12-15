import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Input,
    Stack,
    HStack,
} from "@chakra-ui/react"
import { useUser } from '../context/UserContext';

export default function Login() {
    const navigate = useNavigate()
    const { login } = useUser();

    const handleLogin = async () => {
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then(async response => {
                const responseText = await response.text();
                if (!response.ok) {
                    console.error('Server error:', responseText);
                    alert(responseText || 'Login failed');
                    throw new Error(responseText || 'Login failed');
                }
                return responseText; // AuthController возвращает String (токен), а не JSON
            })
            .then(token => {
                console.log('Login successful, token:', token);
                login(token);
                navigate('/feed');
            })
            .catch((error) => {
                console.error('Login error:', error.message);
            });
    }

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgGradient="linear(to-r, teal.400, blue.500)"
        >
            <Box
                w="100%"
                maxW="400px"
                p={8}
                borderRadius="2xl"
                bg="white"
                boxShadow="2xl"
            >
                <Stack spacing={4}>
                    <Box textAlign="center" mb={2}>
                        <strong style={{ fontSize: "1.5rem", color: "#319795" }}>Flow</strong>
                    </Box>

                    <Box>
                        <label htmlFor="username">Username</label>
                        <Input id="username" name="username" colorPalette="purple" borderRadius="xl" />
                    </Box>

                    <Box>
                        <label htmlFor="password">Password</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            colorPalette="purple"
                            borderRadius="xl"
                        />
                    </Box>

                    <HStack justifyContent="space-between" mt={4}>
                        <Button
                            variant="link"
                            color="gray.400"
                            onClick={() => navigate('/')}
                        >
                            Sign up
                        </Button>
                        <Button
                            bg="purple.500"
                            color="white"
                            borderRadius="xl"
                            alignSelf="flex-end"
                            _hover={{ bg: "purple.600" }}
                            onClick={handleLogin}
                        >
                            Submit
                        </Button>
                    </HStack>
                </Stack>
            </Box>
        </Box>
    )
}
