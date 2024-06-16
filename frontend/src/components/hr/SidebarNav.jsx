import React from "react";
import { useLocation } from "react-router-dom";
import {
  ListIcon,
  Heading,
  Link as LinkChakra,
  Box,
  Text,
  List,
  ListItem,
  useColorModeValue
} from "@chakra-ui/react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { LuMonitorCheck } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";
import { PiAirplaneTilt } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";

const items = [
  {
    type: "link",
    label: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    path: "/hr",
  },
  {
    type: "header",
    label: "Employee",
  },
  {
    type: "link",
    label: "Attendance",
    icon: LuMonitorCheck,
    path: "/hr/attendance",
  },
  {
    type: "link",
    label: "Payroll",
    icon: AiOutlineDollarCircle,
    path: "/hr/payroll",
  },
  {
    type: "header",
    label: "Time Management",
  },
  {
    type: "link",
    label: "Overtime",
    icon: FaRegClock,
    path: "/hr/overtime",
  },
  {
    type: "link",
    label: "Leave",
    icon: PiAirplaneTilt,
    path: "/hr/leave",
  },
  {
    type: "header",
    label: "Report",
  },
  {
    type: "link",
    label: "Attendance",
    icon: TbReportAnalytics,
    path: "/hr/report/attendance",
  },
  {
    type: "link",
    label: "Overtime",
    icon: TbReportAnalytics,
    path: "/hr/report/overtime",
  },
  {
    type: "link",
    label: "All",
    icon: TbReportAnalytics,
    path: "/hr/report/all",
  },
];

const NavItem = ({ item, collapse }) => {
  const location = useLocation();
  const { label, icon, path, type } = item;
  const isActive = location.pathname === path;

  if (type === "link") {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        py={2}
      >
        <LinkChakra
          href={path}
          w="full"
          gap={2}
          display="flex"
          alignItems="center"
          fontWeight="medium"
          justifyContent={collapse ? "center" : ""}
          borderRadius={5}
          p="1"
          _hover={{ textDecoration: "none", color: "green.300" }}
          bg={isActive ? useColorModeValue("green.500", "green.900") : ""}
          color={isActive ? "white" : ""}
        >
          <ListIcon as={icon} fontSize={22} m="0" />
          {!collapse && <Text>{label}</Text>}
        </LinkChakra>
      </Box>
    );
  }

  return (
    <Heading
      color="gray.400"
      fontWeight="medium"
      textTransform="uppercase"
      fontSize="sm"
      borderTopWidth={1}
      borderColor="gray.200"
      pt={!collapse ? 3 : 0}
      my={2}
    >
      <Text display={!collapse ? "flex" : "none"}>{label}</Text>
    </Heading>
  );
};

export const SidebarNav = ({ collapse }) => {
  return (
    <List w="full" mt={{ base: 0, md: 8 }}>
      {items.map((item, index) => (
        <ListItem key={index}>
          <NavItem item={item} collapse={collapse} />
        </ListItem>
      ))}
    </List>
  );
};
