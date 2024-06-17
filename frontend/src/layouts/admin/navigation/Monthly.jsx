import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import DataTable from "../../../components/admin/table/DataTabel";
import { Flex, Heading, Box, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";

const Monthly = () => {
  const [data, setData] = useState([]);

  const getAttendance = () => {
    axios
      .get("http://localhost:5000/api/attendance/monthly")
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
        Header: "total attendance",
        accessor: "total_attendance",
      },
      {
        Header: "present",
        accessor: "present",
      },
      {
        Header: "absent",
        accessor: "absent",
      },
      {
        Header: "sick",
        accessor: "sick",
      },
      {
        Header: "permit",
        accessor: "permit",
      },
      {
        Header: "leave",
        accessor: "leave",
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Monthly Attendance
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
    </AdminLayout>
  );
};

export default Monthly;
