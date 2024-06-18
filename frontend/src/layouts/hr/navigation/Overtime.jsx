import React, { useState, useEffect } from "react";
import HrLayout from "../HrLayout";
import {
  useColorModeValue,
  useDisclosure,
  useToast,
  Flex,
  Heading,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Formik, Form, Field } from "formik";
import { validationSchemaOvertime } from "../../../utils/validationSchema";
import axios from "axios";

const Overtime = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overtime, setOvertime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getDataOvertime = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/overtime/data/all"
      );
      console.log(response.data.data);
      setOvertime(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataOvertime();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/hr/overtime",
        values
      );
      toast({
        position: "top-left",
        title: "Overtime Applied",
        description: "Overtime form has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Response:", response.data);
      resetForm();
    } catch (error) {
      console.error(
        "Error submitting overtime:",
        error.response || error.message
      );
      toast({
        position: "top-left",
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error submitting your overtime application.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
    resetForm();
    setSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "nip",
        accessor: "nip",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : cell.value}</Text>
        ),
      },
      {
        Header: "division",
        accessor: "division",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "date",
        accessor: "date",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "hours",
        accessor: "hours",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : cell.value}</Text>
        ),
      },
      {
        Header: "reason",
        accessor: "reason",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "status overtime",
        accessor: "status_overtime",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "overtime rate",
        accessor: "overtime_rate",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString('id-ID')}`
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Overtime
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <Button
            leftIcon={<IoIosAddCircleOutline size={25} />}
            mb={5}
            colorScheme="blue"
            onClick={onOpen}
          >
            Apply for Overtime
          </Button>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "xs", md: "md", lg: "lg" }}
          >
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "green.900")}>
              <ModalHeader>Apply for Overtime</ModalHeader>
              <ModalCloseButton />

              <Formik
                initialValues={{
                  division: "",
                  date: "",
                  hours: "",
                  reason: "",
                  overtime_rate: "",
                }}
                validationSchema={validationSchemaOvertime}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <ModalBody pb={6}>
                      <Field name="division">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.division && form.touched.division
                            }
                            isRequired
                          >
                            <FormLabel>
                              Division
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Select division"
                              focusBorderColor="green.500"
                            >
                              <option value="" disabled>
                                Select division
                              </option>
                              <option value="it">IT</option>
                              <option value="sales">Sales</option>
                              <option value="marketing">Marketing</option>
                              <option value="accounting">Accounting</option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.division}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="date">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.date && form.touched.date}
                            mt={3}
                            isRequired
                          >
                            <FormLabel>
                              Date
                            </FormLabel>
                            <Input
                              {...field}
                              type="date"
                              placeholder="Enter date"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>
                              {form.errors.date}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="hours">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.hours && form.touched.hours}
                            mt={3}
                            isRequired
                          >
                            <FormLabel>
                              Hours
                            </FormLabel>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter hours"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>
                              {form.errors.hours}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="reason">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.reason && form.touched.reason
                            }
                            mt={3}
                            isRequired
                          >
                            <FormLabel>
                              Reason
                            </FormLabel>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter Reason"
                              focusBorderColor="green.500"
                              _autofill={{
                                boxShadow: "0 0 0 30px #9AE6B4 inset !important",
                                textFillColor: "black !important",
                              }}
                            />
                            <FormErrorMessage>
                              {form.errors.reason}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="overtime_rate">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.overtime_rate &&
                              form.touched.overtime_rate
                            }
                            mt={3}
                            isRequired
                          >
                            <FormLabel>
                              Overtime Rate
                            </FormLabel>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter overtime rate"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>
                              {form.errors.overtime_rate}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="green"
                        mr={3}
                        type="submit"
                        isLoading={isLoading}
                        isDisabled={!isValid || isSubmitting}
                      >
                        Submit
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            </ModalContent>
          </Modal>

          <DataTable
            columns={columns}
            data={overtime}
            filename={"table_overtime"}
          />
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Overtime;
