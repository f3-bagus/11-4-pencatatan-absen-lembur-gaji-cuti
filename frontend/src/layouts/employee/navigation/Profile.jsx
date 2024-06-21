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
  FormErrorMessage,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { BiShow, BiHide } from "react-icons/bi";
import { validationSchemaChangePassword } from "../../../utils/validationSchema";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [division, setDivision] = useState("");
  const [photo, setPhoto] = useState("");

  const toast = useToast();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    profile_photo: "",
  });

  const validateForm = () => {
    const { name, email, phone, profile_photo } = formValues;
    return name && email && phone && profile_photo;
  };

  const getProfile = () => {
    axios
      .get("https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/user/profile")
      .then((res) => {
        setName(res.data.data.name);
        setNip(res.data.data.nip);
        setEmail(res.data.data.email);
        setPhone(res.data.data.phone);
        setDivision(res.data.data.division);
        setPhoto(res.data.data.profile_photo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formValues]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormValues({ ...formValues, [name]: files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/user/reset-password",
        values
      );

      toast({
        position: "top-left",
        title: "Password Changed",
        description: "Password has been changed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting edit:", error.response || error.message);
      toast({
        position: "top-left",
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error change your password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
    resetForm();
    setSubmitting(false);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      const response = await axios.put(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/user/update/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Error submitting profile:",
        error.response || error.message
      );
      toast({
        position: "top-left",
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error updating your profile information.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
    document.getElementById("update-profile").reset();
  };

  let photoUrl = "";
  if (photo) {
    const slicedPath = photo.substring(7);
    photoUrl = `https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/${slicedPath}`;
  }

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
                src={photoUrl}
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

          {/* Edit Password */}
          <Box
            w="full"
            borderRadius="2xl"
            boxShadow="lg"
            p={5}
            bg={useColorModeValue("white", "green.800")}
          >
            <VStack align="flex-start" mb={8}>
              <Heading as="h2" size="lg">
                Change Password
              </Heading>
              <Text fontSize="md" color="gray.500">
                Here you can set your new password
              </Text>
            </VStack>
            <Formik
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchemaChangePassword}
              onSubmit={handlePasswordChange}
            >
              {({ isSubmitting, isValid, errors, touched }) => (
                <Form>
                  <Stack py={2} direction="column">
                    <Field name="oldPassword">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.oldPassword && form.touched.oldPassword
                          }
                          mb={2}
                          isRequired
                        >
                          <FormLabel>Old Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              focusBorderColor="green.500"
                              placeholder="Old Password"
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="md"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <BiHide /> : <BiShow />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>
                            {form.errors.oldPassword}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="newPassword">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.newPassword && form.touched.newPassword
                          }
                          mb={2}
                          isRequired
                        >
                          <FormLabel>New Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              focusBorderColor="green.500"
                              placeholder="New Password"
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="md"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <BiHide /> : <BiShow />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>
                            {form.errors.newPassword}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="confirmPassword">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.confirmPassword &&
                            form.touched.confirmPassword
                          }
                          mb={2}
                          isRequired
                        >
                          <FormLabel>Confirm New Password</FormLabel>
                          <InputGroup>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              focusBorderColor="green.500"
                              placeholder="Confirm New Password"
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="md"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <BiHide /> : <BiShow />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>
                            {form.errors.confirmPassword}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Button
                    colorScheme="green"
                    float="right"
                    mt={3}
                    type="submit"
                    isLoading={isSubmitting || isLoading}
                    isDisabled={!isValid}
                  >
                    Change Password
                  </Button>
                </Form>
              )}
            </Formik>
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
          <form onSubmit={handleEditProfile} id="update-profile">
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
                  placeholder={nip}
                  focusBorderColor="green.500"
                  isDisabled
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Fullname</FormLabel>
                <Input
                  type="text"
                  name="name"
                  placeholder={name}
                  onChange={handleChange}
                  focusBorderColor="green.500"
                  _autofill={{
                    boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                    textFillColor: "black !important",
                  }}
                />
              </FormControl>
            </Stack>
            <Stack py={2} direction={{ base: "column", md: "row" }}>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder={email}
                  onChange={handleChange}
                  focusBorderColor="green.500"
                  _autofill={{
                    boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                    textFillColor: "black !important",
                  }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="number"
                  name="phone"
                  placeholder={phone}
                  onChange={handleChange}
                  focusBorderColor="green.500"
                  _autofill={{
                    boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                    textFillColor: "black !important",
                  }}
                />
              </FormControl>
            </Stack>
            <Stack py={2} direction={{ base: "column", md: "row" }}>
              <FormControl>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  name="profile_photo"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleChange}
                  focusBorderColor="green.500"
                  alignContent="center"
                />
              </FormControl>
            </Stack>
            <Button
              colorScheme="green"
              float="right"
              mt={3}
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid}
            >
              Edit
            </Button>
          </form>
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Profile;
