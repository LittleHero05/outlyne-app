-- Background photos for saved cards.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Only adds a new private storage bucket and policies for it.

-- Private bucket: photos are only reachable through short-lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'card-photos',
  'card-photos',
  false,
  10485760, -- 10 MB per photo
  array['image/jpeg', 'image/png', 'image/heic', 'image/webp']
)
on conflict (id) do nothing;

-- Each user's photos live under a folder named with their user id,
-- e.g. card-photos/<user id>/<file>. These policies only allow that folder.

create policy "Users upload their own card photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users read their own card photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users delete their own card photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
