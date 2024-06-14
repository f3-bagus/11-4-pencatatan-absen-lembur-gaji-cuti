import React from "react";
import EmployeeLayout from "../EmployeeLayout";
import {
  Box,
  Avatar,
  Text,
  VStack,
  Flex,
  useColorModeValue,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const Profile = () => {
  return (
    <EmployeeLayout>
      <Flex w="full" p="5" direction={{ base: "column", md: "row" }} gap={5}>
        <Flex w="full" direction="column" gap={5}>
          <Box
            w="full"
            borderRadius="2xl"
            boxShadow="lg"
            bg={useColorModeValue("white", "green.900")}
          >
            <Box
              borderTopRadius="2xl"
              h="150px"
              bgGradient="linear(to-b, green.200, green.500)"
            />
            <VStack mt="-12" spacing="3" mb={5}>
              <Avatar
                size="2xl"
                src="https://i0.wp.com/global.ac.id/wp-content/uploads/2015/04/speaker-3-v2.jpg?fit=768%2C768&ssl=1"
                borderColor="white"
              />
              <Text fontSize="lg" fontWeight="bold">
                dummy
              </Text>
              <Text fontSize="md" color="gray.500">
                Division: <b>IT</b>
              </Text>
              <Text fontSize="md" color="gray.500">
                Account type: <b>Employee</b>
              </Text>
            </VStack>
          </Box>
          <Box
            w="full"
            borderRadius="2xl"
            boxShadow="lg"
            p={5}
            bg={useColorModeValue("white", "green.800")}
          >
            <VStack align="flex-start" mb={8}>
              <Heading as="h2" size="lg">
                Change password
              </Heading>
              <Text fontSize="md" color="gray.500">
                Here you can set your new password
              </Text>
            </VStack>
            <Stack py={2} direction="column">
              <FormControl>
                <FormLabel>Old Password</FormLabel>
                <Input
                  type="text"
                  focusBorderColor="green.500"
                  placeholder="Old Password"
                />
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="text"
                  focusBorderColor="green.500"
                  placeholder="New Password"
                />
              </FormControl>
              <FormControl>
                <FormLabel>New Password Confirmation</FormLabel>
                <Input
                  type="text"
                  focusBorderColor="green.500"
                  placeholder="Confirm New Password"
                />
              </FormControl>
            </Stack>
            <Button colorScheme="green" float="right" mt={3}>
              Change Password
            </Button>
          </Box>
        </Flex>

        {/* Edit Account */}
        <Box
          w="full"
          maxH={{ base: "650px", md: "450px" }}
          borderRadius="2xl"
          boxShadow="lg"
          bg={useColorModeValue("white", "green.800")}
          p={5}
        >
          <VStack align="flex-start" mb={8}>
            <Heading as="h2" size="lg">
              Account Settings
            </Heading>
            <Text fontSize="md" color="gray.500">
              Here you can change user account information
            </Text>
          </VStack>
          <Stack py={2} direction={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel>NIP</FormLabel>
              <Input
                type="text"
                focusBorderColor="green.500"
                placeholder="dummy"
                disabled
              />
            </FormControl>
            <FormControl>
              <FormLabel>Fullname</FormLabel>
              <Input
                type="text"
                focusBorderColor="green.500"
                placeholder="dummy"
              />
            </FormControl>
          </Stack>
          <Stack py={2} direction={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                focusBorderColor="green.500"
                placeholder="dummy"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="number"
                focusBorderColor="green.500"
                placeholder="dummy"
              />
            </FormControl>
          </Stack>
          <Stack py={2} direction={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <Input
                type="file"
                focusBorderColor="green.500"
                accept="image/jpeg, image/png, image/jpg"
                alignContent="center"
              />
            </FormControl>
          </Stack>
          <Button colorScheme="green" float="right" mt={3}>
            Edit
          </Button>
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Profile;
