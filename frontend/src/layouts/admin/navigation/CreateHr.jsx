import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  useColorModeValue,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import AdminLayout from "../AdminLayout";
import axios from "axios";

const CreateHr = () => {
  const [formData, setFormData] = useState({
    nip: "",
    name: "",
    gender: "",
    email: "",
    phone: "",
    profilePhoto: null,
  });

  const [isInvalidNIPAlertOpen, setIsInvalidNIPAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate NIP format (must be numeric and exactly 7 digits)
    const isValidNIP = /^\d{7}$/.test(formData.nip);

    if (!isValidNIP) {
      setIsInvalidNIPAlertOpen(true);
      return;
    }

    console.log(formData); // Replace with your API call or further logic
    // Here you would typically handle form submission, e.g., send data to backend
    
    // Show success alert
    setIsSuccessAlertOpen(true);
  };

  const closeInvalidNIPAlert = () => {
    setIsInvalidNIPAlertOpen(false);
  };

  const closeSuccessAlert = () => {
    setIsSuccessAlertOpen(false);
  };

  return (
    <AdminLayout>
      <Flex
        w="full" p="5" direction="column" gap={5}>
        
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="2"
          borderRadius="2xl"
          shadow="lg"
        >
          <form onSubmit={handleSubmit}>
            <FormControl id="nip" isRequired>
              <FormLabel>NIP</FormLabel>
              <Input
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                isInvalid={!/^\d*$/.test(formData.nip)}
              />
            </FormControl>
            <FormControl id="name" isRequired mt={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="gender" isRequired mt={4}>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Select>
            </FormControl>
            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                pattern="[a-z0-9._%+-]+@gmail\.com$"
              />
            </FormControl>
            <FormControl id="phone" isRequired mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="profilePhoto" mt={4}>
              <FormLabel>Profile Photo</FormLabel>
              <Input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleChange}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="green"
              mt={6}
              w="full"
            >
              Create Account
            </Button>
          </form>
        </Box>
      </Flex>

      {/* Alert dialog for invalid NIP */}
      <AlertDialog
        isOpen={isInvalidNIPAlertOpen}
        onClose={closeInvalidNIPAlert}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Invalid NIP
            </AlertDialogHeader>

            <AlertDialogBody>
              NIP must be a 7-digit numeric value.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={closeInvalidNIPAlert} colorScheme="blue">
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Alert dialog for success */}
      <AlertDialog
        isOpen={isSuccessAlertOpen}
        onClose={closeSuccessAlert}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Success
            </AlertDialogHeader>

            <AlertDialogBody>
              Successfully created account.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={closeSuccessAlert} colorScheme="blue">
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  );
};

export default CreateHr;
