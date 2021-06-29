import { Column } from "react-table";
import { ColumnFilter } from "./ColumnFilter";
export interface DataStructure {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  phone: string;
  age: number;
  email: string;
}

export const COLUMNS: Column<DataStructure>[] = [
  { Header: "Id", Footer: "Id", accessor: "id", Filter: ColumnFilter },
  {
    Header: "First Name",
    Footer: "First Name",
    accessor: "first_name",
    Filter: ColumnFilter,
  },
  {
    Header: "Last Name",
    Footer: "Last Name",
    accessor: "last_name",
    Filter: ColumnFilter,
  },
  {
    Header: "Date of Birth",
    Footer: "Date of Birth",
    accessor: "date_of_birth",
    Filter: ColumnFilter,
  },
  {
    Header: "Country",
    Footer: "Country",
    accessor: "country",
    Filter: ColumnFilter,
  },
  { Header: "Phone", Footer: "Phone", accessor: "phone", Filter: ColumnFilter },
];
