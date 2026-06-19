import { supabase } from '../lib/supabase'

export async function upsertParticipant({
  clientId,
  displayName,
}: {
  clientId: string
  displayName: string
}): Promise<string> {
  const { data, error } = await supabase
    .from('participants')
    .upsert({ client_id: clientId, display_name: displayName }, { onConflict: 'client_id' })
    .select('id')
    .single()

  if (error) {
    throw error
  }

  return data.id
}
