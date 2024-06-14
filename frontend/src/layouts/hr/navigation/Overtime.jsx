import React from "react";
import HrLayout from "../HrLayout";
import {
  useColorModeValue,
  useDisclosure,
  Flex,
  Heading,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select
} from "@chakra-ui/react";
import DataTable from "../../../components/hr/table/DataTabel";
import { IoIosAddCircleOutline } from "react-icons/io";

const Overtime = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "nip",
        accessor: "nip",
      },
      {
        Header: "name",
        accessor: "name",
      },
      {
        Header: "division",
        accessor: "division",
      },
      {
        Header: "date",
        accessor: "date",
      },
      {
        Header: "hours",
        accessor: "hours",
      },
      {
        Header: "reasons",
        accessor: "reasons",
      },
      {
        Header: "status_overtime",
        accessor: "status_overtime",
      },
      {
        Header: "overtime_rate",
        accessor: "overtime_rate",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        nip: 33421312,
        name: "John Doe",
        division: "IT",
        date: "12-12-2024",
        hours: "3",
        reasons: "overtime",
        status_overtime: "attend",
        overtime_rate: "Rp. 100.000",
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Overtime
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <Button
            leftIcon={<IoIosAddCircleOutline size={25} />}
            mb={5}
            colorScheme="blue"
            onClick={onOpen}
          >
            Apply for Overtime
          </Button>

          <Modal
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "xs", md: "md", lg: "lg" }}
          >
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "green.900")}>
              <ModalHeader>Apply for Overtime</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Division</FormLabel>
                  <Select
                    ref={initialRef}
                    placeholder="Select division"
                    focusBorderColor="green.500"
                  >
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Accounting">Accounting</option>
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    placeholder="Enter date"
                    focusBorderColor="green.500"
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Hours</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter hours"
                    focusBorderColor="green.500"
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Overtime Rate</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter overtime rate"
                    focusBorderColor="green.500"
                  />
                </FormControl>

              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" mr={3}>
                  Submit
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <DataTable
            columns={columns}
            data={data}
            filename={"table_overtime"}
          />
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Overtime;
