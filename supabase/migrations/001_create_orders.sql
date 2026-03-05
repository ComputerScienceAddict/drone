-- Run this in Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- Creates orders table for storing checkout data

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  items jsonb not null,
  total decimal not null,
  latitude decimal not null,
  longitude decimal not null,
  accuracy decimal default 0
);

-- Enable Row Level Security (RLS)
alter table orders enable row level security;

-- Allow anonymous inserts (for checkout without auth)
create policy "Allow anon insert on orders"
  on orders for insert
  to anon
  with check (true);
