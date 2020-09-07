import React, { useState, useEffect, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, Chip, Avatar
} from '@material-ui/core'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'

import { AuthBrokerContext } from 'contexts/Auth'
import { useSnackbar } from 'notistack'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      flexGrow: 1
    },
    appBar: {
      flexGrow: 1
    },
    title: {
      flexGrow: 1
    },
    grow: {
      flexGrow: 1
    }
  })
)

const TheHeader: React.FC = () => {
  const classes = useStyles()
  const [isBrokerAuthenticated, setIsBrokerAuthenticated] = useState<
    boolean | undefined
  >(undefined)
  const { authBroker, setAuthBroker } = useContext(AuthBrokerContext)
  const { enqueueSnackbar } = useSnackbar()

  // Side Effects: Is admin
  useEffect(() => {
    try {
      if (!authBroker || !authBroker.contextMeta.isReady) {
        setIsBrokerAuthenticated(undefined)
      } else {
        setIsBrokerAuthenticated(!!authBroker?.id)
      }
    } catch (err) {
      enqueueSnackbar(JSON.stringify(err), {
        variant: 'error'
      })
    }
  }, [authBroker, enqueueSnackbar])

  return (
    <header className={classes.header}>
      <AppBar
        position="static"
        className={classes.appBar}
        color="transparent"
        elevation={0}
      >
        <Toolbar>
          {/* Logo */}
          <RouterLink to="/">
            <Typography variant="h6" className={classes.title}>
              Brokers Hub
            </Typography>
          </RouterLink>
          <div className={classes.grow} />
          {/* Top Bar Buttons */}
          {!!isBrokerAuthenticated ? (
            isBrokerAuthenticated ? (
              <React.Fragment>
                <Chip avatar={<Avatar/>} label={`${authBroker?.firstName} ${authBroker?.lastName}`}/>
                <Button color="inherit" component={RouterLink} to="/auth/signUp">
                  Sign Out
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/auth/signIn"
                >
                  Sign In
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/auth/signUp"
                >
                  Sign Up
                </Button>
              </React.Fragment>
            )
          ) : (
            <Skeleton />
          )}
        </Toolbar>
      </AppBar>
    </header>
  )
}

export default TheHeader
