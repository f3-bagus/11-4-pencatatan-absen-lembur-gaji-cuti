import React, { useEffect, useState } from "react";
import EmployeeLayout from "../EmployeeLayout";
import { useColorModeValue, Flex, Heading, Box } from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";
import axios from "axios";

const Payroll = () => {
  const [data, setData] = useState([]);

  const getPayrollData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/payroll/data"
      );
      
      setData([{
        basic_salary: `Rp. ${response.data.data.basic_salary}`,
        deduction_sick: `Rp. ${response.data.data.deduction_sick}`,
        deduction_permission: `Rp. ${response.data.data.deduction_permission}`,
        deduction_absent: `Rp. ${response.data.data.deduction_absent}`,
        overtime_salary: `Rp. ${response.data.data.overtime_salary}`,
        total_salary: `Rp. ${response.data.data.total_salary}`,
      }]);
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
      },
      {
        Header: "Deduction Sick",
        accessor: "deduction_sick",
      },
      {
        Header: "Deduction Permission",
        accessor: "deduction_permission",
      },
      {
        Header: "Deduction Absent",
        accessor: "deduction_absent",
      },
      {
        Header: "Overtime Salary",
        accessor: "overtime_salary",
      },
      {
        Header: "Total Salary",
        accessor: "total_salary",
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
