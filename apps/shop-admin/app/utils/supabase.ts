import { createClient } from '@supabase/supabase-js';

const supabaseRef = ref();

export const supabase = () => {
  if (supabaseRef.value) return supabaseRef.value;

  const config = useRuntimeConfig();

  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseKey;

  supabaseRef.value = createClient(supabaseUrl, supabaseKey);
  return supabaseRef.value;
};
