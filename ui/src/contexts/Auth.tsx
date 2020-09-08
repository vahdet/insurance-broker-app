import React, { useReducer, createContext } from 'react'

interface AuthBrokerContextDataType {
  isAuthenticated: boolean
  token: string
}

interface AuthBrokerContextType {
  state: AuthBrokerContextDataType | null
  dispatch: Function
}

export const AuthBrokerContext = createContext<AuthBrokerContextType>({
  state: null,
  dispatch: () => {}
})

const initialState: AuthBrokerContextDataType = {
  isAuthenticated: false,
  token: ''
}

type AuthBrokerActionType = {
  type: 'SIGNIN' | 'SIGNOUT'
  payload: {
    token: string
  }
}

const reducer = (
  state: AuthBrokerContextDataType,
  action: AuthBrokerActionType
): AuthBrokerContextDataType => {
  if (!process.env.REACT_APP_AUTHENTICATION_ENABLED) return state
  switch (action.type) {
    case 'SIGNIN':
      // The Auth API should have pushed token now
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token
      }
    case 'SIGNOUT':
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false
      }
    default:
      return state
  }
}

export default ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AuthBrokerContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthBrokerContext.Provider>
  )
}
