import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { RegistrationForm } from "@/lib/types";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { token } = await params;
  try {
    const { data, error: formError } = await getSupabase().from("event_forms")
      .select("event_name, participant_guide").eq("public_token", token).maybeSingle();
    if (formError) return error("신청서를 불러오지 못했습니다.", 500);
    if (!data) return error("유효하지 않은 참가 신청 링크입니다.", 404);
    return NextResponse.json({ form: { event_name: data.event_name, guide: data.participant_guide } as RegistrationForm });
  } catch { return error("신청서를 불러오지 못했습니다.", 500); }
}

export async function POST(request: Request, { params }: RouteContext) {
  const { token } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return error("신청 내용을 읽을 수 없습니다.", 400); }
  if (!isResponse(body)) return error("이름과 사용 언어를 확인해 주세요.", 400);

  try {
    const supabase = getSupabase();
    const { data: form, error: formError } = await supabase.from("event_forms").select("id").eq("public_token", token).maybeSingle();
    if (formError) return error("신청서를 불러오지 못했습니다.", 500);
    if (!form) return error("유효하지 않은 참가 신청 링크입니다.", 404);
    const { error: insertError } = await supabase.from("event_responses").insert({
      form_id: form.id, name: body.name.trim(), preferred_language: body.preferred_language.trim(),
      dietary_allergies: body.dietary_allergies.trim(), support_needs: body.support_needs.trim(),
    });
    if (insertError) return error("신청서 제출에 실패했습니다.", 500);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return error("신청서 제출에 실패했습니다.", 500); }
}

function isResponse(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return typeof input.name === "string" && input.name.trim().length >= 1 && input.name.trim().length <= 100
    && typeof input.preferred_language === "string" && input.preferred_language.trim().length >= 1 && input.preferred_language.trim().length <= 100
    && typeof input.dietary_allergies === "string" && typeof input.support_needs === "string";
}

function error(message: string, status: number) { return NextResponse.json({ error: message }, { status }); }
