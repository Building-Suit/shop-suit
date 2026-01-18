import { createClient } from '@supabase/supabase-js';

const supabaseRef = ref();

export const supabase = () => {
  if (supabaseRef.value) return supabaseRef.value;

  const config = useRuntimeConfig();

  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = import.meta.client ? config.public.supabaseKey : config.supabaseServiceKey;

  supabaseRef.value = createClient(supabaseUrl, supabaseKey);
  return supabaseRef.value;
};
