-- ============================================================================
-- Make A Portion — Row Level Security (RLS) policies
-- Paste this whole file into the Supabase SQL Editor and run it.
-- It is idempotent: every policy is dropped first, so you can re-run it safely.
-- ============================================================================
--
-- COLUMN ASSUMPTIONS  (adjust the names if your tables differ):
--   * Every table that belongs to a user has a `user_id uuid` column that
--     stores the owner's auth id (i.e. user_id = auth.uid()).
--       - "Users".user_id        -> the auth.users id
--       - "Recipe".user_id        -> recipe owner
--       - "Ratings".user_id, "Favorites".user_id, "Comments".user_id
--   * "Recipe".id is the recipe primary key.
--   * "Recipe-Ingredients".recipe_id references "Recipe".id.
--   * "Ingredient" and "Category" are a global shared library (no per-user owner).
--
-- POLICY MODEL (recipe-sharing app with public browsing):
--   * Anyone (even logged-out guests) can READ recipes, ingredients, categories,
--     ratings, comments, the recipe-ingredients junction, and user profiles.
--   * Favorites are PRIVATE — only the owner can read them.
--   * Logged-in users can only INSERT / UPDATE / DELETE their OWN rows.
--   * The global Ingredient/Category library: anyone logged in can ADD, but it
--     is locked against edits/deletes by normal users (manage those from the
--     dashboard, which bypasses RLS, or add an admin policy later).
-- ============================================================================


-- ============================================================================
-- 1. Enable RLS on every table
--    (With RLS on and NO matching policy, access is denied by default.)
-- ============================================================================
alter table "Users"              enable row level security;
alter table "Recipe"             enable row level security;
alter table "Ingredient"         enable row level security;
alter table "Recipe-Ingredients" enable row level security;
alter table "Category"           enable row level security;
alter table "Ratings"            enable row level security;
alter table "Favorites"          enable row level security;
alter table "Comments"           enable row level security;


-- ============================================================================
-- 2. USERS  — public profiles; each user manages only their own row
-- ============================================================================
drop policy if exists "Users are viewable by everyone"      on "Users";
drop policy if exists "Users can insert their own profile"  on "Users";
drop policy if exists "Users can update their own profile"  on "Users";
drop policy if exists "Users can delete their own profile"  on "Users";

create policy "Users are viewable by everyone"
  on "Users" for select
  using (true);

create policy "Users can insert their own profile"
  on "Users" for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own profile"
  on "Users" for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own profile"
  on "Users" for delete
  to authenticated
  using (user_id = auth.uid());


-- ============================================================================
-- 3. RECIPE  — anyone can read; owner manages their own recipes
-- ============================================================================
drop policy if exists "Recipes are viewable by everyone" on "Recipe";
drop policy if exists "Users can create recipes"         on "Recipe";
drop policy if exists "Users can update own recipes"     on "Recipe";
drop policy if exists "Users can delete own recipes"     on "Recipe";

create policy "Recipes are viewable by everyone"
  on "Recipe" for select
  using (true);

create policy "Users can create recipes"
  on "Recipe" for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own recipes"
  on "Recipe" for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own recipes"
  on "Recipe" for delete
  to authenticated
  using (user_id = auth.uid());


-- ============================================================================
-- 4. INGREDIENT  — global library: read for all, add for logged-in users.
--    (No update/delete policy = normal users cannot edit/remove. Manage from
--     the Supabase dashboard, or add an admin policy later.)
-- ============================================================================
drop policy if exists "Ingredients are viewable by everyone"  on "Ingredient";
drop policy if exists "Authenticated users can add ingredients" on "Ingredient";

create policy "Ingredients are viewable by everyone"
  on "Ingredient" for select
  using (true);

create policy "Authenticated users can add ingredients"
  on "Ingredient" for insert
  to authenticated
  with check (true);


