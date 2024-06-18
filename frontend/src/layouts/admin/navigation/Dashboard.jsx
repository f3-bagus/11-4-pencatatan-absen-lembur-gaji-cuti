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
  Image,
} from "@chakra-ui/react";
import images from "../../../assets/img/images-3.png";
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
    if (hours < 10) return "Good Morning";
    if (hours < 15) return "Good Afternoon";
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
        Header: "Type",
        accessor: "type",
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
      <Flex direction="column" w="full" py="4" px="4">
        {/* Greeting Box */}
        <Stack
          direction={{ base: "column", md: "row" }}
          w="full"
          borderRadius="2xl"
          shadow="lg"
          p="3"
          bg={useColorModeValue("white", "green.800")}
          mb="4"
          px="2"
        >
          <Box w="full" px="3" flexDirection="column">
            <Heading as="h1" size="lg" mb={1}>
              {greeting}, {name}
            </Heading>
            <Text color="gray.500" mb={8}>
              It's {formatDate(currentTime)}
            </Text>
            <Stack
              direction={{ base: "column", md: "row" }}
              mb={3}
              align="center"
            >
              <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                borderRadius="full"
                shadow="lg"
                px={5}
                marginRight={{ base: 0, md: 5 }}
                bg={useColorModeValue("white", "green.700")}
                w="250px"
              >
                <Heading as="h1" size="sm" color="gray.400">
                  Remaining <br /> Leave
                </Heading>
                <Box p="3" borderRadius="full">
                  <Heading as="h1" size="xl">
                    123
                  </Heading>
                </Box>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                borderRadius="full"
                shadow="lg"
                px={5}
                bg={useColorModeValue("white", "green.700")}
                w="250px"
              >
                <Heading as="h1" size="sm" color="gray.400">
                  Total Overtime
                  <br /> Hours
                </Heading>
                <Box p="3" borderRadius="full">
                  <Heading as="h1" size="xl">
                    123
                  </Heading>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box w="full" px="3" align="right">
            <Image w="180px" objectFit="cover" src={images} alt="Dan Abramov" />
          </Box>
        </Stack>

        {/* Stack pertama dengan 3 kolom */}
        {/* <Stack
          direction={{ base: "column", md: "row" }}
          w="full"
          borderRadius="2xl"
          shadow="lg"
          p="3"
          bg={useColorModeValue("white", "green.800")}
          mb="4"
          px="2"
        >
          <Box w="full" px="3" flexDirection="column">
            <Heading as="h1" size="lg" mb={1}>
              {greeting}, {name}
            </Heading>
            <Text color="gray.500" mb={8}>
              It's {formatDate(currentTime)}
            </Text>
            <Stack
              direction={{ base: "column", md: "row" }}
              mb={3}
              align="center"
            >
              <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                borderRadius="full"
                shadow="lg"
                px={5}
                marginRight={{ base: 0, md: 5 }}
                bg={useColorModeValue("white", "green.700")}
                w="250px"
              >
                <Heading as="h1" size="sm" color="gray.400">
                  Total <br /> Employees
                </Heading>
              </Stack>
            </Stack>
          </Box>

          <Box w="full" px="3" align="right">
            <Image w="250px" objectFit="cover" src={images} alt="Dan Abramov" />
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
        </Stack> */}

        {/* Attendance DataTable */}
        {/* <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
          mt="5"
        >
          <DataTable columns={columns} data={data} filename={"table_attendance"} />
        </Box> */}
      </Flex>
    </AdminLayout>
  );
};

export default Dashboard;
