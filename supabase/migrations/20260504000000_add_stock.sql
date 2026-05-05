-- Add per-size stock tracking to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock jsonb NOT NULL DEFAULT '{"S":0,"M":0,"L":0,"XL":0}';

-- Seed initial stock for the active hoodie
UPDATE products
  SET stock = '{"S":5,"M":10,"L":10,"XL":0}'
  WHERE is_active = true;

-- Atomically decrement stock for a given product+size.
-- Uses FOR UPDATE row lock to prevent concurrent overselling.
-- Returns true if stock was successfully decremented, false if insufficient stock.
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id uuid, p_size text, p_qty integer)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  current_stock integer;
BEGIN
  SELECT (stock->>p_size)::integer INTO current_stock
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  IF current_stock IS NULL OR current_stock < p_qty THEN
    RETURN false;
  END IF;

  UPDATE products
  SET stock = jsonb_set(stock, ARRAY[p_size], ((current_stock - p_qty)::text)::jsonb)
  WHERE id = p_product_id;

  RETURN true;
END;
$$;
