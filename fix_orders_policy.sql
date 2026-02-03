-- Enable Update access for orders table
-- This fixes the "Error updating order" issue by allowing updates to the orders table

CREATE POLICY "Public update orders" ON orders FOR UPDATE USING (true);

-- Also enable Delete if needed later
CREATE POLICY "Public delete orders" ON orders FOR DELETE USING (true);
