import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import {
  useColorModeValue,
  Flex,
  Heading,
  Box,
} from "@chakra-ui/react";
import DataTable from "../../../components/admin/table/DataTabel";
import axios from 'axios';

const Payroll = () => {
  const [data, setData] = useState([]);

  const getPayroll = () => {
    axios.get('http://localhost:5000/api/payroll/data/employee')
      .then((res) => {
        console.log("Response data:", res.data.data);
        const payrollData = res.data.data;

        if (Array.isArray(payrollData)) {
          const formattedData = payrollData.map(employee => ({
            nip: employee.nip,
            name: employee.name,
            division: employee.division,
            basic_salary: `Rp. ${employee.basic_salary}`,
            deduction_sick: `Rp. ${employee.deduction_sick}`,
            deduction_permission: `Rp. ${employee.deduction_permission}`,
            deduction_absent: `Rp. ${employee.deduction_absent}`,
            overtime_salary: `Rp. ${employee.overtime_salary}`,
            total_salary: `Rp. ${employee.total_salary}`,
          }));
          setData(formattedData);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching payroll data:", err);
      });
  };

  useEffect(() => {
    getPayroll();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "NIP",
        accessor: "nip",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Division",
        accessor: "division",
      },
      {
        Header: "Basic Salary",
        accessor: "basic_salary",
      },
      {
        Header: "Deduction Permission",
        accessor: "deduction_permission",
      },
      {
        Header: "Deduction Sick",
        accessor: "deduction_sick",
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
    <AdminLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Salary
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <DataTable columns={columns} data={data} filename={"table_payroll"}/>
        </Box>
      </Flex>
    </AdminLayout>
  );
}

export default Payroll;