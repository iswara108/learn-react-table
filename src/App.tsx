import React from 'react'
import './App.css'
import { DataGrid } from './components/DataGrid'
import MOCK_DATA from './MOCK_DATA.json'
import { COLUMNS, DataStructure } from './columns'
import { Column } from 'react-table'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

const MockedDataMemory: DataStructure[] = MOCK_DATA
;(window as any).mocked = MockedDataMemory
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

function useForceUpdate(): () => void {
  return React.useReducer(() => ({}), {})[1] as () => void // <- paste here
}
function Main() {
  const ff = useForceUpdate()
  const changeNameMutation = useMutation<{ ok: boolean }, unknown, string>(
    text =>
      new Promise(res => setTimeout(res, 2000)).then(() => {
        MockedDataMemory[2].last_name = text
        return { ok: true }
      })
  )
  const {
    status,
    error,
    data: serverData,
    isFetching
  } = useQuery('repoData', () => {
    console.log('fetching')
    return new Promise(res => setTimeout(res, 2000)).then(
      () => MockedDataMemory
    )
  })

  const columns: Column<DataStructure>[] = COLUMNS

  if (status === 'loading') return <>Loading...</>

  if (status === 'error') {
    if (error instanceof Error)
      return <>An error has occurred: {error.message}</>
    else return <>An error has occured</>
  }

  if (status === 'idle') return <>IDLE</>
  if (!serverData) return <>DATA UNDEFINED</>

  const data = serverData.slice()
  return (
    <div className="App">
      {/* <button onClick={reverseFirstName}>Change data</button> */}
      <br />
      <br />
      <DataGrid
        columns={columns}
        data={data}
        myFunction={(newValue: string) => {
          console.log('myFunction is called')
          changeNameMutation.mutate(newValue)
        }}
      />
      {isFetching ? <div>Fetching</div> : null}
      Mutation Status: {changeNameMutation.status}
      <div>
        <button onClick={() => ff()}>For rerender</button>
      </div>
    </div>
  )
}
