import { Box, Text, VStack, HStack, Heading, Button, Container, Avatar, Field, Input, Group, Switch, Checkbox } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../components/ui/password-input"
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useUser } from '../context/UserContext';
import { Tabs } from "@chakra-ui/react"
import { Dialog, CloseButton, Portal } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"

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
    const fileInputRef = useRef(null);
    const { user, updateUser } = useUser();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        avatar: ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || '',
                email: user.email || ''
            });
            setLoading(false);
        }
    }, [user]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/auth/${user.username}/change-password`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            toaster.create({
                description: "Password updated successfully",
                type: "success",
            })
            setPasswordData({ oldPassword: '', newPassword: '' });
            setPasswordDialogOpen(false);
        } catch (error) {
            console.error('Error updating password:', error);
            toaster.create({
                description: "Failed to update password",
                type: "error",
            })
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/auth/${user.username}/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update profile');
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            toaster.create({
                description: "Profile updated successfully",
                type: "success",
            })
            updateUser(formData);
            setDialogOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toaster.create({
                description: "Failed to update profile",
                type: "error",
            })
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/auth/${user.username}/upload-avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to upload avatar');
            }

            const avatarUrl = await response.text();
            updateUser({ avatarUrl });
            toaster.create({
                description: "Avatar uploaded successfully",
                type: "success",
            })
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toaster.create({
                description: "Failed to upload avatar",
                type: "error",
            })
        }
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
                        <HStack spacing={4} mb={4} align="center">
                            <Button
                                variant="ghost"
                                borderRadius="xl"
                                onClick={() => navigate('/feed')}
                                size="sm"
                            >
                                ←
                            </Button>
                            <Heading size="lg">Profile Settings</Heading>
                        </HStack>
                        <Tabs.Root defaultValue="profile" variant="line">
                            <Tabs.List>
                                <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
                                <Tabs.Trigger value="privacy">Privacy</Tabs.Trigger>
                                <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="profile">
                                <HStack spacing={4}>
                                    <Avatar.Root boxSize="120px">
                                        <Avatar.Fallback name={user ? `${user.firstName} ${user.lastName}` : "User"} />
                                        <Avatar.Image src={user?.avatarUrl ? `http://localhost:8080${user.avatarUrl}` : "https://www.nationalflags.shop/WebRoot/vilkasfi01/Shops/2014080403/66F5/457A/B8F1/BB43/EC8A/7F00/0001/CBF5/John_pork_flag_oikee_ml.png"} />
                                    </Avatar.Root>
                                    <VStack align="start" spacing={0} flex="1" ml={6}>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                        <Button
                                            colorScheme="purple"
                                            variant="outline"
                                            bg="purple.400"
                                            color="white"
                                            _hover={{ bg: "purple.500" }}
                                            borderRadius="xl"
                                            width="170px"
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            Change Avatar</Button>
                                        <Text fontSize="xs" color="gray.600">JPJ or PNG, 10MB max.</Text>
                                    </VStack>
                                </HStack>
                                <HStack spacing={4} align="center" mt={4}>
                                    <Group gap="10" width="full">
                                        <Field.Root required>
                                            <Field.Label>
                                                First Name
                                            </Field.Label>
                                            <Input
                                                borderRadius="xl"
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
                                                borderRadius="xl"
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
                                                borderRadius="xl"
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
                                                borderRadius="xl"
                                                placeholder="me@example.com"
                                                variant="subtle"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                            />
                                        </Field.Root>
                                    </Group>
                                </HStack>
                                <Dialog.Root placement="center" open={isDialogOpen} onOpenChange={(e) => setDialogOpen(e.open)}>
                                    <Dialog.Trigger asChild>
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button
                                                colorScheme="green"
                                                bg="green.400"
                                                color="white"
                                                _hover={{ bg: "green.500" }}
                                                borderRadius="xl"
                                                mt={4}
                                                width="170px"
                                            >
                                                Save Profile Changes
                                            </Button>
                                        </Box>
                                    </Dialog.Trigger>
                                    <Portal>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                            <Dialog.Content borderRadius="xl">
                                                <Dialog.Header>
                                                    <Dialog.Title>Are you sure you want to save changes?</Dialog.Title>
                                                </Dialog.Header>
                                                <Dialog.Footer>
                                                    <Dialog.ActionTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            colorScheme="red"
                                                            bg="red.400"
                                                            color="white"
                                                            _hover={{ bg: "red.500" }}
                                                            borderRadius="xl"
                                                            mt={4}
                                                        >Cancel</Button>
                                                    </Dialog.ActionTrigger>
                                                    <Button
                                                        onClick={handleProfileUpdate}
                                                        colorScheme="purple"
                                                        bg="purple.400"
                                                        color="white"
                                                        _hover={{ bg: "purple.500" }}
                                                        borderRadius="xl"
                                                        mt={4}
                                                    >Save</Button>
                                                </Dialog.Footer>
                                                <Dialog.CloseTrigger asChild>
                                                    <CloseButton size="sm" />
                                                </Dialog.CloseTrigger>
                                            </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                </Dialog.Root>
                                <Group gap="10" width="full" mt={4}>
                                    <Field.Root required>
                                        <Field.Label>
                                            Old Password
                                        </Field.Label>
                                        <PasswordInput
                                            borderRadius="xl"
                                            size="md"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                        />
                                    </Field.Root>
                                    <Field.Root required>
                                        <Field.Label>
                                            New Password
                                        </Field.Label>
                                        <PasswordInput
                                            borderRadius="xl"
                                            size="md"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        />
                                    </Field.Root>
                                </Group>
                                <Dialog.Root placement="center" open={isPasswordDialogOpen} onOpenChange={(e) => setPasswordDialogOpen(e.open)}>
                                    <Dialog.Trigger asChild>
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button
                                                colorScheme="purple"
                                                variant="outline"
                                                bg="purple.400"
                                                color="white"
                                                _hover={{ bg: "purple.500" }}
                                                borderRadius="xl"
                                                width="170px"
                                                mt={4}
                                            >
                                                Change Password
                                            </Button>
                                        </Box>
                                    </Dialog.Trigger>
                                    <Portal>
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                            <Dialog.Content borderRadius="xl">
                                                <Dialog.Header>
                                                    <Dialog.Title>Change Password?</Dialog.Title>
                                                </Dialog.Header>
                                                <Dialog.Footer>
                                                    <Dialog.ActionTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            colorScheme="red"
                                                            bg="red.400"
                                                            color="white"
                                                            _hover={{ bg: "red.500" }}
                                                            borderRadius="xl"
                                                            mt={4}>Cancel</Button>
                                                    </Dialog.ActionTrigger>
                                                    <Button
                                                        onClick={handlePasswordChange}
                                                        colorScheme="purple"
                                                        bg="purple.400"
                                                        color="white"
                                                        _hover={{ bg: "purple.500" }}
                                                        borderRadius="xl"
                                                        mt={4}
                                                    >Save</Button>
                                                </Dialog.Footer>
                                                <Dialog.CloseTrigger asChild>
                                                    <CloseButton size="sm" />
                                                </Dialog.CloseTrigger>
                                            </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                </Dialog.Root>
                            </Tabs.Content>

                            <Tabs.Content value="privacy">
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
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        colorScheme="green"
                                        variant="outline"
                                        bg="green.400"
                                        color="white"
                                        _hover={{ bg: "green.500" }}
                                        borderRadius="xl"
                                        width="170px"
                                        mt={4}
                                    >
                                        Save
                                    </Button>
                                </Box>

                            </Tabs.Content>
                            <Tabs.Content value="notifications">
                                <CheckBox text="Email Notifications" />
                                <CheckBox text="SMS Notifications" />
                                <CheckBox text="Push Notifications" />
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        colorScheme="green"
                                        variant="outline"
                                        bg="green.400"
                                        color="white"
                                        _hover={{ bg: "green.500" }}
                                        borderRadius="xl"
                                        width="170px"
                                        mt={4}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Tabs.Content>
                        </Tabs.Root>
                    </VStack>
                </Box>
            </Container >
        </Box >
    )
}
