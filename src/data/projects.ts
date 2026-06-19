import type { ProposalValues } from '../lib/proposalValidation'
import { supabase } from '../lib/supabase'

export type Project = {
  id: string
  title: string
  shortDescription: string
  signupCount: number
  participantNames: string[]
  isSignedUp?: boolean
}

type ParticipantRow = {
  display_name: string
  client_id: string
}

type SignupWithParticipant = {
  created_at?: string
  participants: ParticipantRow | ParticipantRow[] | null
}

function getParticipant(signup: SignupWithParticipant): ParticipantRow | null {
  const participant = signup.participants
  if (!participant) return null
  return Array.isArray(participant) ? (participant[0] ?? null) : participant
}

type ProjectRow = {
  id: string
  title: string
  short_description: string
  signups: SignupWithParticipant[] | null
}

function mapSignupParticipants(
  signups: SignupWithParticipant[] | null | undefined,
  clientId?: string,
): { participantNames: string[]; isSignedUp: boolean } {
  const sorted = [...(signups ?? [])].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return aTime - bTime
  })

  const participantNames = sorted
    .map((signup) => getParticipant(signup)?.display_name)
    .filter((name): name is string => Boolean(name))

  const isSignedUp = clientId
    ? sorted.some((signup) => getParticipant(signup)?.client_id === clientId)
    : false

  return { participantNames, isSignedUp }
}

function mapProjectRow(row: ProjectRow, clientId?: string): Project {
  const { participantNames, isSignedUp } = mapSignupParticipants(row.signups, clientId)

  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    signupCount: participantNames.length,
    participantNames,
    isSignedUp,
  }
}

export async function fetchApprovedProjects(clientId?: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      id,
      title,
      short_description,
      signups (
        created_at,
        participants ( display_name, client_id )
      )
    `,
    )
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  
  if (error) {
    throw error
  }

  return (data as unknown as ProjectRow[]).map((row) => mapProjectRow(row, clientId))
}

export async function fetchProjectById(id: string, clientId?: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(
      `
      id,
      title,
      short_description,
      signups (
        created_at,
        participants ( display_name, client_id )
      )
    `,
    )
    .eq('id', id)
    .eq('status', 'approved')
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return mapProjectRow(data as unknown as ProjectRow, clientId)
}

export async function submitProposal(values: ProposalValues): Promise<void> {
  const { error } = await supabase.from('projects').insert({
    title: values.title,
    short_description: values.shortDescription,
    status: 'pending',
  })

  if (error) {
    throw error
  }
}
