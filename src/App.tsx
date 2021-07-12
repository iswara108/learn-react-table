import React from "react";
import "./App.css";
import { DataGrid } from "./components/DataGrid";
import MOCK_DATA from "./MOCK_DATA.json";
import { COLUMNS, DataStructure2 } from "./columns";
// todo: have Column exported from datagrid component
import { Column } from "react-table";

function App() {
  const columns: Column<DataStructure2>[] = React.useMemo(() => COLUMNS, []);
  const [data, setData] = React.useState<DataStructure2[]>(() =>
    MOCK_DATA.map(r => ({
      id2: r.id,
      first_name2: r.first_name,
      last_name2: r.last_name,
      email2: r.email,
      date_of_birth2: r.date_of_birth,
      age2: r.age,
      country2: r.country,
      phone2: r.phone,
    }))
  );

  const reverseFirstName = () =>
    setData(data =>
      data.map(r => ({
        ...r,
        first_name2: Array.from(r.first_name2).reduce((n, l) => l + n, ""),
      }))
    );

  return (
    <div className='App'>
      <button onClick={reverseFirstName}>Change data</button>
      <br />
      <br />

      <DataGrid columns={columns} data={data} />
    </div>
  );
}

export default App;
