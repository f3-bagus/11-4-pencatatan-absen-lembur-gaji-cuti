import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
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
} from "@chakra-ui/react";
import DataTable from "../../../components/admin/table/DataTabel";
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

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/overtime",
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
    setSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
        Header: "type",
        accessor: "type",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "jobdesk",
        accessor: "jobdesk",
      },
      {
        Header: "date",
        accessor: "date",
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Overtime History
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "xs", md: "md", lg: "lg" }}
          >
          </Modal>

          <DataTable
            columns={columns}
            data={overtime}
            filename={"table_overtime"}
          />
        </Box>
      </Flex>
    </AdminLayout>
  );
};

export default Overtime;
