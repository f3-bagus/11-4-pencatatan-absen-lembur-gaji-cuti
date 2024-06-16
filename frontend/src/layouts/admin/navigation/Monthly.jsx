import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import DataTable from "../../../components/admin/table/DataTabel";
import { Flex, Heading, Box, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";

const Monthly = () => {
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
        Header: "total attendance",
        accessor: "total_attendance",
      },
      {
        Header: "total present",
        accessor: "total_present",
      },
      {
        Header: "total absent",
        accessor: "total_absent",
      },
      {
        Header: "total sick",
        accessor: "total_sick",
      },
      {
        Header: "total permission",
        accessor: "total_permission",
      },
      {
        Header: "total leave",
        accessor: "total_leave",
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Daily Attendance
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
