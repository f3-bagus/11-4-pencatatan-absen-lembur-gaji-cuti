import React, { useEffect, useState } from "react";
import EmployeeLayout from "../EmployeeLayout";
import { useColorModeValue, Flex, Heading, Box } from "@chakra-ui/react";
import DataTable from "../../../components/employee/table/DataTabel";

const Payroll = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "basic_salary",
        accessor: "basic_salary",
      },
      {
        Header: "deduction_sick",
        accessor: "deduction_sick",
      },
      {
        Header: "deduction_permission",
        accessor: "deduction_permission",
      },
      {
        Header: "deduction_absent",
        accessor: "deduction_absent",
      },
      {
        Header: "total_salary",
        accessor: "total_salary",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        basic_salary: "Rp. 5.000.000",
        deduction_sick: "Rp. 1.000.000",
        deduction_permission: "-",
        deduction_absent: "-",
        total_salary: "Rp. 4.000.000",
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
          <DataTable columns={columns} data={data} filename={"table_payroll"} />
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Payroll;
