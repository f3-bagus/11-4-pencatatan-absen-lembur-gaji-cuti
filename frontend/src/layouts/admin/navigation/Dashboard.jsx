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
import DivisiChart from "../../../components/admin/chart/DivisiChart";
import TypeChart from "../../../components/admin/chart/TypeChart";
import { BASE_URL } from "../../../api/BASE_URL";

const Dashboard = () => {
  const [totalEmp, setTotalEmp] = useState("");
  const [totalDiv, setTotalDiv] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");

  const determineGreeting = (date) => {
    const hours = date.getHours();
    if (hours < 10) return "Good Morning";
    if (hours < 15) return "Good Afternoon";
    return "Good Evening";
  };

  const getProfile = () => {
    axios
      .get(
        `${BASE_URL}/api/user/profile`
      )
      .then((res) => {
        setName(res.data.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData = () => {
    axios
      .get(
        `${BASE_URL}/api/admin/dashboard/data`
      )
      .then((res) => {
        setTotalEmp(res.data.total_employee);
        setTotalDiv(res.data.total_division.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProfile();
    getData();

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
            <Image
              w="240px"
              objectFit="cover"
              src="https://ouch-cdn2.icons8.com/I0J_kDgKZS42GOt-7PZ1wqDRPpBBFXgnEZ5o_jFM3a0/rs:fit:368:319/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODU2/LzhhYTE0ZmJlLTM1/NGEtNGIyZS05NzQz/LTA5NGJjZTA5ZjYw/Yi5zdmc.png"
              alt="Dan Abramov"
            />
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
              Employment Type
            </Heading>
            <TypeChart />
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
              Member Each Division
            </Heading>
            <DivisiChart />
          </Box>
        </Stack>
      </Flex>
    </AdminLayout>
  );
};

export default Dashboard;
