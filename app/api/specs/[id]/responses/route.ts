import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { tokensMatch } from "@/lib/registration";
import { getSupabase } from "@/lib/supabase";
import type { RegistrationResponse } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const supabase = getSupabase();
    const { data: form, error: formError } = await supabase.from("event_forms")
      .select("id, event_name, manager_token_hash").eq("spec_id", id).maybeSingle();
    if (formError) return error("신청 응답을 불러오지 못했습니다.", 500);
    if (!form) return error("신청서를 찾을 수 없습니다.", 404);

    const token = (await cookies()).get(`event-manager-${id}`)?.value;
    if (!tokensMatch(token, form.manager_token_hash)) return error("운영진만 응답을 확인할 수 있습니다.", 403);

    const { data, error: responseError } = await supabase.from("event_responses")
      .select("id, created_at, name, preferred_language, dietary_allergies, support_needs")
      .eq("form_id", form.id).order("created_at", { ascending: false });
    if (responseError) return error("신청 응답을 불러오지 못했습니다.", 500);
    return NextResponse.json({ event_name: form.event_name, items: (data ?? []) as RegistrationResponse[] });
  } catch { return error("신청 응답을 불러오지 못했습니다.", 500); }
}

function error(message: string, status: number) { return NextResponse.json({ error: message }, { status }); }
