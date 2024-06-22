import React, { useEffect, useState } from "react";
import HrLayout from "../HrLayout";
import { useColorModeValue, Flex, Heading, Box, Text } from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";
import axios from "axios";
import { BASE_URL } from "../../../api/BASE_URL";

const Salary = () => {
  const [data, setData] = useState([]);

  const getPayroll = () => {
    axios
      .get(`${BASE_URL}/api/payroll/data/employee`)
      .then((res) => {
        const payrollData = res.data.data;

        if (Array.isArray(payrollData)) {
          const formattedData = payrollData.map((employee) => ({
            nip: employee.nip,
            name: employee.name,
            division: employee.division,
            month: employee.month,
            basic_salary: `Rp ${parseInt(employee.basic_salary).toLocaleString('id-ID')}`,
            deduction_sick: `Rp ${parseInt(employee.deduction_sick).toLocaleString('id-ID')}`,
            deduction_permission: `Rp ${parseInt(employee.deduction_permission).toLocaleString('id-ID')}`,
            deduction_late: `Rp ${parseInt(employee.deduction_late).toLocaleString('id-ID')}`,
            deduction_absent: `Rp ${parseInt(employee.deduction_absent).toLocaleString('id-ID')}`,
            overtime_salary: `Rp ${parseInt(employee.overtime_salary).toLocaleString('id-ID')}`,
            total_salary: `Rp ${parseInt(employee.total_salary).toLocaleString('id-ID')}`,
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
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "month",
        accessor: "month",
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
        Header: "Deduction Late",
        accessor: "deduction_late",
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
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Payroll
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
          overflow="auto"
        >
          <DataTable columns={columns} data={data} filename={"table_payroll"} />
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Salary;
