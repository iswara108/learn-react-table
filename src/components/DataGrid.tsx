import * as React from 'react'
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder,
  useSortBy,
  HeaderGroup,
  useRowSelect,
  UseRowSelectRowProps,
  usePagination,
  Column,
  Hooks
} from 'react-table'
import { Checkbox } from './Checkbox'
import styled from 'styled-components/macro'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
  Droppable
} from 'react-beautiful-dnd'

const TableBody = styled.tbody``

const TableFooter = styled.tfoot``

const TableHead = styled.thead`
  ${
    '' /* In this example we use an absolutely position resizer,
 so this is required. */
  }
  position: relative;
  :last-child {
    border-right: 0;
  }
`

const TableRowInHeader = styled.tr`
  border-bottom: 1px solid black;
`

const TableHeaderStyledColumn = styled.th<{ isDragging: boolean }>`
  ${({ isDragging }) => isDragging && 'background-color: #eee;'}
`

function ColumnComponent<S extends {}>({
  snapshot,
  provided,
  column,
  setIsResizing
}: {
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  column: HeaderGroup<S>
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [onHover, setOnHover] = React.useState(false)
  return (
    <TableHeaderStyledColumn
      isDragging={snapshot.isDragging}
      className="th"
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
        {column.render('Header')}
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
    </TableHeaderStyledColumn>
  )
}

const Heading = styled.div<{ isDragging: boolean }>`
  ${({ isDragging }) => !isDragging && 'transform: inherit !important;'}
  background-color: ${({ isDragging }) =>
    isDragging ? 'lightYellow' : 'white'};
  padding: 0.5rem;
  border-radius: 0.4rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`

const DroppableContainer = styled.table`
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
`

const SortIcon = ({
  isSorted,
  isSortedDesc,
  onHover
}: {
  isSorted: boolean
  isSortedDesc: boolean | undefined
  onHover: boolean
}) => {
  return (
    <span>
      {(onHover || isSorted) && (
        <SortIconComponent
          className="MuiSvgIcon-root MuiDataGrid-sortIcon MuiSvgIcon-fontSizeSmall"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          hint={!isSorted && onHover}
          up={!!isSortedDesc}
        >
          <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
        </SortIconComponent>
      )}{' '}
    </span>
  )
}

const SortIconComponent = styled.svg<{ hint: boolean; up: boolean }>`
  width: 1em;
  height: 1em;
  color: ${({ hint }) => (hint ? '#ddd' : 'black')};
  fill: currentColor;
  transform: rotate(${({ up }) => (up ? 0 : 180)}deg);
`

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
  ${'' /* prevents from scrolling while dragging on touch devices */}
  touch-action:none;
`

const Resizer = (props: React.SVGAttributes<SVGElement>) => (
  <ResizerComponent {...props}>
    <path d="M11 19V5h2v14z"></path>
  </ResizerComponent>
)

function pushSelectColumn<S extends {}>(hooks: Hooks<S>) {
  hooks.visibleColumns.push(columns => {
    return [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <Checkbox {...getToggleAllRowsSelectedProps()} />
        ),
        Cell: ({ row }: { row: UseRowSelectRowProps<S> }) => (
          <Checkbox {...row.getToggleRowSelectedProps()} />
        ),
        Footer: () => <div>Total:</div>
      },
      ...columns
    ]
  })
}

export function DataGrid<S extends {}>({
  columns,
  data,
  myFunction
}: {
  columns: Column<S>[]
  data: S[]
  myFunction?: any
}) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400
    }),
    []
  )

  const {
    footerGroups,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    selectedFlatRows,
    prepareRow,
    setColumnOrder,
    visibleColumns,
    state,
    page,
    gotoPage,
    pageCount,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, pageSize },
    setPageSize
  } = useTable<S>(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
      myFunction
    },
    useBlockLayout,
    useResizeColumns,
    useColumnOrder,
    useSortBy,
    pushSelectColumn,
    usePagination,
    useRowSelect
  )

  const currentColumnOrder = React.useRef<string[]>([])
  const [isResizing, setIsResizing] = React.useState(false)

  const onDragUpdate = ({ destination, source, draggableId }: DragUpdate) => {
    const newColumnOrder = currentColumnOrder.current.slice()
    const sIndex = source.index
    const dIndex = destination && destination.index

    if (typeof sIndex === 'number' && typeof dIndex === 'number') {
      newColumnOrder.splice(sIndex, 1)
      newColumnOrder.splice(dIndex, 0, draggableId)
      setColumnOrder(newColumnOrder)
    }
  }

  const onDragStart = () =>
    (currentColumnOrder.current = state.columnOrder.length
      ? state.columnOrder
      : visibleColumns.map(c => c.id))

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragUpdate}
    >
      <Droppable droppableId="all-columns" direction="horizontal">
        {provided => (
          <DroppableContainer
            {...getTableProps()}
            className="table"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <TableHead>
              {headerGroups.map(headerGroup => (
                <TableRowInHeader
                  {...headerGroup.getHeaderGroupProps()}
                  className="tr"
                >
                  {headerGroup.headers.map((column, i) => (
                    <Draggable
                      isDragDisabled={isResizing}
                      key={column.id}
                      draggableId={column.id}
                      index={i}
                    >
                      {(provided, snapshot) => (
                        <ColumnComponent
                          snapshot={snapshot}
                          provided={provided}
                          column={column}
                          setIsResizing={setIsResizing}
                        ></ColumnComponent>
                      )}
                    </Draggable>
                  ))}
                </TableRowInHeader>
              ))}
            </TableHead>

            <TableBody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} className="tr">
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()} className="td">
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </TableBody>
            <TableFooter>
              {footerGroups.map(group => (
                <tr {...group.getFooterGroupProps()}>
                  {group.headers.map(column => (
                    <td {...column.getFooterProps()}>
                      {column.render('Footer')}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td>
                  <pre>
                    <code>
                      {JSON.stringify(
                        {
                          selectedFlatRows: selectedFlatRows.map(
                            row => row.original
                          )
                        },
                        null,
                        2
                      )}
                    </code>
                  </pre>
                  <div>
                    <span>
                      Page <strong>{pageIndex + 1}</strong> of{' '}
                      <strong>{pageOptions.length}</strong>{' '}
                    </span>
                    <span>
                      | Go to page:{' '}
                      <input
                        type="number"
                        value={pageIndex + 1}
                        onChange={e => {
                          const pageNumber = e.target.value
                            ? Number(e.target.value) - 1
                            : 0
                          gotoPage(pageNumber)
                        }}
                      />
                    </span>
                    <select
                      value={pageSize}
                      onChange={e => setPageSize(Number(e.target.value))}
                    >
                      {[10, 25, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                          Show {pageSize}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => gotoPage(0)}
                      disabled={!canPreviousPage}
                    >
                      {'<<'}
                    </button>
                    <button
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      Previous
                    </button>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                      Next
                    </button>
                    <button
                      onClick={() => gotoPage(pageCount - 1)}
                      disabled={!canNextPage}
                    >
                      {'>>'}
                    </button>
                  </div>
                </td>
              </tr>
            </TableFooter>
            {provided.placeholder}
          </DroppableContainer>
        )}
      </Droppable>
    </DragDropContext>
  )
}
