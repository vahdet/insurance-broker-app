import React, { useReducer, createContext } from 'react'

export interface AuthBrokerType {
  id: number
  firstName: string
  lastName: string
  email: string
  address: string
  agency: {
    title: string
    domain: string
  }
}

interface AuthBrokerContextDataType {
  isAuthenticated: boolean
  token: string
}

export interface AuthBrokerContextType {
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
  switch (action.type) {
    case 'SIGNIN':
      localStorage.setItem('token', JSON.stringify(action.payload.token))
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
