import { useState, useContext, useEffect } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Stack,
  Checkbox,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { BiShow, BiHide } from "react-icons/bi";
import { validationSchema } from "../utils/validationSchema";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const initialValues = {
    nip: localStorage.getItem("nip")??"",
    password: localStorage.getItem("password")?? "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    login(values.nip, values.password, rememberMe);
    setSubmitting(false);
  };

  useEffect(() => {
    if (localStorage.getItem("nip") && localStorage.getItem("password")) {
      setRememberMe(true);
    }
  }, []);

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      bg={useColorModeValue("white", "green.900")}
    >
      <Flex p={5} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Flex align={"center"} direction={"column"} mb={5}>
            <Heading
              fontSize={{ base: "2xl", md: "4xl" }}
              color={useColorModeValue("green.500", "green.200")}
            >
              <Text as="span" fontStyle="italic">
                A
              </Text>
              bsentee
            </Heading>
            <Text color={"gray.500"}>Sign in to your account</Text>
          </Flex>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, setValues }) => (
              <Form>
                <Field name="nip">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.nip && form.touched.nip}
                    >
                      <FormLabel htmlFor="nip">
                        NIP
                        <Text as="span" color="red.500">
                          *
                        </Text>
                      </FormLabel>
                      <Input
                        {...field}
                        id="nip"
                        type="text"
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
                <Field name="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                    >
                      <FormLabel htmlFor="password">
                        Password
                        <Text as="span" color="red.500">
                          *
                        </Text>
                      </FormLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          focusBorderColor="green.500"
                          _autofill={{
                            boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                            textFillColor: "black !important",
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="md"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <BiShow /> : <BiHide />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="rememberMe">
                  {() => (
                    <FormControl py="5">
                      <Checkbox
                        isChecked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        colorScheme="green"
                      >
                        Remember Me
                      </Checkbox>
                    </FormControl>
                  )}
                </Field>
                <Stack spacing={6}>
                  <Button
                    type="submit"
                    colorScheme="green"
                    isLoading={isSubmitting}
                    isDisabled={!isValid || isSubmitting}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
    </Stack>
  );
};

export default LoginPage;
