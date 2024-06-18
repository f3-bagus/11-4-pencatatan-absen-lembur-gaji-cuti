import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import {
  useColorMode,
  useColorModeValue,
  Flex,
  useToast,
  Heading,
  Box,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Select,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FileSaver from "file-saver";
import axios from "axios";

const Reset = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();

  return (
    <AdminLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Reset Account
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList mb="1em" flexDirection={{ base: "column", md: "row" }}>
              <Tab color={colorMode === "light" ? "" : "white"}>Pending</Tab>
              <Tab color={colorMode === "light" ? "" : "white"}>
                Approved/Rejected
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* <DataTable
                  columns={pendingColumns}
                  data={pending}
                  filename={"pending_leave_report"}
                /> */}
              </TabPanel>
              <TabPanel>
                {/* <DataTable
                  columns={rejectColumns}
                  data={leave}
                  filename={"rejected_leave_report"}
                /> */}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </AdminLayout>
  );
};

export default Reset;
