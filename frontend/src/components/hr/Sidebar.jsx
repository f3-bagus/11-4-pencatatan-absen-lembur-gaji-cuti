import React from "react";
import { Box, Heading, Text, useColorMode } from "@chakra-ui/react";
import { SidebarNav } from "./SidebarNav";

export const Sidebar = ({ collapse }) => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Box w="full">
        <Box display="flex" justifyContent="center">
          <Heading fontSize="2xl" color={colorMode === "light" ? "green.500" : "green.200"}>
            {!collapse ? (
              <>
                <Text as="span" fontStyle="italic">A</Text>bsentee
              </>
            ) : (
              <>
                <Text as="span" fontStyle="italic">A</Text>
              </>
            )}
          </Heading>
        </Box>
        <SidebarNav collapse={collapse}/>
      </Box>
    </>
  );
};
