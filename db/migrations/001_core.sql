-- LinkDrim MVP. Apply in a fresh Supabase SQL Editor; retain a database backup before upgrades.
create extension if not exists pgcrypto;
create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','admin','super_admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]([a-z0-9-]{1,38}[a-z0-9])?$'),
  status text not null default 'draft' check (status in ('draft','published','paused','pending_deletion')),
  home_template text check (home_template in ('profile','business-card','link')),
  content jsonb not null default '{}'::jsonb,
  published_content jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{"seoIndex":true}'::jsonb,
  revision bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_members (
  site_id uuid not null references public.sites(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(site_id,user_id)
);
create table if not exists public.site_templates (
  site_id uuid not null references public.sites(id) on delete cascade,
  template_key text not null check (template_key in ('profile','business-card','link')),
  enabled boolean not null default false,
  version text not null default '1.0.0',
  primary key(site_id,template_key)
);
create table if not exists public.site_history (
  id bigint generated always as identity primary key,
  site_id uuid not null references public.sites(id) on delete cascade,
  revision bigint not null,
  actor_id uuid references auth.users(id) on delete set null,
  operation text not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique(site_id,revision)
);
create table if not exists public.site_invites (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  token_sha256 text not null unique,
  expires_at timestamptz not null,
  consumed_by uuid references auth.users(id),
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.site_issues (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete set null,
  fingerprint text not null unique,
  category text not null,
  message text not null,
  occurrence_count bigint not null default 1,
  state text not null default 'open' check(state in ('open','investigating','resolved')),
  notion_page_id text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table if not exists public.visit_events (
  id bigint generated always as identity primary key,
  site_id uuid not null references public.sites(id) on delete cascade,
  template_key text not null,
  kind text not null check (kind in ('view','link','social','phone','email','duration')),
  target text not null default '',
  session_id uuid not null,
  source text,
  referrer_host text,
  occurred_at timestamptz not null default now()
);
create index if not exists visit_events_site_time on public.visit_events(site_id,occurred_at desc);
create index if not exists visit_events_site_kind on public.visit_events(site_id,kind);
create index if not exists site_members_user on public.site_members(user_id);
-- User-controlled URL keys must not shadow reserved application routes.
create or replace function public.protect_site_slug() returns trigger language plpgsql as $$
begin
  if new.slug = any(array['admin','dashboard','login','api','auth','invite','about','demo','_next']) then
    raise exception 'Reserved URL key';
  end if;
  return new;
end;$$;
drop trigger if exists tr_site_slug on public.sites;
create trigger tr_site_slug before insert or update of slug on public.sites for each row execute function public.protect_site_slug();
-- Prevent access to all tables unless a policy explicitly allows it.
alter table public.app_users enable row level security;
alter table public.sites enable row level security;
alter table public.site_members enable row level security;
alter table public.site_templates enable row level security;
alter table public.site_history enable row level security;
alter table public.site_invites enable row level security;
alter table public.site_issues enable row level security;
alter table public.visit_events enable row level security;
create policy "users see self" on public.app_users for select to authenticated using(id=auth.uid());
create policy "sites accessible to members" on public.sites for select to authenticated using(
  exists (select 1 from public.site_members m where m.site_id=sites.id and m.user_id=auth.uid())
  or exists(select 1 from public.app_users a where a.id=auth.uid() and a.role='super_admin')
);
create policy "members see own memberships" on public.site_members for select to authenticated using(user_id=auth.uid());
create policy "members see assigned templates" on public.site_templates for select to authenticated using(
  exists(select 1 from public.site_members m where m.site_id=site_templates.site_id and m.user_id=auth.uid())
);
-- Single atomic mutation. SECURITY DEFINER must be permission-checked internally.
create or replace function public.save_site(
  p_site_id uuid, p_revision bigint, p_slug text, p_content jsonb, p_templates jsonb, p_home text
) returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid:=auth.uid();v_revision bigint;v_current public.sites%rowtype;v_tpl jsonb;
begin
  if v_actor is null or not (
    exists(select 1 from public.site_members where site_id=p_site_id and user_id=v_actor)
    or exists(select 1 from public.app_users where id=v_actor and role='super_admin')
  ) then raise exception 'FORBIDDEN';end if;
  if p_home is not null and not exists(select 1 from jsonb_array_elements(p_templates) t where t->>'key'=p_home and (t->>'enabled')::boolean) then
     raise exception 'HOME_TEMPLATE_DISABLED';end if;
  if jsonb_typeof(p_content) <> 'object' or jsonb_typeof(p_templates) <> 'array' then raise exception 'INVALID_PAYLOAD';end if;
  if exists(select 1 from jsonb_array_elements(p_templates) t where (t->>'enabled')::boolean)
     and (nullif(btrim(p_content->>'name'),'') is null or nullif(btrim(p_content->>'headline'),'') is null) then
     raise exception 'REQUIRED_PROFILE_DATA';
  end if;
  if exists(select 1 from jsonb_array_elements(p_templates) t where t->>'key'='profile' and (t->>'enabled')::boolean)
     and nullif(btrim(p_content->>'bio'),'') is null then raise exception 'REQUIRED_BIO';end if;
  if exists(select 1 from jsonb_array_elements(p_templates) t where t->>'key'='business-card' and (t->>'enabled')::boolean)
     and nullif(btrim(p_content->>'phone'),'') is null and nullif(btrim(p_content->>'email'),'') is null then raise exception 'REQUIRED_CONTACT';end if;
  if exists(select 1 from jsonb_array_elements(p_templates) t where t->>'key'='link' and (t->>'enabled')::boolean)
     and not exists(select 1 from jsonb_array_elements(coalesce(p_content->'links','[]'::jsonb)) l
       where l->>'visible'='true' and nullif(btrim(l->>'title'),'') is not null
       and (l->>'url') ~ '^(https?://|mailto:|tel:)') then raise exception 'REQUIRED_LINK';end if;
  select * into v_current from public.sites where id=p_site_id for update;
  if not found then raise exception 'SITE_NOT_FOUND';end if;
  if v_current.revision <> p_revision then raise exception 'STALE_REVISION';end if;
  update public.sites set slug=p_slug,content=p_content,published_content=p_content,home_template=p_home,
    revision=revision+1,updated_at=now() where id=p_site_id returning revision into v_revision;
  delete from public.site_templates where site_id=p_site_id;
  for v_tpl in select * from jsonb_array_elements(p_templates) loop
     insert into public.site_templates(site_id,template_key,enabled,version)
     values(p_site_id,v_tpl->>'key',(v_tpl->>'enabled')::boolean,v_tpl->>'version');
  end loop;
  insert into public.site_history(site_id,revision,actor_id,operation,snapshot)
  values(p_site_id,v_revision,v_actor,'save',jsonb_build_object('content',p_content,'slug',p_slug,'home',p_home,'templates',p_templates));
  return v_revision;
end;$$;
revoke all on function public.save_site(uuid,bigint,text,jsonb,jsonb,text) from public, anon;
grant execute on function public.save_site(uuid,bigint,text,jsonb,jsonb,text) to authenticated;
-- One-use invite, race-safe under row locking; owner verifies the token out of band.
create or replace function public.accept_site_invite(p_hash text) returns uuid
 language plpgsql security definer set search_path = '' as $$
declare v_invite public.site_invites%rowtype;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED';end if;
  select * into v_invite from public.site_invites where token_sha256=p_hash for update;
  if not found or v_invite.consumed_at is not null or v_invite.expires_at<now() then raise exception 'INVALID_INVITE';end if;
  insert into public.site_members(site_id,user_id) values(v_invite.site_id,auth.uid()) on conflict do nothing;
  update public.site_invites set consumed_at=now(),consumed_by=auth.uid() where id=v_invite.id;
  return v_invite.site_id;
end;$$;
revoke all on function public.accept_site_invite(text) from public,anon;
grant execute on function public.accept_site_invite(text) to authenticated;
-- Bootstrap super admin after their first successful OAuth login:
-- insert into public.app_users(id,role) values ('AUTH_USER_UUID','super_admin')
-- on conflict(id) do update set role='super_admin';
-- Storage is public-read only for renderable images; upload requires site membership.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('site-images','site-images',true,8388608,array['image/png','image/jpeg','image/webp'])
on conflict(id) do nothing;
create policy "Site members upload optimized images" on storage.objects
for insert to authenticated with check(bucket_id='site-images' and (exists(
 select 1 from public.site_members m where m.site_id::text=(storage.foldername(name))[1] and m.user_id=auth.uid()
) or exists(select 1 from public.app_users a where a.id=auth.uid() and a.role='super_admin')));
create policy "Public reads approved image bucket" on storage.objects
for select to public using(bucket_id='site-images');
-- Atomic administrative restore, audited as a new version. Never rolls back users, analytics or domains.
create or replace function public.restore_site(p_site_id uuid,p_revision bigint,p_reset boolean default false)
returns bigint language plpgsql security definer set search_path='' as $$
declare v_site public.sites%rowtype;v_snapshot jsonb;v_next bigint;v_tpl jsonb;
begin
 if not exists(select 1 from public.app_users where id=auth.uid() and role='super_admin') then raise exception 'FORBIDDEN'; end if;
 select * into v_site from public.sites where id=p_site_id for update;
 if not found then raise exception 'SITE_NOT_FOUND';end if;
 if p_reset then
   v_snapshot=jsonb_build_object('content','{}'::jsonb,'slug',v_site.slug,'home',null,'templates','[]'::jsonb);
 else
   select snapshot into v_snapshot from public.site_history where site_id=p_site_id and revision=p_revision;
   if not found then raise exception 'HISTORY_NOT_FOUND';end if;
 end if;
 v_next=v_site.revision+1;
 update public.sites set content=v_snapshot->'content',published_content=v_snapshot->'content',
 home_template=v_snapshot->>'home',revision=v_next,updated_at=now() where id=p_site_id;
 -- URL changes are deliberately NOT restored, so an old slug cannot steal another tenant's URL.
 delete from public.site_templates where site_id=p_site_id;
 for v_tpl in select * from jsonb_array_elements(coalesce(v_snapshot->'templates','[]'::jsonb)) loop
   insert into public.site_templates(site_id,template_key,enabled,version)
   values(p_site_id,v_tpl->>'key',(v_tpl->>'enabled')::boolean,v_tpl->>'version');
 end loop;
 insert into public.site_history(site_id,revision,actor_id,operation,snapshot)
 values(p_site_id,v_next,auth.uid(),case when p_reset then 'reset' else 'restore' end,
 jsonb_set(v_snapshot,'{slug}',to_jsonb(v_site.slug)));
 return v_next;
end;$$;
revoke all on function public.restore_site(uuid,bigint,boolean) from public,anon;
grant execute on function public.restore_site(uuid,bigint,boolean) to authenticated;
