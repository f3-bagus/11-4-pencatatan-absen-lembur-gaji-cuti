import React, { useState, useEffect } from "react";
import EmployeeLayout from "../EmployeeLayout";
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
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Formik, Form, Field } from "formik";
import { validationSchemaLeave } from "../../../utils/validationSchema";
import axios from "axios";

const Leave = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const getHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employee/:nip/leaves"
      );
      console.log(response.data);
      setHistory(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    console.log(values);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/leave/apply",
        values
      );
      toast({
        position: "top-left",
        title: "Leave Applied",
        description: "Leave form has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Response:", response.data);
    } catch (error) {
      console.error(
        "Error submitting leave:",
        error.response || error.message
      );
      toast({
        position: "top-left",
        title: "Error",
        description:
          error.response?.data?.message ||
          "There was an error submitting your leave application.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
    setSubmitting(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "nip",
        accessor: "nip",
      },
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "division",
        accessor: "division",
      },
      {
        Header: "date",
        accessor: "date",
      },
      {
        Header: "hours",
        accessor: "hours",
      },
      {
        Header: "reasons",
        accessor: "reasons",
      },
      {
        Header: "status_overtime",
        accessor: "status_overtime",
      },
      {
        Header: "overtime_rate",
        accessor: "overtime_rate",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        nip: 33421312,
        name: "John Doe",
        division: "IT",
        date: "12-12-2024",
        hours: "3",
        reasons: "overtime",
        status_overtime: "attend",
        overtime_rate: "Rp. 100.000",
      },
    ],
    []
  );

  return (
    <EmployeeLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Leave
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
            Apply for Leave
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
                  start_date: "",
                  end_date: "",
                  type: "",
                  reason: "",
                  leave_letter: "",
                }}
                validationSchema={validationSchemaLeave}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <ModalBody pb={6}>
                      <Field name="start_date">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.start_date && form.touched.start_date
                            }
                            mt={3}
                          >
                            <FormLabel>Start Date</FormLabel>
                            <Input
                              {...field}
                              type="date"
                              placeholder="Enter date"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>
                              {form.errors.start_date}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="end_date">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.end_date && form.touched.end_date
                            }
                            mt={3}
                          >
                            <FormLabel>End Date</FormLabel>
                            <Input
                              {...field}
                              type="date"
                              placeholder="Enter date"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>
                              {form.errors.end_date}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="type">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.type && form.touched.type}
                            mt={3}
                          >
                            <FormLabel>Type</FormLabel>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter type"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>
                              {form.errors.type}
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
                          >
                            <FormLabel>Reason</FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Enter reason"
                              focusBorderColor="green.500"
                            />
                            <FormErrorMessage>
                              {form.errors.reason}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="leave_letter">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.leave_letter &&
                              form.touched.leave_letter
                            }
                            mt={3}
                          >
                            <FormLabel>Leave Letter</FormLabel>
                            <Input
                              {...field}
                              type="file"
                              focusBorderColor="green.500"
                              alignContent="center"
                            />
                            <FormErrorMessage>
                              {form.errors.leave_letter}
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

          <DataTable columns={columns} data={data} filename={"leave_history"} />
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Leave;
