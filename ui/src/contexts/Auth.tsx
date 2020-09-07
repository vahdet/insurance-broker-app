import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'

export interface AuthBrokerType {
  id: number
  firstName: string
  lastName: string
  email: string
  address: string
  agency: {
    id: number
    title: string
    domain: string
    address: string
  }
}

interface AuthBrokerContextDataType extends AuthBrokerType {
  contextMeta: {
    isReady: boolean
  }
}

export interface AuthBrokerContextType {
  authBroker: AuthBrokerContextDataType | null
  setAuthBroker: Function
}

export const AuthBrokerContext = React.createContext<AuthBrokerContextType>({
  authBroker: null,
  setAuthBroker: () => {}
})

export default ({ children }: any) => {
  const [
    authBroker,
    setAuthBroker
  ] = useState<AuthBrokerContextDataType | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // Closure
    const setNoUserButReady = () => {
      setAuthBroker({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        agency: {
          id: 0,
          title: '',
          domain: '',
          address: ''
        },
        contextMeta: {
          isReady: true
        }
      })
    }

    const setAuthenticatedUser = (broker: AuthBrokerType) => {
      setAuthBroker({
        ...broker,
        contextMeta: {
          isReady: true
        }
      })
    }

    // Main body
    ;(async () => {
      try {
        let [authUser, cognitoCredentials] = await Promise.all([
          Auth.currentAuthenticatedUser(),
          Auth.currentCredentials()
        ])
        if (!authUser) {
          setNoUserButReady()
          return
        }

        // Extract Cognito Group from token
        const cognitoGroups = authUser.signInUserSession.accessToken.payload[
          'cognito:groups'
        ] as Array<string>
        // DB data
        const userGraphqlResponse = (await API.graphql(
          graphqlOperation(GetUser, { username: authUser.username })
        )) as {
          data: GetUserByUsernameQuery
        }

        let user = userGraphqlResponse.data.getUserByUsername
        // console.log('User: ' + JSON.stringify(user))
        if (!user) {
          setNoUserButReady()
          throw new Error('no db record found for the authenticated user')
        }

        setAuthenticatedUser(user, cognitoGroups, profilePictureObjectUrl)
      } catch (err) {
        setNoUserButReady()

        if (![cognitoNotAuthenticatedMessage].includes(err.toString())) {
          enqueueSnackbar(JSON.stringify(err), {
            variant: 'error'
          })
        }
      }
    })()
  }, [enqueueSnackbar])

  return (
    <AuthBrokerContext.Provider value={{ authBroker, setAuthBroker }}>
      {children}
    </AuthBrokerContext.Provider>
  )
}
