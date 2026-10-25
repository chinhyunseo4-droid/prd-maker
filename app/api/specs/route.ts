import { NextResponse } from "next/server";
import { generateSpec } from "@/lib/openai";
import { getSupabase } from "@/lib/supabase";
import type { CreateSpecInput, SpecListItem } from "@/lib/types";

const timeframes = ["1주", "2주", "1달"] as const;

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return error("요청 내용을 읽을 수 없습니다.", 400); }
  if (!isCreateSpecInput(body)) return error("아이디어 이름과 해결하려는 문제를 확인해 주세요.", 400);

  const input: CreateSpecInput = {
    title: body.title.trim(), problem: body.problem.trim(), target: body.target.trim(),
    timeframe: timeframes.includes(body.timeframe as CreateSpecInput["timeframe"]) ? body.timeframe as CreateSpecInput["timeframe"] : "1주",
  };

  let spec;
  try { spec = await generateSpec(input); } catch { return error("PRD를 만드는 중 AI 호출에 실패했습니다.", 502); }

  try {
    const { data, error: insertError } = await getSupabase().from("specs").insert({
      title: input.title, problem: input.problem, target: input.target || null, timeframe: input.timeframe,
      product_name: spec.product_name, spec,
    }).select("id, created_at").single();
    if (insertError || !data) return error("PRD 저장에 실패했습니다.", 500);
    return NextResponse.json({ id: data.id, created_at: data.created_at, spec }, { status: 201 });
  } catch { return error("PRD 저장에 실패했습니다.", 500); }
}

export async function GET() {
  try {
    const { data, error: selectError } = await getSupabase().from("specs")
      .select("id, created_at, title, product_name, timeframe, one_liner:spec->>one_liner")
      .order("created_at", { ascending: false }).limit(50);
    if (selectError) return error("PRD 목록을 불러오지 못했습니다.", 500);
    return NextResponse.json({ items: (data ?? []) as SpecListItem[] });
  } catch { return error("PRD 목록을 불러오지 못했습니다.", 500); }
}

function isCreateSpecInput(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return typeof input.title === "string" && input.title.trim().length >= 1 && input.title.trim().length <= 100
    && typeof input.problem === "string" && input.problem.trim().length >= 1 && input.problem.trim().length <= 1000
    && typeof input.target === "string" && typeof input.timeframe === "string";
}

function error(message: string, status: number) { return NextResponse.json({ error: message }, { status }); }
