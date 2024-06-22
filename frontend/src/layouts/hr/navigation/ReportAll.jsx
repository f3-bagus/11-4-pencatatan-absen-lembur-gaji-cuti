import React, { useEffect, useState } from "react";
import HrLayout from "../HrLayout";
import { Flex, Heading, Box, useColorModeValue, Text } from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";
import axios from "axios";
import { BASE_URL } from "../../../api/BASE_URL";

const ReportAll = () => {
  const [report, setReport] = useState([]);

  const getReportAll = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/report/all`
      );
      setReport(response.data.data.reports);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReportAll();
  }, []);

  const reportColumns = React.useMemo(
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
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "month",
        accessor: "month",
      },
      {
        Header: "Points Attendance",
        accessor: "PointsAttendance",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : cell.value}</Text>
        ),
      },
      {
        Header: "Points Overtime",
        accessor: "PointsOvertime",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : cell.value}</Text>
        ),
      },
      {
        Header: "MinPoint Overtime",
        accessor: "MinPointOvertime",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : cell.value}</Text>
        ),
      },
      {
        Header: "MaxPoints Attendance",
        accessor: "MaxPointsAttendance",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : cell.value}</Text>
        ),
      },
      {
        Header: "TotalPoint Overtime Division",
        accessor: "TotalPointOvertimeDivision",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : cell.value}</Text>
        ),
      },
      {
        Header: "review",
        accessor: "review",
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Reports All
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
          overflow="auto"
        >
          <DataTable
            columns={reportColumns}
            data={report}
            filename={"report_all"}
          />
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default ReportAll;
