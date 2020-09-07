import axios from 'axios'
import { appBackendBaseUrl, authBackendBaseUrl } from 'utils/constants'

export const appBackend = axios.create({
  baseURL: appBackendBaseUrl
})

export const authBackend = axios.create({
  baseURL: authBackendBaseUrl
})
