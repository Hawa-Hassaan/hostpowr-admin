import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://asvyrytyodcfmfymludd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdnlyeXR5b2RjZm1meW1sdWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTUwMTYsImV4cCI6MjA5NTg5MTAxNn0.Xs2EfgmSwQB6eWIAKatKuLumCTDzmIJscyqKUiXcaIE'

export const supabase = createClient(supabaseUrl, supabaseKey)