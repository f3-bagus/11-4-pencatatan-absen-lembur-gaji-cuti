import React, { useEffect, useState } from "react";
import HrLayout from "../HrLayout";
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
} from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";
import axios from "axios";

const Report = () => {
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const { colorMode } = useColorMode();

  const getReport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/attendance/report"
      );
      console.log(response.data.data.reportMonthly);
      console.log(response.data.data.reportYearly);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReport();
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
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Reports
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList mb="1em" flexDirection={{ base: "column", md: "row" }}>
              <Tab color={colorMode === "light" ? "" : "white"}>Monthly</Tab>
              <Tab color={colorMode === "light" ? "" : "white"}>Yearly</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DataTable
                  columns={attendanceColumns}
                  data={attendanceData}
                  filename={"monthly_report"}
                />
              </TabPanel>
              <TabPanel>
                <DataTable
                  columns={payrollColumns}
                  data={payrollData}
                  filename={"yearly_report"}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Report;
