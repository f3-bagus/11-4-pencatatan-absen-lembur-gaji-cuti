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
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
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

const Reset = () => {
  const [data, setData] = useState([]);
  const { colorMode } = useColorMode();
  const toast = useToast();

  const getDataAll = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/data");
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataAll();
  }, []);

  const dataColumns = React.useMemo(
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
        Header: "role",
        accessor: "role",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            <Button
              colorScheme="yellow"
              size="sm"
              onClick={() => handleReset(row.original)}
            >
              Reset
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const handleReset = async (rowData) => {
    console.log("Accepting data for:", rowData);
    const { nip: nip } = rowData;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/reset-password/${nip}`
      );
      console.log(response.data);

      toast({
        position: "top-left",
        title: "User Account Reseted",
        description: "User password reset to default successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      getDataAll();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        position: "top-left",
        title: "Error",
        description: "Error reseted user account.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
          <DataTable
            columns={dataColumns}
            data={data}
          />
        </Box>
      </Flex>
    </AdminLayout>
  );
};

export default Reset;
