import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  useColorModeValue,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";
import AdminLayout from "../AdminLayout";
import { Formik, Form, Field } from "formik";
import { validationSchemaCreateAccountHr } from "../../../utils/validationSchema";
import axios from "axios";
import { BASE_URL } from "../../../api/BASE_URL";

const CreateHr = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);

    const { firstName, lastName, ...rest } = values;
    const submitValues = {
      ...rest,
      name: `${firstName} ${lastName}`,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/create-hr`,
        submitValues
      );

      toast({
        position: "top-left",
        title: "Account created",
        description: "Hr account has been created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(
        "Error submitting create account:",
        error.response || error.message
      );
      toast({
        position: "top-left",
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error created account.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
    resetForm();
    setSubmitting(false);
  };

  return (
    <AdminLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl" mb={4} textAlign="left">
          Create HR Account
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          px="5"
          py="2"
          borderRadius="2xl"
          shadow="lg"
        >
          <Formik
            initialValues={{
              nip: "",
              gender: "",
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
            }}
            validationSchema={validationSchemaCreateAccountHr}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                <Stack py={2} direction={{ base: "column", md: "row" }}>
                  <Field name="nip">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.nip && form.touched.nip}
                        isRequired
                      >
                        <FormLabel>NIP</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter nip"
                          focusBorderColor="green.500"
                          _autofill={{
                            boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                            textFillColor: "black !important",
                          }}
                        />
                        <FormErrorMessage>{form.errors.nip}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="gender">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.gender && form.touched.gender}
                        isRequired
                      >
                        <FormLabel>Gender</FormLabel>
                        <Select
                          {...field}
                          placeholder="Select gender"
                          focusBorderColor="green.500"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Select>
                        <FormErrorMessage>
                          {form.errors.gender}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Stack py={2} direction={{ base: "column", md: "row" }}>
                  <Field name="firstName">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.firstName && form.touched.firstName
                        }
                        isRequired
                      >
                        <FormLabel>First Name</FormLabel>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter first name"
                          focusBorderColor="green.500"
                          _autofill={{
                            boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                            textFillColor: "black !important",
                          }}
                        />
                        <FormErrorMessage>
                          {form.errors.firstName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="lastName">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.lastName && form.touched.lastName
                        }
                        isRequired
                      >
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter last name"
                          focusBorderColor="green.500"
                          _autofill={{
                            boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                            textFillColor: "black !important",
                          }}
                        />
                        <FormErrorMessage>
                          {form.errors.lastName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Stack py={2} direction={{ base: "column", md: "row" }}>
                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        isRequired
                      >
                        <FormLabel>Email Address</FormLabel>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email address"
                          focusBorderColor="green.500"
                          _autofill={{
                            boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                            textFillColor: "black !important",
                          }}
                        />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="phone">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.phone && form.touched.phone}
                        isRequired
                      >
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter phone number"
                          focusBorderColor="green.500"
                          _autofill={{
                            boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                            textFillColor: "black !important",
                          }}
                        />
                        <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
                <Button
                  colorScheme="green"
                  float="right"
                  mt={3}
                  mb={3}
                  type="submit"
                  isLoading={isSubmitting || isLoading}
                  isDisabled={!isValid}
                >
                  Create Account
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </AdminLayout>
  );
};

export default CreateHr;
