import React, { useState } from "react";
import { Flex, HStack, Button, Text, useColorModeValue } from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";
import { Sidebar } from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const AdminLayout = ({children}) => {
  const [collapse, setCollapse] = useState(false);

  return (
    <HStack w="full" h="100vh" bg={useColorModeValue("gray.100", "green.900")} padding={6}>
      {/* Sidebar */}
      <Flex
        as="aside"
        w={collapse ? "0" : "250px"}
        h="full"
        bg={useColorModeValue("white", "green.800")}
        alignItems="center"
        justifyContent="space-between"
        padding={6}
        flexDirection="column"
        borderRadius="2xl"
        transition="width 0.4s ease"
        display={{ base: "none", md: "block" }}
      >
        <Sidebar collapse={collapse} />
      </Flex>

      <Flex w="full" h="full" flexDirection="column" gap={2}>

        {/* Header */}
        <Flex
          as="header"
          w="full"
          bg={useColorModeValue("white", "green.800")}
          alignItems="center"
          padding={4}
          borderRadius="2xl"
        >
          <Button
            display={{ base: "none", md: "block" }}
            aria-label="Menu Collapse"
            onClick={() => setCollapse(!collapse)}
          ><MdMenu /></Button>
          <Topbar/>
        </Flex>

        {/* Main */}
        <Flex
          as="main"
          w="full"
          h="full"
          bg={useColorModeValue("white", "green.800")}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="2xl"
          overflow="scroll"
        >
          <Text fontSize={100} color="gray.500">
            {children}
          </Text>
        </Flex>

      </Flex>
    </HStack>
  );
};

export default AdminLayout;
