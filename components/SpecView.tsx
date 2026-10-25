"use client";

import type { ReactNode } from "react";
import type { Spec } from "@/lib/types";

export default function SpecView({ spec }: { spec: Spec }) {
  async function copyMarkdown() {
    const markdown = [
      `# ${spec.product_name}`,
      "",
      spec.one_liner,
      "",
      "## 문제",
      spec.problem,
      "",
      "## 핵심 기능",
      ...spec.core_features.map((feature) => `- [${feature.priority}] ${feature.name}: ${feature.description}`),
      "",
      "## 유저 플로우",
      ...spec.user_flow.map((step, index) => `${index + 1}. ${step}`),
      "",
      "## 첫 프롬프트",
      spec.first_prompt,
    ].join("\n");
    await navigator.clipboard.writeText(markdown);
  }

  return (
    <article className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
      <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--accent)]">생성된 PRD</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{spec.product_name}</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{spec.one_liner}</p>
        </div>
        <button type="button" onClick={copyMarkdown} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--bg)]">
          마크다운 복사
        </button>
      </header>
      <div className="mt-7 space-y-8">
        <Section title="문제"><p>{spec.problem}</p></Section>
        <Section title="타깃 유저"><ul className="space-y-3">{spec.target_users.map((user) => <li key={user.persona}><strong>{user.persona}</strong><span className="text-[var(--muted)]"> — {user.pain}</span></li>)}</ul></Section>
        <Section title="핵심 기능"><ul className="space-y-4">{spec.core_features.map((feature) => <li key={feature.name} className="flex gap-3"><span className={feature.priority === "P0" ? "h-fit rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--accent)]" : "h-fit rounded-full bg-[var(--bg)] px-2 py-0.5 text-xs font-semibold text-[var(--muted)]"}>{feature.priority}</span><div><p className="font-medium">{feature.name}</p><p className="mt-1 text-[var(--muted)]">{feature.description}</p></div></li>)}</ul></Section>
        <Section title="유저 플로우"><ol className="list-decimal space-y-2 pl-5">{spec.user_flow.map((step) => <li key={step}>{step}</li>)}</ol></Section>
        <Section title="화면"><ul className="space-y-3">{spec.screens.map((screen) => <li key={screen.name}><strong>{screen.name}</strong><span className="text-[var(--muted)]"> — {screen.purpose}</span></li>)}</ul></Section>
        <Section title="데이터 모델 / API"><div className="space-y-4 font-mono text-sm leading-6">{spec.data_model.map((model) => <p key={model.table}>{model.table} ({model.columns.join(", ")})</p>)}{spec.api_endpoints.map((endpoint) => <p key={`${endpoint.method}-${endpoint.path}`}>{endpoint.method} {endpoint.path} — {endpoint.description}</p>)}</div></Section>
        <Section title="이번에 안 하는 것"><ul className="list-disc space-y-2 pl-5">{spec.out_of_scope.map((item) => <li key={item}>{item}</li>)}</ul></Section>
        <Section title="리스크"><ul className="list-disc space-y-2 pl-5">{spec.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></Section>
        <Section title="첫 프롬프트"><pre className="whitespace-pre-wrap rounded-lg bg-[var(--bg)] p-4 font-mono text-sm leading-6">{spec.first_prompt}</pre></Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section><h3 className="text-base font-semibold">{title}</h3><div className="mt-3 leading-7 text-[var(--text)]">{children}</div></section>;
}
