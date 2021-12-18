import React from 'react'
import './App.css'
import { DataGrid } from './components/DataGrid'
import MOCK_DATA from './MOCK_DATA.json'
import { COLUMNS, DataStructure } from './columns'
import { Column } from 'react-table'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  )
}

function Main() {
  const { status, error, data } = useQuery('repoData', () =>
    new Promise(res => setTimeout(res, 2000)).then(() =>
      MOCK_DATA.map(r => ({
        id: r.id,
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
        date_of_birth: r.date_of_birth,
        age: r.age,
        country: r.country,
        phone: r.phone
      }))
    )
  )

  const columns: Column<DataStructure>[] = React.useMemo(() => COLUMNS, [])

  // const reverseFirstName = () =>
  //   setData(data =>
  //     data.map(r => ({
  //       ...r,
  //       first_name2: Array.from(r.first_name2).reduce((n, l) => l + n, '')
  //     }))
  //   )

  if (status === 'loading') return <>Loading...</>

  if (status === 'error') {
    if (error instanceof Error)
      return <>An error has occurred: {error.message}</>
    else return <>An error has occured</>
  }

  if (status === 'idle') return <>IDLE</>
  if (!data) return <>DATA UNDEFINED</>
  return (
    <div className="App">
      {/* <button onClick={reverseFirstName}>Change data</button> */}
      <br />
      <br />

      <DataGrid columns={columns} data={data} />
    </div>
  )
}
