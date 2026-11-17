-- Saved cards for signed-in users.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to read before running: it only creates new objects and touches no
-- existing table (the waitlist table is unaffected).

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  activity text not null check (activity in ('reading', 'workout', 'habit', 'recipe')),
  -- The ActivityDraft.details object from @outlyne/core, minus any local photo URL.
  details jsonb not null,
  outline_color text not null,
  -- Supabase Storage path for a background photo. Unused until photo upload ships.
  photo_path text,
  created_at timestamptz not null default now()
);

create index cards_user_created_idx on public.cards (user_id, created_at desc);

-- Row level security: each user sees and changes only their own cards.
alter table public.cards enable row level security;

create policy "Users read their own cards"
  on public.cards for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users save their own cards"
  on public.cards for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users delete their own cards"
  on public.cards for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Free-tier limit. Keep in sync with FREE_CARD_LIMIT in packages/core.
create function public.enforce_card_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.cards where user_id = new.user_id) >= 20 then
    raise exception 'card_limit_reached'
      using hint = 'Free accounts can save up to 20 cards.';
  end if;
  return new;
end;
$$;

create trigger cards_enforce_limit
  before insert on public.cards
  for each row execute function public.enforce_card_limit();
