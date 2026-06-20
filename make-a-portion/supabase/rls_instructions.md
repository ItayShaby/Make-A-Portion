# RLS instructions for the Make A Portion database (for the Supabase-connected assistant)

You are a Supabase SQL expert with access to my "Make A Portion" PostgreSQL
database. Create **Row Level Security (RLS)** policies for the tables below.

## Before you write anything
1. Inspect each table and list its **real column names** — especially the
   owner/foreign-key columns. Do **not** assume names; read them from the schema.
2. Identify, for each user-owned table, the column that holds the **auth user id**
   (the one that should equal `auth.uid()`). I refer to it below as the
   *owner column*. In the `Users` table this is the column linked to `auth.users`.
3. Identify `Recipe`'s primary key and the column in `Recipe-Ingredients` that
   references it.

## Exact table names (case-sensitive — quote them, the junction has a hyphen)
`"Users"`, `"Recipe"`, `"Ingredient"`, `"Recipe-Ingredients"`, `"Category"`,
`"Ratings"`, `"Favorites"`, `"Comments"`.

## Conventions to follow
- Enable RLS on every one of these 8 tables.
- Make the script **idempotent**: `drop policy if exists` before each
  `create policy`, so I can re-run it safely.
- Write **one policy per action** (separate SELECT / INSERT / UPDATE / DELETE) —
  do not combine with `for all`.
- Public-read policies: `for select using (true)` (applies to anon + logged-in).
- Write policies: target `to authenticated` and check ownership with
  `<owner column> = auth.uid()` in both `using` and `with check` where relevant.
- Use clear, descriptive policy names.
- After running, give me a short summary of how many policies were created per table.

## Access model (what each policy should allow)

| Table | SELECT (read) | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| **Users** | Everyone (public profiles) | Own row only (`owner = auth.uid()`) | Own row only | Own row only |
| **Recipe** | Everyone | Logged-in, own row (`owner = auth.uid()`) | Own row | Own row |
| **Ingredient** | Everyone | Any logged-in user (`with check (true)`) | **No policy** (locked) | **No policy** (locked) |
| **Category** | Everyone | Any logged-in user (`with check (true)`) | **No policy** (locked) | **No policy** (locked) |
| **Recipe-Ingredients** | Everyone | Only if the user **owns the parent recipe** | Same ownership check | Same ownership check |
| **Ratings** | Everyone | Own row | Own row | Own row |
| **Favorites** | **Owner only** (private) | Own row | (not needed) | Own row |
| **Comments** | Everyone | Own row | Own row | Own row |

### Notes on the trickier tables
- **Ingredient / Category** are a shared global library. Anyone logged in may
  *add* entries, but normal users must **not** be able to edit or delete them
  (no UPDATE/DELETE policy → denied by default; I'll manage those from the
  dashboard or with an admin policy later).
- **Recipe-Ingredients** (junction): a user may insert/update/delete a link only
  when they own the recipe it points to. Implement this with an `EXISTS` check
  against `Recipe`, e.g.:
  `exists (select 1 from "Recipe" r where r.<recipe PK> = <junction's recipe FK> and r.<owner column> = auth.uid())`
- **Favorites** are private: the SELECT policy must also be restricted to the
  owner (`to authenticated using (owner = auth.uid())`), unlike the other tables.

## Deliverable
Apply the policies to the database, then show me the final SQL you ran and the
per-table summary. If any column name differs from my assumptions, use the real
one from the schema and tell me which you used.
