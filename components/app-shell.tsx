"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
 LayoutDashboard, ChartNoAxesCombined, Star, Package, Flame, ClipboardList, MessageCircle,
 Link2, Images, TicketPercent, Headphones, Mail, UsersRound, Settings2,
 Search, Bell, Menu, X, ChevronDown, ChevronsUpDown, Store, LogOut, Crown,
 Command, Zap, CheckCheck, Check, ArrowUpRight, PanelLeftClose, Sparkles
} from "lucide-react";
import { useDashboard } from "@/components/dashboard-context";

const primary = [
 {href:"/",label:"Dashboard & Analitik",icon:LayoutDashboard},
 {href:"/trafik-kunjungan",label:"Trafik Kunjungan",icon:ChartNoAxesCombined},
 {href:"/rating-ulasan",label:"Rating & Ulasan",icon:Star},
 {href:"/kelola-produk",label:"Kelola Produk",icon:Package,badge:"products"},
 {href:"/flash-sale",label:"Flash Sale",icon:Flame,badge:"6"},
 {href:"/riwayat-pesanan",label:"Riwayat Pesanan",icon:ClipboardList},
 {href:"/chat-customer",label:"Chat Customer",icon:MessageCircle,badge:"3"},
] as const;
const secondary = [
 {href:"/manajemen-stok",label:"Manajemen Stok Link",icon:Link2,badge:"104"},
 {href:"/banner-promo",label:"Banner Promo",icon:Images,badge:"0"},
 {href:"/kupon-diskon",label:"Kupon Diskon",icon:TicketPercent,badge:"1"},
 {href:"/tiket-bantuan",label:"Tiket Bantuan",icon:Headphones},
 {href:"/broadcast-email",label:"Broadcast Email",icon:Mail},
 {href:"/program-afiliasi",label:"Program Afiliasi",icon:UsersRound},
 {href:"/pengaturan-toko",label:"Pengaturan Toko",icon:Settings2},
] as const;
const navigation=[...primary,...secondary];
export function AppShell({children}:{children:React.ReactNode}) {
 const pathname=usePathname(),router=useRouter();
 const {products,delivery,setDelivery,notifications,setNotifications,toasts,dismissToast,toast}=useDashboard();
 const [mobileOpen,setMobileOpen]=useState(false);
 const [collapsed,setCollapsed]=useState(false);
 const [searchOpen,setSearchOpen]=useState(false);
 const [term,setTerm]=useState("");
 const [bellOpen,setBellOpen]=useState(false);
 const [profileOpen,setProfileOpen]=useState(false);
 useEffect(()=>{setMobileOpen(false);setSearchOpen(false);},[pathname]);
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
   if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setSearchOpen(v=>!v);}
   if(e.key==="Escape"){setSearchOpen(false);setBellOpen(false);setProfileOpen(false);}
  };
  window.addEventListener("keydown",key);
  return ()=>window.removeEventListener("keydown",key);
 },[]);
 const results=useMemo(()=>navigation.filter(n=>n.label.toLowerCase().includes(term.toLowerCase())),[term]);
 function navItems(items:typeof navigation) {
  return items.map(item=>{
   const Icon=item.icon;
   const badge="badge" in item ? item.badge==="products"?String(products.length):item.badge : null;
   return <Link href={item.href} key={item.href} title={item.label}
    className={`side-link ${pathname===item.href?"selected":""}`}>
    <Icon size={19} strokeWidth={pathname===item.href?2.5:1.8} aria-hidden="true"/>
    <span className="side-label">{item.label}</span>
    {badge!==null && <span className="side-count">{badge}</span>}
   </Link>;
  });
 }
 return <div className={`app-frame ${collapsed?"sidebar-collapsed":""}`}>
  <aside className={`sidebar ${mobileOpen?"mobile-open":""}`} aria-label="Navigasi admin">
   <div className="brand-head">
    <Link href="/" className="brand" aria-label="Tokoku beranda">
     <span className="brand-symbol"><svg viewBox="0 0 42 42" width="34" height="34" aria-hidden="true"><path d="M9 26V17a5 5 0 0 1 10 0v12a5 5 0 0 0 10 0V16a5 5 0 0 1 10 0v5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M3 24v-7" stroke="#0BBE93" strokeWidth="5" strokeLinecap="round"/></svg></span>
     <strong>Tokoku</strong><span className="admin-pill">Admin Panel</span>
    </Link>
    <button className="mobile-close icon-button" aria-label="Tutup menu" onClick={()=>setMobileOpen(false)}><X size={21}/></button>
   </div>
   <div className="sidebar-scroll">
    <div className="sidebar-group"><span className="section-label">MENU UTAMA</span><nav>{navItems(primary)}</nav></div>
    <div className="sidebar-group sidebar-secondary"><span className="section-label">FITUR LAINNYA</span><nav>{navItems(secondary)}</nav></div>
   </div>
   <div className="sidebar-bottom">
    <div className="mode-box">
     <div className="mode-top"><span>Mode Pengiriman</span><span className="mode-active"><Zap size={12} fill="currentColor"/>{delivery}</span></div>
     <button className="mode-selector" type="button" onClick={()=>{const next=delivery==="Otomatis"?"Manual":"Otomatis";setDelivery(next);toast(`Mode pengiriman demo: ${next}`);}}>
      <span>{delivery==="Otomatis"?"Ubah ke Manual":"Ubah ke Otomatis"}</span><ChevronsUpDown size={14}/>
     </button>
    </div>
    <div className="sidebar-tip"><span className="tip-icon"><Crown size={20}/></span><div><b>Toko kamu berkembang</b><small>Terus berikan pengalaman terbaik untuk pelanggan!</small></div></div>
   </div>
  </aside>
  {mobileOpen&&<button className="sidebar-scrim" aria-label="Tutup menu" onClick={()=>setMobileOpen(false)}/>}
  <div className="main-column">
   <header className="topbar">
    <div className="topbar-left">
     <button className="icon-button desktop-collapse" aria-label={collapsed?"Tampilkan sidebar":"Ciutkan sidebar"} onClick={()=>setCollapsed(v=>!v)}><PanelLeftClose size={20}/></button>
     <button className="icon-button mobile-menu" aria-label="Buka menu" onClick={()=>setMobileOpen(true)}><Menu size={23}/></button>
     <button onClick={()=>{setSearchOpen(true);setTerm("");}} className="global-search" type="button"><Search size={18}/><span>Cari produk, pesanan, pembeli, atau fitur...</span><kbd>⌘ K</kbd></button>
    </div>
    <div className="topbar-right">
     <span className="demo-indicator"><span className="pulse-dot"/>Demo Data</span>
     <button className="topbar-store" onClick={()=>toast("Tautan toko publik belum disambungkan ke demo.","info")}><Store size={16}/><span>Lihat Toko</span><ArrowUpRight size={13}/></button>
     <div className="topbar-popover-anchor">
      <button className="icon-button notification-button" onClick={()=>{setBellOpen(v=>!v);setProfileOpen(false);}} aria-label="Notifikasi"><Bell size={20}/><i/></button>
      {bellOpen&&<div className="header-popover notifications-popover">
       <h3>Notifikasi <button onClick={()=>{setNotifications(!notifications);toast(!notifications?"Notifikasi diaktifkan":"Notifikasi dimatikan","info")}}><CheckCheck size={15}/>{notifications?"Nonaktifkan":"Aktifkan"}</button></h3>
       <div className="notification-item"><span className="notify-circle"><Package size={17}/></span><div><b>Aktivitas toko terkini</b><p>Pesanan dan produk dapat dikelola dari panel admin.</p><small>Data simulasi</small></div></div>
       <div className="notification-item"><span className="notify-circle mint"><Sparkles size={17}/></span><div><b>Redesign sudah aktif</b><p>Jelajahi grafik interaktif dan halaman lainnya.</p><small>Sekarang</small></div></div>
      </div>}
     </div>
     <div className="topbar-popover-anchor">
      <button onClick={()=>{setProfileOpen(v=>!v);setBellOpen(false);}} className="user-menu"><span className="user-avatar">W</span><span className="user-copy"><b>wasis</b><small>Admin Tokoku</small></span><ChevronDown size={15}/></button>
      {profileOpen&&<div className="header-popover profile-popover">
        <b>Akun Admin</b><small>Mode preview lokal</small>
        <button onClick={()=>{setProfileOpen(false);router.push("/pengaturan-toko");}}><Settings2 size={16}/>Pengaturan Toko</button>
        <button onClick={()=>toast("Login/logout memerlukan integrasi autentikasi.","info")}><LogOut size={16}/>Keluar (demo)</button>
      </div>}
     </div>
    </div>
   </header>
   <main className="main-content" id="main-content">{children}</main>
   <footer className="app-footer"><span>© 2026 Tokoku · Admin Panel Redesign</span><span>Dirancang untuk pengalaman toko yang lebih baik <span aria-hidden="true">✦</span></span></footer>
  </div>
  <AnimatePresence>
   {searchOpen && <motion.div className="command-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)setSearchOpen(false);}}>
    <motion.div className="command-dialog" initial={{y:-18,scale:.98}} animate={{y:0,scale:1}} exit={{y:-18,scale:.98}}>
     <div className="command-input-row"><Search size={21}/><input autoFocus placeholder="Cari halaman admin..." value={term} onChange={e=>setTerm(e.target.value)}
      onKeyDown={e=>{if(e.key==="Enter"&&results[0])router.push(results[0].href);}}/><kbd>ESC</kbd></div>
     <div className="command-results"><span className="section-label">NAVIGASI</span>{results.length?results.map(item=><button key={item.href} onClick={()=>router.push(item.href)}>
       <item.icon size={18}/><span>{item.label}</span><ArrowUpRight size={15}/>
      </button>):<p className="no-search-result">Tidak ada menu yang cocok.</p>}</div>
     <div className="command-hint"><Command size={14}/> Tekan Enter untuk membuka hasil pertama</div>
    </motion.div>
   </motion.div>}
  </AnimatePresence>
  <div className="toast-stack" role="status" aria-live="polite">{toasts.map(t=><div key={t.id} className={`toast toast-${t.tone}`}><Check size={17}/><span>{t.message}</span><button onClick={()=>dismissToast(t.id)} aria-label="Tutup pesan"><X size={15}/></button></div>)}</div>
 </div>;
}
