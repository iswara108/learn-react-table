import { Column } from "react-table";

export interface DataStructure2 {
  id2: number;
  first_name2: string;
  last_name2: string;
  date_of_birth2: string;
  country2: string;
  phone2: string;
  age2: number;
  email2: string;
}

export const COLUMNS: Column<DataStructure2>[] = [
  { Header: "Id 2", Footer: "Id 2", accessor: "id2" },
  { Header: "First Name 2", Footer: "First Name 2", accessor: "first_name2" },
  { Header: "Last Name 2", Footer: "Last Name 2", accessor: "last_name2" },
  {
    Header: "Date of Birth 2",
    Footer: "Date of Birth",
    accessor: "date_of_birth2",
    Cell: ({ value }) => value.slice(0, 10),
  },
  { Header: "Country 2", Footer: "Country", accessor: "country2" },
  { Header: "Phone 2", Footer: "Phone", accessor: "phone2" },
];
