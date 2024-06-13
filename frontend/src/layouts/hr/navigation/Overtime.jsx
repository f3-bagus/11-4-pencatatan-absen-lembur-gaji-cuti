import React from "react";
import HrLayout from "../HrLayout";
import {
  useColorModeValue,
  Flex,
  Heading,
  Box,
} from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";

const Overtime = () => {
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
        Header: "date",
        accessor: "date",
      },
      {
        Header: "hours",
        accessor: "hours",
      },
      {
        Header: "reasons",
        accessor: "reasons",
      },
      {
        Header: "status_overtime",
        accessor: "status_overtime",
      },
      {
        Header: "overtime_rate",
        accessor: "overtime_rate",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        nip: 33421312,
        name: "John Doe",
        division: "IT",
        date: "12-12-2024",
        hours: "3",
        reasons: "overtime",
        status_overtime: "attend",
        overtime_rate: "Rp. 100.000",
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Overtime
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <DataTable columns={columns} data={data} filename={"table_overtime"}/>
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Overtime;