-- ============================================================================
-- 5. CATEGORY  — same global-library model as Ingredient
-- ============================================================================
drop policy if exists "Categories are viewable by everyone"   on "Category";
drop policy if exists "Authenticated users can add categories" on "Category";

create policy "Categories are viewable by everyone"
  on "Category" for select
  using (true);

create policy "Authenticated users can add categories"
  on "Category" for insert
  to authenticated
  with check (true);


-- ============================================================================
-- 6. RECIPE-INGREDIENTS  (junction)
--    Anyone can read. A user may only add/change/remove ingredient links for
--    recipes they OWN (checked against "Recipe".user_id).
-- ============================================================================
drop policy if exists "Recipe ingredients are viewable by everyone" on "Recipe-Ingredients";
drop policy if exists "Users can add ingredients to own recipes"    on "Recipe-Ingredients";
drop policy if exists "Users can update ingredients of own recipes"  on "Recipe-Ingredients";
drop policy if exists "Users can delete ingredients of own recipes"  on "Recipe-Ingredients";

create policy "Recipe ingredients are viewable by everyone"
  on "Recipe-Ingredients" for select
  using (true);

create policy "Users can add ingredients to own recipes"
  on "Recipe-Ingredients" for insert
  to authenticated
  with check (
    exists (
      select 1 from "Recipe" r
      where r.id = recipe_id
        and r.user_id = auth.uid()
    )
  );

create policy "Users can update ingredients of own recipes"
  on "Recipe-Ingredients" for update
  to authenticated
  using (
    exists (
      select 1 from "Recipe" r
      where r.id = recipe_id
        and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from "Recipe" r
      where r.id = recipe_id
        and r.user_id = auth.uid()
    )
  );

create policy "Users can delete ingredients of own recipes"
  on "Recipe-Ingredients" for delete
  to authenticated
  using (
    exists (
      select 1 from "Recipe" r
      where r.id = recipe_id
        and r.user_id = auth.uid()
    )
  );


-- ============================================================================
-- 7. RATINGS  — anyone can read; users manage only their own ratings
-- ============================================================================
drop policy if exists "Ratings are viewable by everyone" on "Ratings";
drop policy if exists "Users can create own ratings"     on "Ratings";
drop policy if exists "Users can update own ratings"     on "Ratings";
drop policy if exists "Users can delete own ratings"     on "Ratings";

create policy "Ratings are viewable by everyone"
  on "Ratings" for select
  using (true);

create policy "Users can create own ratings"
  on "Ratings" for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own ratings"
  on "Ratings" for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own ratings"
  on "Ratings" for delete
  to authenticated
  using (user_id = auth.uid());


-- ============================================================================
-- 8. FAVORITES  — PRIVATE: each user sees and manages only their own
-- ============================================================================
drop policy if exists "Users can view own favorites"   on "Favorites";
drop policy if exists "Users can create own favorites" on "Favorites";
drop policy if exists "Users can delete own favorites" on "Favorites";

create policy "Users can view own favorites"
  on "Favorites" for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can create own favorites"
  on "Favorites" for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can delete own favorites"
  on "Favorites" for delete
  to authenticated
  using (user_id = auth.uid());


-- ============================================================================
-- 9. COMMENTS  — anyone can read; users manage only their own comments
-- ============================================================================
drop policy if exists "Comments are viewable by everyone" on "Comments";
drop policy if exists "Users can create own comments"     on "Comments";
drop policy if exists "Users can update own comments"     on "Comments";
drop policy if exists "Users can delete own comments"     on "Comments";

create policy "Comments are viewable by everyone"
  on "Comments" for select
  using (true);

create policy "Users can create own comments"
  on "Comments" for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own comments"
  on "Comments" for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own comments"
  on "Comments" for delete
  to authenticated
  using (user_id = auth.uid());

-- ============================================================================
-- Done. Verify in: Supabase → Authentication → Policies (or Table Editor → RLS).
-- ============================================================================
