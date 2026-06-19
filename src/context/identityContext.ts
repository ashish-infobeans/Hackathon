import { createContext } from 'react'
import type { Identity } from '../lib/identity'

export type IdentityContextValue = {
  identity: Identity | null
  participantId: string | null
  isReady: boolean
  setDisplayName: (displayName: string) => void
  ensureParticipant: () => Promise<string>
}

export const IdentityContext = createContext<IdentityContextValue | null>(null)
