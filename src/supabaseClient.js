import { createClient } from "@supabase/supabase-js";

// ==========================================
// 🔑 SUPABASE CREDENTIALS & ENVIRONMENT DETECTION
// ==========================================
// Automatically detects environment variables, with fallback to configured credentials
const SUPABASE_URL = 
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || 
  "https://nzgisrrrbabedlntmcoc.supabase.co";

const SUPABASE_PUBLIC_KEY = 
  (typeof import.meta !== "undefined" && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_KEY)) || 
  "sb_publishable_CZTBEfxJPsy4EjJSMXtydw_yZ0gzyJ0";

// ==========================================
// 🚀 SINGLETON SUPABASE CLIENT
// ==========================================
// Detect if a global or existing client instance is already present to prevent duplicate clients
const globalScope = typeof window !== "undefined" ? window : globalThis;

export const supabase = 
  globalScope.__supabase_instance__ || 
  createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

if (typeof window !== "undefined") {
  globalScope.__supabase_instance__ = supabase;
}

// ==========================================
// 🔍 REAL CONNECTION VERIFICATION TEST
// ==========================================
export async function testSupabaseConnection() {
  try {
    if (!SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
      const err = "Supabase URL or Public Key is missing.";
      console.error("Supabase connection failed:", err);
      return { success: false, error: err };
    }

    // Ping the Supabase backend to test real connection
    const { error: authError } = await supabase.auth.getUser();

    if (authError) {
      const isSessionMissing = 
        authError.name === "AuthSessionMissingError" || 
        (authError.message && authError.message.toLowerCase().includes("session")) ||
        (authError.message && authError.message.toLowerCase().includes("auth session missing"));

      if (!isSessionMissing) {
        // Fallback REST probe to check PostgreSQL service response
        const { error: restError } = await supabase.from("_industryskill_ping_").select("id").limit(1);
        
        const isPostgresResponding = 
          restError && (
            restError.code === "42P01" || 
            restError.code === "PGRST204" || 
            restError.code === "PGRST116" ||
            (restError.message && restError.message.includes("relation")) ||
            (restError.message && restError.message.includes("does not exist"))
          );

        if (!isPostgresResponding) {
          const finalErrorMsg = (restError && restError.message) || authError.message || "Failed to reach Supabase";
          console.error("Supabase connection failed:", finalErrorMsg);
          return { success: false, error: finalErrorMsg };
        }
      }
    }

    // Log exact requested success message
    console.log("Supabase connected successfully");
    return { success: true };
  } catch (err) {
    const errorMsg = (err && err.message) || String(err);
    console.error("Supabase connection failed:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

// Automatically test connection on boot
testSupabaseConnection();

