import React, { useEffect, useState } from "react";
import HrLayout from "../HrLayout";
import {
  useColorModeValue,
  Flex,
  Heading,
  Box,
} from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";
import axios from 'axios';

const Salary = () => {
  const [data, setData] = useState([]);

  const getPayroll = () => {
    axios.get('http://localhost:5000/api/payroll/data/employee').then((res) =>{
      //console.log(res.data.data);
      setData(res.data.data)
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    getPayroll();
  }, []);

  const columns = React.useMemo(
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
        Header: "overtime_pay",
        accessor: "overtime_pay",
      },
      {
        Header: "deduction_permission",
        accessor: "deduction_permission",
      },
      {
        Header: "deduction_sick",
        accessor: "deduction_sick",
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
        >
          <DataTable columns={columns} data={data} filename={"table_payroll"}/>
        </Box>
      </Flex>
    </HrLayout>
  );
}

export default Salary