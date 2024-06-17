import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import {
  useColorModeValue,
  useDisclosure,
  useToast,
  Flex,
  Heading,
  Box,
  Modal,
} from "@chakra-ui/react";
import DataTable from "../../../components/admin/table/DataTabel";
import axios from "axios";

const Overtime = () => {
  const { isOpen, onClose } = useDisclosure();
  const [overtime, setOvertime] = useState([]);
  const [setIsLoading] = useState(false);
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
