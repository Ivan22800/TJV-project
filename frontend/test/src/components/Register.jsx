import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Button,
    Input,
    Stack,
    HStack
} from "@chakra-ui/react"

export default function Register() {
    const navigate = useNavigate()

    const handleRegister = async () => {
        const name = document.querySelector('input[name="name"]').value;
        const surname = document.querySelector('input[name="surname"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: name,
                lastName: surname,
                email,
                username,
                password,
            }),
        })
            .then(async response => {
                let errorMessage = 'Registration failed';
                if (!response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        // Если ошибка валидации, показываем все ошибки
                        if (typeof errorData === 'object') {
                            errorMessage = Object.values(errorData).join(', ') || 'Registration failed';
                        } else {
                            errorMessage = JSON.stringify(errorData);
                        }
                    } else {
                        errorMessage = await response.text() || 'Registration failed';
                    }
                    throw new Error(errorMessage);
                }
                return await response.text(); // AuthController возвращает String, а не JSON
            })
            .then(message => {
                console.log('Success:', message);
                alert('Registration successful!');
                navigate('/feed');
            })
            .catch((error) => {
                console.error('Error:', error.message);
                alert(error.message); // Показываем ошибку пользователю
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
                        <label htmlFor="name">Name</label>
                        <Input id="name" name="name" focusBorderColor="teal.400" borderRadius="xl" />
                    </Box>

                    <Box>
                        <label htmlFor="surname">Surname</label>
                        <Input id="surname" name="surname" focusBorderColor="teal.400" borderRadius="xl" />
                    </Box>

                    <Box>
                        <label htmlFor="email">Email address</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            focusBorderColor="teal.400"
                            borderRadius="xl"
                        />
                    </Box>

                    <Box>
                        <label htmlFor="username">Username</label>
                        <Input id="username" name="username" focusBorderColor="teal.400" borderRadius="xl" />
                    </Box>

                    <Box>
                        <label htmlFor="password">Password</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            focusBorderColor="teal.400"
                            borderRadius="xl"
                        />
                    </Box>
                    <HStack justifyContent="space-between" mt={4}>
                        <Button
                            variant="link"
                            color="gray.400"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                        <Button
                            bg="purple.500"
                            color="white"
                            borderRadius="xl"
                            alignSelf="flex-end"
                            _hover={{ bg: "purple.600" }}
                            onClick={handleRegister}
                        >
                            Submit
                        </Button>
                    </HStack>
                </Stack>
            </Box>
        </Box>
    )
}
