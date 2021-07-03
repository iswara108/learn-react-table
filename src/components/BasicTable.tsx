import * as React from "react";
import { useTable } from "react-table";
import styled from "styled-components";
import MOCK_DATA from "../MOCK_DATA.json";
import { COLUMNS, DataStructure } from "./columns";
import "./table.css";

const Styled = styled.div`
  .view {
    margin: auto;
    width: 600px;
  }

  .wrapper {
    position: relative;
    overflow: auto;
    border: 1px solid black;
    white-space: nowrap;
  }

  .sticky-col {
    position: -webkit-sticky;
    position: sticky;
  }

  table tbody tr:nth-child(odd) td.sticky-col {
    background-color: #fff;
  }

  table tbody tr:nth-child(even) td.sticky-col {
    background-color: #f2f2f2;
  }

  .first-col {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    left: 0px;
  }

  .second-col {
    width: 150px;
    min-width: 150px;
    max-width: 150px;
    left: 100px;
  }
`;

export const BasicTable = () => {
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => MOCK_DATA, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable<DataStructure>({ columns, data });

  return (
    <Styled>
      <div className='wrapper'>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className={
                      column.id === "id"
                        ? "sticky-col first-col"
                        : column.id === "first_name"
                        ? "sticky-col second-col"
                        : ""
                    }
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={
                        cell.column.id === "id"
                          ? "sticky-col first-col"
                          : cell.column.id === "first_name"
                          ? "sticky-col second-col"
                          : ""
                      }
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {footerGroups.map(footerGroup => (
              <tr {...footerGroup.getFooterGroupProps()}>
                {footerGroup.headers.map(column => (
                  <td
                    {...column.getFooterProps()}
                    className={
                      column.id === "id"
                        ? "sticky-col first-col"
                        : column.id === "first_name"
                        ? "sticky-col second-col"
                        : ""
                    }
                  >
                    {column.render("Footer")}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </Styled>
  );
};
