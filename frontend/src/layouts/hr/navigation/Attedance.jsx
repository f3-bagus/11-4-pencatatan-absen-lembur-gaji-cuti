import React, { useEffect, useState } from "react";
import HrLayout from "../HrLayout";
import DataTable from "../../../components/hr/table/DataTabel";
import { Flex, Heading, Box, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";

const Attedance = () => {
  const [data, setData] = useState([]);

  const getAttendance = () => {
    axios
      .get("http://localhost:5000/api/attendance/data")
      .then((res) => {
        //console.log(res.data.data);
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAttendance();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
        Header: "clock_in",
        accessor: "clock_in",
      },
      {
        Header: "clock_out",
        accessor: "clock_out",
      },
      {
        Header: "date",
        accessor: "date",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "status_attendance",
        accessor: "status_attendance",
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
          <DataTable
            columns={columns}
            data={data}
            filename={"table_attendance"}
          />
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Attedance;
