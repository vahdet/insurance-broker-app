import { lazy } from 'react'
import BrokersHubHomeView from 'views/Home'

const BrokersHubSignInView = lazy(() => import('views/auth/SignIn'))
const BrokersHubSignUpView = lazy(() => import('views/auth/SignUp'))
const BrokersHubNotFoundView = lazy(() => import('views/NotFound'))

const router = [
  // Content
  {
    path: '/',
    exact: true,
    component: BrokersHubHomeView
  },
  // Auth
  {
    path: '/auth/signIn',
    component: BrokersHubSignInView
  },
  {
    path: '/auth/signUp',
    component: BrokersHubSignUpView
  },
  // Other
  {
    component: BrokersHubNotFoundView
  }
]

export default router
