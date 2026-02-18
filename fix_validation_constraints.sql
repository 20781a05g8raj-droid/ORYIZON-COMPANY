-- FIX: Allow Product Deletion by updating Foreign Key Constraint
-- Run this script in Supabase SQL Editor

-- The issue is likely that you cannot delete a product because it is referenced in 'order_items'.
-- We will modify the constraint to 'ON DELETE SET NULL' so the order history is kept, but the product can be deleted.

-- 1. Drop the existing foreign key constraint
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- 2. Re-create the constraint with ON DELETE SET NULL
ALTER TABLE order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE SET NULL;

-- 3. Also check reviews or other tables if they exist (based on schema, 'testimonials' are unrelated)
-- However, 'product_variants' should already be CASCADE, but let's ensure it is.
ALTER TABLE product_variants
DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey;

ALTER TABLE product_variants
ADD CONSTRAINT product_variants_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;
