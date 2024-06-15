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
} from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";
import axios from "axios";

const Overtime = () => {
  const { colorMode } = useColorMode();
  const [overtime, setOvertime] = useState([]);
  const [history, setHistory] = useState([]);

  const getOvertime = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/overtime/data"
      );
      console.log(response.data);
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

  const attendanceColumns = React.useMemo(
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
        Header: "total_attendance",
        accessor: "total_attendance",
      },
      {
        Header: "total_present",
        accessor: "total_present",
      },
      {
        Header: "absent",
        accessor: "absent",
      },
      {
        Header: "sick",
        accessor: "sick",
      },
      {
        Header: "leave",
        accessor: "leave",
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
            <Button
              colorScheme="red"
              size="sm"
              ml={2}
              onClick={() => handleReject(row.original)}
            >
              Reject
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const payrollColumns = React.useMemo(
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
        Header: "month",
        accessor: "month",
      },
      {
        Header: "basic_salary",
        accessor: "basic_salary",
      },
      {
        Header: "total_overtime",
        accessor: "total_overtime",
      },
      {
        Header: "total_deduction",
        accessor: "total_deduction",
      },
      {
        Header: "total_salary",
        accessor: "total_salary",
      },
    ],
    []
  );

  const handleReject = (rowData) => {
    // Lakukan operasi untuk menolak permintaan cuti
    console.log("Rejecting leave for:", rowData);
    // Misalnya, Anda dapat membuat permintaan ke backend untuk mengubah status cuti menjadi ditolak
  };

  const handleAccept = (rowData) => {
    // Lakukan operasi untuk menerima permintaan cuti
    console.log("Accepting leave for:", rowData);
    // Misalnya, Anda dapat membuat permintaan ke backend untuk mengubah status cuti
  };

  const attendanceData = React.useMemo(
    () => [
      {
        nip: 33421312,
        name: "John Doe",
        total_attendance: "full",
        total_present: "full",
        absent: "-",
        sick: "-",
        leave: "-",
      },
    ],
    []
  );

  const payrollData = React.useMemo(
    () => [
      {
        nip: 33421312,
        name: "John Doe",
        division: "IT",
        month: "June",
        basic_salary: "Rp. 5.000.000",
        total_overtime: "Rp. 500.000",
        total_deduction: "Rp. 100.000",
        total_salary: "Rp. 5.400.000",
      },
    ],
    []
  );

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
              <Tab color={colorMode === "light" ? "" : "white"}>Accept</Tab>
              <Tab color={colorMode === "light" ? "" : "white"}>History</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DataTable
                  columns={attendanceColumns}
                  data={attendanceData}
                  filename={"attendance_report"}
                />
              </TabPanel>
              <TabPanel>
                <DataTable
                  columns={payrollColumns}
                  data={payrollData}
                  filename={"payroll_report"}
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
