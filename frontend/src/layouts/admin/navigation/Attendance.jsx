import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import DataTable from "../../../components/admin/table/DataTabel";
import { Flex, Heading, Box, useColorModeValue, Text } from "@chakra-ui/react";
import axios from "axios";

const Attendance = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null); // State untuk menyimpan pesan error

  const getAttendance = () => {
    axios
      .get("http://localhost:5000/api/attendance/data")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch attendance data. Please try again later.");
      });
  };

  useEffect(() => {
    getAttendance();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTimeToHHMM = (timeString) => {
    if (!timeString) return "-";
    const date = new Date(`1970-01-01T${timeString}Z`);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
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
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "clock in",
        accessor: "clock_in",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : formatTimeToHHMM(cell.value)}</Text>
        ),
      },
      {
        Header: "clock out",
        accessor: "clock_out",
        Cell: ({ cell }) => (
          <Text>{cell.value === null ? "-" : formatTimeToHHMM(cell.value)}</Text>
        ),
      },
      {
        Header: "date",
        accessor: "date",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "status",
        accessor: "status_attendance",
        Cell: ({ cell }) => <Text textTransform="capitalize">{cell.value}</Text>,
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
        {error ? (
          <Box p="5" bg="red.100" borderRadius="md">
            <Text color="red.800">{error}</Text>
          </Box>
        ) : (
          <Box
            bg={useColorModeValue("white", "green.800")}
            p="3"
            borderRadius="2xl"
            shadow="lg"
          >
            <DataTable columns={columns} data={data} filename={"table_attendance"} />
          </Box>
        )}
      </Flex>
    </AdminLayout>
  );
};

export default Attendance;
