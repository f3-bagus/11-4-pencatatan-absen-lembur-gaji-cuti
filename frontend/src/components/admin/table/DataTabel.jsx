import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import {
  Flex,
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
      
      <TableContainer py="3" maxW="910px">
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



export default DataTable;
