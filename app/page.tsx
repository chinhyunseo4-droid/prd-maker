"use client";

import { useState, type FormEvent } from "react";
import SpecView from "@/components/SpecView";
import type { Spec } from "@/lib/types";

const mockSpec: Spec = {
  product_name: "Campus Welcome",
  one_liner: "외국인 학생을 위한 한국 대학 문화 행사 기획 도구",
  problem: "처음 한국 대학에 온 외국인 학생은 캠퍼스 문화와 생활 정보를 이해하기 어렵습니다.",
  target_users: [
    { persona: "교환학생", pain: "낯선 대학 문화와 지원 정보를 모릅니다." },
    { persona: "운영진", pain: "참여자 배경을 고려한 행사를 기획하기 어렵습니다." },
  ],
  core_features: [
    { name: "한·영 행사 안내", description: "목적과 준비물을 두 언어로 정리합니다.", priority: "P0" },
    { name: "참여형 문화 활동", description: "처음 만난 학생들의 어색함을 풉니다.", priority: "P0" },
    { name: "식단 안내", description: "식단과 알레르기 정보를 미리 안내합니다.", priority: "P0" },
    { name: "참가 신청서", description: "한·영 질문으로 참가자를 받습니다.", priority: "P1" },
  ],
  user_flow: ["운영진이 행사 아이디어를 입력합니다.", "PRD를 생성합니다.", "기획안을 확인합니다.", "참가자에게 안내를 공유합니다."],
  screens: [
    { name: "PRD 만들기", purpose: "행사 아이디어를 입력합니다." },
    { name: "생성 결과", purpose: "기획안을 확인합니다." },
    { name: "참가 신청", purpose: "참가자가 신청서를 작성합니다." },
  ],
  data_model: [{ table: "events", columns: ["id uuid", "title text", "guide jsonb"] }],
  api_endpoints: [{ method: "POST", path: "/api/specs", description: "행사 PRD 생성" }],
  out_of_scope: ["로그인과 회원가입", "실시간 협업", "결제"],
  risks: ["정해지지 않은 정보를 AI가 임의로 만들 수 있습니다.", "식단 정보가 누락될 수 있습니다."],
  first_prompt: "외국인 학생을 위한 한국 대학 문화 소개 행사 페이지를 만들어줘. 쉬운 한국어와 영어를 함께 사용해줘.",
};

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [spec, setSpec] = useState<Spec | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setSpec(null);
    window.setTimeout(() => {
      setSpec(mockSpec);
      setIsGenerating(false);
    }, 1000);
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
              <select defaultValue="1주" className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]">
                <option>1주</option><option>2주</option><option>1달</option>
              </select>
            </label>
            <button type="submit" disabled={isGenerating} className="w-full rounded-lg bg-[var(--accent)] px-5 py-3.5 font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--accent-disabled)]">
              {isGenerating ? "PRD 작성 중... (10~30초)" : "PRD 만들기"}
            </button>
          </form>
        </section>
        <div className="mt-8" aria-live="polite">{spec ? <SpecView spec={spec} /> : null}</div>
      </main>
    </div>
  );
}

type FieldProps = { label: string; name: string; placeholder: string; required?: boolean; multiline?: boolean };

function Field({ label, name, placeholder, required, multiline }: FieldProps) {
  const className = "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{multiline ? <textarea name={name} placeholder={placeholder} required={required} rows={4} className={className} /> : <input name={name} placeholder={placeholder} required={required} className={className} />}</label>;
}
