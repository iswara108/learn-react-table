import * as React from "react";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder,
} from "react-table";
import MOCK_DATA from "../MOCK_DATA.json";
import { COLUMNS, DataStructure } from "./columns";
import styled from "styled-components/macro";
import {
  DragDropContext,
  Draggable,
  DragUpdate,
  Droppable,
} from "react-beautiful-dnd";

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

const DraggableColumn = styled.div<{ isDragging: boolean }>`
  background-color: ${({ isDragging }) =>
    isDragging ? "lightGreen" : "white"};
`;

const DroppableContainer = styled.div``;

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

  const currentColumnOrder = React.useRef<string[]>([]);

  const onDragUpdate = ({ destination, source, draggableId }: DragUpdate) => {
    const newColumnOrder = currentColumnOrder.current.slice();
    const sIndex = source.index;
    const dIndex = destination && destination.index;

    if (typeof sIndex === "number" && typeof dIndex === "number") {
      newColumnOrder.splice(sIndex, 1);
      newColumnOrder.splice(dIndex, 0, draggableId);
      setColumnOrder(newColumnOrder);
    }
  };

  const onDragStart = () =>
    (currentColumnOrder.current = state.columnOrder.length
      ? state.columnOrder
      : visibleColumns.map(c => c.id));

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragUpdate}
    >
      <Styles>
        <Droppable droppableId='all-columns' direction='horizontal'>
          {provided => (
            <DroppableContainer
              {...getTableProps()}
              className='table'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className='thead'>
                {headerGroups.map(headerGroup => (
                  <div {...headerGroup.getHeaderGroupProps()} className='tr'>
                    {headerGroup.headers.map((column, i) => (
                      <Draggable
                        key={column.id}
                        draggableId={column.id}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <DraggableColumn
                            isDragging={snapshot.isDragging}
                            {...column.getHeaderProps()}
                            className='th'
                          >
                            <div
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                ...(!snapshot.isDragging && {
                                  transform: "",
                                }),
                              }}
                              ref={provided.innerRef}
                            >
                              {column.render("Header")}
                              {/* Use column.getResizerProps to hook up the events correctly */}
                              <div
                                {...column.getResizerProps()}
                                className={`resizer ${
                                  column.isResizing ? "isResizing" : ""
                                }`}
                              />
                            </div>
                          </DraggableColumn>
                        )}
                      </Draggable>
                    ))}
                  </div>
                ))}
              </div>

              <div className='tbody' {...getTableBodyProps()}>
                {rows.map(row => {
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
              {provided.placeholder}
            </DroppableContainer>
          )}
        </Droppable>

        <pre>
          <code>{JSON.stringify(state, null, 2)}</code>
          {/* {visibleColumns} */}
        </pre>
      </Styles>
    </DragDropContext>
  );
};
