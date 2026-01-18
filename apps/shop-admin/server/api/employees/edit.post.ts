import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const user_id = body.user_id;
  const full_name = body.full_name;
  const email = body.email;
  const password = body.password;

  if (!email) {
    throw { statusCode: 400, statusMessage: 'Missing email' };
  }

  // استخدم Service Key هنا
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey // service role (server only!)
  );

  // 1) Create user in auth
  const { error: createError } = await supabase.auth.admin.updateUserById(
    user_id,
    { email, ...(password ? { password } : {}) }
  );

  if (createError) {
    return { error: createError.message };
  }

  // 2) Insert into shop_members
  await supabase
    .from('shop_members')
    .update({ full_name, email })
    .eq('user_id', user_id);

  return { success: true };
});
