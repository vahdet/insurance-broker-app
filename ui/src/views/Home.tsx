import React, { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Typography, Box, Button } from '@material-ui/core'
import MaterialTable, { Column, QueryResult } from 'material-table'
import { useSnackbar } from 'notistack'
import { AuthBrokerContext } from 'contexts/Auth'
import { appBackend } from 'httpCall'

interface BrokerRow {
  agencyTitle: string
  agencyDomain: string
  firstName: string
  lastName: string
  email: string
  address: string
}

const tableColumns: Array<Column<BrokerRow>> = [
  {
    title: 'Agency Name',
    field: 'agency.title',
    filtering: false
  },
  {
    title: 'Agency Domain',
    field: 'agency.domain',
    filtering: false
  },
  {
    title: 'First Name',
    field: 'firstName',
    filtering: false
  },
  {
    title: 'Last Name',
    field: 'lastName',
    filtering: false
  },
  {
    title: 'Email',
    field: 'email',
    filtering: false
  },
  {
    title: 'Address',
    field: 'address',
    filtering: false
  }
]

const Home: React.FC = () => {
  const { state: authState } = useContext(AuthBrokerContext)
  const { enqueueSnackbar } = useSnackbar()

  // Functions
  const fetchTableData = () => {
    const asyncFetchBrokers = async () => {
      try {
        const { data } = await appBackend.get('api/users', {
          withCredentials: !!process.env.REACT_APP_AUTHENTICATION_ENABLED
        })

        return {
          data: data,
          page: 0,
          totalCount: data?.length
        } as QueryResult<BrokerRow>
      } catch (err) {
        enqueueSnackbar(JSON.stringify(err), {
          variant: 'error'
        })
        throw err
      }
    }
    return asyncFetchBrokers()
  }

  return !process.env.REACT_APP_AUTHENTICATION_ENABLED ||
    authState?.isAuthenticated ? (
    <React.Fragment>
      <Box mb={2} pl={1}>
        <Typography variant="h4" color="textSecondary">
          Brokers
        </Typography>
      </Box>
      <MaterialTable
        title="Records"
        columns={tableColumns}
        data={fetchTableData}
        options={{
          sorting: false,
          filtering: false,
          search: false
        }}
      ></MaterialTable>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Typography variant="h6" color="textSecondary">
        You must sign in to access this page
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/auth/signIn"
      >
        Go Sign In
      </Button>
    </React.Fragment>
  )
}

export default Home
