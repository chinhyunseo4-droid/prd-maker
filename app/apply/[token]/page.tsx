"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import type { RegistrationForm } from "@/lib/types";

export default function ApplicationPage() {
  const params = useParams<{ token: string }>();
  const [form, setForm] = useState<RegistrationForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function loadForm() {
      try {
        const response = await fetch(`/api/registrations/${params.token}`);
        const result = await response.json() as { error?: string; form?: RegistrationForm };
        if (!response.ok || !result.form) setError(result.error || "신청서를 불러오지 못했습니다.");
        else setForm(result.form);
      } catch { setError("신청서를 불러오지 못했습니다."); }
    }
    void loadForm();
  }, [params.token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true); setError(null);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/registrations/${params.token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), preferred_language: data.get("preferred_language"), dietary_allergies: data.get("dietary_allergies") || "", support_needs: data.get("support_needs") || "" }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) setError(result.error || "신청서 제출에 실패했습니다."); else setIsComplete(true);
    } catch { setError("신청서 제출에 실패했습니다."); }
    finally { setIsSubmitting(false); }
  }

  if (error && !form) return <Message text={error} />;
  if (!form) return <Message text="불러오는 중..." />;
  if (isComplete) return <Message text="신청이 완료되었습니다. / Your registration has been submitted." />;

  return <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:py-14"><section className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"><p className="text-sm font-medium text-[var(--accent)]">참가 신청 / Registration</p><h1 className="mt-2 text-2xl font-semibold">{form.event_name}</h1><Guide form={form} /><form onSubmit={submit} className="mt-8 space-y-5"><Field label="이름 / Name" name="name" required /><Field label="사용 언어 / Preferred language" name="preferred_language" placeholder="한국어, English" required /><Field label="식단·알레르기 / Dietary restrictions or allergies" name="dietary_allergies" multiline /><Field label="필요한 지원 / Support you need" name="support_needs" multiline /><button disabled={isSubmitting} className="w-full rounded-lg bg-[var(--accent)] px-5 py-3.5 font-medium text-white disabled:cursor-not-allowed disabled:bg-[var(--accent-disabled)]">{isSubmitting ? "제출 중... / Submitting..." : "신청 제출 / Submit registration"}</button></form>{error ? <p className="mt-4 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-3 text-sm text-[var(--accent)]">{error}</p> : null}</section></main>;
}

function Guide({ form }: { form: RegistrationForm }) { const guide = form.guide; return <dl className="mt-6 space-y-3 border-t border-[var(--border)] pt-5 text-sm leading-6"><Item label="목적 / Purpose" value={guide.purpose} /><Item label="일정 / Schedule" value={guide.schedule} /><Item label="장소 / Venue" value={guide.venue} /><Item label="준비물 / Items to prepare" value={guide.items_to_prepare} /><Item label="식단 안내 / Dietary notice" value={guide.dietary_notice} /></dl>; }
function Item({ label, value }: { label: string; value: string }) { return <div><dt className="font-semibold">{label}</dt><dd className="text-[var(--muted)]">{value}</dd></div>; }
function Field({ label, name, placeholder, required, multiline }: { label: string; name: string; placeholder?: string; required?: boolean; multiline?: boolean }) { const className = "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"; return <label className="block text-sm font-medium">{label}{multiline ? <textarea name={name} placeholder={placeholder} rows={3} className={className} /> : <input name={name} placeholder={placeholder} required={required} className={className} />}</label>; }
function Message({ text }: { text: string }) { return <main className="mx-auto min-h-screen max-w-2xl px-4 py-10"><p className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-6 leading-7">{text}</p></main>; }
