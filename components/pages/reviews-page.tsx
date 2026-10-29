"use client";
import { useMemo, useState } from "react";
import { ArrowRight, MessageSquare, Plus, Search, ShieldCheck, Star, UserRoundCheck } from "lucide-react";
import { useDashboard } from "@/components/dashboard-context";
import { Dialog, EmptyState, ExportButton, Field, PageHeader, Panel, ProductAvatar, Reveal, SearchInput, toCsv } from "@/components/ui";

export function ReviewsPage(){
 const {reviews,products,addReview,toast}=useDashboard();
 const [q,setQ]=useState(""),[dialog,setDialog]=useState(false);
 const [buyer,setBuyer]=useState(""),[product,setProduct]=useState(products[0]?.id??""),[rating,setRating]=useState(5),[comment,setComment]=useState("");
 const average=reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : "—";
 const found=useMemo(()=>reviews.filter(r=>`${r.buyer} ${r.product} ${r.comment}`.toLowerCase().includes(q.toLowerCase())),[q,reviews]);
 const submit=(e:React.FormEvent)=>{
  e.preventDefault();
  if(!buyer.trim()||!product||!comment.trim()){toast("Isi semua kolom yang diwajibkan.","danger");return;}
  addReview({id:String(Date.now()),buyer:buyer.trim(),product:products.find(p=>p.id===product)?.name??product,rating,comment:comment.trim(),type:"Ditambahkan Admin",date:new Date().toLocaleDateString("id-ID")});
  setDialog(false);setBuyer("");setRating(5);setComment("");toast("Ulasan demo berhasil ditambahkan.");
 };
 return <div className="standard-page">
  <PageHeader icon={Star} title="Kelola Rating & Ulasan" subtitle="Bangun kepercayaan pelanggan lewat ulasan dan rating produk."
    action={<button className="primary-button" onClick={()=>setDialog(true)}><Plus size={18}/> Tambah Rating Pembeli</button>}/>
  <div className="detail-stat-grid reviews-stats">
   {[{label:"Total Ulasan",number:reviews.length,icon:MessageSquare,tone:"green",desc:"Ulasan dari pelanggan"},
     {label:"Rata-rata Rating",number:average==="—"?"—":average+" / 5.0",icon:Star,tone:"orange",desc:reviews.length?"Dari seluruh ulasan":"Belum ada ulasan"},
     {label:"Ditambahkan Admin",number:reviews.length,icon:UserRoundCheck,tone:"blue",desc:"Ulasan yang diinput manual"}
    ].map((s,i)=><Reveal key={s.label} delay={i*.05}><div className="detail-stat"><span className={`stat-mini-icon ${s.tone}`}><s.icon size={22}/></span><div><small>{s.label}</small><strong>{s.number}</strong><span>{s.desc}</span></div></div></Reveal>)}
  </div>
  <Reveal delay={.18}><Panel title="Semua Ulasan" subtitle="Cari dan kelola feedback untuk produk di toko." action={<div className="actions-row"><SearchInput value={q} onChange={setQ} placeholder="Cari produk, pembeli, atau ulasan"/><ExportButton onClick={()=>{toCsv("tokoku-ulasan.csv",["Pembeli","Produk","Rating","Ulasan"],found.map(r=>[r.buyer,r.product,r.rating,r.comment]));toast("Data ulasan berhasil diekspor.")}}/></div>}>
   {found.length?<div className="table-scroll"><table className="data-table"><thead><tr><th>Produk</th><th>Pembeli</th><th>Rating</th><th>Ulasan</th><th>Tipe</th><th>Waktu</th></tr></thead>
    <tbody>{found.map(r=><tr key={r.id}><td className="strong-cell">{r.product}</td><td>{r.buyer}</td><td><span className="rating-stars">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span></td><td>{r.comment}</td><td><span className="soft-badge">{r.type}</span></td><td>{r.date}</td></tr>)}</tbody></table></div>
    :<EmptyState icon={MessageSquare} title={q?"Ulasan tidak ditemukan":"Belum ada ulasan"} description={q?"Coba kata kunci lain.":"Saat ulasan pelanggan masuk, semuanya akan ditampilkan di sini. Kamu juga bisa menambahkan contoh ulasan dari admin."}
      action={!q&&<button className="primary-button" onClick={()=>setDialog(true)}><Plus size={17}/> Tambah Ulasan</button>}/>}
  </Panel></Reveal>
  <Dialog open={dialog} onClose={()=>setDialog(false)} title="Tambah Rating Pembeli">
   <form className="modal-form" onSubmit={submit}>
    <p className="dialog-hint">Form ini menambah data demo lokal, bukan ulasan pelanggan yang terverifikasi.</p>
    <Field label="Nama pembeli *"><input value={buyer} onChange={e=>setBuyer(e.target.value)} placeholder="Nama pembeli" required maxLength={80}/></Field>
    <Field label="Produk *"><select value={product} onChange={e=>setProduct(e.target.value)} required>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
    <Field label="Rating *"><div className="rating-picker" role="group" aria-label="Pilih rating 1 sampai 5">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setRating(n)} aria-label={`${n} bintang`}><Star size={31} fill={n<=rating?"#ffb629":"none"} color={n<=rating?"#ffb629":"#bbc8c2"}/></button>)}<span>{rating}.0 / 5.0</span></div></Field>
    <Field label="Ulasan *"><textarea value={comment} onChange={e=>setComment(e.target.value)} required maxLength={500} rows={4} placeholder="Tulis kesan tentang produk..."/></Field>
    <div className="form-actions"><button type="button" className="secondary-button" onClick={()=>setDialog(false)}>Batal</button><button className="primary-button" type="submit"><Plus size={16}/> Simpan Ulasan</button></div>
   </form>
  </Dialog>
 </div>;
}
