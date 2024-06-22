import React, { useState, useEffect } from "react";
import HrLayout from "../HrLayout";
import {
  Flex,
  Stack,
  Box,
  Heading,
  useColorModeValue,
  Text,
  Image
} from "@chakra-ui/react";
import images from "../../../assets/img/images-2.png";
import LemburChart from "../../../components/hr/chart/LemburChart";
import CutiChart from "../../../components/hr/chart/CutiChart";
import axios from "axios";
import { BASE_URL } from "../../../api/BASE_URL";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [totalEmp, setTotalEmp] = useState("");
  const [totalDiv, setTotalDiv] = useState(0);

  const getProfile = () => {
    axios
      .get(`${BASE_URL}/api/user/profile`)
      .then((res) => {
        setName(res.data.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDataDashboard = () => {
    axios
      .get(`${BASE_URL}/api/hr/dashboard/data`)
      .then((res) => {
        const data = res.data;
        setTotalEmp(data.total_employee);
        setTotalDiv(data.total_division.length);
      })
      .catch((err) => {
        console.log(err);
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
    <HrLayout>
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
            <Image w="240px" objectFit="cover" src="https://ouch-cdn2.icons8.com/I0J_kDgKZS42GOt-7PZ1wqDRPpBBFXgnEZ5o_jFM3a0/rs:fit:368:319/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODU2/LzhhYTE0ZmJlLTM1/NGEtNGIyZS05NzQz/LTA5NGJjZTA5ZjYw/Yi5zdmc.png" alt="Dan Abramov" />
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
              Overtime Overview
            </Heading>
            <LemburChart />
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
              Leave Overview
            </Heading>
            <CutiChart />
          </Box>
        </Stack>
      </Flex>
    </HrLayout>
  );
};

export default Dashboard;
