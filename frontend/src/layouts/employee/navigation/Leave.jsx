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
} from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";

const Leave = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const toast = useToast();

  const getDataHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/leave/data/history"
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [formValues, setFormValues] = useState({
    start_date: "",
    end_date: "",
    type: "",
    reason: "",
    leave_letter: null,
  });

  const validateForm = () => {
    const { start_date, end_date, type, reason, leave_letter } = formValues;
    return start_date && end_date && type && reason && leave_letter;
  };

  useEffect(() => {
    getDataHistory();
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
        "http://localhost:5000/api/leave/apply",
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
      console.log("Response:", response.data);
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
              <ModalHeader>Apply for Overtime</ModalHeader>
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
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      name="end_date"
                      value={formValues.end_date}
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

          <DataTable columns={columns} data={data} filename={"leave_history"} />
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Leave;
