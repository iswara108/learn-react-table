import * as React from "react";
import { useTable, useRowSelect, UseRowSelectRowProps } from "react-table";
import MOCK_DATA from "../MOCK_DATA.json";
import { Checkbox } from "./Checkbox";
import { COLUMNS, DataStructure } from "./columns";
import "./table.css";

export const RowSelection = () => {
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => MOCK_DATA, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    selectedFlatRows,
    prepareRow,
  } = useTable<DataStructure>({ columns, data }, useRowSelect, hooks => {
    hooks.visibleColumns.push(columns => {
      return [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }: { row: UseRowSelectRowProps<DataStructure> }) => (
            <Checkbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ];
    });
  });

  const first10Rows = rows.slice(0, 10);
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {first10Rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {footerGroups.map(footerGroup => (
            <tr {...footerGroup.getFooterGroupProps()}>
              {footerGroup.headers.map(column => (
                <td {...column.getFooterProps()}>{column.render("Footer")}</td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <pre>
        <code>
          {JSON.stringify(
            { selectedFlatRows: selectedFlatRows.map(row => row.original) },
            null,
            2
          )}
        </code>
      </pre>
    </>
  );
};
