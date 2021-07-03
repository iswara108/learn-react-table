import { Column } from "react-table";

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
  // @ts-ignore
  { Header: "Id", Footer: "Id", accessor: "id", sticky: "left" },
  {
    Header: "First Name",
    Footer: "First Name",
    accessor: "first_name",
    // @ts-ignore
    sticky: "left",
  },
  {
    Header: "Last Name",
    Footer: "Last Name",
    accessor: "last_name",
    // @ts-ignore
    sticky: "left",
  },
  {
    Header: "Date of Birth",
    Footer: "Date of Birth",
    accessor: "date_of_birth",
  },
  { Header: "Country", Footer: "Country", accessor: "country" },
  { Header: "Phone", Footer: "Phone", accessor: "phone" },
  { Header: "Email", Footer: "Email", accessor: "email" },
  { Header: "Age", Footer: "Age", accessor: "age" },
];
