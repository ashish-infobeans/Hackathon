import { supabase } from '../lib/supabase'

export type ProjectCta = 'join' | 'switch' | 'give-up'

export function getProjectCta(projectId: string, signedUpProjectId: string | null): ProjectCta {
  if (signedUpProjectId === projectId) return 'give-up'
  if (signedUpProjectId) return 'switch'
  return 'join'
}

export async function fetchSignedUpProjectId(clientId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('signups')
    .select('project_id, participants!inner(client_id)')
    .eq('participants.client_id', clientId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data?.project_id ?? null
}

export async function joinProject(participantId: string, projectId: string): Promise<void> {
  const { error } = await supabase.from('signups').insert({
    participant_id: participantId,
    project_id: projectId,
  })

  if (error) {
    throw error
  }
}

export async function giveUpProject(participantId: string): Promise<void> {
  const { error } = await supabase.from('signups').delete().eq('participant_id', participantId)

  if (error) {
    throw error
  }
}

export async function switchProject(participantId: string, newProjectId: string): Promise<void> {
  const { error: deleteError } = await supabase
    .from('signups')
    .delete()
    .eq('participant_id', participantId)

  if (deleteError) {
    throw deleteError
  }

  const { error: insertError } = await supabase.from('signups').insert({
    participant_id: participantId,
    project_id: newProjectId,
  })

  if (insertError) {
    throw insertError
  }
}
