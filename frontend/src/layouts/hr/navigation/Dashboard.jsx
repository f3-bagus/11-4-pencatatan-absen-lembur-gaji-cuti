import React, { useState, useEffect } from "react";
import HrLayout from "../HrLayout";
import { Flex, Stack, Box, Heading, useColorModeValue } from "@chakra-ui/react";
import { FaUserTie, FaUser } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import LemburChart from "../../../components/hr/chart/LemburChart";
import CutiChart from "../../../components/hr/chart/CutiChart";
import axios from "axios";

const Dashboard = () => {
  const [roleCounts, setRoleCounts] = useState({});

  const getData = () => {
    axios
      .get("http://localhost:5000/api/employee/data")
      .then((res) => {
        const employees = res.data.data;
        countRoles(employees);
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <HrLayout>
      <Flex direction="column" w="full" py="4">
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
                  Total Divisions
                </Heading>
                <Heading as="h1" size="lg">
                  4
                </Heading>
              </Stack>
              <Box bg="green.500" p="3" borderRadius="full">
                <RiTeamFill size={30} color="white" />
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
        </Stack>

        {/* Stack kedua dengan 2 kolom */}
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
