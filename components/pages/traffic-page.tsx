"use client";
import { useMemo, useState } from "react";
import { Activity, ArrowDownToLine, CalendarDays, ChartNoAxesCombined, Eye, Globe2, RefreshCw, Smartphone, UsersRound } from "lucide-react";
import { HourlyChart, MonthlyChart } from "@/components/charts";
import { EmptyState, ExportButton, PageHeader, Panel, RangeSelect, Reveal, SearchInput, toCsv } from "@/components/ui";
import { useDashboard } from "@/components/dashboard-context";
import { visitLogs, rangeFactor } from "@/lib/data";

export function TrafficPage() {
 const {range,toast}=useDashboard();
 const [term,setTerm]=useState("");
 const [device,setDevice]=useState("Semua Perangkat");
 const [page,setPage]=useState(1);
 const [refreshed,setRefreshed]=useState(false);
 const filtered=useMemo(()=>visitLogs.filter(v=>
  (device==="Semua Perangkat"||v.device===device)&&
  `${v.page} ${v.region} ${v.time}`.toLowerCase().includes(term.toLowerCase())
 ),[term,device]);
 const perPage=8, maxPage=Math.max(1,Math.ceil(filtered.length/perPage));
 const list=filtered.slice((page-1)*perPage,page*perPage);
 const total=Math.round(3736*rangeFactor[range]);
 return <div className="standard-page">
  <PageHeader title="Trafik Kunjungan" icon={Globe2} subtitle="Pahami perilaku pengunjung, waktu ramai, dan asal trafik tokomu."
   action={<div className="actions-row"><RangeSelect/><button aria-label="Segarkan data demo" className="secondary-button square-button" onClick={()=>{setRefreshed(true);toast("Data demo ditampilkan ulang. Hubungkan API untuk data live.","info")}}><RefreshCw size={17} className={refreshed?"one-spin":""}/></button>
   <ExportButton onClick={()=>{toCsv("tokoku-trafik.csv",["Waktu","Halaman","Regional","Perangkat"],filtered.map(v=>[v.time,v.page,v.region,v.device]));toast("Catatan kunjungan berhasil diekspor.")}}/></div>}/>
  <div className="detail-stat-grid">
   <Reveal><div className="detail-stat"><span className="stat-mini-icon green"><Eye size={21}/></span><div><small>Total Kunjungan Terekam</small><strong>{total.toLocaleString("id-ID")}</strong><span>Dalam {range.toLowerCase()}</span></div><span className="detail-stat-graphic">↗</span></div></Reveal>
   <Reveal delay={.05}><div className="detail-stat"><span className="stat-mini-icon blue"><UsersRound size={21}/></span><div><small>Pengunjung Unik (Sesi)</small><strong>{Math.round(999*rangeFactor[range]).toLocaleString("id-ID")}</strong><span>Pengunjung berbeda (estimasi demo)</span></div><span className="detail-stat-graphic blue-text">◎</span></div></Reveal>
   <Reveal delay={.1}><div className="detail-stat"><span className="stat-mini-icon orange"><Activity size={21}/></span><div><small>Puncak Kunjungan</small><strong>45 <em>/ jam</em></strong><span>Terbanyak sekitar pukul 12.00</span></div><span className="detail-stat-graphic orange-text">⌁</span></div></Reveal>
  </div>
  <div className="chart-duo">
   <Reveal delay={.12}><Panel title="Kunjungan Harian per Jam" subtitle="Rabu, 28 Oktober 2026 · WIB" action={<span className="soft-badge">Puncak 45</span>}><HourlyChart/><div className="chart-edge-labels"><span>00:00</span><span>12:00</span><span>23:00</span></div></Panel></Reveal>
   <Reveal delay={.16}><Panel title="Kunjungan Bulanan per Tanggal" subtitle="Oktober 2026 · WIB" action={<span className="soft-badge">Puncak 545</span>}><MonthlyChart/><div className="chart-edge-labels"><span>1 Okt</span><span>16 Okt</span><span>31 Okt</span></div></Panel></Reveal>
  </div>
  <Reveal delay={.22}><Panel title="Log Kunjungan" subtitle="Contoh 45 kunjungan terbaru dari 3.736 catatan (data demo)." action={<div className="actions-row"><SearchInput className="table-search" value={term} onChange={v=>{setTerm(v);setPage(1);}} placeholder="Cari halaman atau lokasi"/><label className="select-wrap compact"><span className="sr-only">Filter perangkat</span><select value={device} onChange={e=>{setDevice(e.target.value);setPage(1);}}><option>Semua Perangkat</option><option>Mobile</option><option>Desktop</option><option>Tablet</option></select></label></div>}>
   {list.length?<div className="table-scroll"><table className="data-table"><thead><tr><th>Jam Kunjungan</th><th>Halaman</th><th>Regional</th><th>Perangkat</th></tr></thead>
    <tbody>{list.map(v=><tr key={v.id}><td>{v.time}</td><td><code>{v.page}</code></td><td>{v.region}</td><td><span className="device-label"><Smartphone size={15}/>{v.device}</span></td></tr>)}</tbody></table></div>
    :<EmptyState icon={Globe2} title="Tidak ada hasil" description="Coba ubah kata pencarian atau filter perangkat."/>}
   <div className="table-pagination"><span>Menampilkan {list.length} dari {filtered.length} log demo</span><div><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Sebelumnya</button><span>{page} / {maxPage}</span><button disabled={page>=maxPage} onClick={()=>setPage(p=>p+1)}>Berikutnya</button></div></div>
  </Panel></Reveal>
 </div>;
}
