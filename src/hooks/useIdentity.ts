import { useContext } from 'react'
import { IdentityContext } from '../context/identityContext'

export function useIdentity() {
  const context = useContext(IdentityContext)

  if (!context) {
    throw new Error('useIdentity must be used within an IdentityProvider.')
  }

  return context
}
