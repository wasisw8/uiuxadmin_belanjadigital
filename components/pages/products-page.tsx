"use client";
import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowUpRight, Boxes, CircleAlert, Copy, Link2, Package, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useDashboard } from "@/components/dashboard-context";
import { Dialog, EmptyState, ExportButton, Field, PageHeader, Panel, ProductAvatar, Reveal, SearchInput, toCsv } from "@/components/ui";
import { type Product, formatRupiah } from "@/lib/data";

type ProductForm={name:string;category:string;price:string;stock:string;short:string;color:string};
const empty:ProductForm={name:"",category:"Digital",price:"",stock:"0",short:"✦",color:"mint"};
const categories=["Semua Produk","Desain","Digital","E-book","AI & Produktivitas","Produktivitas","Hiburan"];
export function ProductsPage() {
 const {products,setProducts,toast}=useDashboard();
 const [q,setQ]=useState(""),[category,setCategory]=useState("Semua Produk"),[sort,setSort]=useState("Terlaris"),[page,setPage]=useState(1);
 const [dialog,setDialog]=useState(false),[editing,setEditing]=useState<string|null>(null),[form,setForm]=useState<ProductForm>(empty);
 const [stockId,setStockId]=useState<string|null>(null),[stockCount,setStockCount]=useState("0");
 const filtered=useMemo(()=>{
  const list=products.filter(p=>(category==="Semua Produk"||p.category===category)&&`${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
  return [...list].sort((a,b)=>sort==="Terlaris"?b.sold-a.sold:sort==="Stok Terendah"?a.stock-b.stock:b.name.localeCompare(a.name));
 },[products,q,category,sort]);
 const maxPage=Math.max(1,Math.ceil(filtered.length/6));const visible=filtered.slice((page-1)*6,page*6);
 const changeField=(key:keyof ProductForm,value:string)=>setForm(f=>({...f,[key]:value}));
 function openAdd(){setEditing(null);setForm(empty);setDialog(true);}
 function openEdit(p:Product){
  setEditing(p.id);
  setForm({name:p.name,category:p.category,price:String(p.price),stock:String(p.stock),short:p.short,color:p.color});setDialog(true);
 }
 function submit(e:React.FormEvent){
  e.preventDefault();const price=Number(form.price),stock=Number(form.stock);
  if(!form.name.trim()||!Number.isFinite(price)||price<0||!Number.isInteger(stock)||stock<0){toast("Periksa nama, harga, dan stok produk.","danger");return;}
  if(editing){setProducts(items=>items.map(p=>p.id===editing?{...p,name:form.name.trim(),category:form.category,price,stock,short:form.short,color:form.color}:p));toast("Produk demo berhasil diperbarui.");}
  else {const id=`added-${Date.now()}`;setProducts(items=>[{id,name:form.name.trim(),category:form.category,price,stock,short:form.short,color:form.color,sold:0,todaySold:0},...items]);setPage(1);toast("Produk demo berhasil dibuat.");}
  setDialog(false);
 }
 function remove(p:Product){
  if(window.confirm(`Hapus "${p.name}" dari data demo?`)){
   setProducts(items=>items.filter(item=>item.id!==p.id));toast("Produk dihapus dari data demo.");
  }
 }
 const stockProduct=products.find(p=>p.id===stockId);
 return <div className="standard-page">
  <PageHeader title="Kelola Produk" icon={Package} subtitle="Kelola katalog produk digital, harga, performa, dan ketersediaan stok."
   action={<div className="actions-row"><ExportButton onClick={()=>{toCsv("tokoku-produk.csv",["Produk","Kategori","Harga","Stok","Total Terjual"],filtered.map(p=>[p.name,p.category,p.price,p.stock,p.sold]));toast("Katalog berhasil diekspor.");}}/><button className="primary-button" onClick={openAdd}><Plus size={17}/> Tambah Produk</button></div>}/>
  <div className="product-overview">
   <Reveal><div className="overview-tile"><span className="overview-icon mint"><Boxes size={24}/></span><div><small>Total Produk</small><b>{products.length}</b><span>Produk dalam katalog</span></div></div></Reveal>
   <Reveal delay={.04}><div className="overview-tile"><span className="overview-icon blue"><Package size={24}/></span><div><small>Stok Tersedia</small><b>{products.reduce((a,p)=>a+p.stock,0).toLocaleString("id-ID")}</b><span>Link / unit digital</span></div></div></Reveal>
   <Reveal delay={.08}><div className="overview-tile"><span className="overview-icon amber"><ArrowUpRight size={24}/></span><div><small>Seluruh Produk Terjual</small><b>{products.reduce((a,p)=>a+p.sold,0).toLocaleString("id-ID")}</b><span>Akumulasi data demo</span></div></div></Reveal>
  </div>
  <Reveal delay={.13}><Panel title={`Semua Produk (${filtered.length})`} subtitle="Cari, sortir, dan ubah detail item digital toko."
   action={<div className="actions-row"><SearchInput value={q} onChange={v=>{setQ(v);setPage(1)}} placeholder="Cari nama produk..." className="table-search"/>
    <label className="select-wrap compact"><span className="sr-only">Urutan produk</span><select value={sort} onChange={e=>setSort(e.target.value)}><option>Terlaris</option><option>Stok Terendah</option><option>Nama A-Z</option></select></label></div>}>
   <div className="filter-chips">{categories.map(c=><button key={c} className={`filter-chip ${category===c?"active":""}`} onClick={()=>{setCategory(c);setPage(1)}}>{c}</button>)}</div>
   {visible.length?<div className="product-list">{visible.map(p=><div className="product-row" key={p.id}>
    <ProductAvatar name={p.name} color={p.color} short={p.short} size="lg"/>
    <div className="product-info"><h3>{p.name}</h3><p>{p.category}<span className="mid-dot">·</span><strong>{formatRupiah(p.price)}</strong></p><div className="product-micro"><span className={p.stock===0?"out-of-stock":""}>{p.stock} link tersedia</span><span>·</span><span>{p.sold.toLocaleString("id-ID")} total terjual</span></div></div>
    <div className="product-actions"><button className="stock-button" onClick={()=>{setStockId(p.id);setStockCount(String(p.stock));}}><Link2 size={15}/>Stok Link ({p.stock})</button><button className="secondary-button" onClick={()=>openEdit(p)}><Pencil size={15}/> Edit</button><button className="danger-button" onClick={()=>remove(p)}><Trash2 size={15}/> Hapus</button></div>
   </div>)}</div>:<EmptyState icon={Package} title="Tidak ada produk" description="Coba ubah filter atau tambahkan produk baru." action={<button className="primary-button" onClick={openAdd}><Plus size={17}/> Tambah Produk</button>}/>}
   <div className="table-pagination"><span>{filtered.length} produk ditemukan</span><div><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Sebelumnya</button><span>{Math.min(page,maxPage)} / {maxPage}</span><button onClick={()=>setPage(p=>Math.min(maxPage,p+1))} disabled={page>=maxPage}>Berikutnya</button></div></div>
  </Panel></Reveal>
  <Dialog open={dialog} onClose={()=>setDialog(false)} title={editing?"Edit Produk":"Tambah Produk"}>
   <form className="modal-form" onSubmit={submit}>
    <Field label="Nama produk *"><input value={form.name} onChange={e=>changeField("name",e.target.value)} maxLength={150} required placeholder="Contoh: Paket Desain Premium"/></Field>
    <Field label="Kategori *"><select value={form.category} onChange={e=>changeField("category",e.target.value)}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></Field>
    <div className="form-columns"><Field label="Harga (Rupiah) *"><input value={form.price} onChange={e=>changeField("price",e.target.value)} type="number" min="0" step="1" required/></Field><Field label="Stok link *"><input value={form.stock} onChange={e=>changeField("stock",e.target.value)} type="number" min="0" step="1" required/></Field></div>
    <div className="form-columns"><Field label="Inisial ikon"><input value={form.short} maxLength={3} onChange={e=>changeField("short",e.target.value)}/></Field><Field label="Warna ikon"><select value={form.color} onChange={e=>changeField("color",e.target.value)}>{["mint","blue","violet","indigo","amber","pink","green","charcoal"].map(c=><option key={c}>{c}</option>)}</select></Field></div>
    <div className="form-actions"><button className="secondary-button" type="button" onClick={()=>setDialog(false)}>Batal</button><button className="primary-button" type="submit">{editing?"Simpan Perubahan":"Tambah Produk"}</button></div>
   </form>
  </Dialog>
  <Dialog open={!!stockId} onClose={()=>setStockId(null)} title={`Manajemen Stok Link`}>
   {stockProduct&&<form className="modal-form" onSubmit={e=>{
    e.preventDefault();const n=Number(stockCount);if(!Number.isInteger(n)||n<0)return;
    setProducts(list=>list.map(p=>p.id===stockId?{...p,stock:n}:p));setStockId(null);toast("Jumlah stok demo berhasil diubah.");
   }}><p className="dialog-hint"><strong>{stockProduct.name}</strong><br/>Ubah jumlah stok contoh. Pengiriman link aktual membutuhkan backend dan penyimpanan aman.</p>
   <Field label="Jumlah stok tersedia"><input type="number" min="0" step="1" value={stockCount} onChange={e=>setStockCount(e.target.value)} required/></Field>
   <div className="form-actions"><button className="secondary-button" type="button" onClick={()=>setStockId(null)}>Batal</button><button className="primary-button" type="submit">Simpan Stok</button></div></form>}
  </Dialog>
 </div>;
}
