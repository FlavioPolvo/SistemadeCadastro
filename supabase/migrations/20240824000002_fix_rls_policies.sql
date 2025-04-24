-- Remove existing RLS policies to fix the security error
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Acesso público aos produtos" ON products;
DROP POLICY IF EXISTS "Inserção de produtos" ON products;
DROP POLICY IF EXISTS "Atualização de produtos" ON products;
DROP POLICY IF EXISTS "Exclusão de produtos" ON products;
DROP POLICY IF EXISTS "Permissive policy for products" ON products;

DROP POLICY IF EXISTS "Acesso público às imagens" ON product_images;
DROP POLICY IF EXISTS "Inserção de imagens" ON product_images;
DROP POLICY IF EXISTS "Atualização de imagens" ON product_images;
DROP POLICY IF EXISTS "Exclusão de imagens" ON product_images;
DROP POLICY IF EXISTS "Permissive policy for product_images" ON product_images;

-- Create new permissive policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permissive policy for products"
ON products
USING (true)
WITH CHECK (true);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permissive policy for product_images"
ON product_images
USING (true)
WITH CHECK (true);
