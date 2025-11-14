import { Box, Text, VStack, HStack, Heading, Button, Container, Avatar, Field, Input, Group, Switch, Checkbox } from "@chakra-ui/react"
import { Select } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../components/ui/password-input"
import { useState, useEffect } from "react";

function SettingSwitch({ title, description }) {
    return (
        <Group gap="10" width="full">
            <VStack align="start" spacing={0} flex="1" mt={2}>
                <Text fontWeight="normal" fontSize="sm">{title}</Text>
                {description && (
                    <Text fontSize="xs" color="gray.500">{description}</Text>
                )}
            </VStack>
            <Switch.Root colorPalette="purple" >
                <Switch.HiddenInput />
                <Switch.Control _checked={{ bg: "purple.400" }} />
            </Switch.Root>
        </Group>
    )
}

function CheckBox({ text }) {
    return (
        <Group gap="10" width="full">
            <VStack align="start" spacing={0} flex="1" mt={2}>
                <Checkbox.Root colorPalette="purple">
                    <Checkbox.Control _checked={{ bg: "purple.400", borderColor: "purple.400", color: "white" }} />
                    <Checkbox.Label>
                        <Text fontWeight="normal" fontSize="sm">{text}</Text>
                    </Checkbox.Label>
                    <Checkbox.HiddenInput />
                </Checkbox.Root>
            </VStack>
        </Group>
    )
}


export default function Settings() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: ''
    });

    useEffect(() => {
        // Загружаем данные пользователя при монтировании компонента
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Токен невалидный, перенаправляем на регистрацию
                        localStorage.removeItem('token');
                        navigate('/');
                        return;
                    }
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUser(userData);
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    username: userData.username || '',
                    email: userData.email || ''
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <Box
                w="100%"
                minH="calc(100vh - 60px)"
                bg="gray.50"
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Text>Loading...</Text>
            </Box>
        );
    }

    return (
        <Box
            w="100%"
            minH="calc(100vh - 60px)"
            bg="gray.50"
            p={4}
        >
            <Container maxW="container.lg">
                <Box
                    bg="white"
                    p={8}
                    borderRadius="xl"
                    boxShadow="md"
                >
                    <VStack align="stretch" spacing={4}>
                        <Heading size="lg" mb={4}>Profile Settings</Heading>
                        <HStack spacing={4}>
                            <Avatar.Root boxSize="120px">
                                <Avatar.Fallback name="Segun Adebayo" />
                                <Avatar.Image src="https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png" />
                            </Avatar.Root>
                            <VStack align="start" spacing={0} flex="1" ml={6}>
                                <Button
                                    colorScheme="purple"
                                    variant="outline"
                                    bg="purple.400"
                                    color="white"
                                    _hover={{ bg: "purple.500" }}
                                    borderRadius="xl"
                                >
                                    Change Avatar</Button>
                                <Text fontSize="xs" color="gray.600">JPJ or PNG, 1MB max.</Text>
                            </VStack>
                        </HStack>
                        <HStack spacing={4} align="center" mt={4}>
                            <Group gap="10" width="full">
                                <Field.Root required>
                                    <Field.Label>
                                        First Name
                                    </Field.Label>
                                    <Input
                                        placeholder="John"
                                        variant="subtle"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>
                                        Last Name
                                    </Field.Label>
                                    <Input
                                        placeholder="Pork"
                                        variant="subtle"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    />
                                </Field.Root>
                            </Group>
                        </HStack>
                        <HStack spacing={4} align="center" mt={4}>
                            <Group gap="10" width="full">
                                <Field.Root required>
                                    <Field.Label>
                                        Username
                                    </Field.Label>
                                    <Input
                                        placeholder="johnpork"
                                        variant="subtle"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                    />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>
                                        Email
                                    </Field.Label>
                                    <Input
                                        placeholder="me@example.com"
                                        variant="subtle"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </Field.Root>
                            </Group>
                        </HStack>
                        <Group gap="10" width="full" mt={4}>
                            <Field.Root required>
                                <Field.Label>
                                    Password
                                </Field.Label>
                                <PasswordInput size="md" />
                            </Field.Root>
                            <Button
                                colorScheme="purple"
                                variant="outline"
                                bg="purple.400"
                                color="white"
                                _hover={{ bg: "purple.500" }}
                                borderRadius="xl"
                                mt={8}
                            >
                                Change Password
                            </Button>
                        </Group>
                        <Heading size="lg" mb={4} mt={12}>Privacy Settings</Heading>
                        <SettingSwitch
                            title="Show Email"
                            description="Your email will be visible to other users"
                        />
                        <SettingSwitch
                            title="Allow Friend Requests"
                            description="Other users can send you friend requests"
                        />
                        <SettingSwitch
                            title="Make Profile Private"
                            description="Only friends can see your profile and posts"
                        />
                        <Heading size="lg" mb={4} mt={12}>Notification</Heading>
                        <CheckBox text="Email Notifications" />
                        <CheckBox text="SMS Notifications" />
                        <CheckBox text="Push Notifications" />

                        <Button
                            colorScheme="purple"
                            variant="outline"
                            borderRadius="xl"
                            onClick={() => navigate('/feed')}
                            alignSelf="flex-start"
                            mt={4}
                        >
                            ← Back to Feed
                        </Button>
                    </VStack>
                </Box>
            </Container >
        </Box >
    )
}
