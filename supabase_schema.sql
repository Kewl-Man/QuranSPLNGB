-- ========================================================
-- Supabase Schema & Row-Level Security (RLS) Setup Script
-- Application: QuranSPLNGB
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    photo_url TEXT,
    avatar_gradient TEXT DEFAULT 'emerald',
    status TEXT DEFAULT 'active',
    ban_reason TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    moderated_at TIMESTAMPTZ
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles select" ON public.profiles;
CREATE POLICY "Public profiles select" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert profile" ON public.profiles;
CREATE POLICY "Users can insert profile" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);

-- 2. COMMUNITY MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.community_messages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    avatar_gradient TEXT DEFAULT 'emerald',
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on community_messages
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Community Messages Policies
DROP POLICY IF EXISTS "Public community messages select" ON public.community_messages;
CREATE POLICY "Public community messages select" ON public.community_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert community message" ON public.community_messages;
CREATE POLICY "Users insert community message" ON public.community_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users delete community message" ON public.community_messages;
CREATE POLICY "Users delete community message" ON public.community_messages FOR DELETE USING (true);

-- 3. DIRECT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    sender_email TEXT,
    sender_name TEXT,
    recipient_id TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on direct_messages
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Direct Messages Policies
DROP POLICY IF EXISTS "Direct messages select" ON public.direct_messages;
CREATE POLICY "Direct messages select" ON public.direct_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Direct messages insert" ON public.direct_messages;
CREATE POLICY "Direct messages insert" ON public.direct_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Direct messages delete" ON public.direct_messages;
CREATE POLICY "Direct messages delete" ON public.direct_messages FOR DELETE USING (true);

-- 4. APPEALS TABLE
CREATE TABLE IF NOT EXISTS public.appeals (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_email TEXT,
    contact_info TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on appeals
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;

-- Appeals Policies
DROP POLICY IF EXISTS "Appeals select" ON public.appeals;
CREATE POLICY "Appeals select" ON public.appeals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Appeals insert" ON public.appeals;
CREATE POLICY "Appeals insert" ON public.appeals FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Appeals update" ON public.appeals;
CREATE POLICY "Appeals update" ON public.appeals FOR UPDATE USING (true);
