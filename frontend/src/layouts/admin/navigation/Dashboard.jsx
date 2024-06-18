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
  Image,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import images from "../../../assets/img/images-4.png";
import { FaUserTie, FaUser } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import axios from "axios";

const Dashboard = () => {
  const [roleCounts, setRoleCounts] = useState({});
  const [totalDiv, setTotalDiv] = useState(0);
  const [totalEmp, setTotalEmp] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedNip, setSelectedNip] = useState(null);

  const getDataDashboard = () => {
    axios
      .get("http://localhost:5000/api/admin/dashboard/data")
      .then((res) => {
        const data = res.data;
        setTotalEmp(data.total_employee)
        setTotalDiv(data.total_division.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
    getDataDashboard();
  }, []);

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
    axios
      .post(`http://localhost:5000/api/employee/reset-password`, { nip })
      .then((response) => {
        console.log(`Password reset for NIP: ${nip}`);
        alert(`Password reset link sent to email associated with NIP: ${nip}`);
      })
      .catch((error) => {
        console.error(`Error resetting password for NIP: ${nip}`, error);
        alert(`Error resetting password for NIP: ${nip}`);
      });
  };

  const handleDelete = (nip) => {
    setSelectedNip(nip);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:5000/api/employee/${selectedNip}`)
      .then((response) => {
        console.log(`Deleted employee with NIP: ${selectedNip}`);
        setIsDeleteAlertOpen(false);
        setSelectedNip(null);
        getData();
      })
      .catch((error) => {
        console.error(`Error deleting employee with NIP: ${selectedNip}`, error);
        setIsDeleteAlertOpen(false);
        setSelectedNip(null);
      });
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
      <Flex direction="column" w="full" py="4">
        {/* Stack pertama dengan 3 kolom */}
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
                  Total <br /> Employees
                </Heading>
                <Box p="3" borderRadius="full">
                  <Heading as="h1" size="xl">
                    {totalEmp}
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
                  Total 
                  <br /> Division
                </Heading>
                <Box p="3" borderRadius="full">
                  <Heading as="h1" size="xl">
                    {totalDiv}
                  </Heading>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box w="full" px="3" align="right">
            <Image w="250px" objectFit="cover" src={images} alt="Dan Abramov" />
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

      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this account?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsDeleteAlertOpen(false)}>No</Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Dashboard;
