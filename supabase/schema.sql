-- MedBot progress table — run once in the Supabase SQL editor.
-- Creates the per-user progress row and locks it to its owner (RLS).

create table if not exists public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  lessons text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "own progress read"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "own progress insert"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "own progress update"
  on public.progress for update
  using (auth.uid() = user_id);

-- Chat conversations, one row per message. RLS keeps every row owner-only.
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  character_id text not null default 'maya',
  sender text not null check (sender in ('bot', 'user')),
  text text not null,
  lesson text,
  created_at timestamptz not null default now()
);

create index if not exists messages_user_char_idx
  on public.messages (user_id, character_id, id desc);

alter table public.messages enable row level security;

create policy "own messages read"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "own messages insert"
  on public.messages for insert
  with check (auth.uid() = user_id);
