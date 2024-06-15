import React, { useState } from "react";
import { Flex, HStack, useColorModeValue } from "@chakra-ui/react";
import { Sidebar } from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const AdminLayout = ({ children }) => {
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
          <Topbar />
        </Flex>

        {/* Main */}
        <Flex
          as="main"
          w="full"
          h="full"
          flexDirection="column" // Changed to column for proper layout
          bg={useColorModeValue("gray.100", "green.900")}
          borderRadius="2xl"
          overflow="scroll"
          p={6} // Added padding for content spacing
        >
          {children} {/* Render children component */}
        </Flex>

      </Flex>
    </HStack>
  );
};

export default AdminLayout;
