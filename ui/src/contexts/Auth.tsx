import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { authBackend } from 'httpCall'

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
        // Check if the broker is already logged in
        let broker
        setAuthBroker(broker)
      } catch (err) {
        setNoUserButReady()
      }
    })()
  }, [enqueueSnackbar])

  return (
    <AuthBrokerContext.Provider value={{ authBroker, setAuthBroker }}>
      {children}
    </AuthBrokerContext.Provider>
  )
}
