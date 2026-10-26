"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { RegistrationResponse } from "@/lib/types";

export default function ResponsesPage() {
  return <Suspense fallback={<Loading />}><ResponsesContent /></Suspense>;
}

function ResponsesContent() {
  const params = useParams<{ id: string }>();
  const [eventName, setEventName] = useState("");
  const [items, setItems] = useState<RegistrationResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResponses() {
      try {
        const response = await fetch(`/api/specs/${params.id}/responses`);
        const result = await response.json() as { error?: string; event_name?: string; items?: RegistrationResponse[] };
        if (!response.ok || !result.items) { setError(result.error || "신청 응답을 불러오지 못했습니다."); return; }
        setEventName(result.event_name || "참가 신청 응답"); setItems(result.items);
      } catch { setError("신청 응답을 불러오지 못했습니다."); }
    }
    void loadResponses();
  }, [params.id]);

  return <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:py-14"><a href="/specs" className="text-sm font-medium text-[var(--accent)] hover:underline">← 내 PRD 목록</a><h1 className="mt-5 text-2xl font-semibold tracking-tight">{eventName || "참가 신청 응답"}</h1><p className="mt-2 text-[var(--muted)]">운영진 전용 화면입니다.</p><div className="mt-8 space-y-3">{items === null && !error ? <p className="text-[var(--muted)]">불러오는 중...</p> : null}{error ? <p className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent)]">{error}</p> : null}{items?.length === 0 ? <p className="text-[var(--muted)]">아직 제출된 신청서가 없습니다.</p> : null}{items?.map((item) => <article key={item.id} className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-5"><p className="text-sm text-[var(--muted)]">{new Date(item.created_at).toLocaleString("ko-KR")}</p><h2 className="mt-2 font-semibold">{item.name} · {item.preferred_language}</h2><p className="mt-3 text-sm font-semibold">식단·알레르기 / Dietary restrictions or allergies</p><p className="text-[var(--muted)]">{item.dietary_allergies || "없음"}</p><p className="mt-3 text-sm font-semibold">필요한 지원 / Support needed</p><p className="text-[var(--muted)]">{item.support_needs || "없음"}</p></article>)}</div></main>;
}

function Loading() { return <main className="mx-auto min-h-screen max-w-2xl px-4 py-10"><p className="text-[var(--muted)]">불러오는 중...</p></main>; }
