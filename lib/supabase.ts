import "server-only";

import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("SUPABASE_URL 또는 SUPABASE_SECRET_KEY가 설정되지 않았습니다.");
  return createClient(url, secretKey, { auth: { persistSession: false } });
}
