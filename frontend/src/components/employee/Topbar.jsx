import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Center,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { SidebarNav } from "./SidebarNav";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const [nip, setNip] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNip = localStorage.getItem("nip");
    if (storedNip) {
      setNip(storedNip);
    }
  }, []);

  const handleLogout = async () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await logout();
          Swal.fire("Logged Out!", "You have been logged out.", "success");
          navigate("/");
        } catch (error) {
          console.error("Logout failed", error);
          Swal.fire("Error!", "There was a problem logging out.", "error");
        }
      }
    });
  };

  console.log("dari topbar");

  return (
    <>
      <Box w="full" h="full">
        <Flex h={10} alignItems={"center"} justifyContent={"space-between"}>
          <Button
            ref={btnRef}
            onClick={onOpen}
            display={{ base: "block", md: "none" }}
          >
            <MdMenu />
          </Button>
          <Box></Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? (
                  <FaMoon size={20} />
                ) : (
                  <FaSun size={20} />
                )}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={
                      ""
                    }
                    bgColor="gray.500"
                  />
                </MenuButton>
                <MenuList
                  alignItems={"center"}
                  bg={useColorModeValue("white", "green.900")}
                >
                  <br />
                  <Center>
                    <Avatar
                      size={"xl"}
                      src={
                        ""
                      }
                      bgColor="gray.500"
                    />
                  </Center>
                  <br />
                  <Center flexDirection="column">
                    <Text fontWeight="bold" fontSize="sm">
                      NIP :{" "}{nip}
                    </Text>
                    <Text color="gray.400" fontSize="md" fontWeight="bold">
                      Employee
                    </Text>
                  </Center>
                  <MenuDivider />
                  <MenuItem
                    bg={useColorModeValue("white", "green.900")}
                    _hover={{
                      bg: useColorModeValue("gray.100", "green.600"),
                    }}
                    onClick={() => {
                      navigate("/employee/profile");
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    as="button"
                    bg={useColorModeValue("white", "green.900")}
                    _hover={{
                      bg: useColorModeValue("gray.100", "green.600"),
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue("white", "green.900")}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading
              fontSize="2xl"
              color={colorMode === "light" ? "green.500" : "green.200"}
            >
              <Text as="span" fontStyle="italic">
                A
              </Text>
              bsentee
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <SidebarNav collapse={false} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
