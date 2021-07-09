import * as React from "react";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder,
  useSortBy,
  HeaderGroup,
} from "react-table";
import MOCK_DATA from "../MOCK_DATA.json";
import { COLUMNS, DataStructure } from "./columns";
import styled from "styled-components/macro";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
  Droppable,
} from "react-beautiful-dnd";

const TableBody = styled.div``;

const TableHead = styled.div`
  ${
    "" /* In this example we use an absolutely position resizer,
 so this is required. */
  }
  position: relative;
  :last-child {
    border-right: 0;
  }
`;

const TableHeadRow = styled.div`
  border-bottom: 1px solid black;
`;

const StyledColumn = styled.div<{ isDragging: boolean }>`
  ${({ isDragging }) => isDragging && "background-color: #eee;"}
`;

const Column = ({
  snapshot,
  provided,
  column,
  setIsResizing,
}: {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  column: HeaderGroup<DataStructure>;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [onHover, setOnHover] = React.useState(false);
  return (
    <StyledColumn
      isDragging={snapshot.isDragging}
      className='th'
      {...column.getHeaderProps(column.getSortByToggleProps())}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <Heading
        isDragging={snapshot.isDragging}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
        ref={provided.innerRef}
      >
        {column.render("Header")}
        {/* Use column.getResizerProps to hook up the events correctly */}
        <Resizer
          {...column.getResizerProps()}
          onMouseEnter={() => setIsResizing(true)}
          onMouseLeave={() => setIsResizing(false)}
        />
        <SortIcon
          isSorted={column.isSorted}
          isSortedDesc={column.isSortedDesc}
          onHover={onHover}
        ></SortIcon>
      </Heading>
    </StyledColumn>
  );
};

const Heading = styled.div<{ isDragging: boolean }>`
  ${({ isDragging }) => !isDragging && "transform: inherit !important;"}
  background-color: ${({ isDragging }) =>
    isDragging ? "lightYellow" : "white"};
  padding: 0.5rem;
  border-radius: 0.4rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const DroppableContainer = styled.div`
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

  .td {
    padding: 0.5rem;
    margin: 0;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    :last-child {
      border-right: 0;
    }
  }
`;

const SortIcon = ({
  isSorted,
  isSortedDesc,
  onHover,
}: {
  isSorted: boolean;
  isSortedDesc: boolean | undefined;
  onHover: boolean;
}) => {
  return (
    <span>
      {(onHover || isSorted) && (
        <SortIconComponent
          className='MuiSvgIcon-root MuiDataGrid-sortIcon MuiSvgIcon-fontSizeSmall'
          focusable='false'
          viewBox='0 0 24 24'
          aria-hidden='true'
          hint={!isSorted && onHover}
          up={!!isSortedDesc}
        >
          <path d='M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z'></path>
        </SortIconComponent>
      )}{" "}
    </span>
  );
};

const SortIconComponent = styled.svg<{ hint: boolean; up: boolean }>`
  width: 1em;
  height: 1em;
  color: ${({ hint }) => (hint ? "#ddd" : "black")};
  fill: currentColor;
  transform: rotate(${({ up }) => (up ? 0 : 180)}deg);
`;

const ResizerComponent = styled.svg`
  display: inline-block;
  position: absolute;
  right: 0;
  top: 50%;
  fill: currentColor;
  width: 1em;
  height: 1em;
  color: #ddd;
  display: inline-block;
  font-size: 1.5rem;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  flex-shrink: 0;
  user-select: none;
  transform: translate(50%, -50%);
  z-index: 1;
  ${"" /* prevents from scrolling while dragging on touch devices */}
  touch-action:none;
`;

const Resizer = (props: React.SVGAttributes<SVGElement>) => (
  <ResizerComponent {...props}>
    <path d='M11 19V5h2v14z'></path>
  </ResizerComponent>
);

export const BasicTable = () => {
  const columns = React.useMemo(() => COLUMNS, []);
  const [data, setData] = React.useState(() => MOCK_DATA);
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
    useColumnOrder,
    useSortBy
  );

  const currentColumnOrder = React.useRef<string[]>([]);
  const [isResizing, setIsResizing] = React.useState(false);

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
      <button
        onClick={() =>
          setData(data =>
            data.map(r => ({
              ...r,
              first_name: r.first_name.toLocaleLowerCase(),
            }))
          )
        }
      >
        Change data
      </button>
      <br />
      <br />
      <Droppable droppableId='all-columns' direction='horizontal'>
        {provided => (
          <DroppableContainer
            {...getTableProps()}
            className='table'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableHeadRow
                  {...headerGroup.getHeaderGroupProps()}
                  className='tr'
                >
                  {headerGroup.headers.map((column, i) => (
                    <Draggable
                      isDragDisabled={isResizing}
                      key={column.id}
                      draggableId={column.id}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <Column
                          snapshot={snapshot}
                          provided={provided}
                          column={column}
                          setIsResizing={setIsResizing}
                        ></Column>
                      )}
                    </Draggable>
                  ))}
                </TableHeadRow>
              ))}
            </TableHead>

            <TableBody {...getTableBodyProps()}>
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
            </TableBody>
            {provided.placeholder}
          </DroppableContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};
