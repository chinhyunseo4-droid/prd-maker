import type { Spec } from "@/lib/types";

export function specToMarkdown(spec: Spec) {
  return [
    `# ${spec.product_name}`, "", spec.one_liner, "", "## 문제", spec.problem, "",
    "## 핵심 기능", ...spec.core_features.map((feature) => `- [${feature.priority}] ${feature.name}: ${feature.description}`), "",
    "## 유저 플로우", ...spec.user_flow.map((step, index) => `${index + 1}. ${step}`), "",
    "## 참가자용 안내 / Participant Guide",
    `- 목적 / Purpose: ${spec.participant_guide.purpose}`,
    `- 일정 / Schedule: ${spec.participant_guide.schedule}`,
    `- 장소 / Venue: ${spec.participant_guide.venue}`,
    `- 준비물 / Items to prepare: ${spec.participant_guide.items_to_prepare}`,
    `- 식단 안내 / Dietary notice: ${spec.participant_guide.dietary_notice}`,
    "", "## 첫 프롬프트", spec.first_prompt,
  ].join("\n");
}
