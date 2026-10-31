import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Koneksi Supabase di sisi server untuk pengunjung menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca katalog dan detail produk tanpa batasan RLS publik.
 */
export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;

