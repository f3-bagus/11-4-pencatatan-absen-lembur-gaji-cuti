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
  Text,
} from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";
import axios from "axios";

const ReportOvertime = () => {
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const { colorMode } = useColorMode();

  const getReportMonthly = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/report/overtime/monthly"
      );
      setMonthly(response.data.data.reportMonthly);
    } catch (error) {
      console.log(error);
    }
  };

  const getReportYearly = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/report/overtime/yearly"
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
        Header: "division",
        accessor: "division",
        Cell: ({ cell }) => <Text textTransform="capitalize">{cell.value}</Text>,
      },
      {
        Header: "month",
        accessor: "month",
      },
      {
        Header: "total hours",
        accessor: "total_hours",
      },
      {
        Header: "total overtime",
        accessor: "total_overtime",
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
        Header: "name",
        accessor: "name",
      },
      {
        Header: "division",
        accessor: "division",
        Cell: ({ cell }) => <Text textTransform="capitalize">{cell.value}</Text>,
      },
      {
        Header: "total hours",
        accessor: "total_hours",
      },
      {
        Header: "total overtime",
        accessor: "total_overtime",
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Reports Overtime
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
                  filename={"monthly_overtime_report"}
                />
              </TabPanel>
              <TabPanel>
                <DataTable
                  columns={yearlyColumns}
                  data={yearly}
                  filename={"yearly_overtime_report"}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default ReportOvertime;
