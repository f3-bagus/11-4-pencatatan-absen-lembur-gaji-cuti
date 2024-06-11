import React from "react";
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
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

const DataTable = ({ columns, data }) => {
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

    doc.save("table_attendance.pdf");
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
        <Flex >
          <Button colorScheme="red" size="sm" onClick={exportToPDF}>
            Export PDF
          </Button>
          <CSVLink
            data={data}
            headers={columns.map((col) => ({
              label: col.Header,
              key: col.accessor,
            }))}
            filename={"table_attendance.csv"}
          >
            <Button colorScheme="green" size="sm" ml="2">
              Export CSV
            </Button>
          </CSVLink>
        </Flex>
      </Flex>

      <TableContainer py="3">
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  ))}
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

const Attedance = () => {
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
        Header: "check_in",
        accessor: "check_in",
      },
      {
        Header: "check_out",
        accessor: "check_out",
      },
      {
        Header: "date",
        accessor: "date",
      },
      {
        Header: "status",
        accessor: "status",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        nip: 33421312,
        name: "John Doe",
        check_in: "09.00",
        check_out: "17.00",
        date: "12-12-2024",
        status: "attend",
      },
      {
        nip: 33421312,
        name: "Emily Johnson",
        check_in: "09.00",
        check_out: "17.00",
        date: "12-12-2024",
        status: "attend",
      },
    ],
    []
  );

  return (
    <HrLayout>
      <Flex w="full" p="5" direction="column" gap={5}>
        <Heading as="h1" size="xl">
          Attendance
        </Heading>
        <Box
          bg={useColorModeValue("white", "green.800")}
          p="3"
          borderRadius="2xl"
          shadow="lg"
        >
          <DataTable columns={columns} data={data} />
        </Box>
      </Flex>
    </HrLayout>
  );
};

export default Attedance;
