import React, { useState, useEffect } from "react";
import EmployeeLayout from "../EmployeeLayout";
import Swal from "sweetalert2";
import {
  Flex,
  Heading,
  Box,
  useColorMode,
  useColorModeValue,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";
import axios from "axios";

const Overtime = () => {
  const { colorMode } = useColorMode();
  const [overtime, setOvertime] = useState([]);
  const [history, setHistory] = useState([]);
  const toast = useToast();

  const getOvertime = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/overtime/data"
      );
      setOvertime(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getHistory = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/overtime/data/history"
      );
      setHistory(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOvertime();
    getHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const acceptColumns = React.useMemo(
    () => [
      {
        Header: "date",
        accessor: "date",
      },
      {
        Header: "hours",
        accessor: "hours",
      },
      {
        Header: "reason",
        accessor: "reason",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "overtime rate",
        accessor: "overtime_rate",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => handleAccept(row.original)}
            >
              Accept
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const historyColumns = React.useMemo(
    () => [
      {
        Header: "date",
        accessor: "date",
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
        Header: "overtime rate",
        accessor: "overtime_rate",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
    ],
    []
  );

  const handleAccept = async (rowData) => {
    const { _id: overtimeId } = rowData;

    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to accept this overtime request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/employee/accept-overtime/${overtimeId}`
          );
          toast({
            position: "top-left",
            title: "Overtime Accepted",
            description: "Overtime has been accepted successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          getOvertime();
          getHistory();
        } catch (error) {
          console.error("Error accepting overtime:", error);
          toast({
            position: "top-left",
            title: "Error",
            description: "There was an error accepting overtime.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    });
  };

  return (
    <EmployeeLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Overtime
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
          overflow="auto"
        >
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList mb="1em" flexDirection={{ base: "column", md: "row" }}>
              <Tab color={colorMode === "light" ? "" : "white"}>Available</Tab>
              <Tab color={colorMode === "light" ? "" : "white"}>History</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DataTable
                  columns={acceptColumns}
                  data={overtime}
                  filename={"overtime_acc_report"}
                />
              </TabPanel>
              <TabPanel>
                <DataTable
                  columns={historyColumns}
                  data={history}
                  filename={"overtime_history_report"}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Overtime;
