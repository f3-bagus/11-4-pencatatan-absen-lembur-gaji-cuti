import React, { useState, useEffect } from "react";
import HrLayout from "../HrLayout";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import {
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
  Text
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FileSaver from 'file-saver';
import axios from "axios";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<Icon as={FaSearch} color="gray.400" />}
        />
        <Input
          value={globalFilter || ""}
          onChange={(e) => {
            setGlobalFilter(e.target.value || undefined);
          }}
          placeholder={"Search....."}
          width="300px"
          borderRadius="full"
          focusBorderColor="green.500"
        />
      </InputGroup>
    </>
  );
}

const DataTable = ({ columns, data, filename }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.Header);
    const tableRows = data.map((row) =>
      columns.map((col) => row[col.accessor])
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(filename);
  };

  return (
    <>
      <Flex
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        flexDirection={{ base: "column", md: "row" }}
        mb="4"
        gap={2}
      >
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Flex>
          <Button colorScheme="red" size="sm" onClick={exportToPDF}>
            Export PDF
          </Button>
          <CSVLink
            data={data}
            headers={columns.map((col) => ({
              label: col.Header,
              key: col.accessor,
            }))}
            filename={filename}
          >
            <Button colorScheme="green" size="sm" ml="2">
              Export CSV
            </Button>
          </CSVLink>
        </Flex>
      </Flex>

      <TableContainer py="3" w="940px">
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderGroupProps } =
                headerGroup.getHeaderGroupProps();
              return (
                <Tr key={key} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...restHeaderProps } = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    return (
                      <Th key={key} {...restHeaderProps}>
                        {column.render("Header")}
                        {/* Add a sort direction indicator */}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              return (
                <Tr key={key} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <Td key={key} {...restCellProps}>
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems="center"
        flexDirection={{ base: "column", md: "row" }}
        gap={2}
      >
        <Stack direction="row" spacing={2}>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </Button>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </Button>
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>
        </Stack>
        <Stack direction="row" spacing={4} alignItems="center">
          <Box>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Box>
          <Box display={{ base: "none", md: "block" }}>
            | Go to page:{" "}
            <Input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
              focusBorderColor="green.500"
            />
          </Box>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            width="120px"
            focusBorderColor="green.500"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Stack>
      </Flex>
    </>
  );
};

const Leave = () => {
  const [leave, setLeave] = useState([]);

  const toast = useToast();

  const getDataLeave = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leave/data");
      console.log(response.data.data);
      setLeave(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataLeave();
  }, []);

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
        Header: "start date",
        accessor: "start_date",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "end date",
        accessor: "end_date",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "type",
        accessor: "type",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "reason",
        accessor: "reason",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "leave_letter",
        accessor: "leave_letter",
        Cell: ({ row }) => (
          <>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => handleDownload(row.original)}
            >
              Download
            </Button>
          </>
        ),
      },
      {
        Header: "status",
        accessor: "status_leave",
        Cell: ({ cell }) => (
          <Text textTransform="capitalize">{cell.value}</Text>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => handleAccept(row.original)}
            >
              Accept
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              ml={2}
              onClick={() => handleReject(row.original)}
            >
              Reject
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleReject = async (rowData) => {
    console.log("Rejecting leave for:", rowData);
    const { _id: leaveId } = rowData;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/reject/${leaveId}`
      );
      console.log(response.data);
      toast({
        position: "top-left",
        title: "Leave Rejected",
        description: "Leave has been rejected.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      getDataLeave();
    } catch (error) {
      console.error("Error reject leave:", error);
      toast({
        position: "top-left",
        title: "Error",
        description: "There was an error reject leave.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAccept = async (rowData) => {
    console.log("Accepting leave for:", rowData);
    const { _id: leaveId } = rowData;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/approve/${leaveId}`
      );
      console.log(response.data);

      toast({
        position: "top-left",
        title: "Leave Accepted",
        description: "Leave has been accepted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      getDataLeave();
    } catch (error) {
      console.error("Error accepting leave:", error);

      toast({
        position: "top-left",
        title: "Error",
        description: "There was an error accepting leave.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDownload = async (rowData) => {
    const { _id: leaveId } = rowData;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/employee/leave-letter/${leaveId}`,
        {
          responseType: 'blob', // Ensure the response is treated as a Blob
        }
      );
      console.log(response.data);
  
      // Create a new Blob object using the response data of the file
      const file = new Blob([response.data], {
        type: response.headers['content-type'],
      });
  
      // Use FileSaver to save the file
      FileSaver.saveAs(file, `leave-letter-${leaveId}.doc`);

      toast({
        position: "top-left",
        title: "File Downloaded",
        description: "Leave letter has been downloaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        position: "top-left",
        title: "Error",
        description: "There was an error downloading file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Leave
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <DataTable columns={columns} data={leave} filename={"table_leave"} />
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Leave;
