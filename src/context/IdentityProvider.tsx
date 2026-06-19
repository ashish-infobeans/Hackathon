import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { NamePromptModal } from '../components/NamePromptModal'
import { upsertParticipant } from '../data/participants'
import { loadOrCreateIdentity, saveIdentity } from '../lib/identity'
import { IdentityContext } from './identityContext'

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [{ identity, needsPrompt, isReady }, setState] = useState(() => {
    const result = loadOrCreateIdentity()
    return {
      identity: result.identity,
      needsPrompt: result.needsPrompt,
      isReady: true,
    }
  })
  const [participantId, setParticipantId] = useState<string | null>(null)

  const setDisplayName = useCallback(
    (displayName: string) => {
      const nextIdentity = saveIdentity(displayName, identity?.clientId)
      setState({
        identity: nextIdentity,
        needsPrompt: false,
        isReady: true,
      })
    },
    [identity?.clientId],
  )

  const ensureParticipant = useCallback(async () => {
    if (participantId) {
      return participantId
    }

    if (!identity) {
      throw new Error('Identity is required.')
    }

    const id = await upsertParticipant({
      clientId: identity.clientId,
      displayName: identity.displayName,
    })
    setParticipantId(id)
    return id
  }, [identity, participantId])

  const value = useMemo(
    () => ({
      identity,
      participantId,
      isReady,
      setDisplayName,
      ensureParticipant,
    }),
    [identity, participantId, isReady, setDisplayName, ensureParticipant],
  )

  return (
    <IdentityContext.Provider value={value}>
      {children}
      {isReady && needsPrompt ? <NamePromptModal onSubmit={setDisplayName} /> : null}
    </IdentityContext.Provider>
  )
}
