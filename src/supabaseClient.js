import { createClient } from "@supabase/supabase-js";

// ============================================================================
// 🔑 SUPABASE CONFIGURATION
// Replace the values below with your own Supabase Project URL and Anon/Public Key:
// 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
// 2. Open Project Settings -> API
// 3. Copy Project URL and Anon/Public Key and paste them below:
// ============================================================================

// SUPABASE PROJECT URL AND ANON KEY
const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || "https://nzgisrrrbabedlntmcoc.supabase.co";
const SUPABASE_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || "sb_publishable_CZTBEfxJPsy4EjJSMXtydw_yZ0gzyJ0";

// ============================================================================
// 🚀 EXPORT SUPABASE CLIENT
// ============================================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
