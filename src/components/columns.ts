import { Column, ColumnGroup } from "react-table";

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

export const COLUMNS: Column<DataStructure>[] = [];

export const GROUPED_COLUMNS: ColumnGroup<DataStructure>[] = [
  {
    Header: "Id",
    Footer: "Id",
    columns: [
      {
        Header: "Id",
        Footer: "Id",
      },
    ],
  },
  {
    Header: "Name",
    Footer: "Name",
    columns: [
      { Header: "First Name", Footer: "First Name", accessor: "first_name" },
      { Header: "Last Name", Footer: "Last Name", accessor: "last_name" },
    ],
  },
  {
    Header: "Info",
    Footer: "info",
    columns: [
      {
        Header: "Date of Birth",
        Footer: "Date of Birth",
        accessor: "date_of_birth",
      },
      { Header: "Country", Footer: "Country", accessor: "country" },
      { Header: "Phone", Footer: "Phone", accessor: "phone" },
    ],
  },
];
