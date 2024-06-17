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
        "http://localhost:5000/api/payroll/data"
      );

      //console.log(response.data.data);
      
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
        Header: "Basic Salary",
        accessor: "basic_salary",
        Cell: ({ value }) => (
          <Text>Rp. {value}</Text>
        ),
      },
      {
        Header: "Deduction Late",
        accessor: "deduction_late",
        Cell: ({ value }) => (
          <Text>Rp. {value}</Text>
        ),
      },
      {
        Header: "Deduction Permission",
        accessor: "deduction_permission",
        Cell: ({ value }) => (
          <Text>Rp. {value}</Text>
        ),
      },
      {
        Header: "Deduction Absent",
        accessor: "deduction_absent",
        Cell: ({ value }) => (
          <Text>Rp. {value}</Text>
        ),
      },
      {
        Header: "Overtime Salary",
        accessor: "overtime_salary",
        Cell: ({ value }) => (
          <Text>Rp. {value}</Text>
        ),
      },
      {
        Header: "Total Salary",
        accessor: "total_salary",
        Cell: ({ value }) => (
          <Text>Rp. {value}</Text>
        ),
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
        >
          <DataTable columns={columns} data={data} filename={"payroll_report"} />
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Payroll;
