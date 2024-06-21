import React, { useState, useEffect } from "react";
import EmployeeLayout from "../EmployeeLayout";
import {
  Flex,
  Stack,
  Box,
  Heading,
  useColorModeValue,
  Text,
  Image,
} from "@chakra-ui/react";
import images from "../../../assets/img/images-2.png";
import GajiChart from "../../../components/employee/chart/GajiChart";
import AbsenChart from "../../../components/employee/chart/AbsenChart";
import axios from "axios";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [remainingLeave, setRemainingLeave] = useState("");
  const [totalHours, setTotalHours] = useState("");

  const getProfile = () => {
    axios
      .get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/user/profile"
      )
      .then((res) => {
        setName(res.data.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDataDashboard = () => {
    axios
      .get(
        "https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/employee/dashboard/data"
      )
      .then((res) => {
        setRemainingLeave(res.data.remaining_leave);
        setTotalHours(res.data.total_hours);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const determineGreeting = (date) => {
    const hours = date.getHours();
    if (hours < 10) return "Good Morning";
    if (hours < 15) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    getProfile();
    getDataDashboard();

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

  return (
    <EmployeeLayout>
      <Flex direction="column" w="full" py="4" px="4">
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
                  Remaining <br /> Leave
                </Heading>
                <Box p="3" borderRadius="full">
                  <Heading as="h1" size="xl">
                    {remainingLeave}
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
                    {totalHours}
                  </Heading>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Box w="full" px="3" align="right">
            <Image w="250px" objectFit="cover" src="https://ouch-cdn2.icons8.com/uZVLKzsyMULqmJtzTut9qmDdScFq23wXiVEMtduHr2k/rs:fit:368:319/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvOTM1/LzRlNmM4Y2M5LTM5/YzktNDIyMy04Mjgz/LWY2YTg3MWY4NTVh/MC5zdmc.png" alt="Dan Abramov" />
          </Box>
        </Stack>

        {/* Stack grafik */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing="24px"
          w="full"
          px="2"
        >
          <Box
            w="full"
            h="auto"
            bg={useColorModeValue("white", "green.800")}
            borderRadius="2xl"
            shadow="lg"
            p="3"
          >
            <Heading as="h1" size="sm" mb={6}>
              Monthly Payroll Overview
            </Heading>
            <GajiChart />
          </Box>
          <Box
            w="full"
            h="auto"
            bg={useColorModeValue("white", "green.800")}
            borderRadius="2xl"
            shadow="lg"
            p="3"
          >
            <Heading as="h1" size="sm" mb={6}>
              Attendance Overview
            </Heading>
            <AbsenChart />
          </Box>
        </Stack>
      </Flex>
    </EmployeeLayout>
  );
};

export default Dashboard;
