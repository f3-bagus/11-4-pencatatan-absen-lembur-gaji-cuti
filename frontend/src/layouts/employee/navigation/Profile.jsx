import React, { useState, useEffect } from "react";
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
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [division, setDivision] = useState("");

  const getProfile = () => {
    axios
      .get("http://localhost:5000/api/user/profile")
      .then((res) => {
        //console.log(res.data.data);
        setName(res.data.data.name);
        setNip(res.data.data.nip);
        setEmail(res.data.data.email);
        setPhone(res.data.data.phone);
        setDivision(res.data.data.division);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <EmployeeLayout>
      <Flex w="full" p="5" direction={{ base: "column", md: "row" }} gap={5}>
        <Flex w="full" direction="column" gap={5}>
          <Box
            w="full"
            borderRadius="2xl"
            boxShadow="lg"
            bg={useColorModeValue("white", "green.800")}
          >
            <Box
              borderTopRadius="2xl"
              h="150px"
              bgGradient="linear(to-b, green.200, green.500)"
            />
            <VStack mt="-12" spacing="3" mb={5}>
              <Avatar
                size="2xl"
                src=""
                borderColor="white"
                bgColor="gray.500"
              />
              <Text fontSize="lg" fontWeight="bold">
                {name}
              </Text>
              <Text fontSize="md" color="gray.500">
                Division:{" "}
                <Text as="span" fontWeight="bold" textTransform="capitalize">
                  {division}
                </Text>
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
                placeholder={nip}
                disabled
              />
            </FormControl>
            <FormControl>
              <FormLabel>Fullname</FormLabel>
              <Input
                type="text"
                focusBorderColor="green.500"
                placeholder={name}
              />
            </FormControl>
          </Stack>
          <Stack py={2} direction={{ base: "column", md: "row" }}>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                focusBorderColor="green.500"
                placeholder={email}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="number"
                focusBorderColor="green.500"
                placeholder={phone}
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
