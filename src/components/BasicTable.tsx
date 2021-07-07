import * as React from "react";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder,
} from "react-table";
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

      ${
        "" /* In this example we use an absolutely position resizer,
       so this is required. */
      }
      position: relative;
      :last-child {
        border-right: 0;
      }
      .resizer {
        display: inline-block;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${"" /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;
        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

export const BasicTable = () => {
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => MOCK_DATA, []);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder,
    visibleColumns,
    state,
  } = useTable<DataStructure>(
    { columns, data, defaultColumn },
    useBlockLayout,
    useResizeColumns,
    useColumnOrder
  );

  return (
    <Styles>
      <button
        onClick={() => {
          setColumnOrder([
            "id",
            "last_name",
            "first_name",
            "country",
            "date_of_birth",
            "phone",
            "age",
            "email",
          ]);
        }}
      >
        Set column order
      </button>
      <div {...getTableProps()} className='table'>
        <div>
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className='tr'>
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps()} className='th'>
                  {column.render("Header")}
                  {/* Use column.getResizerProps to hook up the events correctly */}
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? "isResizing" : ""
                    }`}
                  />
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
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
        {/* {visibleColumns} */}
      </pre>
    </Styles>
  );
};
