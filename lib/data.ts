export type RangeOption = "7 Hari Terakhir" | "30 Hari Terakhir" | "90 Hari Terakhir";
export type OrderStatus = "Lunas" | "Menunggu" | "Pre-Order" | "Refund" | "Batal";
export type Product = {
  id: string; name: string; category: string; price: number;
  stock: number; sold: number; todaySold: number; color: string; short: string;
};
export type Order = {
  id: string; product: string; customer: string; email: string;
  price: number; payment: string; status: OrderStatus; time: string;
};
export type Review = {
  id: string; product: string; buyer: string; rating: number;
  comment: string; type: string; date: string;
};
export type Visit = { id: string; time: string; page: string; region: string; device: "Desktop" | "Mobile" | "Tablet" };
export const formatRupiah = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
export const shortMoney = (n: number) => n >= 1000000 ? "Rp" + (n / 1000000).toFixed(1).replace(".", ",") + "jt" : n >= 1000 ? "Rp" + (n / 1000).toFixed(0) + "rb" : formatRupiah(n);
export const dateLabels = ["22 Okt", "23 Okt", "24 Okt", "25 Okt", "26 Okt", "27 Okt", "28 Okt"];
export const salesData = [
 {date:"22 Okt", revenue:64000, orders:4}, {date:"23 Okt", revenue:129000, orders:6},
 {date:"24 Okt", revenue:196500, orders:7}, {date:"25 Okt", revenue:312450, orders:12},
 {date:"26 Okt", revenue:154000, orders:6}, {date:"27 Okt", revenue:218000, orders:8},
 {date:"28 Okt", revenue:274000, orders:10},
];
export const trafficData = [
 {date:"22 Okt", visitors:294}, {date:"23 Okt", visitors:405},
 {date:"24 Okt", visitors:296}, {date:"25 Okt", visitors:545},
 {date:"26 Okt", visitors:367}, {date:"27 Okt", visitors:238},
 {date:"28 Okt", visitors:318},
];
export const hourlyTraffic = [2, 5, 2, 2, 3, 8, 10, 25, 19, 25, 30, 45, 28, 36, 4, 2, 5, 2, 2, 2, 2, 2, 2, 2]
 .map((visitors, h) => ({time: String(h).padStart(2,"0")+":00", visitors}));
