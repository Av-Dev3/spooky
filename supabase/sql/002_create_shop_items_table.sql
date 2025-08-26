-- Migration: Create separate shop_items table
-- Run this in your Supabase SQL editor

-- Create shop_items table
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  processor_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON shop_items FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shop_items_price ON shop_items (price);
CREATE INDEX IF NOT EXISTS idx_shop_items_tags ON shop_items USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_shop_items_created_at ON shop_items (created_at);
