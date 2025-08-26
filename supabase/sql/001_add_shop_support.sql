-- Migration: Add shop support to media_asset table
-- Run this in your Supabase SQL editor

-- Add metadata column for storing shop-specific data
ALTER TABLE media_asset 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add price column for shop items
ALTER TABLE media_asset 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Add processor_url column for shop items
ALTER TABLE media_asset 
ADD COLUMN IF NOT EXISTS processor_url TEXT;

-- Add content_type column if it doesn't exist
ALTER TABLE media_asset 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'unknown';

-- Update existing rows to have empty metadata
UPDATE media_asset 
SET metadata = '{}' 
WHERE metadata IS NULL;

-- Create index on metadata for better query performance
CREATE INDEX IF NOT EXISTS idx_media_asset_metadata ON media_asset USING GIN (metadata);

-- Create index on price for shop queries
CREATE INDEX IF NOT EXISTS idx_media_asset_price ON media_asset (price) WHERE price IS NOT NULL;
