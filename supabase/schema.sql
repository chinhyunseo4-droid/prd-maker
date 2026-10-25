-- PRD 메이커: specs 테이블
-- Supabase 대시보드 > SQL Editor에 전체 붙여넣고 Run.
-- 여러 번 실행해도 안전하다.

create table if not exists public.specs (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  problem      text not null,
  target       text,
  timeframe    text not null default '1주',
  product_name text not null,
  spec         jsonb not null
);

create index if not exists specs_created_at_idx on public.specs (created_at desc);

-- RLS를 켜고 정책(policy)은 하나도 만들지 않는다.
-- => publishable(anon) 키로는 이 테이블을 읽지도 쓰지도 못한다.
-- => 우리 서버는 secret 키(service_role)로 접속하는데, 이 키는 RLS를 우회한다.
alter table public.specs enable row level security;

-- 2026-05-30 이후 만든 프로젝트는 새 테이블이 API에 자동 노출되지 않는다.
-- 이 grant가 없으면 "42501 permission denied for table specs" 에러가 난다.
grant select, insert, update, delete on public.specs to service_role;

create table if not exists public.event_forms (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  spec_id            uuid not null unique references public.specs(id) on delete cascade,
  event_name         text not null,
  participant_guide  jsonb not null,
  public_token       text not null unique,
  manager_token_hash text not null
);

create table if not exists public.event_responses (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  form_id              uuid not null references public.event_forms(id) on delete cascade,
  name                 text not null,
  preferred_language   text not null,
  dietary_allergies    text not null,
  support_needs        text not null
);

create index if not exists event_responses_form_created_at_idx on public.event_responses (form_id, created_at desc);
alter table public.event_forms enable row level security;
alter table public.event_responses enable row level security;
grant select, insert, update, delete on public.event_forms to service_role;
grant select, insert, update, delete on public.event_responses to service_role;
