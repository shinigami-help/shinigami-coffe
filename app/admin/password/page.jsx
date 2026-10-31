"use client";

import { useActionState } from "react";
import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPassword } from "@/app/admin/actions";

// US-05: ganti password admin yang sedang login, diproses di server (Supabase Auth).
export default function HalamanGantiPassword() {
  const [state, formAction, pending] = useActionState(gantiPassword, {});

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold">Ganti password</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Ganti password bawaan segera setelah pertama kali masuk. Minimal 8 karakter.
        </p>
      </div>
      <form action={formAction} className="flex max-w-sm flex-col gap-4">
        <Input
          label="Password baru"
          name="password_baru"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          label="Ulangi password baru"
          name="konfirmasi_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Tombol type="submit" className="self-start" disabled={pending}>
          Simpan password
        </Tombol>
        {state?.sukses ? (
          <p
            role="status"
            className="rounded-lg border border-utama/40 bg-utama/10 px-3 py-2 text-sm text-utama"
          >
            {state.sukses}
          </p>
        ) : null}
        {state?.error ? (
          <p
            role="alert"
            className="rounded-lg border border-bahaya/40 bg-bahaya/10 px-3 py-2 text-sm text-bahaya"
          >
            {state.error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
