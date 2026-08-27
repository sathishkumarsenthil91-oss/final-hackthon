import { createClient } from "@supabase/supabase-js";

// ============================================================================
// 🔑 SUPABASE CONFIGURATION
// Replace the values below with your own Supabase Project URL and Anon/Public Key:
// 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
// 2. Open Project Settings -> API
// 3. Copy Project URL and Anon/Public Key and paste them below:
// ============================================================================

// PASTE YOUR SUPABASE PROJECT URL HERE:
const SUPABASE_URL = "https://nzgisrrrbabedlntmcoc.supabase.co";

// PASTE YOUR SUPABASE ANON / PUBLIC API KEY HERE:
const SUPABASE_PUBLIC_KEY = "sb_publishable_CZTBEfxJPsy4EjJSMXtydw_yZ0gzyJ0";

// ============================================================================
// 🚀 EXPORT SUPABASE CLIENT
// ============================================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
