import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import EmployeeLayout from "../EmployeeLayout";
import {
  Box,
  Text,
  VStack,
  Flex,
  useColorModeValue,
  Heading,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import DataTable from "../../../components/employee/table/DataTabel";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    getDataAttendance();

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimeToHHMM = (timeString) => {
    if (!timeString) return "-";
    const date = new Date(`1970-01-01T${timeString}Z`);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDateApi = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const getDataAttendance = async () => {
    try {
      const response = await axios.get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/employee/attendance"
      );
      setAttendance(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClockIn = async () => {
    try {
      const response = await axios.post(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/attendance/clock-in"
      );
      Swal.fire("Clocked In!", response.data.message, "success").then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire("Error!", error.response.data.message, "error");
    }
  };

  const handleClockOut = async () => {
    Swal.fire({
      title: "Clock Out",
      text: "Are you sure you want to clock out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clock out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/attendance/clock-out"
          );
          Swal.fire("Clocked Out!", response.data.message, "success").then(
            () => {
              window.location.reload();
            }
          );
        } catch (error) {
          Swal.fire("Error!", error.response.data.message, "error");
        }
      }
    });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "clock in",
        accessor: "clock_in",
        Cell: ({ cell }) => (
          <Text>
            {cell.value === null ? "-" : formatTimeToHHMM(cell.value)}
          </Text>
        ),
      },
      {
        Header: "clock out",
        accessor: "clock_out",
        Cell: ({ cell }) => (
          <Text>
            {cell.value === null ? "-" : formatTimeToHHMM(cell.value)}
          </Text>
        ),
      },
      {
        Header: "date",
        accessor: "date",
      },
      {
        Header: "status",
        accessor: "status_attendance",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
    ],
    []
  );

  return (
    <EmployeeLayout>
      <Flex w="full" px="5" py="5" direction="column" gap={5}>
          <Heading as="h1" size="xl">
            Live Attendance
          </Heading>
          <Box
            w="full"
            borderRadius="2xl"
            boxShadow="lg"
            bg={useColorModeValue("white", "green.800")}
            p={5}
          >
            <VStack>
              <Heading as="h2" size="lg">
                {formatTime(currentTime)}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {formatDate(currentTime)}
              </Text>
            </VStack>
            <Divider my={2} />
            <VStack py={5}>
              <Text fontSize="sm" color="gray.500">
                Schedule, {formatDate(currentTime)}
              </Text>
              <Heading as="h1" size="xl">
                06:30 - 16:30
              </Heading>
            </VStack>
            <HStack justify="space-around">
              <Button w="full" colorScheme="green" onClick={handleClockIn}>
                Clock In
              </Button>
              <Button w="full" colorScheme="green" onClick={handleClockOut}>
                Clock Out
              </Button>
            </HStack>
          </Box>
          {/* Attendance Log */}
          <Box
            w="full"
            borderRadius="2xl"
            boxShadow="lg"
            bg={useColorModeValue("white", "green.800")}
            p={5}
          >
            <VStack align="flex-start" mb={8}>
              <Heading as="h2" size="md">
                Attendance History
              </Heading>
            </VStack>
            <DataTable
              columns={columns}
              data={attendance}
              filename={"attendance_history"}
            />
          </Box>
        </Flex>
    </EmployeeLayout>
  );
};

export default Attendance;
