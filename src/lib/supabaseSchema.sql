-- ========================================================
-- 🛠️ AFINACIONES DE AUTOR - ESQUEMA DE BASE DE DATOS SUPABASE
-- Copia y pega todo este script en: Supabase Dashboard > SQL Editor > Run
-- ========================================================

-- 1. Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- 2. Tabla de Citas & Servicios (Appointments)
create table if not exists public.appointments (
  id text primary key,
  folio text not null,
  client jsonb not null,
  vehicle jsonb not null,
  package_type text not null default 'afinacion_mayor',
  service_description text default '',
  selected_option text,
  quote jsonb,
  status text not null default 'solicitud_pendiente',
  scheduled_date text not null,
  time_slot text not null,
  technician_name text default 'Pedro Almonte (Master Tech)',
  technician_phone text default '+52 55 9876 5432',
  payment_method text default 'on_site_card',
  payment_status text default 'pending',
  cancellation_policy_accepted boolean default true,
  cancellation_fee numeric default 350,
  service_record jsonb,
  next_follow_up_date text,
  follow_up_status text default 'pending',
  created_at timestamptz default now()
);

-- 3. Tabla de Notificaciones
create table if not exists public.notifications (
  id text primary key,
  appointment_id text,
  type text not null,
  channel text not null default 'whatsapp',
  recipient text not null,
  title text not null,
  message text not null,
  metadata jsonb,
  timestamp timestamptz default now()
);

-- 4. Tabla de Configuración de Horarios (Schedule Settings)
create table if not exists public.schedule_settings (
  id text primary key default 'default_settings',
  working_days jsonb not null,
  slots jsonb not null,
  blocked_dates jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- 5. Tabla de Seguridad y Miembros del Equipo
create table if not exists public.security_settings (
  id text primary key default 'default_security',
  admin_pin text not null default '123456',
  technician_pin text not null default '123456',
  staff_members jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- 6. Insertar valores iniciales por defecto si no existen
insert into public.schedule_settings (id, working_days, slots, blocked_dates)
values (
  'default_settings',
  '[
    {"dayOfWeek": 1, "name": "Lunes", "enabled": true},
    {"dayOfWeek": 2, "name": "Martes", "enabled": true},
    {"dayOfWeek": 3, "name": "Miércoles", "enabled": true},
    {"dayOfWeek": 4, "name": "Jueves", "enabled": true},
    {"dayOfWeek": 5, "name": "Viernes", "enabled": true},
    {"dayOfWeek": 6, "name": "Sábado", "enabled": true},
    {"dayOfWeek": 0, "name": "Domingo", "enabled": true}
  ]'::jsonb,
  '[
    {"id": "slot-1", "slot": "09:00 - 11:30", "label": "Mañana (Recomendado)", "active": true},
    {"id": "slot-2", "slot": "12:00 - 14:30", "label": "Mediodía", "active": true},
    {"id": "slot-3", "slot": "15:30 - 18:00", "label": "Tarde", "active": true},
    {"id": "slot-4", "slot": "18:30 - 20:30", "label": "Vespertino", "active": true}
  ]'::jsonb,
  '[]'::jsonb
)
on conflict (id) do nothing;

insert into public.security_settings (id, admin_pin, technician_pin, staff_members)
values (
  'default_security',
  '123456',
  '123456',
  '[
    {
      "id": "staff-1",
      "name": "Pedro Almonte",
      "phone": "+52 55 9876 5432",
      "role": "admin",
      "status": "active",
      "createdAt": "2026-08-24T10:00:00Z"
    },
    {
      "id": "staff-2",
      "name": "Carlos Ruiz (Master Tech)",
      "phone": "+52 55 8899 1122",
      "role": "technician",
      "status": "active",
      "createdAt": "2026-08-24T10:00:00Z"
    }
  ]'::jsonb
)
on conflict (id) do nothing;

-- 7. Configuración de Políticas de Acceso (Row Level Security)
alter table public.appointments enable row level security;
alter table public.notifications enable row level security;
alter table public.schedule_settings enable row level security;
alter table public.security_settings enable row level security;

-- Permitir lectura y escritura completa con clave anónima (anon key)
create policy "Allow all access to appointments" on public.appointments for all using (true) with check (true);
create policy "Allow all access to notifications" on public.notifications for all using (true) with check (true);
create policy "Allow all access to schedule_settings" on public.schedule_settings for all using (true) with check (true);
create policy "Allow all access to security_settings" on public.security_settings for all using (true) with check (true);
