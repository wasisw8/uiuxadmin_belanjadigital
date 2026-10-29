"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownToLine, ArrowUpRight, ChevronDown, Search, X, type LucideIcon } from "lucide-react";
import { useDashboard } from "@/components/dashboard-context";
import { type OrderStatus, type RangeOption } from "@/lib/data";

export function PageHeader({eyebrow,title,subtitle,icon:Icon,action}: {
 eyebrow?:string; title:string;subtitle:string;icon?:LucideIcon;action?:React.ReactNode;
}) {
 return <div className="page-header">
  <div><div className="page-headline">{Icon && <span className="title-icon"><Icon size={23}/></span>}<h1>{title}</h1></div>
   <p>{subtitle}</p>{eyebrow && <span className="overline">{eyebrow}</span>}</div>
  {action && <div className="page-header-actions">{action}</div>}
 </div>;
}
export function Reveal({children, className="",delay=0}: {children:React.ReactNode;className?:string;delay?:number}) {
 const reduced = useReducedMotion();
 return <motion.div className={className} initial={reduced?false:{opacity:0,y:18}}
    animate={{opacity:1,y:0}} transition={{duration:.45,delay,ease:[.2,.7,.2,1]}}>{children}</motion.div>;
}
export function TiltCard({children,className="",delay=0}: {children:React.ReactNode;className?:string;delay?:number}) {
 const ref=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 return <motion.div ref={ref} className={`tilt-card ${className}`} initial={reduced?false:{opacity:0,y:18}}
   animate={{opacity:1,y:0}} transition={{delay,duration:.45}}
   onPointerMove={(event) => {
    if(reduced || event.pointerType==="touch" || !ref.current) return;
    const r=ref.current.getBoundingClientRect();
    const x=(event.clientX-r.left)/r.width-.5;const y=(event.clientY-r.top)/r.height-.5;
    ref.current.style.setProperty("--rx",`${-y*3.8}deg`);
    ref.current.style.setProperty("--ry",`${x*3.8}deg`);
   }}
   onPointerLeave={()=>{if(ref.current){ref.current.style.setProperty("--rx","0deg");ref.current.style.setProperty("--ry","0deg");}}}>
    {children}
  </motion.div>;
}
export function Panel({title,subtitle,action,children,className=""}: {
 title:string;subtitle?:string;action?:React.ReactNode;children:React.ReactNode;className?:string
}) {
 return <section className={`panel ${className}`}>
  <div className="panel-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <div className="panel-action">{action}</div>}</div>
  {children}
 </section>;
}
export function RangeSelect() {
 const {range,setRange}=useDashboard();
 return <label className="select-wrap"><span className="sr-only">Rentang tanggal</span>
  <select value={range} onChange={e=>setRange(e.target.value as RangeOption)}>
   <option>7 Hari Terakhir</option><option>30 Hari Terakhir</option><option>90 Hari Terakhir</option>
  </select><ChevronDown size={15}/></label>;
}
export function SearchInput({value,onChange,placeholder="Cari...",className=""}: {value:string;onChange:(s:string)=>void;placeholder?:string;className?:string}) {
 return <label className={`search-input ${className}`}><Search size={17} aria-hidden="true"/><span className="sr-only">{placeholder}</span>
  <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>{value && <button aria-label="Hapus pencarian" onClick={()=>onChange("")} type="button"><X size={15}/></button>}
 </label>;
}
export function ProductAvatar({name,color="mint",short="✦",size="md"}:{name:string;color?:string;short?:string;size?:"md"|"lg"}) {
 return <span className={`product-avatar avatar-${color} avatar-${size}`} title={name} aria-label={name}>{short}</span>;
}
export function StatusBadge({status}:{status:OrderStatus}) {
 const config:Record<OrderStatus,string>={Lunas:"success",Menunggu:"warning","Pre-Order":"blue",Refund:"purple",Batal:"danger"};
 return <span className={`status-badge badge-${config[status]}`}>{status === "Batal" ? "CANCELLED" : status}</span>;
}
export function Delta({children="+12%",color="green"}:{children?:React.ReactNode;color?:"green"|"red"}) {
 return <span className={`delta ${color}`}><ArrowUpRight size={15} strokeWidth={2.8}/>{children}</span>;
}
export function Dialog({open,onClose,title,children,wide=false}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode;wide?:boolean}) {
 useEffect(()=>{
  if(!open)return;
  function close(e:KeyboardEvent){if(e.key==="Escape")onClose();}
  window.addEventListener("keydown",close);
  return ()=>window.removeEventListener("keydown",close);
 },[open,onClose]);
 if(!open)return null;
 return <div className="dialog-overlay" onMouseDown={e=>{if(e.currentTarget===e.target)onClose();}}>
   <motion.div role="dialog" aria-modal="true" aria-label={title} className={`dialog ${wide?"dialog-wide":""}`}
      initial={{opacity:0,y:20,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.2}}>
    <div className="dialog-header"><h2>{title}</h2><button onClick={onClose} className="icon-button" aria-label="Tutup"><X size={20}/></button></div>
    <div className="dialog-content">{children}</div>
   </motion.div>
  </div>;
}
export function EmptyState({icon:Icon,title,description,action}:{icon:LucideIcon;title:string;description:string;action?:React.ReactNode}) {
 return <div className="empty-state"><span className="empty-illustration"><Icon size={31}/></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}
export function Field({label,children}:{label:string;children:React.ReactNode}) {
 return <label className="field"><span>{label}</span>{children}</label>;
}
export function ExportButton({onClick}:{onClick:()=>void}) {
 return <button type="button" className="secondary-button" onClick={onClick}><ArrowDownToLine size={16}/><span>Ekspor</span></button>;
}
export function toCsv(name:string,headers:string[],rows:(string|number)[][]) {
 const escape=(value:string|number)=>`"${String(value).replaceAll('"','""')}"`;
 const csv="\uFEFF"+[headers,...rows].map(r=>r.map(escape).join(",")).join("\r\n");
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download=name;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function Segmented({items,active,onChange}:{items:string[];active:string;onChange:(s:string)=>void}){
 return <div className="segmented" role="group">{items.map(item=><button className={active===item?"active":""} key={item} type="button" onClick={()=>onChange(item)}>{item}</button>)}</div>;
}