export const monthlyTraffic = Array.from({length:31}, (_,i) => ({
  date: String(i+1), visitors: i < 19 ? 0 : [0,0,0,460,495,545,287,244,189,0,0,0][i-19] ?? 0,
}));
const seed = [
 ["gemini", "Google Gemini Pro 18 Bulan", "AI & Produktivitas", 195775, 16, 248, 12, "violet", "AI"],
 ["ebook", "E-book – Dari ide jadi video 1 menit", "E-book", 14700, 38, 116, 4, "mint", "eB"],
 ["viu", "VIU – Lifetime", "Hiburan", 3999, 74, 221, 1, "amber", "▶"],
 ["canva-premium", "Canva Premium – Bisnis – Pro – Edu", "Desain", 4971, 14, 397, 1, "indigo", "C"],
 ["canva-1", "Canva Bisnis 1 Bulan", "Desain", 2000, 0, 355, 0, "blue", "C"],
 ["canva-head", "CANVA BISNIS 1 BULAN HEAD", "Desain", 25000, 0, 18, 0, "indigo", "C"],
 ["canva-edu", "CANVA Edu 1 Tahun", "Digital", 1000, 0, 444, 0, "blue", "C"],
 ["notion", "Notion Template Produktivitas", "Produktivitas", 19000, 20, 91, 0, "charcoal", "N"],
 ["capcut", "CapCut Editing Pack Pro", "Desain", 29000, 28, 167, 0, "charcoal", "✂"],
 ["ebook-ai", "E-book Panduan AI Creator", "E-book", 39000, 40, 82, 0, "mint", "eB"],
 ["figma", "UI Design Kit Premium", "Desain", 49000, 12, 49, 0, "pink", "UI"],
 ["spotify", "Paket Digital Music", "Hiburan", 25000, 18, 68, 0, "green", "♪"],
 ["excel", "Template Excel Keuangan", "Produktivitas", 24000, 35, 108, 0, "green", "X"],
 ["ebook-sell", "E-book Strategi Jualan Online", "E-book", 35000, 24, 77, 0, "amber", "eB"],
 ["calendar", "Digital Planner 2026", "Produktivitas", 15000, 21, 85, 0, "pink", "26"],
 ["logo", "Logo & Branding Starter Kit", "Desain", 59000, 15, 32, 0, "violet", "L"],
 ["course", "Mini Course Konten Viral", "E-book", 99000, 9, 26, 0, "amber", "▶"],
 ["mockup", "Mockup Bundle Creator", "Desain", 45000, 17, 59, 0, "indigo", "M"],
 ["slides", "Slide Template Business", "Produktivitas", 32000, 50, 67, 0, "blue", "S"],
 ["icons", "Icon Pack Premium", "Desain", 17000, 53, 111, 0, "mint", "✦"],
 ["video", "Video Editing Presets", "Desain", 27000, 30, 43, 0, "pink", "V"],
 ["font", "Font Bundle Digital", "Desain", 23000, 27, 73, 0, "charcoal", "Aa"],
] as const;
export const initialProducts: Product[] = seed.map(([id,name,category,price,stock,sold,todaySold,color,short]) => ({id,name,category,price,stock,sold,todaySold,color,short}));
export const initialOrders: Order[] = [
 {id:"TK-10529",product:"E-book – Dari ide jadi video 1 menit",customer:"wasis",email:"wasis@example.com",price:4900,payment:"BELIBAYAR",status:"Batal",time:"16 menit lalu"},
 {id:"TK-10528",product:"Canva Premium – Bisnis – Pro – Edu",customer:"nuralillah11",email:"nuralillah@example.com",price:4971,payment:"DANA",status:"Lunas",time:"2 jam lalu"},
 {id:"TK-10527",product:"E-book – Dari ide jadi video 1 menit",customer:"wasis",email:"wasis@example.com",price:4900,payment:"BELIBAYAR",status:"Batal",time:"3 jam lalu"},
 {id:"TK-10526",product:"E-book – Dari ide jadi video 1 menit",customer:"wasis",email:"wasis@example.com",price:4900,payment:"BELIBAYAR",status:"Batal",time:"5 jam lalu"},
 {id:"TK-10525",product:"E-book – Dari ide jadi video 1 menit",customer:"wasis",email:"wasis@example.com",price:4900,payment:"BELIBAYAR",status:"Lunas",time:"8 jam lalu"},
 {id:"TK-10524",product:"Google Gemini Pro 18 Bulan",customer:"kurnia",email:"kurnia@example.com",price:195775,payment:"QRIS",status:"Lunas",time:"Kemarin"},
 {id:"TK-10523",product:"Canva Bisnis 1 Bulan",customer:"dian",email:"dian@example.com",price:2000,payment:"QRIS",status:"Pre-Order",time:"Kemarin"},
 {id:"TK-10522",product:"VIU – Lifetime",customer:"reza",email:"reza@example.com",price:3999,payment:"DANA",status:"Refund",time:"2 hari lalu"},
 {id:"TK-10521",product:"E-book Panduan AI Creator",customer:"alif",email:"alif@example.com",price:39000,payment:"QRIS",status:"Lunas",time:"2 hari lalu"},
 {id:"TK-10520",product:"Template Excel Keuangan",customer:"mira",email:"mira@example.com",price:24000,payment:"QRIS",status:"Lunas",time:"3 hari lalu"},
];
export const visitLogs: Visit[] = Array.from({length:45}, (_,i) => ({
 id: "V-"+(4100+i),time:`28 Okt 2026, ${String(16-Math.floor(i/6)).padStart(2,"0")}:${String(59-(i*7)%60).padStart(2,"0")}:33`,
 page: i%7===0?"/produk/canva":i%6===0?"/checkout":i%5===0?"/produk/gemini":"/",
 region: ["Tidak diketahui","Pontianak, ID","Jakarta, ID","Surabaya, ID","Bandung, ID"][i%5],
 device: (["Mobile","Desktop","Mobile","Tablet"] as const)[i%4]
}));
export const statusData = [
 {name:"Lunas", value:799, color:"#0cb776"},
 {name:"Pre-Order",value:17,color:"#3589fb"},
 {name:"Refund",value:3,color:"#9255ff"},
 {name:"Batal",value:102,color:"#ff6e81"},
];
export const demoChats = [
 {name:"wasis", initials:"W",message:"Iya masuk",time:"23:08",status:"Aktif"},
 {name:"Pradana Raharja",initials:"P",message:"terima kasih",time:"10:55",status:"Aktif"},
 {name:"Aldo Nano",initials:"A",message:"ok",time:"09:21",status:"Aktif"},
];
export const rangeFactor: Record<RangeOption,number> = {
 "7 Hari Terakhir":1, "30 Hari Terakhir":3.84, "90 Hari Terakhir":11.24
};
