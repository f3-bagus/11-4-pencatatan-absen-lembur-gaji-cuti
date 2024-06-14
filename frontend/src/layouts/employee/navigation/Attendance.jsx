import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import EmployeeLayout from "../EmployeeLayout";
import {
  Box,
  Text,
  VStack,
  Flex,
  useColorModeValue,
  Image,
  Heading,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import noActivity from "../../../assets/img/paper.png";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Membersihkan interval saat komponen dilepas
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

  const handleClockIn = () => {
    setAttendanceData(true);
  };

  const handleClockOut = () => {
    Swal.fire({
      title: "Clock Out",
      text: "Are you sure you want to clock out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clock out!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Clocked Out!",
          "You have clocked out successfully.",
          "success"
        );
        // Add your clock out logic here
      }
    });
  };

  return (
    <EmployeeLayout>
      <Heading as="h1" size="xl" pt={5} px={5}>
        Live Attendance
      </Heading>
      <Flex w="full" p="5" direction={{ base: "column", md: "row" }} gap={5}>
        <Flex w="full" direction="column" gap={5}>
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
                09:00 - 17:00
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
        </Flex>

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
              Attendance Log
            </Heading>
          </VStack>
          {attendanceData ? (
            // if has data
            <VStack align="flex" px={3}>
              <HStack justifyContent="space-between">
                <Heading as="h6" size="sm">
                  09.00
                </Heading>
                <Heading as="h6" size="sm">
                  Clock in
                </Heading>
              </HStack>
              <Divider my={2} />
            </VStack>
          ) : (
            // if no data
            <VStack>
              <Image
                boxSize="150px"
                objectFit="cover"
                src={noActivity}
                alt="No Activity"
              />
              <Heading as="h6" size="sm">
                No attendance log today
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Your Clock In/Out activity will show up here.
              </Text>
            </VStack>
          )}
        </Box>
      </Flex>
    </EmployeeLayout>
  );
};

export default Attendance;
