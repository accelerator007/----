-- خوص (KHOOS) — مخطط أولي لـ Supabase
-- نفّذ الملف كاملاً من: Dashboard → SQL Editor → New query → Run

-- امتدادات
create extension if not exists "pgcrypto";

-- أنواع مساعدة
do $$ begin
  create type public.user_role as enum ('farmer', 'engineer', 'admin');
exception when duplicate_object then null;
end $$;

-- الملفات الشخصية (مرتبطة بـ auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  role text not null default 'farmer' check (role in ('farmer', 'engineer', 'admin')),
  full_name text default '',
  subtitle text default '',
  farm_name text default '',
  phone text default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- مزارع
create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  name text not null,
  region text default '',
  hectares numeric default 0,
  risk text default 'low' check (risk in ('low', 'med', 'high')),
  created_at timestamptz not null default now()
);

-- مصايد
create table if not exists public.traps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  farm_id uuid references public.farms on delete set null,
  code text unique,
  name text not null,
  region text default '',
  status text not null default 'نشط',
  battery_pct int not null default 100 check (battery_pct >= 0 and battery_pct <= 100),
  signal_pct int not null default 100 check (signal_pct >= 0 and signal_pct <= 100),
  insects_today int not null default 0,
  insects_week int not null default 0,
  lat double precision,
  lng double precision,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- تنبيهات
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  trap_id uuid references public.traps on delete cascade,
  user_id uuid references auth.users on delete set null,
  severity text not null check (severity in ('critical', 'warn', 'info')),
  title text not null default '',
  body text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- تقارير مجدولة (شاشة التحليلات)
create table if not exists public.scheduled_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  frequency_label text not null,
  recipients_count int not null default 1 check (recipients_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- مهام مهندس (اختياري للجوال)
create table if not exists public.engineer_tasks (
  id uuid primary key default gen_random_uuid(),
  trap_id uuid references public.traps on delete set null,
  farm_name text default '',
  trap_code text default '',
  title text not null,
  due_label text default '',
  status text not null default 'open' check (status in ('open', 'done', 'cancelled')),
  assignee_id uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

-- تحديث updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_profiles_updated on public.profiles;
create trigger tr_profiles_updated before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists tr_traps_updated on public.traps;
create trigger tr_traps_updated before update on public.traps
for each row execute procedure public.set_updated_at();

-- عند تسجيل مستخدم جديد في Auth
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role, full_name, subtitle, farm_name, phone)
  values (
    new.id,
    new.email,
    'farmer',
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'farm_name', ''),
    coalesce(new.raw_user_meta_data->>'farm_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    farm_name = coalesce(nullif(excluded.farm_name, ''), profiles.farm_name),
    subtitle = coalesce(nullif(excluded.subtitle, ''), profiles.subtitle),
    phone = coalesce(nullif(excluded.phone, ''), profiles.phone);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.traps enable row level security;
alter table public.alerts enable row level security;
alter table public.scheduled_reports enable row level security;
alter table public.engineer_tasks enable row level security;

-- profiles
create policy "profiles_self_select" on public.profiles for select
  using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "profiles_self_update" on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_admin_update" on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- farms
create policy "farms_select" on public.farms for select using (
  owner_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
);

create policy "farms_insert_owner" on public.farms for insert with check (owner_id = auth.uid());

create policy "farms_update_owner" on public.farms for update using (owner_id = auth.uid());

create policy "farms_update_admin" on public.farms for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "farms_delete_owner" on public.farms for delete using (
  owner_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- traps
create policy "traps_select" on public.traps for select using (
  owner_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
);

create policy "traps_insert" on public.traps for insert with check (
  owner_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "traps_update" on public.traps for update using (
  owner_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
);

-- alerts
create policy "alerts_select" on public.alerts for select using (
  exists (
    select 1 from public.traps t
    where t.id = alerts.trap_id
      and (
        t.owner_id = auth.uid()
        or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
      )
  )
  or user_id = auth.uid()
);

create policy "alerts_insert" on public.alerts for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
  or exists (
    select 1 from public.traps t where t.id = trap_id and t.owner_id = auth.uid()
  )
);

create policy "alerts_update" on public.alerts for update using (
  exists (
    select 1 from public.traps t
    where t.id = alerts.trap_id and t.owner_id = auth.uid()
  )
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
);

-- scheduled_reports
create policy "sched_reports_owner" on public.scheduled_reports for all using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- engineer_tasks
create policy "eng_tasks_select" on public.engineer_tasks for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
  or assignee_id = auth.uid()
);

create policy "eng_tasks_insert_staff" on public.engineer_tasks for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
);

create policy "eng_tasks_update_staff" on public.engineer_tasks for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','engineer'))
);

create policy "eng_tasks_delete_admin" on public.engineer_tasks for delete using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
