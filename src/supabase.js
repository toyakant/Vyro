import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qjcsslddybcaoslrgrus.supabase.co'
const supabaseAnonKey =
  'sb_publishable_nZTHMGQ16YvIDxITZTaqQw_yHiJJtXx'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)