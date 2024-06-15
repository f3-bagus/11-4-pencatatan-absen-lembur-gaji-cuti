import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import DataTable from "../../../components/admin/table/DataTabel";
import { Flex, Heading, Box, useColorModeValue, Button } from "@chakra-ui/react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);

  const getAttendance = () => {
    axios
      .get("http://localhost:5000/api/attendance/data")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAttendance();
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
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => handleReset(row.original.nip)}
            >
              Reset
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => handleDelete(row.original.nip)}
              ml={2}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Accounts
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

export default Dashboard;
