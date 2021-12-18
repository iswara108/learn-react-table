import React from 'react'
import { Column } from 'react-table'

export interface DataStructure {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  country: string
  phone: string
  age: number
  email: string
}

const EditableCell = React.memo(
  (props: { value: string; myFunction: (newValue: string) => void }) => {
    const [visibleValue, setVisibleValue] = React.useState(props.value)
    return (
      <input
        style={{ width: '100%' }}
        value={visibleValue}
        // value={visibleValue}
        onChange={e => {
          setVisibleValue(e.target.value)
          props.myFunction(e.target.value)
        }}
      />
    )
  }
)

export const COLUMNS: Column<DataStructure>[] = [
  { Header: 'Id', Footer: 'Id', accessor: 'id' },
  {
    Header: 'First Name',
    Footer: 'First Name',
    accessor: 'first_name',
    // Cell: React.memo(({ value }) => <div>{value}</div>)
    Cell: React.memo(props => {
      console.log('editable cell', props)
      return <EditableCell value={props.value} myFunction={props.myFunction} />
    })
  },
  { Header: 'Last Name ', Footer: 'Last Name ', accessor: 'last_name' },
  {
    Header: 'Date of Birth ',
    Footer: 'Date of Birth',
    accessor: 'date_of_birth',
    Cell: ({ value }) => value.slice(0, 10)
  },
  { Header: 'Country ', Footer: 'Country', accessor: 'country' },
  { Header: 'Phone ', Footer: 'Phone', accessor: 'phone' }
]
