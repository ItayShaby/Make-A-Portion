-- In-app feedback widget storage.
-- Logged-in users can submit feedback; only the project owner reads it
-- (via the Supabase dashboard, which uses the service role and bypasses RLS).

create table if not exists "Feedback" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references "Users"(id) on delete set null,
  message text not null,
  type text not null default 'Suggestion',
  created_at timestamptz not null default now()
);

alter table "Feedback" enable row level security;

-- Authenticated users may insert their own feedback rows.
drop policy if exists "feedback insert own" on "Feedback";
create policy "feedback insert own"
  on "Feedback" for insert
  to authenticated
  with check (auth.uid() = user_id);

-- No SELECT policy on purpose: regular users cannot read feedback.
-- The owner reads it in the Supabase Table Editor (service role bypasses RLS).
