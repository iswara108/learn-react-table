import { Column } from "react-table";
import dayjs from "dayjs";

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
  { Header: "Id", Footer: "Id", accessor: "id" },
  { Header: "First Name", Footer: "First Name", accessor: "first_name" },
  { Header: "Last Name", Footer: "Last Name", accessor: "last_name" },
  {
    Header: "Date of Birth",
    Footer: "Date of Birth",
    accessor: "date_of_birth",
    Cell: ({ value }) => dayjs(value).format("MMM DD, YYYY H:mm:ss"),
  },
  { Header: "Country", Footer: "Country", accessor: "country" },
  { Header: "Phone", Footer: "Phone", accessor: "phone" },
];
