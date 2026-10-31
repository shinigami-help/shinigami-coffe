"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { loginAdmin } from "@/app/admin/actions";

// US-04: login admin dengan Supabase Auth (email dan password), diproses di server.
export default function HalamanLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, {});

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-extrabold">Masuk admin</h1>
        <p className="mt-1 text-sm text-teks-lembut">Khusus pemilik toko untuk mengelola produk.</p>
      </div>
      <form action={formAction} className="flex flex-col gap-4">
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Tombol type="submit" disabled={pending}>
          Masuk
        </Tombol>
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
