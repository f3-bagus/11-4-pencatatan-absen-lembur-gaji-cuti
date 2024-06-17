import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import DataTable from "../../../components/admin/table/DataTabel";
import {
  Flex,
  Stack,
  Box,
  Heading,
  useColorModeValue,
  Text,
  Button,
} from "@chakra-ui/react";
import { FaUserTie, FaUser } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import axios from "axios";

const Dashboard = () => {
  const [roleCounts, setRoleCounts] = useState({});
  const [totalDivisions, setTotalDivisions] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");


  const determineGreeting = (date) => {
    const hours = date.getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const getProfile = () => {
    axios
      .get("http://localhost:5000/api/user/profile")
      .then((res) => {
        setName(res.data.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = () => {
    axios
      .get("http://localhost:5000/api/employee/data")
      .then((res) => {
        const employees = res.data.data;
        countRoles(employees);
        countDivisions(employees);
        console.log(employees);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const countRoles = (employees) => {
    const counts = employees.reduce((acc, employee) => {
      acc[employee.role] = (acc[employee.role] || 0) + 1;
      return acc;
    }, {});
    setRoleCounts(counts);
  };

  const countDivisions = (employees) => {
    const divisions = employees.reduce((acc, employee) => {
      acc.add(employee.division);
      return acc;
    }, new Set());
    setTotalDivisions(divisions.size);
  };

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
    getProfile();

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setGreeting(determineGreeting(now));
    }, 1000); 

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    getData();
    getAttendance();

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setGreeting(determineGreeting(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleReset = (nip) => {
    // Logic to handle reset action
    console.log(`Reset clicked for NIP: ${nip}`);
  };

  const handleDelete = (nip) => {
    // Logic to handle delete action
    console.log(`Delete clicked for NIP: ${nip}`);
  };

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
      <Flex direction="column" w="full" py="4">
        {/* Greeting Box */}
        <Box
          w="full"
          bg={useColorModeValue("white", "green.800")}
          borderRadius="2xl"
          shadow="lg"
          p="3"
          mb="4"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="column">
              <Heading as="h1" size="xl">
                {greeting}, {name}
              </Heading>
              <Text color="gray.500">
                {formatDate(currentTime)}
              </Text>
            </Stack>
          </Stack>
        </Box>

        {/* Stack pertama dengan 3 kolom */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing="24px"
          w="full"
          mb="4"
          px="2"
        >
          <Box
            w="full"
            h="100px"
            bg={useColorModeValue("white", "green.800")}
            borderRadius="2xl"
            shadow="lg"
            p="3"
          >
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Stack direction="column">
                <Heading as="h1" size="sm" color="gray.400">
                  Total Employees
                </Heading>
                <Heading as="h1" size="lg">
                  {roleCounts.employee || 0}
                </Heading>
              </Stack>
              <Box bg="green.500" p="3" borderRadius="full">
                <FaUser size={30} color="white" />
              </Box>
            </Stack>
          </Box>
          <Box
            w="full"
            h="100px"
            bg={useColorModeValue("white", "green.800")}
            borderRadius="2xl"
            shadow="lg"
            p="3"
          >
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Stack direction="column">
                <Heading as="h1" size="sm" color="gray.400">
                  Total Managers
                </Heading>
                <Heading as="h1" size="lg">
                  {roleCounts.manager || 0}
                </Heading>
              </Stack>
              <Box bg="green.500" p="3" borderRadius="full">
                <FaUserTie size={30} color="white" />
              </Box>
            </Stack>
          </Box>
          <Box
            w="full"
            h="100px"
            bg={useColorModeValue("white", "green.800")}
            borderRadius="2xl"
            shadow="lg"
            p="3"
          >
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Stack direction="column">
                <Heading as="h1" size="sm" color="gray.400">
                  Total Divisions
                </Heading>
                <Heading as="h1" size="lg">
                  {totalDivisions}
                </Heading>
              </Stack>
              <Box bg="green.500" p="3" borderRadius="full">
                <RiTeamFill size={30} color="white" />
              </Box>
            </Stack>
          </Box>
        </Stack>

        {/* Attendance DataTable */}
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
          mt="5"
        >
          <DataTable columns={columns} data={data} filename={"table_attendance"} />
        </Box>
      </Flex>
    </AdminLayout>
  );
};

export default Dashboard;
