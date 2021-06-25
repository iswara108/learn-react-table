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
  { Header: "Id", accessor: "id" },
  { Header: "First Name", accessor: "first_name" },
  { Header: "Last Name", accessor: "last_name" },
  { Header: "Date of Birth", accessor: "date_of_birth" },
  { Header: "Country", accessor: "country" },
  { Header: "Phone", accessor: "phone" },
];
