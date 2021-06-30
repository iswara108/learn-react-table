import * as React from "react";
import { useAsyncDebounce } from "react-table";

export const GlobalFilter = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (filterValue: string) => void;
}) => {
  const [value, setValue] = React.useState(filter);

  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined);
  }, 500);

  return (
    <span>
      Search:{" "}
      <input
        value={value}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </span>
  );
};
