const DISPLAY_NAME_KEY = 'display_name'
const CLIENT_ID_KEY = 'client_id'
const MAX_DISPLAY_NAME_LENGTH = 50

export type Identity = {
  displayName: string
  clientId: string
}

function createClientId(): string {
  return crypto.randomUUID()
}

export function getStoredDisplayName(): string | null {
  const value = localStorage.getItem(DISPLAY_NAME_KEY)?.trim()
  return value ? value : null
}

export function getStoredClientId(): string | null {
  const value = localStorage.getItem(CLIENT_ID_KEY)?.trim()
  return value ? value : null
}

export function getIdentity(): Identity | null {
  const displayName = getStoredDisplayName()
  const clientId = getStoredClientId()

  if (!displayName || !clientId) {
    return null
  }

  return { displayName, clientId }
}

export function normalizeDisplayName(name: string): string | null {
  const trimmed = name.trim()

  if (!trimmed || trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    return null
  }

  return trimmed
}

export function saveIdentity(displayName: string, clientId = createClientId()): Identity {
  const normalizedName = normalizeDisplayName(displayName)

  if (!normalizedName) {
    throw new Error('Display name is required.')
  }

  localStorage.setItem(DISPLAY_NAME_KEY, normalizedName)
  localStorage.setItem(CLIENT_ID_KEY, clientId)

  return {
    displayName: normalizedName,
    clientId,
  }
}

export function loadOrCreateIdentity(): { identity: Identity | null; needsPrompt: boolean } {
  const displayName = getStoredDisplayName()
  const storedClientId = getStoredClientId()

  if (!displayName) {
    return { identity: null, needsPrompt: true }
  }

  const clientId = storedClientId ?? createClientId()

  if (!storedClientId) {
    localStorage.setItem(CLIENT_ID_KEY, clientId)
  }

  return {
    identity: { displayName, clientId },
    needsPrompt: false,
  }
}
