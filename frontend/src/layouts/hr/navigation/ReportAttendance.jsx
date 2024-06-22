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
import { BASE_URL } from "../../../api/BASE_URL";

const ReportAttendace = () => {
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const { colorMode } = useColorMode();

  const getReportMonthly = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/report/attendance/monthly`
      );
      setMonthly(response.data.data.reportMonthly);
    } catch (error) {
      console.log(error);
    }
  };

  const getReportYearly = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/report/attendance/yearly`
      );
      setYearly(response.data.data.reportYearly);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReportMonthly();
    getReportYearly();
  }, []);

  const monthlyColumns = React.useMemo(
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
        Header: "month",
        accessor: "month",
      },
      {
        Header: "present",
        accessor: "present",
      },
      {
        Header: "late",
        accessor: "late",
      },
      {
        Header: "absent",
        accessor: "absent",
      },
      {
        Header: "leave",
        accessor: "leave",
      },
      {
        Header: "permit",
        accessor: "permit",
      },
      {
        Header: "sick",
        accessor: "sick",
      },
      {
        Header: "total attendance",
        accessor: "total_attendance",
      },
    ],
    []
  );

  const yearlyColumns = React.useMemo(
    () => [
      {
        Header: "nip",
        accessor: "nip",
      },
      {
        Header: "present",
        accessor: "present",
      },
      {
        Header: "late",
        accessor: "late",
      },
      {
        Header: "absent",
        accessor: "absent",
      },
      {
        Header: "leave",
        accessor: "leave",
      },
      {
        Header: "permit",
        accessor: "permit",
      },
      {
        Header: "sick",
        accessor: "sick",
      },
      {
        Header: "total attendance",
        accessor: "total_attendance",
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Reports Attendance
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
              <Tab color={colorMode === "light" ? "" : "white"}>Monthly</Tab>
              <Tab color={colorMode === "light" ? "" : "white"}>Yearly</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DataTable
                  columns={monthlyColumns}
                  data={monthly}
                  filename={"monthly_attendance_report"}
                />
              </TabPanel>
              <TabPanel>
                <DataTable
                  columns={yearlyColumns}
                  data={yearly}
                  filename={"yearly_attendance_report"}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default ReportAttendace;
