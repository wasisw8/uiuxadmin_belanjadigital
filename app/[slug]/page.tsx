import Link from "next/link";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";

const names:Record<string,string>={
 "flash-sale":"Flash Sale","chat-customer":"Chat Customer",
 "manajemen-stok":"Manajemen Stok Link","banner-promo":"Banner Promo",
 "kupon-diskon":"Kupon Diskon","tiket-bantuan":"Tiket Bantuan",
 "broadcast-email":"Broadcast Email","program-afiliasi":"Program Afiliasi",
 "pengaturan-toko":"Pengaturan Toko"
};
export default async function PlaceholderPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const name=names[slug]||"Halaman Admin";
 return <div className="standard-page placeholder-page"><div className="placeholder-art"><Sparkles size={25}/><Construction size={62}/></div><span className="hero-kicker">MODUL BERIKUTNYA</span>
  <h1>{name}</h1><p>Layout dan navigasi sudah siap. Modul ini bisa dihubungkan dengan API dan alur bisnis asli pada tahap implementasi berikutnya.</p>
  <Link className="primary-button" href="/"><ArrowLeft size={17}/> Kembali ke Dashboard</Link>
 </div>;
}
