import "server-only";

import OpenAI from "openai";
import { specSchema } from "@/lib/spec-schema";
import type { CreateSpecInput, Spec } from "@/lib/types";

export async function generateSpec(input: CreateSpecInput): Promise<Spec> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-6-luna",
    instructions: [
      "당신은 외국인 학생을 위한 한국 대학 문화 행사를 기획하는 국제교류 담당자입니다.",
      "쉬운 한국어와 영어가 필요한 참여자를 배려하고, 문화와 식단 차이를 고려하세요.",
      "실행 가능한 작은 범위의 PRD를 작성하세요.",
      "core_features는 4~6개, P0는 최대 3개, user_flow는 4~6단계로 작성하세요.",
      "screens는 2~4개, data_model은 1~3개, api_endpoints는 2~5개로 작성하세요.",
      "정해지지 않은 행사 정보는 임의로 확정하지 말고, 필요한 경우 미정이라고 표시하세요.",
      "participant_guide에는 참가자용 한영 안내문을 작성하세요. purpose, schedule, venue, items_to_prepare, dietary_notice 각각에 한국어와 English를 함께 쓰세요.",
    ].join("\n"),
    input: JSON.stringify(input),
    text: { format: { type: "json_schema", name: "prd", strict: true, schema: specSchema } },
  });

  return JSON.parse(response.output_text) as Spec;
}
