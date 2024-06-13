import React from "react";
import HrLayout from "../HrLayout";
import {
  Flex,
  Stack,
  Box,
  Heading,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { FaUserTie, FaUser } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { MdMenu } from "react-icons/md";
import LemburChart from "../../../components/hr/chart/LemburChart";
import CutiChart from "../../../components/hr/chart/CutiChart";

const Dashboard = () => {
  return (
    <HrLayout>
      <Flex direction="column" w="full" py="4">
        {/* Stack pertama dengan 3 kolom */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing="24px"
          w="full"
          //p="4"
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
                  100
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
                  50
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
                  5
                </Heading>
              </Stack>
              <Box bg="green.500" p="3" borderRadius="full">
                <RiTeamFill size={30} color="white" />
              </Box>
            </Stack>
          </Box>
        </Stack>

        {/* Stack kedua dengan 2 kolom */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing="24px"
          w="full"
          // px="4"
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
            <Stack direction="row" justifyContent="space-between">
              <Heading as="h1" size="sm" mb={6}>
                Overtime Overview
              </Heading>
              {/* <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<MdMenu />}
                  variant="outline"
                />
                <MenuList>
                  <MenuItem>
                    Day
                  </MenuItem>
                  <MenuItem>
                    Month
                  </MenuItem>
                </MenuList>
              </Menu> */}
            </Stack>
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
            <Stack direction="row" justifyContent="space-between">
              <Heading as="h1" size="sm" mb={6}>
                Leave Overview
              </Heading>
              {/* <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<MdMenu />}
                  variant="outline"
                />
                <MenuList>
                  <MenuItem>
                    Day
                  </MenuItem>
                  <MenuItem>
                    Month
                  </MenuItem>
                </MenuList>
              </Menu> */}
            </Stack>
            <CutiChart />
          </Box>
        </Stack>
      </Flex>
    </HrLayout>
  );
};

export default Dashboard;
