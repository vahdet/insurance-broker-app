import React, { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AuthBrokerContext } from 'contexts/Auth'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      flexGrow: 1
    },
    appBar: {
      flexGrow: 1
    },
    title: {
      flexGrow: 1,
      color: '#FFFFFF'
    },
    grow: {
      flexGrow: 1
    }
  })
)

const TheHeader: React.FC = () => {
  const classes = useStyles()
  const { state: authState, dispatch } = useContext(AuthBrokerContext)

  return (
    <header className={classes.header}>
      <AppBar
        position="static"
        className={classes.appBar}
        color="primary"
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
          {process.env.REACT_APP_AUTHENTICATION_ENABLED ? (
            authState?.isAuthenticated ? (
              <React.Fragment>
                <Avatar />
                <Button
                  color="inherit"
                  variant="outlined"
                  component={RouterLink}
                  to="/"
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => dispatch({ type: 'SIGNOUT' })}
                >
                  Sign Out
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  color="inherit"
                  variant="outlined"
                  component={RouterLink}
                  to="/"
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/auth/signIn"
                >
                  Sign In
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  component={RouterLink}
                  to="/new"
                >
                  Add New Broker
                </Button>
              </React.Fragment>
            )
          ) : (
            <React.Fragment>
              <Button
                color="inherit"
                variant="outlined"
                component={RouterLink}
                to="/"
              >
                Home
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                component={RouterLink}
                to="/new"
              >
                Add New Broker
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </header>
  )
}

export default TheHeader
