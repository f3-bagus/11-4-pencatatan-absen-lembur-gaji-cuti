import React from "react";
import HrLayout from "../HrLayout";
import DataTable from "../../../components/hr/table/DataTabel";
import {
  Flex,
  Heading,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

const Attedance = () => {
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
        Header: "check_in",
        accessor: "check_in",
      },
      {
        Header: "check_out",
        accessor: "check_out",
      },
      {
        Header: "date",
        accessor: "date",
      },
      {
        Header: "status",
        accessor: "status",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        nip: 33421312,
        name: "John Doe",
        check_in: "09.00",
        check_out: "17.00",
        date: "12-12-2024",
        status: "attend",
      },
      {
        nip: 33421312,
        name: "Emily Johnson",
        check_in: "09.00",
        check_out: "17.00",
        date: "12-12-2024",
        status: "attend",
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Attendance
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <DataTable columns={columns} data={data} filename={"table_attendance"}/>
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Attedance;
