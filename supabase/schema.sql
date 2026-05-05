-- ============================================================
-- MCWS Merch Store — Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Products table
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  price_cents  int not null,
  sizes        text[] not null default '{"S","M","L","XL"}',
  stock        jsonb not null default '{"S":0,"M":0,"L":0,"XL":0}',
  images       text[] not null default '{}',
  is_active    boolean not null default true,
  created_at   timestamptz default now()
);

-- Orders table
create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid references products(id),
  size                text not null,
  quantity            int not null default 1,
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text,
  fulfillment_method  text not null check (fulfillment_method in ('shipping', 'pickup')),
  shipping_address    jsonb,
  stripe_session_id   text not null unique,
  stripe_payment_intent text,
  payment_status      text not null default 'paid',
  fulfillment_status  text not null default 'pending',
  tracking_number     text,
  tracking_url        text,
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Atomically decrement per-size stock (FOR UPDATE prevents overselling)
create or replace function decrement_stock(p_product_id uuid, p_size text, p_qty integer)
returns boolean language plpgsql as $$
declare
  current_stock integer;
begin
  select (stock->>p_size)::integer into current_stock
  from products where id = p_product_id for update;

  if current_stock is null or current_stock < p_qty then
    return false;
  end if;

  update products
  set stock = jsonb_set(stock, array[p_size], ((current_stock - p_qty)::text)::jsonb)
  where id = p_product_id;

  return true;
end;
$$;

-- Auto-update updated_at on orders
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Row-Level Security
alter table products enable row level security;
alter table orders enable row level security;

-- Public can read active products
create policy "products: public read active"
  on products for select
  using (is_active = true);

-- Orders: no public access (webhook uses service role key, which bypasses RLS)

-- ============================================================
-- Seed — insert the MCWS Hoodie product
-- Update price_cents, description, and images as needed
-- ============================================================
insert into products (name, description, price_cents, sizes, images, is_active)
values (
  'MCWS Hoodie',
  'A premium heavyweight hoodie representing the Muslim Community of the Western Suburbs of Detroit. Embroidered MCWS logo. Made to order — allow 2–3 weeks.',
  6500,
  '{"S","M","L","XL"}',
  '{}',  -- Replace with Supabase Storage URLs once images are uploaded
  true
);
