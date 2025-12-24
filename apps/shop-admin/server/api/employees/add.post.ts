import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async event => {
  let body = await readBody(event);

  // body = Object.fromEntries(Object.entries(body).filter(([_, value]) => value));

  const full_name = body.full_name;
  const email = body.email;
  const password = body.password || Math.random().toString(36).slice(2);
  const role = body.role ?? 'employee';
  const shop_id = body.shop_id;

  if (!email || !shop_id) {
    throw { statusCode: 400, statusMessage: 'Missing email or shop_id' };
  }

  // استخدم Service Key هنا
  const config = useRuntimeConfig();

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey // service role (server only!)
  );

  // 1) Create user in auth
  const { data: userData, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password, // random password nobody uses
      email_confirm: true, // auto-confirm email
    });

  if (createError) {
    throw { statusCode: 400, statusMessage: createError.message };
  }

  const user_id = userData.user.id;

  // 2) Add to shop_members
  const { error } = await supabase.from('shop_members').insert({
    shop_id,
    user_id,
    role,
    full_name,
    email,
  });

  if (error) {
    throw { statusCode: 400, statusMessage: error.message };
  }

  return { success: true };
});
