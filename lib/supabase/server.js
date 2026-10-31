import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ambilEnv, ambilUrlSupabase } from "./konfigurasi";

/**
 * Koneksi Supabase di sisi server untuk pengunjung menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca katalog dan detail produk tanpa batasan RLS publik.
 */
export function createClient() {
  const supabaseUrl = ambilUrlSupabase();
  const supabaseSecretKey = ambilEnv("SUPABASE_SECRET_KEY");

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;

