"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, BarChart3, ShoppingBag, TrendingUp, Sparkles } from "lucide-react";

export function Hero3D() {
 const scene=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 return <div className="hero-visual" onPointerMove={e=>{
  if(reduced || e.pointerType==="touch" || !scene.current)return;
  const r=e.currentTarget.getBoundingClientRect();
  scene.current.style.setProperty("--scene-x",`${-(e.clientY-r.top-r.height/2)/r.height*10}deg`);
  scene.current.style.setProperty("--scene-y",`${(e.clientX-r.left-r.width/2)/r.width*16}deg`);
 }} onPointerLeave={()=>{
   scene.current?.style.setProperty("--scene-x","0deg");
   scene.current?.style.setProperty("--scene-y","0deg");
 }}>
  <div className="hero-orb orb-a"/><div className="hero-orb orb-b"/>
  <div className="scene-perspective" ref={scene}>
   <motion.div className="floating-analytics" animate={reduced?undefined:{y:[0,-10,0],rotate:[-5,-2,-5]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}>
    <BarChart3 size={25}/><span className="chart-bars"><i/><i/><i/><i/></span>
   </motion.div>
   <motion.div className="floating-growth" animate={reduced?undefined:{y:[0,8,0],rotate:[6,4,6]}} transition={{duration:5.5,repeat:Infinity,ease:"easeInOut"}}>
    <small>Penjualan</small><strong>+32%</strong><TrendingUp size={25}/>
   </motion.div>
   <motion.div className="coin coin-one" animate={reduced?undefined:{y:[0,-16,0],rotateY:[-24,24,-24]}} transition={{duration:4,repeat:Infinity}}><span>Rp</span></motion.div>
   <motion.div className="coin coin-two" animate={reduced?undefined:{y:[0,12,0],rotateY:[18,-20,18]}} transition={{duration:4.8,repeat:Infinity}}><span>Rp</span></motion.div>
   <div className="store-platform"/>
   <div className="store-shadow"/>
   <div className="store-building">
     <div className="store-side"/>
     <div className="store-front">
       <div className="store-sign">Tokoku <Sparkles size={12}/></div>
       <div className="store-canopy"><i/><i/><i/><i/><i/><i/></div>
       <div className="store-door"><ShoppingBag size={25}/></div>
       <div className="store-window"><span/><span/></div>
     </div>
     <div className="store-roof"/>
   </div>
   <div className="delivery-box"><div className="box-top"/><div className="box-front"/><div className="box-side"/><span>✓</span></div>
  </div>
  <span className="scene-star star-a">✦</span><span className="scene-star star-b">✦</span>
 </div>;
}
