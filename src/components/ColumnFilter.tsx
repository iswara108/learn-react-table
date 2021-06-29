import * as React from "react";
import { FilterProps } from "react-table";

export const ColumnFilter = ({
  column: { filterValue, setFilter },
}: FilterProps<{}>) => {
  return (
    <span>
      Search:{" "}
      <input value={filterValue} onChange={e => setFilter(e.target.value)} />
    </span>
  );
};
