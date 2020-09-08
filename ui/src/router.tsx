import { lazy } from 'react'
import BrokersHubHomeView from 'views/Home'

const BrokersHubAuthSignInView = lazy(() => import('views/auth/SignIn'))
const BrokersHubSignUpBrokerView = lazy(() => import('views/SignUpBroker'))
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
    path: '/new',
    component: BrokersHubSignUpBrokerView
  },
  {
    path: '/auth/signIn',
    component: BrokersHubAuthSignInView
  },
  // Other
  {
    component: BrokersHubNotFoundView
  }
]

export default router
