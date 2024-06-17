import React, { useState, useEffect } from "react";
import EmployeeLayout from "../EmployeeLayout";
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
  Text
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
        "http://localhost:5000/api/overtime/data"
      );
      setOvertime(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/overtime/data/history"
      );
      console.log(response.data);
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
    return `${year}-${month}-${day}`;
  };

  const acceptColumns = React.useMemo(
    () => [
      {
        Header: "date",
        accessor: "date",
        Cell: ({ value }) => formatDate(value),
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
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "hours",
        accessor: "hours",
        Cell: ({ cell }) => (
          <Text>
            {cell.value === null ? '-' : cell.value  }
          </Text>
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
      },
    ],
    []
  );

  const handleAccept = async (rowData) => {
    console.log("Accepting overtime for:", rowData);

    const { _id: overtimeId } = rowData;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/employee/accept-overtime/${overtimeId}`
      );
      console.log(response.data);
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
