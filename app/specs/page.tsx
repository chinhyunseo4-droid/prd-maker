"use client";

import { useEffect, useState } from "react";
import type { SpecListItem } from "@/lib/types";

export default function SpecsPage() {
  const [items, setItems] = useState<SpecListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpecs() {
      try {
        const response = await fetch("/api/specs");
        const result = await response.json() as { error?: string; items?: SpecListItem[] };
        if (!response.ok || !result.items) {
          setError(result.error || "PRD 목록을 불러오지 못했습니다.");
          return;
        }
        setItems(result.items);
      } catch {
        setError("PRD 목록을 불러오지 못했습니다.");
      }
    }
    void loadSpecs();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:py-14">
      <a href="/" className="text-sm font-medium text-[var(--accent)] hover:underline">← PRD 만들기</a>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">내 PRD 목록</h1>
      <div className="mt-8 space-y-3">
        {items === null && !error ? <p className="text-[var(--muted)]">불러오는 중...</p> : null}
        {error ? <p className="rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent)]">{error}</p> : null}
        {items?.length === 0 ? <p className="text-[var(--muted)]">아직 만든 PRD가 없다. <a href="/" className="font-medium text-[var(--accent)] hover:underline">PRD 만들기</a></p> : null}
        {items?.map((item) => <article key={item.id} className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-sm text-[var(--muted)]">{item.timeframe} · {new Date(item.created_at).toLocaleDateString("ko-KR")}</p>
          <h2 className="mt-2 font-semibold">{item.product_name}</h2>
          <p className="mt-1 leading-6 text-[var(--muted)]">{item.one_liner}</p>
        </article>)}
      </div>
    </main>
  );
}
