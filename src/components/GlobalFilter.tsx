import * as React from "react";

export const GlobalFilter = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (filterValue: string) => void;
}) => {
  return (
    <span>
      Search: <input value={filter} onChange={e => setFilter(e.target.value)} />
    </span>
  );
};
