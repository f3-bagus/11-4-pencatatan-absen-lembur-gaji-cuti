import React, { useState, useEffect } from "react";
import EmployeeLayout from "../EmployeeLayout";
import {
  useColorModeValue,
  useDisclosure,
  useToast,
  Select,
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
  Text,
  Stack,
} from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";

const Leave = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [history, setHistory] = useState([]);
  const [remaining, setRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const toast = useToast();

  const getDataHistory = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/leave/history"
      );
      setHistory(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDataRemaining = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/leave/remaining"
      );
      setRemaining(response.data.remaining_leave);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [formValues, setFormValues] = useState({
    start_date: "",
    duration: "",
    type: "",
    reason: "",
    leave_letter: null,
  });

  const validateForm = () => {
    const { start_date, duration, type, reason, leave_letter } = formValues;
    return start_date && duration && type && reason && leave_letter;
  };

  useEffect(() => {
    getDataHistory();
    getDataRemaining();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      const response = await axios.post(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/leave/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        position: "top-left",
        title: "Leave Applied",
        description: "Leave form has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      getDataHistory();
      getDataRemaining();
    } catch (error) {
      console.error("Error submitting leave:", error.response || error.message);
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
    onClose();
  };

  const handleDownload = () => {
    const file = "/src/assets/file/Surat-Izin-Cuti-Tidak-Masuk-Kerja.doc";

    const link = document.createElement("a");
    link.href = file;
    link.download = "form_leave.doc";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "start date",
        accessor: "start_date",
      },
      {
        Header: "end date",
        accessor: "end_date",
      },
      {
        Header: "type",
        accessor: "type",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
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
        Header: "status",
        accessor: "status_leave",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
    ],
    []
  );

  return (
    <EmployeeLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
        >
          <Heading as="h1" size="xl">
            Leave
          </Heading>
          <Box
            bg={useColorModeValue("green.500", "green.800")}
            alignItems="center"
            py={2}
            px={4}
            borderRadius="2xl"
            boxShadow="lg"
          >
            <Text color="white">
              Leave Remaining:{" "}
              <Text as="span" fontWeight="bold">
                {remaining !== null ? remaining : 0}
              </Text>
            </Text>
          </Box>
        </Stack>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
          overflow="auto"
        >
          <Button
            leftIcon={<IoIosAddCircleOutline size={25} />}
            mb={5}
            mx={2}
            colorScheme="blue"
            onClick={onOpen}
          >
            Apply for Leave
          </Button>
          <Button
            leftIcon={<FaFileDownload size={20} />}
            mb={5}
            mx={2}
            colorScheme="blue"
            onClick={handleDownload}
          >
            Leave Form
          </Button>

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "xs", md: "md", lg: "lg" }}
          >
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "green.900")}>
              <ModalHeader>Apply for Leave</ModalHeader>
              <ModalCloseButton />

              <form onSubmit={handleSubmit}>
                <ModalBody pb={6}>
                  <FormControl mt={3} isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      name="start_date"
                      value={formValues.start_date}
                      onChange={handleChange}
                      focusBorderColor="green.500"
                    />
                  </FormControl>

                  <FormControl mt={3} isRequired>
                    <FormLabel>Duration</FormLabel>
                    <Input
                      type="number"
                      name="duration"
                      placeholder="Enter duration"
                      value={formValues.duration}
                      onChange={handleChange}
                      focusBorderColor="green.500"
                    />
                  </FormControl>

                  <FormControl mt={3} isRequired>
                    <FormLabel>Type</FormLabel>
                    <Select
                      name="type"
                      value={formValues.type}
                      onChange={handleChange}
                      focusBorderColor="green.500"
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="permit">Permit</option>
                      <option value="sick">Sick</option>
                      <option value="leave">Leave</option>
                    </Select>
                  </FormControl>

                  <FormControl mt={3} isRequired>
                    <FormLabel>Reason</FormLabel>
                    <Textarea
                      name="reason"
                      value={formValues.reason}
                      onChange={handleChange}
                      placeholder="Enter reason"
                      focusBorderColor="green.500"
                    />
                  </FormControl>

                  <FormControl mt={3} isRequired>
                    <FormLabel>Leave Letter</FormLabel>
                    <Input
                      type="file"
                      name="leave_letter"
                      accept=".doc, .docx"
                      onChange={handleChange}
                      focusBorderColor="green.500"
                      alignContent="center"
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="green"
                    mr={3}
                    type="submit"
                    isLoading={isLoading}
                    disabled={!isFormValid}
                  >
                    Submit
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>

          <DataTable
            columns={columns}
            data={history}
            filename={"leave_history"}
          />
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Leave;
