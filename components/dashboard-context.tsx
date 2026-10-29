"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { initialOrders, initialProducts, type Order, type Product, type Review, type RangeOption } from "@/lib/data";

type ToastData = { id: number; message: string; tone: "success" | "info" | "danger" };
type StoreContext = {
  range: RangeOption; setRange: (next: RangeOption) => void;
  products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[]; setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  reviews: Review[]; addReview: (review: Review) => void;
  delivery: "Otomatis" | "Manual"; setDelivery: (mode: "Otomatis" | "Manual") => void;
  notifications: boolean; setNotifications: (value: boolean) => void;
  toast: (message: string, tone?: "success" | "info" | "danger") => void;
  toasts: ToastData[]; dismissToast: (id: number) => void;
};
const Ctx = createContext<StoreContext | null>(null);
const STORAGE = "tokoku-redesign-demo-v1";
export function DashboardProvider({ children }: {children: React.ReactNode}) {
  const [range, setRange] = useState<RangeOption>("7 Hari Terakhir");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [delivery, setDelivery] = useState<"Otomatis" | "Manual">("Otomatis");
  const [notifications, setNotifications] = useState(true);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.products)) setProducts(saved.products);
        if (Array.isArray(saved.orders)) setOrders(saved.orders);
        if (Array.isArray(saved.reviews)) setReviews(saved.reviews);
        if (saved.delivery === "Manual" || saved.delivery === "Otomatis") setDelivery(saved.delivery);
      }
    } catch { /* ignore corrupt local demo data */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE, JSON.stringify({products,orders,reviews,delivery})); }
    catch { /* storage may be unavailable */ }
  }, [products, orders, reviews, delivery, ready]);
  const toast = useCallback((message: string, tone: ToastData["tone"] = "success") => {
    setToasts(s => [...s.slice(-2), {id: Date.now() + Math.random(), message, tone}]);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts(s => s.filter(t => t.id !== id)),[]);
  const addReview = useCallback((review: Review) => setReviews(s => [review,...s]), []);
  return (
    <Ctx.Provider value={{range,setRange,products,setProducts,orders,setOrders,reviews,addReview,delivery,setDelivery,notifications,setNotifications,toast,toasts,dismissToast}}>
      {children}
    </Ctx.Provider>
  );
}
export function useDashboard() {
  const context = useContext(Ctx);
  if (!context) throw new Error("DashboardProvider missing");
  return context;
}
