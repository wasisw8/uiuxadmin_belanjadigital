"use client";
import Link from "next/link";
import { useState } from "react";
import {
 BadgeCheck, Boxes, CalendarDays, ChevronDown, Eye, MessageCircle, ShoppingBag,
 ShoppingCart, Star, TrendingUp, UsersRound, Wallet, ArrowRight,
 ArrowUpRight, Download, CircleDollarSign, ClipboardList, Sparkles
} from "lucide-react";
import { Hero3D } from "@/components/hero-3d";
import { SalesChart, Sparkline, TrafficBars, StatusDonut } from "@/components/charts";
import { Panel, RangeSelect, Reveal, TiltCard, Delta, ProductAvatar, StatusBadge, toCsv } from "@/components/ui";
import { useDashboard } from "@/components/dashboard-context";
import { initialOrders, salesData, formatRupiah, demoChats, rangeFactor } from "@/lib/data";

export function DashboardHome() {
 const {products, orders,range,toast}=useDashboard();
 const [salesMode,setSalesMode]=useState<"Omset"|"Pesanan">("Omset");
 const topProducts=[...products].filter(p=>p.todaySold>0).sort((a,b)=>b.todaySold-a.todaySold).slice(0,4);
 const recentOrders=orders.slice(0,4);
 function exportData(){
  toCsv("tokoku-penjualan.csv",["Tanggal","Omset (Rp)","Pesanan"],salesData.map(d=>[d.date,Math.round(d.revenue*rangeFactor[range]),Math.round(d.orders*rangeFactor[range])]));
  toast("Grafik penjualan diekspor sebagai CSV.");
 }
 const metrics=[
  {title:"Omset Hari Ini",value:"Rp219.445",meta:"dari kemarin",delta:"+12%",icon:CircleDollarSign,tone:"mint",spark:[1,2,2,5,4,6,8]},
  {title:"Terjual Hari Ini",value:"18",unit:"produk",meta:"dari kemarin",delta:"+28%",icon:ShoppingBag,tone:"blue",spark:[1,3,2,4,5,4,7]},
  {title:"Transaksi Hari Ini",value:"17",unit:"pesanan",meta:"dari kemarin",delta:"+21%",icon:ShoppingCart,tone:"purple",spark:[1,2,5,4,6,8,9]},
  {title:"Total Omset",value:"Rp15.003.174",meta:"Dari 799 pesanan lunas",icon:Wallet,tone:"orange",spark:[3,2,5,4,5,7,8]},
  {title:"Pengunjung Unik",value:"999",meta:"dari kemarin",delta:"+18%",icon:UsersRound,tone:"mint",spark:[1,2,4,3,6,8,7]},
 ] as const;
 return <div className="dashboard-page">
  <Reveal className="hero-banner">
   <div className="hero-contours"/><div className="hero-copy">
    <div className="eyebrow-line"><span className="hero-kicker"><Sparkles size={13}/> PUSAT KENDALI TOKO</span><span className="hero-live"><i/> Dashboard aktif</span></div>
    <h1>Dashboard &amp; Analitik<span className="hero-period">.</span></h1>
    <p>Pantau penjualan, pelanggan, dan performa toko Anda secara real-time.</p>
    <div className="hero-actions"><RangeSelect/><button className="secondary-button hero-export" onClick={exportData} aria-label="Ekspor data"><Download size={16}/> Ekspor Laporan</button></div>
   </div>
   <Hero3D/>
  </Reveal>
  <div className="stats-grid">{metrics.map((m,i)=>{
   const Icon=m.icon;
   return <TiltCard key={m.title} className={`stat-card stat-${m.tone}`} delay={.05+i*.055}>
    <div className="stat-top"><span className="stat-icon"><Icon size={23}/></span><ArrowUpRight size={15} className="stat-arrow"/></div>
    <div className="stat-content"><span className="stat-label">{m.title}</span><div className="stat-value">{m.value}{"unit" in m&&<small>{m.unit}</small>}</div></div>
    <div className="stat-bottom">{"delta" in m&&<Delta>{m.delta}</Delta>}<small>{m.meta}</small><Sparkline color={m.tone==="purple"?"#9546ff":m.tone==="blue"?"#278bff":m.tone==="orange"?"#ffad25":"#0bc894"} values={[...m.spark]}/></div>
   </TiltCard>;
  })}</div>
  <div className="analytics-grid">
   <Reveal delay={.08}><Panel title="Grafik Penjualan" subtitle="Perbandingan omset dan jumlah pesanan." action={
     <label className="select-wrap compact"><span className="sr-only">Jenis grafik</span><select value={salesMode} onChange={e=>setSalesMode(e.target.value as "Omset"|"Pesanan")}><option>Omset</option><option>Pesanan</option></select><ChevronDown size={14}/></label>
    }><SalesChart mode={salesMode}/><div className="chart-footnote"><span><i className="legend-dot emerald"/> Omset (Rp)</span><span><i className="legend-dot sky"/> Jumlah Pesanan</span></div></Panel></Reveal>
   <Reveal delay={.13}><Panel title="Trafik Kunjungan" subtitle="Jumlah pengunjung toko pada periode dipilih." action={<Link className="panel-link" href="/trafik-kunjungan">Detail <ArrowUpRight size={14}/></Link>}><TrafficBars/></Panel></Reveal>
  </div>
  <div className="bottom-grid">
   <Reveal delay={.10}><Panel title="Produk Terlaris" subtitle="Produk dengan penjualan tertinggi hari ini" action={<Link className="panel-link" href="/kelola-produk">Lihat Semua <ArrowRight size={14}/></Link>}>
    <div className="top-products">{topProducts.map((p,i)=><div className="top-product" key={p.id}>
     <span className={`rank rank-${i+1}`}>{i+1}</span><ProductAvatar name={p.name} short={p.short} color={p.color}/>
     <div className="list-primary"><b title={p.name}>{p.name}</b><span>{formatRupiah(p.price)}</span></div>
     <TrendingUp size={18} className="list-trend"/><small>{p.todaySold} terjual</small>
    </div>)}</div>
   </Panel></Reveal>
   <Reveal delay={.15}><Panel title="Pesanan Terbaru" subtitle="Aktivitas transaksi paling baru" action={<Link href="/riwayat-pesanan" className="panel-link">Lihat Semua <ArrowRight size={14}/></Link>}>
    <div className="recent-orders">{recentOrders.map(o=><div className="recent-order" key={o.id}>
     <span className="order-icon"><ShoppingBag size={19}/></span>
     <div className="list-primary"><b title={o.product}>{o.product}</b><span>{o.customer} • {o.payment}</span></div>
     <StatusBadge status={o.status}/>
     <div className="order-value"><strong>{formatRupiah(o.price)}</strong><small>{o.time}</small></div>
    </div>)}</div>
   </Panel></Reveal>
   <div className="right-panels">
    <Reveal delay={.17}><Panel title="Status Pesanan" action={<Link className="panel-link" href="/riwayat-pesanan">Lihat Semua <ArrowRight size={14}/></Link>}><StatusDonut/></Panel></Reveal>
    <Reveal delay={.2}><Panel title="Chat Customer" action={<Link className="panel-link" href="/chat-customer">Lihat Semua <ArrowRight size={14}/></Link>}>
      <div className="chats-mini">{demoChats.map((c,i)=><div key={c.name} className="chat-row"><span className={`chat-avatar chat-${i}`}>{c.initials}</span><div className="list-primary"><b>{c.name}</b><span>{c.message}</span></div><small>{c.time}</small><span className="status-badge badge-success">{c.status}</span></div>)}</div>
    </Panel></Reveal>
    <Reveal delay={.22}><Panel title="Rating & Ulasan" action={<Link className="panel-link" href="/rating-ulasan">Lihat Semua <ArrowRight size={14}/></Link>}><div className="rating-summary"><span className="rating-icon"><Star size={24} fill="currentColor"/></span><div><strong>—</strong><small>Belum ada rating</small></div><span className="rating-separator"/><MessageCircle size={23} className="rating-comment"/><div><strong>0</strong><small>Total ulasan</small></div></div></Panel></Reveal>
   </div>
  </div>
 </div>;
}
