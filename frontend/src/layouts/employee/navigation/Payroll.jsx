import React, { useEffect, useState } from "react";
import EmployeeLayout from "../EmployeeLayout";
import { useColorModeValue, Flex, Heading, Box, Text } from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";
import axios from "axios";

const Payroll = () => {
  const [data, setData] = useState([]);

  const getPayrollData = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/payroll/data"
      );
      
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPayrollData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Month",
        accessor: "month",
      },
      {
        Header: "Basic Salary",
        accessor: "basic_salary",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
      {
        Header: "Deduction Late",
        accessor: "deduction_late",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
      {
        Header: "Deduction Permission",
        accessor: "deduction_permission",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
      {
        Header: "Deduction Absent",
        accessor: "deduction_absent",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
      {
        Header: "Overtime Salary",
        accessor: "overtime_salary",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
      {
        Header: "Total Salary",
        accessor: "total_salary",
        Cell: ({ value }) => `Rp ${parseInt(value).toLocaleString("id-ID")}`,
      },
    ],
    []
  );

  return (
    <EmployeeLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Your Payroll
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
          overflow="auto"
        >
          <DataTable columns={columns} data={data} filename={"payroll_report"} />
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Payroll;
