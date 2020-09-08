import React, { useMemo, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Container } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { SnackbarProvider } from 'notistack'

import BrokersHubHeader from 'components/common/TheHeader'
import AuthBrokerContextProvider from 'contexts/Auth'
import router from 'router'

const App: React.FC = () => {
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'light'
        }
      }),
    []
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} preventDuplicate>
        <AuthBrokerContextProvider>
          <BrowserRouter>
            {/* Header */}
            <BrokersHubHeader />
            {/* Body */}
            <Container id="maincontent" role="main" maxWidth="lg">
              <Suspense
                fallback={[...Array(6).keys()].map((i) => (
                  <React.Fragment key={`loader-${i}`}>
                    <Skeleton height={theme.spacing(12)} />
                    <br />
                  </React.Fragment>
                ))}
              >
                <Switch>
                  {router.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      component={route.component}
                    />
                  ))}
                </Switch>
              </Suspense>
            </Container>
          </BrowserRouter>
        </AuthBrokerContextProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
