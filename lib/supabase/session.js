import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Koneksi sesi admin (US-04) memakai SUPABASE_PUBLISHABLE_KEY + cookie login,
 * sesuai docs/rancangan-teknis.md. Supabase Auth bisa dipanggil dan cookie
 * diatur hanya di dalam Server Action, bukan saat merender Server Component.
 * Jangan mengimpor file ini dari file dengan "use client".
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll dipanggil saat merender Server Component (mis. refresh sesi).
            // Cookie tidak boleh diatur di sana; aman diabaikan.
          }
        },
      },
    }
  );
}