import * as React from "react";
import { useTable, useBlockLayout } from "react-table";
import MOCK_DATA from "../MOCK_DATA.json";
import { COLUMNS, DataStructure } from "./columns";
import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

export const BasicTable = () => {
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => MOCK_DATA, []);

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<DataStructure>({ columns, data, defaultColumn }, useBlockLayout);

  return (
    <Styles>
      <div {...getTableProps()} className='table'>
        <div>
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className='tr'>
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps()} className='th'>
                  {column.render("Header")}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className='tr'>
                {row.cells.map(cell => {
                  return (
                    <div {...cell.getCellProps()} className='td'>
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Styles>
  );
};
