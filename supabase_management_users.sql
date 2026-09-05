-- 1. Create table to store the active/inactive status of users
CREATE TABLE IF NOT EXISTS public.user_status (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Admins can do everything
CREATE POLICY "Admins can manage user status" 
ON public.user_status FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Users can read their own status
CREATE POLICY "Users can view their own status" 
ON public.user_status FOR SELECT 
USING (
  auth.uid() = user_id
);

-- 4. Create an RPC function to fetch management users (Admins, Blogs)
-- This allows admins to query auth.users securely from the client side
CREATE OR REPLACE FUNCTION get_management_users()
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    role JSONB,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ,
    display_name VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as the definer (postgres), bypassing RLS on auth.users
AS $$
BEGIN
  -- Verify the caller is an admin
  IF (auth.jwt() -> 'user_metadata' ->> 'role') != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can view management users';
  END IF;

  RETURN QUERY
  SELECT 
      au.id, 
      au.email::VARCHAR, 
      au.raw_user_meta_data->'role',
      COALESCE(us.is_active, true),
      au.created_at,
      (au.raw_user_meta_data->>'full_name')::VARCHAR AS display_name
  FROM auth.users au
  LEFT JOIN public.user_status us ON au.id = us.user_id
  WHERE au.raw_user_meta_data->>'role' IN ('admin', 'blog', 'host')
  ORDER BY au.created_at DESC;
END;
$$;
