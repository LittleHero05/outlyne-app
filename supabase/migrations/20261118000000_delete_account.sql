-- Let a signed-in user delete their own account.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- The apps first remove the user's photos from the card-photos bucket (storage
-- policies already allow that), then call this function. Deleting the auth
-- user cascades to public.cards through its foreign key.

create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
