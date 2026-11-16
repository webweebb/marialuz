-- Execute no SQL Editor de um projeto Supabase novo.
create table public.team_members (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.team_members enable row level security;
-- A equipe só pode ser autorizada pelo administrador no SQL Editor.
create policy "member can check own access" on public.team_members
  for select to authenticated using (user_id = auth.uid());

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users(id),
  version integer not null default 1 check (version > 0),
  date date not null,
  name text not null default '',
  phone text not null check (length(trim(phone)) between 1 and 40),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null check (currency in ('BRL','MXN','ARS','CLP','USD','EUR')),
  quantity integer not null check (quantity between 1 and 1000),
  themes text not null check (length(trim(themes)) between 1 and 2000),
  album text not null check (album ~ '^https://(photos[.]app[.]goo[.]gl|photos[.]google[.]com)(/|$)'),
  producer text not null default '',
  reviewer text not null default '',
  status smallint not null default 0 check (status between 0 and 3),
  caption text not null default '',
  notes text not null default '',
  checks boolean[] not null default array[false,false,false,false,false,false,false],
  constraint valid_checklist check (array_ndims(checks)=1 and array_lower(checks,1)=1 and cardinality(checks)=7 and array_position(checks,null) is null),
  constraint completed_review check (status <> 3 or (checks = array[true,true,true,true,true,true,true] and length(trim(reviewer)) > 0))
);
alter table public.orders enable row level security;
create policy "team reads orders" on public.orders for select to authenticated
 using (exists(select 1 from public.team_members where user_id=auth.uid()));
create policy "team creates orders" on public.orders for insert to authenticated
 with check (exists(select 1 from public.team_members where user_id=auth.uid()));
create policy "team updates orders" on public.orders for update to authenticated
 using (exists(select 1 from public.team_members where user_id=auth.uid()))
 with check (exists(select 1 from public.team_members where user_id=auth.uid()));
create function public.track_order_update() returns trigger language plpgsql set search_path=public as $$
begin
  if new.version <> old.version + 1 then
    raise exception 'Atualize a lista antes de salvar este pedido.';
  end if;
  new.updated_at=now();
  new.updated_by=auth.uid();
  new.created_at=old.created_at;
  return new;
end;
$$;
create trigger track_order_update before update on public.orders
for each row execute function public.track_order_update();
grant select on public.team_members to authenticated;
grant select,insert,update on public.orders to authenticated;
revoke all on public.orders from anon;
revoke all on public.team_members from anon;
create index orders_date_idx on public.orders(date desc);
create index orders_status_idx on public.orders(status);

-- Depois de criar cada usuário no painel Authentication > Users,
-- autorize o UUID dele executando (substitua o valor):
-- insert into public.team_members (user_id) values ('UUID-DO-USUARIO');
