"use client";
import { useMemo } from "react";
import {
 ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis,
 Tooltip, BarChart, Bar, LineChart, Line, ComposedChart, PieChart, Pie, Cell, Legend
} from "recharts";
import { useDashboard } from "@/components/dashboard-context";
import { salesData, trafficData, hourlyTraffic, monthlyTraffic, rangeFactor, statusData, formatRupiah } from "@/lib/data";

const tooltipStyle={border:"1px solid #e9f0ed",borderRadius:14,boxShadow:"0 14px 38px rgba(13,64,55,.12)",fontSize:12,backgroundColor:"#fff",padding:"10px 14px"};
const axis={fontSize:11,fill:"#85928e"};
export function SalesChart({mode="Omset"}:{mode?:"Omset"|"Pesanan"}) {
 const {range}=useDashboard();
 const data=useMemo(()=>salesData.map((row,i)=>({
  ...row,date:range==="7 Hari Terakhir"?row.date:`Pekan ${i+1}`,
  revenue:Math.round(row.revenue * rangeFactor[range]),orders:Math.round(row.orders*rangeFactor[range])
 })),[range]);
 return <div className="chart-container sales-chart" aria-label="Grafik penjualan">
  <ResponsiveContainer width="100%" height="100%">
   <ComposedChart data={data} margin={{top:14,right:4,bottom:0,left:-10}}>
    <defs><linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#09b97f" stopOpacity=".30"/><stop offset="98%" stopColor="#09b97f" stopOpacity=".015"/></linearGradient></defs>
    <CartesianGrid stroke="#e9f0ed" strokeDasharray="4 5" vertical={false}/>
    <XAxis dataKey="date" tick={axis} axisLine={false} tickLine={false} dy={10}/>
    <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={v=>`${Math.round(v/1000)}k`}/>
    <Tooltip contentStyle={tooltipStyle} cursor={{stroke:"#12ba89",strokeDasharray:"3 3"}} formatter={(value,name)=>{
     return name==="Omset"?[formatRupiah(Number(value)),"Omset"]:[`${value} pesanan`,"Pesanan"];
    }}/>
    <Area dataKey="revenue" type="monotone" name="Omset" stroke="#00ae73" strokeWidth={3} fill="url(#salesAreaGradient)" dot={false} activeDot={{r:6,strokeWidth:3,stroke:"#fff"}}/>
    {mode==="Pesanan"&&<Line dataKey="orders" yAxisId="orders" type="monotone" name="Pesanan" stroke="#60cfee" strokeWidth={2.5} dot={{r:3}} activeDot={{r:6}}/>}
    <YAxis yAxisId="orders" orientation="right" hide domain={[0,Math.max(...data.map(d=>d.orders))*2]} />
   </ComposedChart>
  </ResponsiveContainer>
 </div>;
}
export function TrafficBars() {
 const {range}=useDashboard();
 const data=useMemo(()=>trafficData.map((r,i)=>({...r,date:range==="7 Hari Terakhir"?r.date:`Pekan ${i+1}`,visitors:Math.round(r.visitors*rangeFactor[range])})),[range]);
 return <div className="chart-container traffic-chart" aria-label="Grafik jumlah kunjungan">
  <ResponsiveContainer width="100%" height="100%">
   <BarChart data={data} margin={{top:14,right:4,bottom:0,left:-18}}>
    <defs><linearGradient id="visitorBarGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#09b17a"/><stop offset="1" stopColor="#a5ead2"/></linearGradient></defs>
    <CartesianGrid stroke="#e9f0ed" strokeDasharray="4 5" vertical={false}/>
    <XAxis dataKey="date" tick={axis} axisLine={false} tickLine={false} dy={10}/>
    <YAxis tick={axis} axisLine={false} tickLine={false}/>
    <Tooltip contentStyle={tooltipStyle} cursor={{fill:"#effaf6"}} formatter={v=>[`${Number(v).toLocaleString("id-ID")} pengunjung`,"Kunjungan"]}/>
    <Bar dataKey="visitors" fill="url(#visitorBarGradient)" radius={[6,6,0,0]} maxBarSize={38}/>
   </BarChart>
  </ResponsiveContainer>
 </div>;
}
export function Sparkline({values,color="#00bc89"}:{values:number[];color?:string}) {
 return <div className="sparkline" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><AreaChart data={values.map((v,i)=>({x:i,v}))}>
  <Area dataKey="v" type="monotone" stroke={color} strokeWidth={2.3} fill={color} fillOpacity={.11} dot={false}/>
 </AreaChart></ResponsiveContainer></div>;
}
export function StatusDonut(){
 return <div className="donut-wrap"><div className="donut-chart"><ResponsiveContainer width="100%" height="100%">
  <PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="92%" paddingAngle={2} stroke="white" strokeWidth={2} isAnimationActive>
   {statusData.map(d=><Cell key={d.name} fill={d.color}/>)}
  </Pie><Tooltip contentStyle={tooltipStyle} formatter={v=>[Number(v).toLocaleString("id-ID"),"Pesanan"]}/></PieChart>
 </ResponsiveContainer><div className="donut-center"><strong>921</strong><span>Total Pesanan</span></div></div>
 <div className="donut-legend">{statusData.map(d=><div key={d.name}><span className="legend-dot" style={{background:d.color}}/ ><span>{d.name}</span><b>{d.value}</b><small>{(d.value/921*100).toFixed(1)}%</small></div>)}</div>
 </div>;
}
export function HourlyChart() {
 return <div className="chart-container detail-chart" aria-label="Kunjungan hari ini per jam"><ResponsiveContainer width="100%" height="100%">
  <AreaChart data={hourlyTraffic} margin={{top:12,right:7,bottom:0,left:-28}}>
   <defs><linearGradient id="hourlyArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#18b988" stopOpacity=".26"/><stop offset="1" stopColor="#18b988" stopOpacity=".015"/></linearGradient></defs>
   <CartesianGrid stroke="#e9f0ed" strokeDasharray="3 5" vertical={false}/>
   <XAxis dataKey="time" tick={axis} tickLine={false} axisLine={false} interval={5}/>
   <YAxis tick={axis} tickLine={false} axisLine={false}/>
   <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v} kunjungan`,"Pengunjung"]}/>
   <Area dataKey="visitors" type="monotone" stroke="#00a66e" strokeWidth={2.8} fill="url(#hourlyArea)" dot={false} activeDot={{r:5}}/>
  </AreaChart>
 </ResponsiveContainer></div>;
}
export function MonthlyChart() {
 return <div className="chart-container detail-chart" aria-label="Kunjungan per tanggal bulan Oktober"><ResponsiveContainer width="100%" height="100%">
  <LineChart data={monthlyTraffic} margin={{top:12,right:7,bottom:0,left:-28}}>
   <CartesianGrid stroke="#e9f0ed" strokeDasharray="3 5" vertical={false}/>
   <XAxis dataKey="date" tick={axis} interval={5} tickLine={false} axisLine={false}/>
   <YAxis tick={axis} tickLine={false} axisLine={false}/>
   <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v} kunjungan`,"Pengunjung"]} labelFormatter={v=>`${v} Oktober 2026`}/>
   <Line dataKey="visitors" type="monotone" stroke="#05a66e" strokeWidth={2.8} dot={false} activeDot={{r:5}}/>
  </LineChart>
 </ResponsiveContainer></div>;
}
