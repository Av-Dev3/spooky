# Supabase Database Setup

This directory contains SQL files for setting up the required database tables and storage buckets.

## Required Setup

### 1. Storage Bucket
Create a storage bucket named `media` in your Supabase project:
- Go to Storage in your Supabase dashboard
- Create a new bucket called `media`
- Set it to public or private (your choice)

### 2. Database Table
Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE media_asset (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  tags TEXT[] DEFAULT '{}',
  kind TEXT NOT NULL CHECK (kind IN ('image', 'video')),
  storage_path TEXT NOT NULL UNIQUE,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Run the migration file 002_create_shop_items_table.sql to create the shop items table
```

-- Enable Row Level Security (optional but recommended)
ALTER TABLE media_asset ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON media_asset FOR ALL USING (true);
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)
- `ADMIN_PASSWORD`: The password for admin access
