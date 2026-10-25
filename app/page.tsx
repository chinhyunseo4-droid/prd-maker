"use client";

import { useState, type FormEvent } from "react";
import SpecView from "@/components/SpecView";
import type { Spec } from "@/lib/types";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [spec, setSpec] = useState<Spec | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setSpec(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"), problem: formData.get("problem"),
          target: formData.get("target") || "", timeframe: formData.get("timeframe"),
        }),
      });
      const result = await response.json() as { error?: string; spec?: Spec };
      if (!response.ok || !result.spec) {
        setError(result.error || "PRD를 만드는 중 문제가 발생했습니다.");
      } else {
        setSpec(result.spec);
      }
    } catch {
      setError("PRD를 만드는 중 문제가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">PRD 메이커</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">행사 아이디어를 실행 가능한 기획으로</p>
          </div>
          <a href="/specs" className="shrink-0 text-sm font-medium text-[var(--accent)] hover:underline">내 PRD 목록</a>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <p className="text-sm font-medium text-[var(--accent)]">행사 기획 시작</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">어떤 행사를 만들고 싶나요?</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">아이디어를 적으면 행사 기획에 필요한 PRD 초안을 만들어 드립니다.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="아이디어 이름" name="title" placeholder="외국인 학생 한국 대학 문화 오리엔테이션" required />
            <Field label="해결하려는 문제" name="problem" placeholder="처음 한국에 온 학생이 캠퍼스 문화를 이해하기 어렵다" required multiline />
            <Field label="타깃 유저 (선택)" name="target" placeholder="한국 대학에 처음 온 외국인 학생" />
            <label className="block">
              <span className="mb-2 block text-sm font-medium">행사 준비 기간</span>
              <select name="timeframe" defaultValue="1주" className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]">
                <option>1주</option><option>2주</option><option>1달</option>
              </select>
            </label>
            <button type="submit" disabled={isGenerating} className="w-full rounded-lg bg-[var(--accent)] px-5 py-3.5 font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--accent-disabled)]">
              {isGenerating ? "PRD 작성 중... (10~30초)" : "PRD 만들기"}
            </button>
          </form>
        </section>
        <div className="mt-8" aria-live="polite">
          {error ? <p className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent)]">{error}</p> : null}
          {spec ? <SpecView spec={spec} /> : null}
        </div>
      </main>
    </div>
  );
}

type FieldProps = { label: string; name: string; placeholder: string; required?: boolean; multiline?: boolean };

function Field({ label, name, placeholder, required, multiline }: FieldProps) {
  const className = "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{multiline ? <textarea name={name} placeholder={placeholder} required={required} rows={4} className={className} /> : <input name={name} placeholder={placeholder} required={required} className={className} />}</label>;
}
