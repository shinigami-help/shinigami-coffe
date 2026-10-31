// US-03: tombol pesan membuka WhatsApp toko dengan pesan berisi nama dan harga produk.
// Nomor toko di lib/toko.js; harga diformat rupiah; pesan di-encode agar URL valid.
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const pesan = encodeURIComponent(
    `Halo, saya ingin memesan ${produk.nama} dengan harga ${formatRupiah(produk.harga)}.`
  );
  const href = `https://wa.me/${toko.nomorWhatsApp}?text=${pesan}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}
