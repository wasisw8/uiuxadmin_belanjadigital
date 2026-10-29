"use client";
import { useMemo, useState } from "react";
import { ArrowRight, Check, CircleCheck, ClipboardList, CreditCard, Mail, PackageCheck, Plus, RefreshCw, Search, Settings2, ShieldCheck, Truck, Undo2, Wallet } from "lucide-react";
import { useDashboard } from "@/components/dashboard-context";
import { Dialog, EmptyState, ExportButton, PageHeader, Panel, Reveal, SearchInput, StatusBadge, toCsv } from "@/components/ui";
import { type Order, type OrderStatus, formatRupiah } from "@/lib/data";
const filters=[
 {name:"Semua",count:"921"},{name:"Perlu Kirim",count:"0"},{name:"Pre-Order",count:"17"},
 {name:"Menunggu",count:"0"},{name:"Lunas",count:"799"},{name:"Refund",count:"3"},{name:"Batal",count:"102"}
];
const methods=["KlikQRIS","BorderPay QRIS","Belibayar QRIS","DANA manual"];
export function OrdersPage() {
 const {orders,setOrders,delivery,setDelivery,toast}=useDashboard();
 const [status,setStatus]=useState("Semua"),[q,setQ]=useState(""),[page,setPage]=useState(1);
 const [payments,setPayments]=useState<Record<string,boolean>>({"KlikQRIS":false,"BorderPay QRIS":false,"Belibayar QRIS":false,"DANA manual":true});
 const [current,setCurrent]=useState<Order|null>(null);
 const [expandedSettings,setExpandedSettings]=useState(true);
 const filtered=useMemo(()=>orders.filter(o=>
  (status==="Semua"||(status==="Perlu Kirim"?false:o.status===status))
  &&`${o.id} ${o.product} ${o.customer} ${o.email}`.toLowerCase().includes(q.toLowerCase())
 ),[orders,status,q]);
 const maxPage=Math.max(1,Math.ceil(filtered.length/6)); const visible=filtered.slice((page-1)*6,page*6);
 function updateStatus(id:string,next:OrderStatus){
  setOrders(items=>items.map(o=>o.id===id?{...o,status:next}:o));
  setCurrent(null);toast(`Status pesanan demo diubah menjadi "${next}".`);
 }
 return <div className="standard-page">
  <PageHeader title="Riwayat Pesanan" icon={ClipboardList} subtitle="Kelola transaksi, pembayaran, dan pengiriman produk digital."
   action={<ExportButton onClick={()=>{toCsv("tokoku-pesanan.csv",["ID","Produk","Pembeli","Nominal","Pembayaran","Status"],filtered.map(o=>[o.id,o.product,o.customer,o.price,o.payment,o.status]));toast("Daftar pesanan demo berhasil diekspor.");}}/>}/>
  <div className="order-filter-chips">{filters.map(f=><button key={f.name} onClick={()=>{setStatus(f.name);setPage(1)}} className={`order-filter ${status===f.name?"active":""}`}>{f.name}<span>{f.count}</span></button>)}</div>
  <Reveal delay={.08}><section className="payment-settings panel">
   <div className="settings-heading"><div><div className="section-heading-with-icon"><span className="soft-square"><CreditCard size={19}/></span><h2>Pengaturan Pembayaran</h2></div><p>Pilih metode pembayaran yang tersedia di tokomu. Pengaturan ini hanya simulasi lokal.</p></div>
    <button className="text-button" onClick={()=>setExpandedSettings(v=>!v)}>{expandedSettings?"Sembunyikan":"Tampilkan"}</button></div>
   {expandedSettings&&<><div className="payment-options">{methods.map(name=><label className="payment-check" key={name}><input type="checkbox" checked={payments[name]} onChange={e=>setPayments(s=>({...s,[name]:e.target.checked}))}/><span>{name}</span></label>)}</div>
   <button className="primary-button" onClick={()=>toast("Pilihan metode pembayaran tersimpan untuk sesi demo ini.")}><Check size={17}/> Simpan Pembayaran</button></>}
  </section></Reveal>
  <Reveal delay={.13}><section className={`delivery-banner ${delivery==="Otomatis"?"auto":"manual"}`}>
   <span className="delivery-icon">{delivery==="Otomatis"?<PackageCheck size={25}/>:<Settings2 size={25}/>}</span>
   <div><div className="delivery-title"><h2>Pengiriman Link / Akun</h2><span className="delivery-pill">{delivery==="Otomatis"?"⚡ OTOMATIS (Instant)":"MANUAL"}</span></div>
    <p><strong>Mode {delivery} Aktif:</strong> {delivery==="Otomatis"?"Pesanan lunas siap diproses otomatis setelah backend pengiriman terhubung.":"Pengiriman perlu dikonfirmasi admin terlebih dahulu."} <span>Simulasi UI — belum mengirim link aktual.</span></p></div>
   <button className="secondary-button" onClick={()=>{const next=delivery==="Otomatis"?"Manual":"Otomatis";setDelivery(next);toast(`Mode pengiriman menjadi ${next}.`);}}><Settings2 size={16}/> Ganti ke Mode {delivery==="Otomatis"?"Manual":"Otomatis"}</button>
  </section></Reveal>
  <Reveal delay={.2}><Panel title="Daftar Transaksi" subtitle={`Menampilkan ${filtered.length} contoh transaksi; jumlah historis pada filter berasal dari referensi desain.`}
   action={<SearchInput value={q} onChange={v=>{setQ(v);setPage(1)}} placeholder="Cari ID, nama, email, produk..." className="orders-search"/>}>
   {visible.length?<div className="order-list">{visible.map(o=><article className="order-row" key={o.id}>
     <div className="order-row-main"><span className="order-large-icon"><Wallet size={22}/></span><div className="order-description"><div className="order-id">{o.id}<span>·</span>{o.time}</div><h3>{o.product}</h3><p>{o.customer} <span>·</span> {o.payment} <span>·</span> {o.email}</p></div></div>
     <div className="order-row-right"><strong>{formatRupiah(o.price)}</strong><StatusBadge status={o.status}/><button className="order-detail-link" onClick={()=>setCurrent(o)}>Detail <ArrowRight size={15}/></button></div>
    </article>)}</div>:<EmptyState icon={ClipboardList} title="Tidak ada pesanan" description="Tidak ada contoh transaksi yang sesuai dengan filter pilihanmu."/>}
   <div className="table-pagination"><span>{filtered.length} transaksi demo</span><div><button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Sebelumnya</button><span>{page} / {maxPage}</span><button disabled={page>=maxPage} onClick={()=>setPage(p=>p+1)}>Berikutnya</button></div></div>
  </Panel></Reveal>
  <Dialog open={!!current} title={current?`Detail Pesanan ${current.id}`:"Detail Pesanan"} onClose={()=>setCurrent(null)}>
   {current&&<div className="order-details">
    <div className="order-detail-summary"><span className="order-large-icon"><Wallet size={25}/></span><div><b>{current.product}</b><p>{formatRupiah(current.price)}</p></div><StatusBadge status={current.status}/></div>
    <dl><div><dt>ID Pesanan</dt><dd>{current.id}</dd></div><div><dt>Nama pembeli</dt><dd>{current.customer}</dd></div><div><dt>Email pembeli</dt><dd>{current.email}</dd></div><div><dt>Metode bayar</dt><dd>{current.payment}</dd></div><div><dt>Waktu</dt><dd>{current.time}</dd></div></dl>
    <div className="order-detail-actions">
     <a className="secondary-button" href={`mailto:${encodeURIComponent(current.email)}?subject=${encodeURIComponent("Pesanan "+current.id)}`}><Mail size={15}/> Email Pembeli</a>
     {current.status==="Lunas"&&<button className="secondary-button warning-action" onClick={()=>{if(window.confirm("Ubah pesanan demo ini ke status Refund?"))updateStatus(current.id,"Refund");}}><Undo2 size={15}/> Tandai Refund</button>}
     {current.status==="Lunas"&&<button className="danger-button" onClick={()=>{if(window.confirm("Batalkan status lunas pada data demo?"))updateStatus(current.id,"Batal");}}><RefreshCw size={15}/> Batal Lunas</button>}
     {current.status==="Menunggu"&&<button className="primary-button" onClick={()=>updateStatus(current.id,"Lunas")}><CircleCheck size={15}/> Tandai Lunas</button>}
    </div>
   </div>}
  </Dialog>
 </div>;
}
