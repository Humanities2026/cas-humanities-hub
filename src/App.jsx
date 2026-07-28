import { supabase } from './supabase';
import { useState, useEffect, useCallback, useRef } from "react";
import * as React from "react";

/* ─────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0A1F44;--ink2:#1044A3;--ink3:#1A5CC8;
  --sky:#2E7DD6;--sky2:#5B9FE8;--sky-pale:#EAF2FF;
  --gold:#E8650A;--gold-pale:#FEF0E6;
  --sage:#1044A3;--sage-pale:#EAF2FF;
  --rose:#CC3A00;--rose-pale:#FDEEE6;
  --slate:#5A6A85;--border:#D6E2F5;--bg:#F0F5FF;
  --card:#FFFFFF;--r:14px;--sh:0 2px 16px rgba(10,31,68,.09);
  --orange:#E8650A;--orange2:#F07830;--orange-pale:#FEF0E6;
  --blue:#1044A3;--blue2:#2E7DD6;--blue-pale:#EAF2FF;
}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--ink);min-height:100vh}
button{cursor:pointer;font-family:'Outfit',sans-serif}
input,select,textarea{font-family:'Outfit',sans-serif}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#CBD5E0;border-radius:99px}

/* NAV */
.nav{background:var(--ink);height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:200}
.nav-logo{font-family:'Playfair Display',serif;color:#fff;font-size:17px}
.nav-logo em{color:var(--orange2);font-style:normal}
.nav-pills{display:flex;gap:4px}
.npill{border:none;background:transparent;color:#94A3B8;padding:7px 15px;border-radius:8px;font-size:13px;font-weight:500;transition:all .18s}
.npill:hover{background:rgba(255,255,255,.08);color:#fff}
.npill.on{background:var(--ink2);color:#fff}

/* HERO */
.hero{background:linear-gradient(135deg,var(--ink) 0%,var(--blue) 55%,var(--orange) 100%);padding:48px 28px 56px;position:relative}
.hero-inner{max-width:960px;margin:0 auto}
.hero h1{font-family:'Playfair Display',serif;font-size:34px;color:#fff;line-height:1.2;margin-bottom:10px}
.hero h1 span{color:var(--orange2)}
.hero-sub{color:#A8C4F0;font-size:15px;max-width:520px;line-height:1.65;margin-bottom:28px}
.kpis{display:flex;gap:16px;flex-wrap:wrap}
.kpi{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:14px 18px}
.kpi-n{font-family:'Playfair Display',serif;font-size:30px;color:var(--orange2)}
.kpi-l{font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:.8px;margin-top:2px}

/* LAYOUT */
.wrap{max-width:960px;margin:0 auto;padding:28px 28px 80px}
.sec-hd{font-family:'Playfair Display',serif;font-size:22px;color:var(--ink);margin-bottom:4px}
.sec-sub{font-size:13px;color:var(--slate);margin-bottom:20px}

/* MODULE GRID */
.mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px}
.mod-card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;border:2px solid transparent;transition:transform .2s,box-shadow .2s,border-color .2s}
.mod-card.go{cursor:pointer}.mod-card.go:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(10,22,40,.13);border-color:var(--sky)}
.mod-card.locked{opacity:.5;cursor:not-allowed}
.mod-card.complete{border-color:var(--orange)}
.mod-top{padding:20px 20px 12px;display:flex;gap:12px}
.mod-icon{width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.mod-info h3{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:3px}
.mod-info p{font-size:12px;color:var(--slate);line-height:1.5}
.lock-note{font-size:11px;font-weight:600;color:var(--slate);background:#F1F5F9;display:inline-block;padding:2px 9px;border-radius:99px;margin-top:5px}
.mod-foot{padding:8px 20px 14px;border-top:1px solid var(--border)}
.mod-foot-row{display:flex;justify-content:space-between;font-size:12px;color:var(--slate);margin-bottom:5px}
.pbar{background:#E8EFF7;border-radius:99px;height:4px}
.pbar-fill{border-radius:99px;height:4px;transition:width .5s}

/* LESSON LIST */
.llist{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;margin-bottom:22px}
.llist-hd{padding:20px 22px 14px;border-bottom:1px solid var(--border)}
.llist-hd h3{font-family:'Playfair Display',serif;font-size:19px;color:var(--ink)}
.llist-hd p{font-size:13px;color:var(--slate);margin-top:3px}
.l-item{display:flex;align-items:center;gap:12px;padding:13px 22px;border-bottom:1px solid var(--border);transition:background .15s}
.l-item:last-child{border-bottom:none}
.l-item.go:hover{background:#F8FAFD;cursor:pointer}
.l-item.dimmed{opacity:.4;cursor:not-allowed}
.l-num{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.l-num.done{background:var(--orange);color:#fff}
.l-num.next{background:var(--ink2);color:#fff}
.l-num.wait{background:#E8EFF7;color:#94A3B8}
.l-body{flex:1}
.l-title{font-size:14px;font-weight:600;color:var(--ink)}
.l-meta{font-size:12px;color:var(--slate);margin-top:2px}
.l-badge{padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700}
.b-read{background:var(--blue-pale);color:var(--ink2)}
.b-quiz{background:var(--orange-pale);color:var(--orange)}
.b-scenario{background:var(--orange-pale);color:var(--orange)}
.b-drag{background:var(--blue-pale);color:var(--blue)}
.b-media{background:var(--blue-pale);color:var(--blue)}

/* LESSON VIEW */
.back-btn{background:none;border:none;color:var(--sky);font-size:13px;font-weight:600;display:flex;align-items:center;gap:5px;padding:0;margin-bottom:16px;cursor:pointer}
.lview{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden}
.lview-hd{padding:24px 28px 18px;border-bottom:2px solid var(--border)}
.lview-tag{display:inline-block;padding:3px 11px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px}
.lview-hd h2{font-family:'Playfair Display',serif;font-size:22px;color:var(--ink);margin-bottom:4px}
.lview-dur{font-size:13px;color:var(--slate)}
.lview-body{padding:26px 28px}
.intro-box{background:var(--sky-pale);border-left:4px solid var(--ink2);padding:14px 16px;border-radius:0 9px 9px 0;margin-bottom:24px;font-size:14px;color:var(--ink2);line-height:1.7;font-style:italic}
.sec-block{margin-bottom:22px}
.sec-block h4{font-size:13px;font-weight:700;color:var(--ink2);margin-bottom:7px;padding-bottom:6px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px}
.sec-block p{font-size:14px;line-height:1.75;color:#0A1F44}
.key-box{background:var(--orange-pale);border:1px solid #F0A060;border-radius:9px;padding:12px 15px;margin-top:9px}
.key-box b{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--orange);display:block;margin-bottom:4px}
.key-box p{font-size:13px;color:#5A3010;line-height:1.6}

/* SCENARIO */
.scenario-card{background:linear-gradient(135deg,var(--ink),var(--ink2));border-radius:11px;padding:18px;color:#fff;margin-bottom:18px}
.scenario-card h4{font-family:'Playfair Display',serif;font-size:15px;margin-bottom:6px;color:var(--sky2)}
.scenario-card p{font-size:13px;line-height:1.65;opacity:.9}
.choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}
.choice-btn{padding:13px;border-radius:9px;border:2px solid var(--border);background:var(--card);text-align:left;transition:all .2s;color:var(--ink);cursor:pointer}
.choice-btn:hover:not(:disabled){border-color:var(--sky);background:var(--sky-pale)}
.choice-btn.correct{border-color:var(--orange)!important;background:var(--orange-pale)!important}
.choice-btn.wrong{border-color:var(--rose)!important;background:var(--rose-pale)!important}
.choice-lbl{font-size:12px;font-weight:700;color:var(--ink2);margin-bottom:3px}
.choice-txt{font-size:12px;color:var(--slate);line-height:1.5}
.fb-box{padding:12px 15px;border-radius:9px;margin-bottom:13px;font-size:13px;line-height:1.6}
.fb-ok{background:var(--orange-pale);border:1px solid #F0A060;color:#7A2800}
.fb-no{background:var(--rose-pale);border:1px solid #F08060;color:#7B241C}

/* QUIZ */
.q-wrap{max-width:640px}
.q-dots{display:flex;gap:5px;margin-bottom:20px}
.q-dot{width:9px;height:9px;border-radius:50%;background:var(--border)}
.q-dot.done{background:var(--orange)}.q-dot.cur{background:var(--sky)}
.q-txt{font-size:15px;font-weight:600;color:var(--ink);margin-bottom:4px;line-height:1.5}
.q-sub{font-size:13px;color:var(--slate);margin-bottom:16px}
.q-opts{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.q-opt{display:flex;align-items:flex-start;gap:11px;padding:11px 14px;border:2px solid var(--border);border-radius:9px;background:var(--card);text-align:left;transition:all .18s;color:var(--ink);cursor:pointer;width:100%}
.q-opt:hover:not(:disabled){border-color:var(--sky);background:var(--sky-pale)}
.q-opt.right{border-color:var(--orange)!important;background:var(--orange-pale)!important}
.q-opt.wrong{border-color:var(--rose)!important;background:var(--rose-pale)!important}
.q-opt:disabled{cursor:default}
.q-radio{width:19px;height:19px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;transition:all .18s}
.q-radio.filled{background:var(--ink2);border-color:var(--ink2)}
.q-radio.r-ok{background:var(--orange);border-color:var(--orange)}
.q-radio.r-no{background:var(--rose);border-color:var(--rose)}
.q-opt-txt{font-size:14px;line-height:1.5;flex:1}
.q-explain{padding:10px 14px;background:var(--sky-pale);border-radius:8px;font-size:13px;color:var(--ink2);line-height:1.6;margin-bottom:13px;border-left:3px solid var(--sky)}
.qresult{text-align:center;padding:30px}
.qresult-score{font-family:'Playfair Display',serif;font-size:50px;margin-bottom:6px}
.qresult h3{font-size:19px;font-weight:700;margin-bottom:7px}
.qresult p{font-size:14px;color:var(--slate);margin-bottom:20px}
.qresult-btns{display:flex;gap:10px;justify-content:center}

/* DRAG */
.drag-list{display:flex;flex-direction:column;gap:7px;margin-bottom:16px}
.drag-item{display:flex;align-items:center;gap:11px;padding:11px 14px;background:var(--card);border:2px solid var(--border);border-radius:9px;cursor:grab;user-select:none;transition:border-color .2s}
.drag-item:active{cursor:grabbing}
.drag-item.over{border-color:var(--sky);background:var(--sky-pale)}
.drag-handle{color:#CBD5E0;font-size:15px;flex-shrink:0}
.drag-num{width:26px;height:26px;border-radius:50%;background:var(--ink2);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
.drag-txt{font-size:13px;font-weight:500;color:var(--ink);flex:1}

/* BUTTONS */
.btn-primary{padding:10px 24px;background:var(--ink2);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;transition:opacity .18s;cursor:pointer}
.btn-primary:hover{opacity:.85}.btn-primary:disabled{opacity:.4;cursor:not-allowed}
.btn-ghost{padding:10px 24px;background:transparent;color:var(--ink2);border:2px solid var(--ink2);border-radius:9px;font-size:14px;font-weight:700;transition:all .18s;cursor:pointer}
.btn-ghost:hover{background:var(--sky-pale)}
.btn-success{padding:10px 24px;background:var(--orange);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;transition:opacity .18s;cursor:pointer}
.btn-success:hover{opacity:.88}
.btn-danger{padding:8px 16px;background:var(--rose-pale);color:var(--rose);border:1px solid #F1948A;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s}
.btn-danger:hover{background:var(--rose);color:#fff}
.complete-btn{width:100%;padding:12px;background:linear-gradient(135deg,var(--blue),var(--orange));color:#fff;border:none;border-radius:9px;font-size:15px;font-weight:700;margin-top:16px;cursor:pointer;transition:opacity .18s}
.complete-btn:hover{opacity:.88}
.complete-btn.done{background:linear-gradient(135deg,var(--orange),var(--orange2));cursor:default}



.tpl-day-tab{flex:1;padding:8px;border:none;background:transparent;border-radius:7px;font-size:12px;font-weight:700;color:var(--slate);transition:all .18s;cursor:pointer}
.tpl-day-tab.on{background:var(--ink2);color:#fff}
.tpl-body{padding:24px}
.tpl-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--slate);margin-bottom:4px}
.tpl-val{padding:9px 12px;background:#F8FAFD;border:1px solid var(--border);border-radius:7px;font-size:13px;color:var(--ink);line-height:1.65;margin-bottom:12px}
.tpl-edit{width:100%;padding:9px 12px;background:#fff;border:2px solid var(--sky);border-radius:7px;font-size:13px;color:var(--ink);line-height:1.65;margin-bottom:12px;resize:vertical;min-height:60px;font-family:'Outfit',sans-serif}
.tpl-edit:focus{outline:none;border-color:var(--ink2)}
.tpl-2col{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:0}
.tpl-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;margin-bottom:12px}
.check-pair{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px}
.check-box{background:#F8FAFD;border:1px solid var(--border);border-radius:7px;padding:11px}
.check-box-hd{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--slate);margin-bottom:6px}
.check-item{font-size:12px;color:var(--ink);margin-bottom:3px}
.check-item::before{content:'☑ ';color:var(--orange)}
.cycle-row{display:flex;gap:9px;margin-bottom:7px;align-items:flex-start}
.cycle-lbl{width:110px;flex-shrink:0;padding:6px 8px;border-radius:6px;color:#fff;font-size:10px;font-weight:700;text-align:center}
.edit-toggle{padding:6px 14px;border:1px solid var(--sky);background:var(--sky-pale);color:var(--ink2);border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s}
.edit-toggle.active{background:var(--ink2);color:#fff;border-color:var(--ink2)}
.download-btn{padding:10px 18px;background:linear-gradient(135deg,var(--orange),var(--orange2));color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .18s;display:flex;align-items:center;gap:7px}
.download-btn:hover{opacity:.88}
.download-btn:disabled{opacity:.4;cursor:not-allowed}

/* ADMIN */
.adash{display:flex;flex-direction:column;gap:20px}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stat-c{background:var(--card);border-radius:var(--r);padding:16px;text-align:center;box-shadow:var(--sh)}
.stat-n{font-family:'Playfair Display',serif;font-size:32px}
.stat-l{font-size:11px;text-transform:uppercase;letter-spacing:.7px;color:var(--slate);margin-top:3px}
.panel{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden}
.panel-hd{padding:14px 20px;border-bottom:2px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.panel-hd h3{font-family:'Playfair Display',serif;font-size:17px;color:var(--ink)}
.panel-hd-btns{display:flex;gap:8px}
.add-btn{padding:6px 14px;background:var(--ink2);color:#fff;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .18s}
.add-btn:hover{opacity:.85}
table{width:100%;border-collapse:collapse}
th{background:var(--ink);color:#fff;padding:9px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.6px;font-family:'Outfit',sans-serif;white-space:nowrap}
td{padding:11px 12px;border-bottom:1px solid var(--border);font-size:13px;color:var(--ink)}
tr:last-child td{border-bottom:none}
tr:hover td{background:#FAFBFD}
.sb{padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700}
.sb-done{background:var(--orange-pale);color:var(--orange)}
.sb-prog{background:var(--blue-pale);color:var(--blue)}
.sb-new{background:var(--blue-pale);color:var(--ink2)}
.sb-ns{background:#F1F5F9;color:var(--slate)}
.minibar{display:flex;align-items:center;gap:6px}
.mb-o{flex:1;background:#E8EFF7;border-radius:99px;height:4px;min-width:40px}
.mb-i{border-radius:99px;height:4px;transition:width .4s}
.mb-p{font-size:11px;color:var(--slate);width:28px;text-align:right}
.tag-row{display:flex;flex-wrap:wrap;gap:4px}
.course-tag{padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;background:var(--sky-pale);color:var(--ink2)}

/* COURSES TABLE */
.courses-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px}
.course-card{background:#F8FAFD;border:1px solid var(--border);border-radius:9px;padding:13px}
.course-card-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}
.course-card h4{font-size:13px;font-weight:700;color:var(--ink)}
.course-card p{font-size:12px;color:var(--slate);line-height:1.5}
.course-icon{font-size:20px}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(10,22,40,.55);z-index:500;display:flex;align-items:center;justify-content:center;padding:24px}
.modal{background:var(--card);border-radius:var(--r);padding:28px;width:100%;max-width:460px;box-shadow:0 20px 60px rgba(10,22,40,.3);max-height:90vh;overflow-y:auto}
.modal h3{font-family:'Playfair Display',serif;font-size:21px;color:var(--ink);margin-bottom:5px}
.modal p{font-size:13px;color:var(--slate);margin-bottom:18px}
.modal-btns{display:flex;gap:9px;justify-content:flex-end;margin-top:16px}
.modal-tabs{display:flex;gap:5px;margin-bottom:20px;background:#F8FAFD;padding:5px;border-radius:9px}
.modal-tab{flex:1;padding:8px;border:none;background:transparent;border-radius:7px;font-size:12px;font-weight:700;color:var(--slate);cursor:pointer;transition:all .18s}
.modal-tab.on{background:var(--ink2);color:#fff}

/* RECS */
.rec-list{display:flex;flex-direction:column;gap:8px;padding:13px 20px 16px}
.rec-card{display:flex;gap:10px;padding:10px 13px;border-radius:9px;align-items:flex-start}
.rec-icon{font-size:17px;flex-shrink:0;margin-top:1px}
.rec-body h4{font-size:13px;font-weight:700;margin-bottom:2px}
.rec-body p{font-size:13px;color:var(--slate);line-height:1.5}
.rec-red{background:var(--rose-pale);border:1px solid #F08060}.rec-red h4{color:var(--rose)}
.rec-amber{background:var(--orange-pale);border:1px solid #F0A060}.rec-amber h4{color:var(--orange)}
.rec-green{background:var(--blue-pale);border:1px solid #90B8E8}.rec-green h4{color:var(--blue)}

/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;background:var(--ink);color:#fff;padding:12px 17px;border-radius:9px;font-size:14px;z-index:999;box-shadow:0 8px 24px rgba(10,22,40,.25);animation:toastIn .3s ease}
@keyframes toastIn{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}

@media(max-width:640px){
  .mod-grid,.form-row,.stat-row,.tpl-2col,.tpl-3col,.check-pair,.choice-grid,.courses-grid{grid-template-columns:1fr}
  .hero h1{font-size:24px}
  .diff-grid{grid-template-columns:1fr 1fr}
}
`;

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const FE_COLORS = { engage: "#1044A3", explore: "#E8650A", explain: "#1A5CC8", elaborate: "#CC5500", evaluate: "#0A1F44" };
// ── Admin password from env (set VITE_ADMIN_PWD in .env / Vercel) ─
// Falls back to "HODadmin2026" so the app still works if the var is missing.
const ADMIN_PWD = import.meta.env.VITE_ADMIN_PWD || "HODadmin2026";

/* ─────────────────────────────────────────────────────────────────
   DEFAULT COURSES
───────────────────────────────────────────────────────────────── */
const DEFAULT_COURSES = [
  { id: "c1", name: "Economics", icon: "📈", description: "College-level economics with C3 inquiry focus" },
  { id: "c2", name: "History", icon: "⏳", description: "Historical thinking, sources, and argumentation" },
  { id: "c3", name: "Geography", icon: "🌍", description: "Spatial thinking and human-environment interaction" },
  { id: "c4", name: "Civics", icon: "⚖️", description: "Rights, power, participation, and democratic institutions" },
  { id: "c5", name: "Sociology", icon: "🏘️", description: "Human behaviour, society, culture, and identity" },
  { id: "c6", name: "Business and Marketing", icon: "💼", description: "Business concepts, strategy, and marketing inquiry" },
];

/* ─────────────────────────────────────────────────────────────────
   CURRICULUM MODULES
───────────────────────────────────────────────────────────────── */
const MODULES = [
  {
    id: "m1", seq: 1, title: "Onboarding", icon: "🚀", color: "#1D9E75", light: "#E1F5EE",
    description: "Everything you need to know before your first lesson at CAS Humanities.",
    lessons: [
      {
        id: "m1l1", title: "Welcome to CAS Humanities", dur: "5 min", type: "read",
        content: {
          intro: "Welcome to the CAS Humanities department. This onboarding module walks you through the essential routines, tools, and expectations you need to know before you step into your first lesson. Work through it at your own pace — everything here is practical and immediate.",
          sections: [
            { icon: "🏛️", heading: "Our department at a glance", body: "The CAS Humanities department covers Business, Accounting, Marketing, World History, Sociology, Geography, and Civics across Grades 9 to 11. Every teacher in the department follows the same planning framework — the C3 Inquiry Arc and the 5E lesson model — regardless of subject. This consistency is what makes our student experience coherent.", key: { label: "What this means for you", text: "Even if you are a subject specialist, you are first a Humanities teacher at CAS. The frameworks you will learn in the modules that follow apply to every lesson you teach here." } },
            { icon: "📁", heading: "OneDrive is your primary workspace", body: "All departmental resources, templates, and shared folders live on OneDrive. You will use it every single week to submit your scheme of work and lesson plans. Make sure you have access before your first day of teaching — ask your HOD if you have not received the shared folder link.", key: { label: "Two folders to bookmark immediately", text: "1. The Weekly Scheme folder — where you submit your scheme of work every Tuesday. 2. The Humanities folder — where you upload your lesson plans and resources every Thursday." } },
            { icon: "📄", heading: "The official lesson plan template", body: "CAS has an official Daily Lesson Plan template for 2025–26. You must use this template for every lesson plan you submit. Do not create your own format. Download it from the Humanities OneDrive folder and save it somewhere accessible — you will use it weekly.", key: { label: "Common mistake", text: "New teachers sometimes design their own planning format. This means their plans cannot be read consistently by the HOD and do not meet submission requirements. Always use the official template." } },
          ]
        }
      },
      {
        id: "m1l2", title: "Your Two Weekly Submissions", dur: "8 min", type: "read",
        content: {
          intro: "Every teacher in the department has two fixed weekly submissions. These are non-negotiable routines — not occasional tasks. Missing them or submitting late affects the HOD's planning and is noted. This lesson explains exactly what each submission involves.",
          sections: [
            { icon: "📅", heading: "Tuesday before 2:00 PM — Weekly Scheme of Work", body: "Every Tuesday before 2:00 PM, you fill in the Scheme of Work for the following week. This is a shared OneDrive document — not a personal file. You enter the topic, learning intention, homework (if any), and assessment (if any) for each lesson next week.", key: { label: "Formatting rules — no exceptions", text: "Font: Calibri Bold, size 11. No italic text. No underlined text. Keep entries concise — this is a planning overview, not a full lesson plan." } },
            { icon: "📤", heading: "Thursday — Lesson Plans and Resources", body: "Every Thursday, you upload next week's lesson plans and all accompanying resources to the Humanities folder on OneDrive. A lesson plan alone is not enough — the PowerPoint, worksheets, and any other student-facing materials must be uploaded alongside it.", key: { label: "What counts as a complete Thursday submission", text: "One completed CAS Lesson Plan template per lesson. The PowerPoint for each lesson. Student worksheets and handouts. Any other resources students will use in the lesson." } },
            { icon: "⚠️", heading: "Most common submission mistakes", body: "Based on what the HOD sees most frequently, these are the errors new teachers make most often in their first term.", key: { label: "Avoid these", text: "Submitting the lesson plan without the PPT or worksheets. Using italic or underlined formatting in the scheme of work. Wrong font or size in the scheme of work (must be Calibri Bold, 11pt)." } },
          ]
        }
      },
      {
        id: "m1l3", title: "Onboarding Check — What Do You Know?", dur: "6 min", type: "quiz",
        questions: [
          { q: "What is the deadline for the Weekly Scheme of Work?", sub: "", opts: ["Friday end of day", "Monday morning", "Tuesday before 2:00 PM", "Thursday morning"], correct: 2, explain: "The Weekly Scheme of Work must be submitted every Tuesday before 2:00 PM. This gives the HOD time to review planning before the week begins." },
          { q: "What font and size is required for the Weekly Scheme of Work?", sub: "", opts: ["Arial, size 12", "Times New Roman, size 11", "Calibri, size 12", "Calibri Bold, size 11"], correct: 3, explain: "Calibri Bold, size 11 — with no italic and no underline. This is a fixed formatting requirement, not a preference. Using the wrong format is one of the most common mistakes in the first term." },
          { q: "You have completed your lesson plans for next week. What else must you upload on Thursday?", sub: "", opts: ["Nothing — the lesson plan is sufficient", "The lesson plan and the PowerPoint only", "The lesson plan, PowerPoint, worksheets, and all other student-facing resources", "A summary email to the HOD"], correct: 2, explain: "A lesson plan alone does not meet the Thursday submission requirement. You must upload the lesson plan plus the PowerPoint, all student worksheets, and any other resources students will use." },
          { q: "Where do you upload your Thursday lesson plans and resources?", sub: "", opts: ["Your personal OneDrive folder", "The Weekly Scheme folder", "The Humanities shared folder on OneDrive", "By email to the HOD"], correct: 2, explain: "Thursday submissions go to the Humanities shared folder on OneDrive. The Weekly Scheme folder is only for the Tuesday scheme of work." },
        ]
      },
    ]
  },
  {
    id: "m2", seq: 2, title: "The C3 Framework", icon: "🔍", color: "#1044A3", light: "#EAF2FF",
    description: "Master the four Dimensions of the Inquiry Arc — from question to argument.",
    lessons: [
      {
        id: "m2l1", title: "The Inquiry Arc — Four Dimensions", dur: "12 min", type: "read",
        content: {
          intro: "The C3 Framework organises all social studies learning around an Inquiry Arc — four interlocking Dimensions that take students from generating questions to communicating conclusions.",
          sections: [
            { icon: "🏛️", heading: "What C3 Is (and Isn't)", body: "C3 stands for College, Career, and Civic Life. It does not prescribe what content to teach — it prescribes HOW students engage with content: through disciplinary thinking, evidence evaluation, and argument construction.", key: { label: "Critical Distinction", text: "'I taught the causes of WWI' describes content. 'Students constructed a claim about WWI's most significant cause using three primary sources' describes C3 instruction." } },
            { icon: "1️⃣", heading: "Dimension 1 — Developing Questions", body: "Students construct two types of questions: Compelling questions address enduring issues and have no single correct answer. Supporting questions build the specific knowledge needed to address the compelling question. D1 is the intellectual launchpad of every unit." },
            { icon: "2️⃣", heading: "Dimension 2 — Applying Disciplinary Concepts", body: "Students apply the analytical tools of their discipline. Economics: scarcity, incentives, supply/demand. History: causation, perspective, continuity/change. Civics: institutions, deliberation. Geography: spatial thinking, human-environment interaction. Content is built through disciplinary thinking, not passive reception." },
            { icon: "3️⃣", heading: "Dimension 3 — Evaluating Sources and Evidence", body: "The most commonly underdeveloped dimension. Students evaluate sources using five criteria: Origin, Authority, Purpose, Context, Corroborative Value. Critical: a source is a document. Evidence is a source used to support a specific claim.", key: { label: "The Most Common Mistake", text: "Students treat sources as decoration — they cite them without connecting them to a specific claim. D3 is about the quality of the evidence relationship, not the number of sources cited." } },
            { icon: "4️⃣", heading: "Dimension 4 — Communicating Conclusions", body: "Students construct evidence-based arguments, present conclusions, and take informed civic action. An argument has a claim + evidence + counterclaim + rebuttal. An opinion has only a claim. D4 products must be arguments, not opinions." },
          ]
        }
      },
      {
        id: "m2l2", title: "D3 Deep Dive — Source vs Evidence", dur: "10 min", type: "scenario",
        scenario: {
          context: "The most common classroom failure in C3 instruction is treating sources as evidence. Work through these scenarios to sharpen the distinction.",
          cases: [
            { setup: "A student writes: 'According to the World Bank report, GDP growth in developing nations increased by 4.2% in 2019. This supports my argument that globalisation benefits developing economies.'", question: "Assess this student's source use:", options: [{ label: "A", text: "Yes — the student cited a credible source with a specific statistic, making it genuine evidence" }, { label: "B", text: "No — the student stated a fact but did not explain why 4.2% GDP growth constitutes a 'benefit', nor for whom. The connection is incomplete" }, { label: "C", text: "Yes — any citation from a credible organisation constitutes evidence" }, { label: "D", text: "No — GDP statistics cannot be used as evidence in a Humanities argument" }], correct: 1, feedback: "Option B is correct. The student has a statistic but has not completed the evidence relationship. They need to explain what GDP growth means for ordinary people and why it constitutes a benefit for their specific argument." },
            { setup: "Mr. Kowalski asks his Geography class to 'find three sources' on the question 'Is migration a crisis or an opportunity?' Students submit three sources with brief summaries.", question: "What is the primary D3 problem with this task as designed?", options: [{ label: "A", text: "Three sources is not enough — students need at least five" }, { label: "B", text: "The task asked students to 'find sources', not use them as evidence. Summarising sources is not evaluating them or connecting them to a claim" }, { label: "C", text: "The sources are too varied — students should only use academic sources" }, { label: "D", text: "There is no problem — summarising three sources demonstrates D3 competency" }], correct: 1, feedback: "The task stops at source identification and summary. Real D3 instruction asks: 'Using these sources, what claim can you make? Which source provides the strongest evidence for your claim? Why? What limitations does each source have?'" },
          ]
        }
      },
      {
        id: "m2l3", title: "Drag to Order — The Inquiry Arc", dur: "6 min", type: "drag",
        drag: { instruction: "Drag the Inquiry Arc stages into the correct C3 order (1 to 4), then check your answer.", items: [{ id: "d1", text: "Developing Questions and Planning Inquiries", order: 0 }, { id: "d2", text: "Applying Disciplinary Concepts and Tools", order: 1 }, { id: "d3", text: "Evaluating Sources and Using Evidence", order: 2 }, { id: "d4", text: "Communicating Conclusions and Taking Informed Action", order: 3 }], correctFeedback: "The Inquiry Arc moves from questioning → building knowledge → evaluating evidence → communicating conclusions. In the CAS model, each dimension occupies one 45-minute lesson." }
      },
      {
        id: "m2l4", title: "Training Video — Building Inquiry", dur: "Watch", type: "media",
        media: { type: "video", label: "Building Inquiry in the Humanities Classroom", description: "Watch this training video on how to build inquiry-based lessons using the C3 Framework. Focus on how the teacher moves students through the four dimensions across the lesson sequence.", note: "What are the four dimensions of the C3 Framework's Inquiry Arc?" }
      },
      {
        id: "m2l5", title: "Podcast — Beyond Memorisation with the C3", dur: "Listen", type: "media",
        media: { type: "audio", label: "Beyond Memorisation with the C3 Framework", description: "Listen to this podcast episode on how the C3 Framework moves students beyond content memorisation to disciplinary thinking and argument. Pay attention to the discussion of what 'evidence' really means in a social studies context.", note: "What is D2 in the Inquiry Arc?" }
      },
      {
        id: "m2l6", title: "C3 Framework Mastery Quiz", dur: "8 min", type: "quiz",
        questions: [
          { q: "What is the key difference between a compelling question and a supporting question?", sub: "", opts: ["Compelling questions are longer and more detailed", "Compelling questions require argument and have no single correct answer; supporting questions are more specific and build toward answering the compelling question", "Supporting questions are student-generated; compelling questions come from the teacher", "Compelling questions appear only in D1"], correct: 1, explain: "A compelling question has no single correct answer and requires students to construct an argument using evidence. A supporting question is more answerable and builds the specific knowledge needed." },
          { q: "A student cites a source but doesn't connect it to their claim. According to C3 D3, what has the student done?", sub: "", opts: ["Used a source as evidence", "Found a source but not yet used it as evidence", "Evaluated the source's credibility", "Completed the D3 requirement"], correct: 1, explain: "Finding and citing a source is not the same as using it as evidence. Evidence requires a deliberate connection between the source and a specific claim." },
          { q: "In the CAS model, how many lessons does a C3 unit span?", sub: "", opts: ["1 lesson", "2 lessons", "4 lessons — each dimension receives one full 45-minute lesson", "5 lessons"], correct: 2, explain: "The CAS model gives each dimension a full 45-minute lesson. This ensures depth — students are not rushed through questioning, concept-building, source evaluation, and argumentation in a single period." },
          { q: "Which of the following is a D4 product?", sub: "", opts: ["A source evaluation table", "A summary of what the student learned", "A written argument with a claim, evidence, counterclaim, and rebuttal", "A list of the student's opinions"], correct: 2, explain: "D4 produces arguments, not opinions or summaries. An argument requires: a clear claim, specific evidence, acknowledgment of a genuine counterclaim, and a rebuttal." },
        ]
      },
    ]
  },
  {
    id: "m3", seq: 3, title: "5E Lesson Structure", icon: "⚙️", color: "#E8650A", light: "#FEF0E6",
    description: "Design lessons that move through a complete 5E learning cycle in 45 minutes.",
    lessons: [
      {
        id: "m3l1", title: "5E Deep Dive — Each Stage Unpacked", dur: "12 min", type: "read",
        content: {
          intro: "The 5E model provides the pedagogical delivery structure for every CAS Humanities lesson. Every lesson must move through all five stages.",
          sections: [
            { icon: "🔥", heading: "ENGAGE (0–7 min) — Ignite Curiosity", body: "A hook that activates prior knowledge and creates cognitive readiness. Strong hooks: a single powerful image, a contradictory statistic, a short provocative quotation, a counter-intuitive claim. The teacher ends Engage with the compelling question visible and framed.", key: { label: "What Engage Is NOT", text: "Engage is not the teacher explaining what students will learn today. It is not a quiz on last lesson. It is specifically designed to create curiosity about today's intellectual focus." } },
            { icon: "🔬", heading: "EXPLORE (7–19 min) — Students Construct First", body: "Students work with content before receiving formal explanations. This is the key inversion of traditional instruction. Students encounter a concept, source, or scenario and begin to make sense of it. The teacher facilitates — circulates, asks probing questions — but does not explain.", key: { label: "The Golden Rule of Explore", text: "If the teacher is talking more than students during Explore, something has gone wrong. Student talk should dominate this stage." } },
            { icon: "💡", heading: "EXPLAIN (19–29 min) — Formalise and Clarify", body: "Now the teacher explains, formalises, and addresses misconceptions surfaced during Explore. This is NOT a lecture starting from scratch — it builds on what students discovered. Duration: 8-10 minutes maximum." },
            { icon: "🌍", heading: "ELABORATE (29–39 min) — Apply to New Context", body: "Students apply the concept to a new or extended scenario. This deepens understanding beyond the initial example. In C3 lessons, Elaborate always connects back to the compelling question.", key: { label: "Subject Examples", text: "Economics: Apply opportunity cost to a government budget. History: Apply perspective to a new primary source. Geography: Apply human-environment interaction to a different region." } },
            { icon: "📋", heading: "EVALUATE (39–45 min) — Check for Understanding", body: "Every lesson ends with a formative check. Not a box to tick — genuine information gathering that shapes tomorrow's planning.", key: { label: "Strong Exit Ticket Formula", text: "'Use [concept from today] to [do something specific] in response to [compelling question].' Dramatically more informative than 'write one thing you learned'." } },
          ]
        }
      },
      {
        id: "m3l2", title: "Subject Scenario — 5E in Economics", dur: "10 min", type: "scenario",
        scenario: {
          context: "You are planning a Grade 10 Economics lesson on Scarcity (D2). Compelling question: 'Is scarcity inevitable, or is it a problem we can solve?' Work through the 5E design decisions.",
          cases: [
            { setup: "You need to design the ENGAGE stage. You have 7 minutes.", question: "Which Engage activity best meets the 5E standard?", options: [{ label: "A", text: "Teacher writes the definition of scarcity on the board and asks students to copy it" }, { label: "B", text: "Teacher displays three images: a food bank queue, an empty supermarket shelf, a water scarcity graph. Ask: 'What do these three things have in common?' Students write one word. Then reveal the compelling question." }, { label: "C", text: "Students complete a 10-question multiple choice quiz on economic resources" }, { label: "D", text: "Teacher plays a 5-minute YouTube video explaining scarcity" }], correct: 1, feedback: "Option B is the strongest Engage. It provokes curiosity through visual juxtaposition, requires students to think BEFORE receiving the concept name, and connects immediately to the compelling question. Options A and D both put teacher explanation first." },
            { setup: "For EXPLORE, students work through a Desert Island scenario: 20 people, limited resources, four needs to meet. Students allocate resources and justify every decision.", question: "What is the teacher's correct role during the Explore stage?", options: [{ label: "A", text: "Stand at the front and give hints when groups are stuck" }, { label: "B", text: "Circulate, listen to group conversations, ask probing questions, note misconceptions — but do NOT explain scarcity yet" }, { label: "C", text: "Sit at the desk and allow groups to work completely independently" }, { label: "D", text: "After 5 minutes, pause and explain opportunity cost so students can complete the task correctly" }], correct: 1, feedback: "Option B is correct. During Explore, the teacher is a facilitator, not an instructor. Options A and D both jump to explanation too early, robbing students of the discovery experience." },
          ]
        }
      },
      {
        id: "m3l3", title: "5E Mastery Quiz", dur: "6 min", type: "quiz",
        questions: [
          { q: "Which stage of the 5E model should have the MOST student talk and the LEAST teacher talk?", sub: "", opts: ["Engage", "Explore", "Explain", "Elaborate"], correct: 1, explain: "Explore is the student-led discovery stage. If the teacher is talking more than students during Explore, the stage has been converted back into a mini-lecture." },
          { q: "A teacher's Explain stage runs for 22 minutes. What is the most likely consequence?", sub: "", opts: ["More learning occurs because students receive more instruction", "The Elaborate and Evaluate stages are compressed or eliminated — students never apply or check their understanding", "Students appreciate the thoroughness", "The lesson structure becomes stronger"], correct: 1, explain: "A 22-minute Explain consumes Elaborate and Evaluate time. Students receive explanation but never apply the concept or have their understanding checked." },
          { q: "What makes an exit ticket genuinely formative?", sub: "", opts: ["It must be written, not oral", "It must produce specific, actionable information about what students understood — enabling the teacher to identify gaps and plan accordingly", "Any question at the end of the lesson counts", "It must take at least 5 minutes"], correct: 1, explain: "'Write something you learned' is not formative. 'Use opportunity cost to explain one decision from the Desert Island scenario' gives specific diagnostic data about whether students can apply the concept." },
        ]
      },
    ]
  },
  {
    id: "m4", seq: 4, title: "Subject-Specific Application", icon: "📚", color: "#1A5CC8", light: "#EAF2FF",
    description: "Apply C3 and 5E to your specific subject — content adapts to the courses assigned to you in Admin.",
    lessons: [
      { id: "m4l1", title: "Your Subject's Lens — C3 by Discipline", dur: "14 min", type: "read", subjectSpecific: true, contentKey: "lens" },
      { id: "m4l2", title: "Planning Your First C3 Unit", dur: "12 min", type: "scenario", subjectSpecific: true, contentKey: "scenario" },
      {
        id: "m4l3", title: "Lesson Planning and Template Quiz", dur: "8 min", type: "quiz",
        questions: [
          { q: "The 'Chapter/Unit/Lesson' field in the CAS template should contain which information?", sub: "", opts: ["Just the chapter number from the textbook", "The unit title, lesson number (e.g. Day 2 of 4), and C3 Dimension being addressed", "The teacher name and the date", "The learning objective restated as a topic"], correct: 1, explain: "The Chapter/Unit/Lesson field communicates the unit context to any reader. It should immediately show where this lesson sits in the larger inquiry arc." },
          { q: "A Learning Intention that says 'Students will understand the concept' — is this valid?", sub: "", opts: ["Yes — it clearly states the topic", "No — 'understand' is not observable or measurable. A valid LI states what students will be ABLE TO DO", "Yes — understanding is the goal of teaching", "No — it needs to be more detailed"], correct: 1, explain: "A Learning Intention must describe observable student behaviour. 'Explain', 'construct', 'evaluate', 'argue', 'analyse' — these are observable actions." },
          { q: "In the Lesson Cycle section of the CAS template, the bullet points should describe…", sub: "", opts: ["What the teacher will say", "What STUDENTS will do at each stage — specific, observable actions", "The timing of each activity", "The resources used"], correct: 1, explain: "The Lesson Cycle section is student-focused. Every bullet should begin with 'Students will...'" },
          { q: "Which D3 exit ticket option is strongest?", sub: "", opts: ["'Write the names of the three sources you used today'", "'Give the source a credibility rating out of 10'", "'Write one claim, cite one source as evidence, and explain why that source supports your specific claim'", "'Write a summary of what each source said'"], correct: 2, explain: "The strongest exit ticket requires the full evidence relationship: claim + source + explicit connection." },
        ]
      },
    ]
  },
  {
    id: "m5", seq: 5, title: "Department Non-Negotiables", icon: "📋", color: "#1044A3", light: "var(--blue-pale)",
    description: "The six baseline standards every Humanities lesson must meet — grounded in C3 and the 4-day inquiry model.",
    lessons: [
      {
        id: "m5l1", title: "The 6 Non-Negotiables Explained", dur: "10 min", type: "read",
        content: {
          intro: "The CAS Humanities Non-Negotiables are not aspirational targets — they are baseline expectations for every lesson, every day, across every subject. They are grounded in the C3 Framework Inquiry Arc and our 4-day unit model: one dimension per lesson, D1 → D2 → D3 → D4.",
          sections: [
            { icon: "❓", heading: "NN1 — Compelling Question Anchors the Unit", body: "Every unit is built around one compelling question that runs across all four lessons. It must be displayed in every lesson, referenced at the start, and returned to at the end. The D1 lesson generates the question. D2–D4 answer it progressively.", key: { label: "Why It Matters", text: "Without a driving question, students complete four disconnected tasks. With one, they complete a 4-day inquiry that builds to a real argument. The compelling question is the spine of the unit." } },
            { icon: "📐", heading: "NN2 — One C3 Dimension Per Lesson (4-Day Model)", body: "Every unit spans exactly four lessons. Day 1 = D1 Developing Questions. Day 2 = D2 Applying Disciplinary Concepts. Day 3 = D3 Evaluating Sources and Evidence. Day 4 = D4 Communicating Conclusions. No dimension is skipped or compressed into another lesson.", key: { label: "Critical Principle", text: "Each dimension deserves a full 45-minute lesson. Rushing D3 into the same period as D2 is the most common planning failure. Give sources the lesson they deserve." } },
            { icon: "⚙️", heading: "NN3 — 5E Structure Within Every Lesson", body: "Within each of the four dimension-lessons, the 5E model must be followed: Engage → Explore → Explain → Elaborate → Evaluate. The 5E is the lesson-level structure. The C3 Inquiry Arc is the unit-level structure. Both must be present.", key: { label: "Key Principle", text: "The 5E ensures every 45-minute lesson has a complete learning cycle — not just content delivery. Engage must come before Explain. Students explore before the teacher explains." } },
            { icon: "💬", heading: "NN4 — Evidence-Based Student Talk Every Lesson", body: "Students must speak in every lesson. At least one structured discussion must occur where students support a claim with evidence. Opinion-only discussions do not meet this standard. The talk must build toward the compelling question argument.", key: { label: "Acceptable Formats", text: "Socratic seminar, structured academic controversy, think-pair-share with evidence requirement, expert jigsaw, D4 peer argumentation." } },
            { icon: "🎯", heading: "NN5 — Differentiation is Planned for All 5 Groups", body: "Every lesson plan must include explicit differentiation for SEN, LA, MA, HA, and G&T students across all four dimension-lessons. It must be a genuine modification — not identical entries across all five columns. Differentiation applies to task, resource, and outcome.", key: { label: "Critical Distinction", text: "In the 4-day model, differentiation must be planned per dimension. A G&T extension for D2 (concepts) looks different from a G&T extension for D3 (source evaluation). Plan specifically." } },
            { icon: "📊", heading: "NN6 — Formative Assessment Closes Every Lesson", body: "Every lesson must close with a formative check aligned to the day's C3 dimension. D1 exit ticket: a student-generated supporting question. D2 exit ticket: a concept applied to a new context. D3 exit ticket: a source evaluated against a specific claim. D4 exit ticket: a draft argument sentence with evidence.", key: { label: "The Test", text: "The exit ticket must be dimension-specific. 'Write one thing you learned' fails NN6 in all four lessons. The question must be: 'What does your formative data tell you about students' readiness for the next dimension?'" } },
          ]
        }
      },
      {
        id: "m5l2", title: "Scenario Practice — Spot the Gap", dur: "10 min", type: "scenario",
        scenario: {
          context: "You are the HOD on a walkthrough. For each lesson description, identify which Non-Negotiable is missing or inadequate.",
          cases: [
            { setup: "Ms. Karimi's Grade 10 Economics unit on scarcity. She runs Day 1 (D1) and Day 2 (D2) in the same lesson — students write their question and then immediately begin applying concepts. Day 3 and Day 4 are combined in the following lesson.", question: "Which Non-Negotiable is most clearly violated?", options: [{ label: "A", text: "NN1 — There is no compelling question anchoring the unit" }, { label: "B", text: "NN2 — The 4-day model is violated; dimensions are compressed and not given a full lesson each" }, { label: "C", text: "NN4 — No evidence-based talk is described" }, { label: "D", text: "NN3 — The 5E structure is missing" }], correct: 1, feedback: "Correct. NN2 is violated. Each C3 dimension must receive a full 45-minute lesson. Compressing D1+D2 into one lesson means students never deeply develop their questions before moving to concept application — the inquiry arc collapses." },
            { setup: "Mr. Al-Farsi's Grade 11 History class. The compelling question 'Was WWI inevitable?' is on the board for all four lessons. On Day 3 (D3), students are given three sources. They summarise each source in two sentences. Exit ticket: 'Write the names of the three sources you used today.'", question: "Which Non-Negotiable is weakest here?", options: [{ label: "A", text: "NN6 — The exit ticket asks students to name sources, not evaluate them or use them as evidence for the compelling question" }, { label: "B", text: "NN1 — The compelling question is not visible" }, { label: "C", text: "NN5 — No differentiation is described" }, { label: "D", text: "NN2 — D3 cannot include sources from only three documents" }], correct: 0, feedback: "Correct. NN6 is violated. A D3 exit ticket must ask students to use a source as evidence: 'Choose one source. Write one claim about WWI's causes it supports. Explain in one sentence why this source is reliable enough to use as evidence.' Naming sources is not evaluating them." },
          ]
        }
      },
      {
        id: "m5l3", title: "Non-Negotiables Mastery Quiz", dur: "8 min", type: "quiz",
        questions: [
          { q: "How many lessons does one C3 unit span at CAS Humanities, and what determines the structure?", sub: "", opts: ["2 lessons — one for teaching, one for assessment", "4 lessons — one per C3 dimension, D1 through D4", "5 lessons — one per stage of the 5E model", "6 lessons — one per Non-Negotiable"], correct: 1, explain: "The CAS model gives each C3 dimension a full 45-minute lesson: D1 (Developing Questions), D2 (Applying Concepts), D3 (Evaluating Sources), D4 (Communicating Conclusions). This 4-day structure is NN2." },
          { q: "A teacher's plan has identical entries in all five differentiation columns across all four lessons: 'Complete the source analysis task.' What does this violate?", sub: "", opts: ["NN3 — evidence-based talk is missing", "NN5 — no genuine differentiation has been planned; identical entries across all columns is not differentiation", "NN6 — there is no exit ticket", "NN1 — the compelling question is not visible"], correct: 1, explain: "NN5 requires genuine modification per group across all four dimension-lessons. Identical entries mean no differentiation. For D3, a G&T extension might ask students to evaluate source corroboration; for SEN, a structured evaluation frame is provided." },
          { q: "Which of the following is a valid D1 exit ticket?", sub: "", opts: ["'Write one thing you learned about the Cold War today'", "'Name the three sources you found'", "'Write one supporting question you would need to answer in order to respond to the compelling question'", "'Give today's lesson a rating out of 10'"], correct: 2, explain: "A D1 exit ticket must produce a student-generated supporting question. It tests whether students can break the compelling question into researchable parts — the core D1 skill." },
          { q: "The 5E Explore stage within a D2 lesson requires…", sub: "", opts: ["The teacher to explain the disciplinary concept first, then students apply it", "Students to encounter and grapple with the concept BEFORE the teacher's formal explanation", "At least 20 minutes of group work on a worksheet", "A written task that students submit for marking"], correct: 1, explain: "In every 5E lesson, Explore comes before Explain. Students must encounter and wrestle with the disciplinary concept before receiving the formal definition. This is the defining inversion of inquiry-based instruction." },
        ]
      },
    ]
  },
  /* ── MODULE 6 ── */
  {
    id: "m6", seq: 6, icon: "🇦🇪", title: "UAE National Framework", color: "#1A9E75",
    desc: "Understand UAE MoE standards, national values, cultural integration requirements, and Vision 2031 alignment for humanities teaching.",
    lessons: [
      {
        id: "m6l1", title: "UAE MoE Standards & Vision 2031", dur: "8 min", type: "read",
        content: {
          intro: "Teaching in the UAE means operating within a national framework that combines global best practices with the UAE's vision for education. Understanding this framework makes your C3-aligned teaching doubly powerful — and ensures you are fully compliant when inspectors observe.",
          sections: [
            { icon: "🎯", heading: "UAE Vision 2031 & Education", body: "UAE Vision 2031 envisions a knowledge-based economy led by empowered citizens. Every school operating in the UAE must align to MoE's National Agenda Parameters — which include high-quality outcomes in critical thinking, citizenship, cultural appreciation, and Arabic/Islamic values.", key: { label: "Your Responsibility", text: "Every unit you plan must serve both C3 inquiry standards and UAE Vision 2031. These are not in conflict — evidence-based reasoning, civic participation, and cultural understanding reinforce each other." } },
            { icon: "📋", heading: "MoE Social Studies Standards", body: "The UAE Ministry of Education sets standards covering: National Identity, Cultural Heritage, Civic Values, Global Citizenship, Historical Awareness, Geographic Understanding, and Economic Literacy. Humanities teachers are expected to embed UAE contexts and examples into their subject area throughout the year.", key: { label: "Practical Application", text: "Economics: include UAE economic data (oil dependence, diversification, Vision 2031). History: connect global events to UAE and Arab World history. Civics: reference the UAE Constitution and Federal System. Geography: use UAE case studies on urbanisation, water, and tourism." } },
            { icon: "🌍", heading: "Moral Education & UAE Values Integration", body: "The UAE Moral Education curriculum runs across all subjects. Humanities teachers must embed: Personal Growth & Identity, Civic Studies, Cultural Studies, and Character & Morality. These are not separate lessons — they should be integrated into your C3 units.", key: { label: "Integration Example", text: "A Civics unit on governance can integrate UAE Moral Education by including the UAE's approach to consensus-based leadership (Shura) alongside democratic systems — then students evaluate both as evidence for the compelling question." } },
            { icon: "🤝", heading: "Cultural Awareness in a Diverse Classroom", body: "CAS serves students from many national and cultural backgrounds. Compelling questions must be framed to be culturally inclusive — inviting all students' perspectives as valid evidence. Avoid framing that privileges any single cultural worldview as 'normal'.", key: { label: "Key Practice", text: "For each compelling question, ask: 'Can a student from any cultural background engage with this using their own experience and knowledge as evidence?' If not, reframe it." } },
          ]
        }
      },
      {
        id: "m6l2", title: "UAE Standards Alignment Quiz", dur: "6 min", type: "quiz",
        questions: [
          { q: "UAE humanities teachers must align their units to which overarching national framework?", sub: "", opts: ["The KHDA Teaching Standards only", "UAE Vision 2031 and MoE National Agenda Parameters", "Only the C3 Framework", "The NEASC accreditation standards"], correct: 1, explain: "UAE Vision 2031 and the MoE National Agenda Parameters provide the overarching national direction. Your C3 units must serve both inquiry standards and national educational goals simultaneously." },
          { q: "The UAE Moral Education Curriculum (2017) requires humanities teachers to:", sub: "", opts: ["Teach a separate Moral Education period each week", "Integrate themes (Personal Growth, Civic Studies, Cultural Studies, Morality) into subject lessons", "Add at least one Islamic value per unit", "Teach in Arabic once per week"], correct: 1, explain: "The UAE Moral Education curriculum is an integration model at secondary level, not a stand-alone subject. Humanities teachers embed its four pillars into their existing units." },
          { q: "When planning a Business unit on globalisation, which best demonstrates UAE context integration?", sub: "", opts: ["Replacing all global examples with UAE examples only", "Including UAE economic diversification data alongside global statistics, connecting to Vision 2031", "Mentioning Dubai briefly in the introduction", "Adding an Arabic vocabulary list at the end"], correct: 1, explain: "The MoE standard requires meaningful integration of UAE contexts — not superficial mention and not replacement of all global content. UAE data alongside global comparisons achieves genuine integration." },
          { q: "A student feels their cultural perspective is not represented in the compelling question. The teacher should:", sub: "", opts: ["Explain that the question is universal and applies to everyone", "Reframe the question so diverse cultural perspectives can engage with it as valid evidence", "Create a separate question for that student", "Skip that unit's compelling question"], correct: 1, explain: "Good compelling questions in a diverse UAE classroom must be accessible from multiple cultural entry points. If a student's cultural knowledge cannot serve as evidence, the question needs reframing." },
        ]
      },
      {
        id: "m6l3", title: "UAE Values in Practice — Scenarios", dur: "10 min", type: "scenario",
        scenario: {
          context: "Apply UAE Framework requirements to real planning decisions in your classroom.",
          cases: [
            { setup: "You are planning a Grade 10 History unit on 'The Rise of Modern Nation-States.' Your default plan uses only European examples. A MoE inspector will visit in Week 3.", question: "How should you modify the unit to meet UAE Framework requirements?", options: [{ label: "A", text: "Add a brief mention of the UAE at the end of the unit" }, { label: "B", text: "Replace all European content with UAE and Arab World content" }, { label: "C", text: "Restructure at least one lesson to examine Arab/UAE state-building alongside European examples using comparative evidence" }, { label: "D", text: "Add a Moral Education period at the start of each lesson" }], correct: 2, feedback: "The MoE standard requires meaningful UAE context integration, not just surface mention or complete replacement. Comparative analysis (Arab/UAE alongside European nation-states) provides richer evidence and meets the framework standard." },
            { setup: "During a Grade 9 Civics unit on government systems, a student challenges whether democracy is truly the best system, citing Islamic governance principles. Several students are uncomfortable.", question: "How do you respond in a way that respects UAE values and best demonstrates C3 practice?", options: [{ label: "A", text: "Tell the student this is not relevant to the unit" }, { label: "B", text: "Invite the student to bring evidence for their position and include it as one of the D3 sources — then teach source evaluation using all perspectives" }, { label: "C", text: "Agree with the student to avoid conflict" }, { label: "D", text: "Move on from the question and continue with the planned lesson" }], correct: 1, feedback: "C3 D3 teaches source evaluation — multiple perspectives, including culturally rooted ones, are evidence to evaluate. This is also UAE Moral Education integration: respectful inquiry across cultural views. Your role is to facilitate evidence-based argumentation, not to shut down or endorse any position." },
          ]
        }
      },
    ]
  },
  /* ── MODULE 7 ── */
  {
    id: "m7", seq: 7, icon: "🔍", title: "Inspection Readiness", color: "#E8650A",
    desc: "Prepare for KHDA/ADEK school inspections — understand what inspectors look for, how to document your practice, and how to teach confidently on observation days.",
    lessons: [
      {
        id: "m7l1", title: "Understanding the Inspection Framework", dur: "9 min", type: "read",
        content: {
          intro: "School inspections by KHDA (Dubai) and ADEK (Abu Dhabi) measure school quality against a national standard. Knowing what inspectors observe — and what they look for as evidence of outstanding teaching — allows you to teach confidently when a visitor walks in.",
          sections: [
            { icon: "📋", heading: "What Inspectors Observe in a Lesson", body: "During a 20–30 minute lesson visit, inspectors assess: Teaching and Learning quality, Student Engagement and Participation, Curriculum Breadth and Relevance, Assessment for Learning, and Inclusion and Differentiation. They note what teachers do and — critically — what students do.", key: { label: "Key Principle", text: "Inspectors primarily judge student learning, not teacher performance. If students are passive, it is a weak lesson regardless of how polished your explanation was." } },
            { icon: "⭐", heading: "Outstanding vs Good Teaching Criteria", body: "Outstanding: Students drive inquiry; teacher facilitates. Evidence-based discussion is happening. Differentiation is visible in student outcomes, not just plans. Assessment shapes the lesson in real-time. Good: Teacher explains clearly; students are engaged. Tasks are appropriately challenging. Some differentiation is evident. Assessment is present but mostly summative.", key: { label: "The Gap", text: "The difference between Good and Outstanding is whether students are doing the thinking or the teacher is. C3 inquiry puts students in the driver's seat — which is exactly what Outstanding criteria reward." } },
            { icon: "📁", heading: "What Inspectors Ask to See", body: "Inspectors may request: Your lesson plan (C3 alignment, 5E structure, differentiation), Student work samples showing progression, Your mark book and assessment records, Your scheme of work for the unit. Have these ready in a clear physical or digital folder so you spend inspection time teaching, not searching.", key: { label: "Document Ready List", text: "Unit plan with C3 alignment → Today's lesson plan with 5E structure → Student work from this term → Mark book page for this class → Scope & sequence for the year" } },
            { icon: "🗣️", heading: "If an Inspector Walks In Mid-Lesson", body: "Continue teaching — do not shift to presentation mode. Inspectors want to see your normal practice. If students are in the Explore stage, let them explore. If they are in structured discussion, let it run. Coach students at the start of every term: 'If a visitor asks what we are doing, tell them the compelling question and which C3 dimension we are working on today.'", key: { label: "Student-Ready Phrase", text: "Our compelling question is [X]. Today we are working on Dimension [1/2/3/4] — [Developing Questions / Applying Concepts / Evaluating Sources / Communicating Conclusions]." } },
          ]
        }
      },
      {
        id: "m7l2", title: "Inspection Preparation — Sort Activity", dur: "8 min", type: "drag",
        drag: {
          instruction: "Drag the inspection preparation steps into the correct order, from most urgent to do first to what you do on the observation day itself.",
          items: [
            { id: "ip1", text: "Update your mark book — ensure all student data and grades are current and legible", order: 0 },
            { id: "ip2", text: "Prepare a unit folder: unit plan, lesson plans with 5E and C3 labels, differentiation grids, assessment records", order: 1 },
            { id: "ip3", text: "Collect and date-stamp 3–5 samples of student work showing progression over the term", order: 2 },
            { id: "ip4", text: "Coach students to state the compelling question and current C3 dimension if a visitor asks", order: 3 },
            { id: "ip5", text: "On the inspection day, teach your planned lesson as normal — not a special showcase", order: 4 },
          ],
          correctFeedback: "This is the correct inspection preparation sequence. Note the final step: teach normally. The inspection tests your sustainable practice, not a one-day performance."
        }
      },
      {
        id: "m7l3", title: "Inspection Scenario Practice", dur: "12 min", type: "scenario",
        scenario: {
          context: "Apply inspection readiness principles to real situations you may face during a school visit.",
          cases: [
            { setup: "An inspector walks in during your Grade 10 Civics lesson. Students are 15 minutes in, completing a worksheet — copying definitions from the textbook into a table. The inspector sits next to a student and asks what they are doing.", question: "What is the main risk and the best immediate response?", options: [{ label: "A", text: "Risk: Worksheet looks passive. Immediately collect worksheets and start a discussion." }, { label: "B", text: "Risk: Students cannot articulate why they are doing the task. Smoothly launch a pair discussion: 'Use the definition you just found to answer: does this concept make [civic issue] better or worse?'" }, { label: "C", text: "Risk: Inspector may not like Civics. Explain the foundational task and say higher-order work is tomorrow." }, { label: "D", text: "No risk — this is standard and acceptable classroom practice." }], correct: 1, feedback: "The core risk is passive definition-copying does not demonstrate inquiry. The right response is not to panic-switch tasks — that looks worse. Instead, use a quick task that activates the definition: a pair discussion linking the concept to the compelling question. This transforms a passive task into application in 30 seconds." },
            { setup: "An inspector asks to see your lesson plan. You pull it up on your laptop. It shows: objective, activities, and homework — but no compelling question, no C3 dimension label, and no differentiation columns.", question: "What does this indicate, and what is the long-term lesson?", options: [{ label: "A", text: "The lesson plan template is wrong. Explain verbally that the lesson covers these things." }, { label: "B", text: "The documentation does not reflect department C3 and differentiation standards. Acknowledge the gap professionally. Long-term: all plans must include the compelling question, C3 dimension, 5E phases, and differentiation." }, { label: "C", text: "The inspector is being too demanding about documentation." }, { label: "D", text: "Lesson plan format is optional — what matters is what happens in the lesson." }], correct: 1, feedback: "Documentation is part of the inspection standard. A plan without C3 alignment, a compelling question, and differentiation raises questions about consistency and sustainability of practice. The professional response is calm acknowledgement and commitment to the standard." },
          ]
        }
      },
    ]
  },
  /* ── MODULE 8 ── */
  {
    id: "m8", seq: 8, icon: "🏫", title: "NEASC Accreditation", color: "#534AB7",
    desc: "Understand the 6 NEASC standards, how they apply to your classroom, and how to gather and present evidence for the school's accreditation self-study.",
    lessons: [
      {
        id: "m8l1", title: "The 6 NEASC Standards Explained", dur: "10 min", type: "read",
        content: {
          intro: "NEASC (New England Association of Schools and Colleges) accreditation is a rigorous self-study process evaluating whether a school meets international standards of educational quality. As a classroom teacher, you are a primary evidence contributor for 4 of the 6 standards.",
          sections: [
            { icon: "1️⃣", heading: "Standard 1 — Mission, Vision & Core Values", body: "NEASC evaluates whether the school's mission drives daily practice. For you: Can you articulate how your teaching connects to the school's mission? Does your classroom practice reflect the values the school claims to hold?", key: { label: "Your Evidence", text: "Be able to state: 'My unit on [topic] advances the school's mission of [X] by building students' capacity to [Y] through C3 inquiry.'" } },
            { icon: "2️⃣", heading: "Standard 2 — Curriculum", body: "The most directly relevant standard for humanities teachers. NEASC evaluates: Curriculum design and alignment, vertical and horizontal articulation across grade levels, C3 (or equivalent inquiry framework) integration, Scope & Sequence documentation, and evidence of cultural responsiveness.", key: { label: "Your Evidence", text: "Unit plans with C3 alignment, your term scope & sequence, student work samples showing progression, and evidence of UAE context integration all count as curriculum evidence." } },
            { icon: "3️⃣", heading: "Standard 3 — Instruction", body: "NEASC evaluates instructional quality: Does teaching promote inquiry? Are students actively constructing knowledge? Is there evidence of differentiated instruction meeting all learners' needs? Is assessment used formatively to adapt instruction in real-time?", key: { label: "Your Evidence", text: "Lesson plans showing 5E structure and differentiation, personal reflection notes, and student data showing you adjusted instruction based on formative results." } },
            { icon: "4️⃣", heading: "Standard 4 — Assessment", body: "NEASC evaluates both formative and summative assessment quality: Are assessments aligned to standards? Do students understand criteria in advance? Is feedback timely and specific? Is data used to improve learning?", key: { label: "Your Evidence", text: "Marked student work with written feedback, rubrics shared with students in advance, and records of how assessment data changed your planning." } },
            { icon: "5️⃣", heading: "Standards 5 & 6 — Culture & Resources", body: "Standard 5 (School Culture & Leadership) and Standard 6 (School Resources and Support) are primarily evaluated at leadership level. Your contribution: Do you participate in professional learning? Do you collaborate with colleagues? Do you use available resources effectively?", key: { label: "Your Evidence", text: "Completing this training programme is direct evidence for Standard 5 (professional development). Keep a brief log of collaborative planning sessions with colleagues." } },
          ]
        }
      },
      {
        id: "m8l2", title: "NEASC Evidence Quiz", dur: "7 min", type: "quiz",
        questions: [
          { q: "A NEASC visitor asks for evidence that 'instruction promotes student inquiry.' Which is the strongest evidence?", sub: "", opts: ["Your textbook adoption decision", "A lesson plan showing 5E with students exploring a source set before the teacher explains the concept", "A photo of your classroom wall display", "Your attendance records for the term"], correct: 1, explain: "Standard 3 requires evidence of inquiry-based teaching. A lesson plan explicitly showing the 5E model — students explore before the teacher explains — is direct documentary evidence of student inquiry." },
          { q: "For NEASC Standard 2 (Curriculum), which document best evidences 'vertical articulation' in humanities?", sub: "", opts: ["Your individual lesson plans", "A scope & sequence showing how topics build across Grade 9, 10, and 11 with C3 alignment at each level", "Your student attendance record", "The textbook table of contents"], correct: 1, explain: "Vertical articulation means curriculum is deliberately sequenced across grade levels. A scope & sequence mapping topics and C3 dimensions across G9–G11 is direct evidence of planned vertical curriculum coherence." },
          { q: "A NEASC reviewer asks how you use assessment data to improve instruction. Which answer best demonstrates Standard 4 compliance?", sub: "", opts: ["'I give students a grade and they can see it on the portal'", "'After every D2 quiz, I look at which concepts most students missed and reteach that concept before they begin D3 source evaluation'", "'I have a mark book and keep all grades there'", "'I follow the department scheme of work'"], correct: 1, explain: "Standard 4 requires evidence that assessment data drives instruction adjustment. Describing specific use of quiz data to change the next lesson's starting point is formative assessment in its strongest form." },
          { q: "Completing this training programme provides direct evidence for which NEASC standard?", sub: "", opts: ["Standard 1 (Mission)", "Standard 5 (School Culture — Professional Development)", "Standard 3 (Instruction)", "Standard 6 (Resources)"], correct: 1, explain: "Standard 5 includes professional growth and participation in school-provided professional development as evidence of a healthy school culture. Completing structured training like this module series is exactly what NEASC reviewers look for." },
        ]
      },
      {
        id: "m8l3", title: "NEASC Self-Study Practice — Scenarios", dur: "12 min", type: "scenario",
        scenario: {
          context: "Practice gathering and presenting NEASC evidence from real teaching scenarios.",
          cases: [
            { setup: "The NEASC Self-Study Coordinator asks you to submit three pieces of evidence for Standard 3 (Instruction) by Friday. You have this week's materials available.", question: "Which combination gives the strongest evidence package?", options: [{ label: "A", text: "(1) Textbook page you used, (2) Photo of class seating, (3) Your employment contract" }, { label: "B", text: "(1) Lesson plan showing 5E structure and C3 dimension, (2) Annotated student work with your written feedback, (3) A paragraph explaining how you adjusted Day 3's lesson based on Day 2's exit ticket data" }, { label: "C", text: "(1) Lesson plan, (2) Attendance sheet, (3) PowerPoint slides" }, { label: "D", text: "(1) Textbook, (2) Scope & sequence, (3) Staff handbook page on instruction" }], correct: 1, feedback: "Option B provides the strongest Standard 3 evidence because it covers all three instructional quality indicators: inquiry design (5E plan), quality feedback (annotated student work), and responsive teaching (written explanation of how assessment data changed your planning)." },
            { setup: "During the NEASC site visit, a reviewer walks into your room and asks a Grade 10 student: 'What are you learning today, and why does it matter?' The student says: 'We're doing page 47.'", question: "What does this reveal, and what is the long-term practice change needed?", options: [{ label: "A", text: "The student is nervous — this is normal and the reviewer will understand." }, { label: "B", text: "Students do not understand the compelling question or C3 dimension. Long-term fix: students must be able to state the compelling question and current dimension from Day 1 of every unit — and see it on the board throughout." }, { label: "C", text: "The student is not academic enough to explain the lesson." }, { label: "D", text: "The reviewer is testing the student unfairly." }], correct: 1, feedback: "NEASC Standards 2 and 3 both assess whether students understand the purpose of their learning. A student who says 'page 47' shows they follow instructions without understanding purpose. The fix: the compelling question must be visible, stated, and returned to every lesson until students can articulate it automatically." },
          ]
        }
      },
    ]
  },
];



const TOTAL_LESSONS = MODULES.flatMap(m => m.lessons).length;

/* ─────────────────────────────────────────────────────────────────
   SUBJECT-SPECIFIC CONTENT — keyed by course ID (c1–c6)
───────────────────────────────────────────────────────────────── */
const SUBJECT_CONTENT = {
  c1: {
    lens: {
      intro: "You teach Economics. C3 D2 is built around the concepts economists use to analyse decisions, markets, and systems.", sections: [
        { icon: "📈", heading: "Economics — Decision Making Under Scarcity", body: "Core D2 concepts: Scarcity and choice, opportunity cost, incentives, supply and demand, market efficiency, trade. Economics asks 'What are the costs and benefits of this decision, and who bears them?'", key: { label: "Compelling Question Examples", text: "'Is a higher minimum wage a net benefit or harm?' | 'Should governments intervene in failing markets?' | 'Is economic growth always the right goal?'" } },
        { icon: "❓", heading: "What a strong D1 looks like in Economics", body: "'What causes inflation?' is a knowledge question. 'Who bears the greatest cost of inflation — workers, savers, or governments?' is a compelling question. The difference: does the student construct an argument or just recall information?", key: { label: "Strong D1 test", text: "Could two reasonable economists disagree about the answer using evidence? If yes, it is compelling." } },
        { icon: "🔍", heading: "D3 in Economics — What counts as evidence?", body: "Evidence includes: official statistics, policy documents, analyses from credible institutions (IMF, World Bank, central banks), and primary sources like congressional testimony. Data is not evidence until it is used to support a specific claim.", key: { label: "Common D3 failure", text: "Students listing economic data without connecting it to the compelling question." } },
      ]
    }, scenario: {
      context: "Apply C3 planning to an Economics unit from start to finish.", cases: [
        { setup: "You are planning a Grade 10 Economics unit on market failure. Your first task is to write the compelling question.", question: "Which question best meets the criteria?", options: [{ label: "A", text: "What is market failure and what causes it?" }, { label: "B", text: "Should governments always intervene when markets fail?" }, { label: "C", text: "List the four types of market failure" }, { label: "D", text: "When did market failure first become a recognised concept?" }], correct: 1, feedback: "Option B is the compelling question. It requires students to weigh evidence about the effectiveness and cost of government intervention — no single correct answer, genuine argumentation required." },
        { setup: "You are planning D3 for the same unit. Students will evaluate sources on government intervention in markets.", question: "Which source set provides the best D3 material?", options: [{ label: "A", text: "Three pages from the textbook chapter on market failure" }, { label: "B", text: "(1) IMF data on subsidy costs, (2) A CEO's op-ed arguing against regulation, (3) A consumer advocacy report on pollution, (4) OECD analysis of intervention outcomes" }, { label: "C", text: "Four news articles from the same newspaper" }, { label: "D", text: "Wikipedia entries on four different market failures" }], correct: 1, feedback: "Option B gives students sources with varied origin, authority, and perspective. A CEO's position versus consumer group versus two institutional data sources creates genuine analytical tension." },
      ]
    }
  },
  c2: {
    lens: {
      intro: "You teach History. C3 D2 is built around historical thinking concepts — the tools historians use to construct meaning from the past.", sections: [
        { icon: "⏳", heading: "History — Thinking Across Time", body: "Core D2 concepts: Causation, change and continuity, historical perspectives, historical significance, primary and secondary sources. History asks 'Why did this happen? How do we know? Whose perspective are we seeing?'", key: { label: "Compelling Question Examples", text: "'Was WWI inevitable?' | 'Was the New Deal a success?' | 'Did colonialism cause more harm than benefit?'" } },
        { icon: "❓", heading: "What a strong D1 looks like in History", body: "'What caused WWI?' is a knowledge question. 'Was WWI primarily caused by structural forces or individual decisions?' requires students to weigh evidence and construct an argument.", key: { label: "Strong D1 test", text: "Could two professional historians disagree using evidence? Avoid questions that just list or sequence events." } },
        { icon: "🔍", heading: "D3 in History — What counts as evidence?", body: "Sources must be evaluated for Origin, Purpose, and Corroborative Value. One well-evaluated source used as evidence is stronger than five sources simply listed.", key: { label: "Common D3 failure", text: "Students treating all sources as equally credible. The task is evaluation, not accumulation." } },
      ]
    }, scenario: {
      context: "Apply C3 planning to a History unit from start to finish.", cases: [
        { setup: "You are planning a Grade 10 World History unit on the Cold War. Write the compelling question.", question: "Which question best meets the criteria?", options: [{ label: "A", text: "What were the main events of the Cold War?" }, { label: "B", text: "Was the United States or the Soviet Union more responsible for escalating the Cold War?" }, { label: "C", text: "When did the Cold War begin and end?" }, { label: "D", text: "Name the key leaders of the Cold War period" }], correct: 1, feedback: "Option B demands historical judgement, has no single correct answer, and requires students to evaluate evidence about the actions of both superpowers." },
        { setup: "You are planning D3 for this unit. Students will evaluate sources on Cold War responsibility.", question: "Which source set provides the best D3 material?", options: [{ label: "A", text: "The textbook chapter divided into four sections" }, { label: "B", text: "(1) Truman Doctrine speech, (2) Soviet Cominform directive, (3) A Western historian's analysis, (4) A revisionist historian's critique" }, { label: "C", text: "Four Wikipedia articles on Cold War events" }, { label: "D", text: "Four news articles from the same country during the Cold War" }], correct: 1, feedback: "Option B provides ideologically varied perspectives with different origins and purposes. Students can evaluate bias, corroboration, and evidential weight — the core D3 skills." },
      ]
    }
  },
  c3: {
    lens: {
      intro: "You teach Geography. C3 D2 is built around geographic thinking concepts — the ways geographers interpret spatial patterns, human-environment relationships, and global connections.", sections: [
        { icon: "🌍", heading: "Geography — Space, Place and Human Interaction", body: "Core D2 concepts: Geographic representations and spatial thinking, human-environment interaction, population patterns and migration, urban systems, global interconnections. Geography asks 'Where? Why there? What are the consequences of this spatial pattern?'", key: { label: "Compelling Question Examples", text: "'Is migration a crisis or an opportunity?' | 'Is urban growth sustainable?' | 'Who is responsible for climate change?'" } },
        { icon: "❓", heading: "What a strong D1 looks like in Geography", body: "'Where do most people live?' is a knowledge question. 'Is rapid urbanisation in developing nations a path to prosperity or a route to inequality?' requires students to weigh spatial and human evidence.", key: { label: "Strong D1 test", text: "Does the question require geographic thinking — connecting place to people and consequences?" } },
        { icon: "🔍", heading: "D3 in Geography — What counts as evidence?", body: "Evidence includes: spatial data and maps, population statistics, environmental data, case studies, and human testimony. A map is a source — students must evaluate its projection, scale, and purpose before using it as evidence.", key: { label: "Common D3 failure", text: "Students using maps and statistics as decoration rather than connecting them to a specific claim." } },
      ]
    }, scenario: {
      context: "Apply C3 planning to a Geography unit from start to finish.", cases: [
        { setup: "You are planning a Grade 11 Geography unit on migration. Write the compelling question.", question: "Which question best meets the criteria?", options: [{ label: "A", text: "What are the push and pull factors of migration?" }, { label: "B", text: "Does international migration create more benefit for receiving countries than it costs them?" }, { label: "C", text: "List the top five countries by immigrant population" }, { label: "D", text: "Define economic migration and explain how it differs from refugee movement" }], correct: 1, feedback: "Option B requires students to weigh spatial data, economic evidence, and human stories. It connects to a genuine ongoing policy and geographic debate." },
        { setup: "You are planning D3 for this unit. Students will evaluate sources on the impact of migration.", question: "Which source set provides the best D3 material?", options: [{ label: "A", text: "The textbook section on migration divided into sub-topics" }, { label: "B", text: "(1) UNHCR global displacement data, (2) An economist's analysis of labour market effects, (3) A receiving-country politician's speech, (4) A first-person account from a migrant worker" }, { label: "C", text: "Four news articles about migration from the same newspaper" }, { label: "D", text: "Wikipedia entries on four types of migration" }], correct: 1, feedback: "Option B gives students sources with varied origin, purpose, and corroborative value. The contrast between the politician's rhetoric and the migrant's lived experience creates genuine evaluative tension." },
      ]
    }
  },
  c4: {
    lens: {
      intro: "You teach Civics. C3 D2 is built around civic concepts — the ideas and structures through which power is organised, rights are protected, and citizens participate.", sections: [
        { icon: "⚖️", heading: "Civics — Rights, Power and Participation", body: "Core D2 concepts: Civic and political institutions, constitutional principles, democratic participation, deliberation, rights and responsibilities, rule of law. Civics asks 'How should power be organised and limited? What are the rights and responsibilities of citizens?'", key: { label: "Compelling Question Examples", text: "'Does democracy work?' | 'When is civil disobedience justified?' | 'How much surveillance should governments be allowed to conduct?'" } },
        { icon: "❓", heading: "What a strong D1 looks like in Civics", body: "'What is the separation of powers?' is a knowledge question. 'Should the judiciary have the power to strike down laws passed by elected governments?' requires reasoning about democratic legitimacy, rights, and institutional design.", key: { label: "Strong D1 test", text: "Could two informed citizens in a democracy genuinely disagree? Does it require weighing rights, powers, and responsibilities?" } },
        { icon: "🔍", heading: "D3 in Civics — What counts as evidence?", body: "Evidence includes: constitutional documents, court rulings, legislative records, policy analyses, and testimony from affected citizens. A court ruling supports one side of a civic argument — it is evidence, not a verdict.", key: { label: "Common D3 failure", text: "Students citing laws or rulings as if they settle the argument rather than using them as one piece of evidence." } },
      ]
    }, scenario: {
      context: "Apply C3 planning to a Civics unit from start to finish.", cases: [
        { setup: "You are planning a Grade 9 Civics unit on freedom of speech. Write the compelling question.", question: "Which question best meets the criteria?", options: [{ label: "A", text: "What is freedom of speech and where does it come from?" }, { label: "B", text: "Should freedom of speech have limits, and if so, who should decide what they are?" }, { label: "C", text: "Name three countries with strong freedom of speech protections" }, { label: "D", text: "When was freedom of speech first recognised as a legal right?" }], correct: 1, feedback: "Option B sits at the heart of every real civil liberties debate — requiring students to reason about competing rights, democratic authority, and the purpose of free expression." },
        { setup: "You are planning D3 for this unit. Students will evaluate sources on the limits of free speech.", question: "Which source set provides the best D3 material?", options: [{ label: "A", text: "The textbook chapter on constitutional rights divided into sections" }, { label: "B", text: "(1) First Amendment text, (2) A Supreme Court ruling on hate speech, (3) A civil liberties organisation's brief, (4) A victim testimony from a hate speech case" }, { label: "C", text: "Four newspaper opinion pieces supporting free speech" }, { label: "D", text: "Wikipedia entries on four free speech court cases" }], correct: 1, feedback: "Option B gives students a constitutional text, a judicial interpretation, an advocacy position, and a human impact perspective. The contrast between legal framework and lived experience creates genuine evaluative tension." },
      ]
    }
  },
  c5: {
    lens: {
      intro: "You teach Sociology. C3 D2 is built around sociological concepts — the frameworks sociologists use to understand how society shapes individuals and how individuals shape society.", sections: [
        { icon: "🏘️", heading: "Sociology — Society, Identity and Behaviour", body: "Core D2 concepts: Socialisation, culture and cultural norms, social stratification, identity, institutions, collective behaviour, power structures, deviance. Sociology asks 'Why do people behave as they do in social contexts? How does society reproduce itself, and who benefits?'", key: { label: "Compelling Question Examples", text: "'Does social media harm mental health?' | 'Is social inequality inevitable in capitalist societies?' | 'How does identity shape life outcomes?'" } },
        { icon: "❓", heading: "What a strong D1 looks like in Sociology", body: "'What is socialisation?' is a knowledge question. 'Does family or peer group have a greater influence on an individual's values and behaviour?' requires students to weigh sociological evidence and argue a position.", key: { label: "Strong D1 test", text: "Could two sociologists from different theoretical traditions disagree? Does it connect structure to agency, or society to the individual?" } },
        { icon: "🔍", heading: "D3 in Sociology — What counts as evidence?", body: "Evidence includes: sociological studies and surveys, demographic data, ethnographic accounts, government statistics, and systematic testimony. Anecdote is not evidence — one person's experience is illustrative unless part of a systematic study.", key: { label: "Common D3 failure", text: "Students using personal opinions or single anecdotes as evidence instead of systematic, patterned data." } },
      ]
    }, scenario: {
      context: "Apply C3 planning to a Sociology unit from start to finish.", cases: [
        { setup: "You are planning a Grade 10 Sociology unit on social media and identity. Write the compelling question.", question: "Which question best meets the criteria?", options: [{ label: "A", text: "What is social media and how many people use it?" }, { label: "B", text: "Does social media strengthen or fragment social identity in young people?" }, { label: "C", text: "List the five most-used social media platforms" }, { label: "D", text: "When was social media first used in schools?" }], correct: 1, feedback: "Option B asks students to weigh sociological evidence about identity formation in digital environments — a genuinely contested question where researchers, educators, and young people disagree." },
        { setup: "You are planning D3 for this unit. Students will evaluate sources on social media and identity.", question: "Which source set provides the best D3 material?", options: [{ label: "A", text: "The textbook section on socialisation and technology" }, { label: "B", text: "(1) A large-scale survey on teen social media use, (2) A psychologist's study on identity and online performance, (3) A platform company's own user wellbeing report, (4) First-person student testimonies from a school study" }, { label: "C", text: "Four news articles about social media published in the same month" }, { label: "D", text: "Wikipedia entries on four social media platforms" }], correct: 1, feedback: "Option B creates maximum evaluative tension. The platform company's self-reporting sits in direct contrast to the independent academic study and student testimonies." },
      ]
    }
  },
  c6: {
    lens: {
      intro: "You teach Business and Marketing. C3 D2 is built around business and marketing concepts — the frameworks used to analyse organisations, markets, and decisions.", sections: [
        { icon: "💼", heading: "Business and Marketing — Strategy, Markets and Value", body: "Core D2 concepts: Business models and strategy, market research, consumer behaviour, branding, supply chain, profit and loss, marketing mix (4Ps), entrepreneurship. Business asks 'What decision creates the most value for this organisation, and at what cost to whom?'", key: { label: "Compelling Question Examples", text: "'Is aggressive marketing ethical?' | 'Should businesses prioritise profit or social responsibility?' | 'Can a small business compete with global corporations?'" } },
        { icon: "❓", heading: "What a strong D1 looks like in Business", body: "'What is a marketing strategy?' is a knowledge question. 'Should companies market directly to children?' requires students to weigh commercial interests, consumer rights, and ethical responsibility.", key: { label: "Strong D1 test", text: "Does it create a genuine tension between stakeholder interests that students must resolve with evidence?" } },
        { icon: "🔍", heading: "D3 in Business — What counts as evidence?", body: "Evidence includes: market data and financial reports, case studies of real businesses, consumer surveys, industry analysis, and journalistic investigation. A company's own marketing materials are a source — students must consider the promotional purpose before using them as evidence.", key: { label: "Common D3 failure", text: "Students using company websites and marketing materials as neutral facts." } },
      ]
    }, scenario: {
      context: "Apply C3 planning to a Business and Marketing unit from start to finish.", cases: [
        { setup: "You are planning a Grade 11 Business unit on corporate social responsibility. Write the compelling question.", question: "Which question best meets the criteria?", options: [{ label: "A", text: "What is corporate social responsibility (CSR)?" }, { label: "B", text: "Is corporate social responsibility a genuine ethical commitment or a marketing strategy?" }, { label: "C", text: "List five examples of companies with CSR programmes" }, { label: "D", text: "When did CSR become a recognised business practice?" }], correct: 1, feedback: "Option B asks students to weigh evidence about corporate motivations and outcomes, connecting business strategy to ethics and consumer trust." },
        { setup: "You are planning D3 for this unit. Students will evaluate sources on corporate social responsibility.", question: "Which source set provides the best D3 material?", options: [{ label: "A", text: "The textbook section on business ethics divided into four topics" }, { label: "B", text: "(1) A company's own CSR report, (2) An investigative journalist's analysis of the same company, (3) An academic study on CSR and consumer behaviour, (4) An NGO's assessment of corporate environmental claims" }, { label: "C", text: "Four company websites describing their CSR initiatives" }, { label: "D", text: "Four news articles praising different companies' CSR work" }], correct: 1, feedback: "Option B creates direct evaluative tension. The company's self-report sits against the journalist's independent investigation — students must evaluate the difference between self-reporting and external scrutiny." },
      ]
    }
  },
};

/* ─────────────────────────────────────────────────────────────────
   CURRICULUM PLANS — per course, term-by-term scope & sequence
───────────────────────────────────────────────────────────────── */
const CURRICULUM_PLANS = {
  c1: {
    subject: "Economics", grade: "Grade 10",
    terms: [
      { term: "Term 1", focus: "Foundations of Economic Thinking", units: [
        { week: "W1–W2", title: "Scarcity, Choice & Opportunity Cost", compQuestion: "Can we ever make a perfect economic decision?", c3: "D1–D2", uae: "UAE resource economy & Vision 2031 diversification", assessment: "Exit ticket: opportunity cost analysis" },
        { week: "W3–W4", title: "Supply, Demand & Market Equilibrium", compQuestion: "Who really controls prices in a free market?", c3: "D2–D3", uae: "UAE real estate and oil market data", assessment: "Source evaluation: market report vs. government data" },
        { week: "W5–W6", title: "Market Structures & Competition", compQuestion: "Is monopoly ever good for consumers?", c3: "D1–D4", uae: "UAE telecommunications market case study", assessment: "D4 argument essay" },
      ]},
      { term: "Term 2", focus: "Government, Policy & Global Trade", units: [
        { week: "W7–W8", title: "Government Intervention & Market Failure", compQuestion: "Should governments always fix market failures?", c3: "D1–D4", uae: "UAE subsidy reforms case study", assessment: "Policy brief (D4)" },
        { week: "W9–W10", title: "International Trade & Globalisation", compQuestion: "Does free trade create winners and losers?", c3: "D1–D4", uae: "UAE's role in global trade routes & Expo 2020 legacy", assessment: "Structured debate (D4)" },
        { week: "W11–W12", title: "Money, Banking & Inflation", compQuestion: "Who is most harmed by inflation?", c3: "D2–D3", uae: "UAE Central Bank data and the dirham peg", assessment: "Data interpretation quiz" },
      ]},
      { term: "Term 3", focus: "Development, Equity & Future Economies", units: [
        { week: "W13–W14", title: "Economic Development & Inequality", compQuestion: "Can economic growth reduce inequality?", c3: "D1–D4", uae: "UAE–Africa development partnerships, Vision 2031", assessment: "Research paper (D4)" },
        { week: "W15–W16", title: "Entrepreneurship & Innovation", compQuestion: "Is entrepreneurship a solution to unemployment?", c3: "D2–D4", uae: "UAE startup ecosystem, Hub71, GITEX", assessment: "Business pitch (D4 communication)" },
      ]},
    ]
  },
  c2: {
    subject: "World History", grade: "Grade 10",
    terms: [
      { term: "Term 1", focus: "Ancient World to Early Modernity", units: [
        { week: "W1–W2", title: "The Rise of Civilisations", compQuestion: "What makes a civilisation rise or collapse?", c3: "D1–D4", uae: "Early Arabian Peninsula civilisations and trade", assessment: "Causation essay" },
        { week: "W3–W4", title: "The Islamic Golden Age", compQuestion: "Was the Islamic Golden Age truly a global turning point?", c3: "D1–D4", uae: "Arab contributions to science, medicine, and mathematics", assessment: "D3 source evaluation" },
        { week: "W5–W6", title: "Empire and Colonialism", compQuestion: "Did colonialism do more harm than good?", c3: "D1–D4", uae: "Gulf region under British influence, the Trucial States", assessment: "Argument essay with evidence" },
      ]},
      { term: "Term 2", focus: "Modern Revolutions & World Wars", units: [
        { week: "W7–W8", title: "The Industrial Revolution", compQuestion: "Did industrialisation improve or harm human life?", c3: "D1–D4", uae: "UAE's transition from pearl diving to oil economy", assessment: "Comparative analysis" },
        { week: "W9–W10", title: "World War I", compQuestion: "Was WWI inevitable or a catastrophic mistake?", c3: "D1–D4", uae: "Arab nationalism and the post-WWI settlement", assessment: "Structured debate (D4)" },
        { week: "W11–W12", title: "World War II & the Holocaust", compQuestion: "How does totalitarianism take hold in a democracy?", c3: "D1–D4", uae: "WWII's impact on decolonisation across the Middle East", assessment: "Primary source portfolio (D3)" },
      ]},
      { term: "Term 3", focus: "Cold War to Contemporary World", units: [
        { week: "W13–W14", title: "The Cold War", compQuestion: "Was the Cold War really about ideology, or about power?", c3: "D1–D4", uae: "Arab world, Non-Aligned Movement, UAE founding (1971)", assessment: "Multi-source essay" },
        { week: "W15–W16", title: "Globalisation & the 21st Century", compQuestion: "Has globalisation made the world more or less equal?", c3: "D1–D4", uae: "UAE as a globalisation success story", assessment: "D4 multimedia presentation" },
      ]},
    ]
  },
  c3: {
    subject: "Geography", grade: "Grade 11",
    terms: [
      { term: "Term 1", focus: "Population, Migration & Urbanisation", units: [
        { week: "W1–W2", title: "Population Dynamics", compQuestion: "Is overpopulation a threat or a myth?", c3: "D1–D4", uae: "UAE population pyramid: expatriate majority, pro-natalist policy", assessment: "Data analysis (D3)" },
        { week: "W3–W4", title: "Migration Patterns", compQuestion: "Does international migration create more benefit than cost?", c3: "D1–D4", uae: "UAE as a major migration destination: causes and consequences", assessment: "Policy brief (D4)" },
        { week: "W5–W6", title: "Urbanisation", compQuestion: "Is rapid urbanisation in developing nations progress or a problem?", c3: "D1–D4", uae: "Dubai's urban growth: from fishing village to megacity", assessment: "Urban planning report (D4)" },
      ]},
      { term: "Term 2", focus: "Resources, Environment & Climate", units: [
        { week: "W7–W8", title: "Water Resources", compQuestion: "Will water scarcity be the defining geopolitical crisis of this century?", c3: "D1–D4", uae: "UAE water security: desalination, groundwater depletion", assessment: "Source evaluation on scarcity claims (D3)" },
        { week: "W9–W10", title: "Energy & Climate Change", compQuestion: "Who bears the greatest responsibility for climate change?", c3: "D1–D4", uae: "UAE energy transition: COP28 Dubai, renewable energy targets", assessment: "Argument essay (D4)" },
        { week: "W11–W12", title: "Food Security & Agriculture", compQuestion: "Can the world feed 10 billion people sustainably?", c3: "D2–D3", uae: "UAE food import dependency, national food security strategy", assessment: "Data interpretation quiz" },
      ]},
      { term: "Term 3", focus: "Global Interconnections & Future Geography", units: [
        { week: "W13–W14", title: "Trade & Development", compQuestion: "Does international trade reduce or reinforce global inequality?", c3: "D1–D4", uae: "UAE's role in global trade, Jebel Ali port, free zones", assessment: "Comparative trade analysis" },
        { week: "W15–W16", title: "Tourism & Globalisation", compQuestion: "Is mass tourism a force for development or destruction?", c3: "D1–D4", uae: "UAE tourism industry: economic benefits vs. environmental costs", assessment: "D4 multimedia presentation" },
      ]},
    ]
  },
  c4: {
    subject: "Civics", grade: "Grades 9–11 (All Levels)",
    terms: [
      { term: "Term 1", focus: "Rights, Identity & Government", units: [
        { week: "W1–W2", title: "What Is a Citizen?", compQuestion: "Does citizenship mean the same thing in every country?", c3: "D1–D4", uae: "UAE citizenship law, residency and nationality frameworks", assessment: "Civic reflection (D4)" },
        { week: "W3–W4", title: "Rights & Responsibilities", compQuestion: "Can rights exist without responsibilities?", c3: "D1–D4", uae: "UAE Constitution — rights and duties of citizens and residents", assessment: "Rights audit (D3 source analysis)" },
        { week: "W5–W6", title: "Forms of Government", compQuestion: "What makes a government legitimate?", c3: "D1–D4", uae: "UAE Federal System: Supreme Council, Council of Ministers, FNC", assessment: "Comparative governance essay" },
      ]},
      { term: "Term 2", focus: "Democracy, Law & Justice", units: [
        { week: "W7–W8", title: "Democracy & Participation", compQuestion: "Is democracy the best system of government?", c3: "D1–D4", uae: "UAE's consultative democracy model (Shura) vs. electoral democracies", assessment: "Structured debate (D4)" },
        { week: "W9–W10", title: "Rule of Law & Justice", compQuestion: "Is the rule of law truly equal for everyone?", c3: "D1–D4", uae: "UAE legal system: civil, sharia, and international law elements", assessment: "Case analysis (D3)" },
        { week: "W11–W12", title: "Civil Liberties & Their Limits", compQuestion: "Should freedom of speech have limits?", c3: "D1–D4", uae: "UAE Cybercrime law and freedom of expression context", assessment: "Policy position paper (D4)" },
      ]},
      { term: "Term 3", focus: "Global Citizenship & Civic Action", units: [
        { week: "W13–W14", title: "International Organisations & Global Governance", compQuestion: "Can international organisations solve global problems?", c3: "D1–D4", uae: "UAE's role at the UN, Arab League, Gulf Cooperation Council", assessment: "UN simulation (D4)" },
        { week: "W15–W16", title: "Civic Action & Youth Leadership", compQuestion: "Can young people make a real difference?", c3: "D1–D4", uae: "UAE Youth Council, Emirates Youth Council, student leadership programmes", assessment: "Civic action project (D4)" },
      ]},
    ]
  },
  c5: {
    subject: "Sociology", grade: "Grade 10",
    terms: [
      { term: "Term 1", focus: "Identity, Socialisation & Culture", units: [
        { week: "W1–W2", title: "Socialisation", compQuestion: "Does family or peer group shape us more?", c3: "D1–D4", uae: "UAE family structures, generational change in Emirati society", assessment: "Observation report (D3)" },
        { week: "W3–W4", title: "Culture & Identity", compQuestion: "Can you belong to more than one culture at once?", c3: "D1–D4", uae: "UAE multicultural society: 200+ nationalities, Year of Tolerance", assessment: "Identity case studies (D3)" },
        { week: "W5–W6", title: "Gender & Society", compQuestion: "How much has gender equality actually changed?", c3: "D1–D4", uae: "UAE women in leadership, gender statistics, Women's Balance Charter", assessment: "Data analysis essay" },
      ]},
      { term: "Term 2", focus: "Inequality, Power & Social Change", units: [
        { week: "W7–W8", title: "Social Stratification & Class", compQuestion: "Is social inequality inevitable?", c3: "D1–D4", uae: "UAE socioeconomic stratification: citizen vs. expat structures", assessment: "Sociological analysis (D4)" },
        { week: "W9–W10", title: "Media & Social Influence", compQuestion: "Does social media strengthen or fragment social identity?", c3: "D1–D4", uae: "UAE social media usage rates, digital content regulation", assessment: "Source analysis (D3)" },
        { week: "W11–W12", title: "Deviance & Social Control", compQuestion: "Does punishment reduce crime or create more of it?", c3: "D1–D4", uae: "UAE crime statistics and justice system approach", assessment: "Policy comparison essay" },
      ]},
      { term: "Term 3", focus: "Institutions & Social Change", units: [
        { week: "W13–W14", title: "Religion & Society", compQuestion: "Does religion unite or divide societies?", c3: "D1–D4", uae: "UAE religious tolerance law, Abrahamic Family House", assessment: "Comparative analysis (D4)" },
        { week: "W15–W16", title: "Globalisation & Social Change", compQuestion: "Is globalisation creating one world culture?", c3: "D1–D4", uae: "Cultural preservation in UAE amid globalisation pressures", assessment: "Sociological argument essay" },
      ]},
    ]
  },
  c6: {
    subject: "Business & Marketing", grade: "Grade 11",
    terms: [
      { term: "Term 1", focus: "Business Foundations & Strategy", units: [
        { week: "W1–W2", title: "What Makes a Business Succeed?", compQuestion: "Is a strong business model enough to guarantee success?", c3: "D1–D4", uae: "UAE startup ecosystem, GITEX, Silicon Oasis, Hub71", assessment: "Business model canvas (D4)" },
        { week: "W3–W4", title: "Market Research & Consumer Behaviour", compQuestion: "Can you predict what consumers will buy?", c3: "D1–D4", uae: "UAE consumer spending data, Ramadan retail trends", assessment: "Market research report (D4)" },
        { week: "W5–W6", title: "Branding & the Marketing Mix", compQuestion: "Is brand image more powerful than product quality?", c3: "D1–D4", uae: "UAE brand case studies: Emirates airline, Dubai Tourism, DP World", assessment: "Brand analysis (D3)" },
      ]},
      { term: "Term 2", focus: "Ethics, CSR & Global Markets", units: [
        { week: "W7–W8", title: "Corporate Social Responsibility", compQuestion: "Is CSR genuine ethics or just good marketing?", c3: "D1–D4", uae: "UAE corporate sustainability, ESG goals, ADNOC net-zero commitments", assessment: "Source evaluation: company report vs. NGO (D3)" },
        { week: "W9–W10", title: "Digital Marketing & E-Commerce", compQuestion: "Has digital marketing made advertising more or less ethical?", c3: "D1–D4", uae: "UAE e-commerce growth, Noon.com vs. Amazon.ae case study", assessment: "Digital campaign analysis" },
        { week: "W11–W12", title: "Globalisation & International Business", compQuestion: "Should multinationals follow local or global standards?", c3: "D2–D3", uae: "UAE as a global hub: free zones, FDI, Expo 2020 legacy", assessment: "Case study comparison (D3)" },
      ]},
      { term: "Term 3", focus: "Innovation & Entrepreneurship", units: [
        { week: "W13–W14", title: "Entrepreneurship & Risk", compQuestion: "Is entrepreneurship the best solution to unemployment?", c3: "D1–D4", uae: "UAE entrepreneurship policy, Youth Enterprise, startup visa", assessment: "Pitch deck presentation (D4)" },
        { week: "W15–W16", title: "The Future of Business", compQuestion: "Will AI replace human workers, or create new ones?", c3: "D1–D4", uae: "UAE AI Strategy 2031, automation in UAE economy", assessment: "Policy brief (D4)" },
      ]},
    ]
  },
};

/* ─────────────────────────────────────────────────────────────────
   TEACHER CURRICULUM PLAN VIEW
───────────────────────────────────────────────────────────────── */
function TeacherCurriculumPlan({ teacher, courses }) {
  const assignedCourses = (teacher.courses || [])
    .map(cid => courses.find(c => c.id === cid)).filter(Boolean);
  const [activeCourse, setActiveCourse] = useState(assignedCourses[0]?.id || null);
  const [activeTerm, setActiveTerm] = useState(0);

  if (!assignedCourses.length) {
    return (
      <div style={{ textAlign: "center", padding: "56px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "var(--ink)", marginBottom: 8 }}>No Courses Assigned</h3>
        <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6 }}>Ask your HOD to assign your courses in the Admin dashboard. Your curriculum plan will appear here automatically.</p>
      </div>
    );
  }

  const plan = activeCourse ? CURRICULUM_PLANS[activeCourse] : null;
  const termData = plan?.terms[activeTerm] || null;

  const C3_COLORS = { "D1": "#534AB7", "D2": "#1A9E75", "D3": "#E8650A", "D4": "#1044A3", "D1–D2": "#534AB7", "D2–D3": "#1A9E75", "D2–D4": "#1044A3", "D1–D4": "#0A1F44", "D1–D3": "#534AB7" };

  return (
    <div>
      {/* Course tabs — only if multiple courses assigned */}
      {assignedCourses.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {assignedCourses.map(c => (
            <button key={c.id} onClick={() => { setActiveCourse(c.id); setActiveTerm(0); }}
              style={{ padding: "7px 15px", border: "2px solid", borderColor: activeCourse === c.id ? "var(--ink2)" : "var(--border)", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer", background: activeCourse === c.id ? "var(--ink2)" : "var(--card)", color: activeCourse === c.id ? "#fff" : "var(--ink)" }}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      )}

      {plan ? (
        <>
          {/* Plan header */}
          <div style={{ background: "linear-gradient(135deg,var(--ink),var(--ink2))", borderRadius: 12, padding: "20px 24px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 4 }}>{plan.grade}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#fff" }}>{plan.subject} — Scope & Sequence</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[["🎯", "C3"], ["🇦🇪", "UAE"], ["📝", "Assessment"]].map(([icon, label]) => (
                <div key={label} style={{ background: "rgba(255,255,255,.12)", borderRadius: 7, padding: "5px 10px", fontSize: 11, color: "rgba(255,255,255,.8)", fontWeight: 600 }}>{icon} {label} aligned</div>
              ))}
            </div>
          </div>

          {/* Term tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {plan.terms.map((t, i) => (
              <button key={i} onClick={() => setActiveTerm(i)}
                style={{ flex: 1, padding: "9px 12px", border: "2px solid", borderColor: activeTerm === i ? "var(--ink2)" : "var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", background: activeTerm === i ? "var(--ink2)" : "var(--card)", color: activeTerm === i ? "#fff" : "var(--ink)", transition: "all .18s" }}>
                {t.term}
              </button>
            ))}
          </div>

          {/* Term focus label */}
          {termData && (
            <div style={{ background: "var(--sky-pale)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 16px", marginBottom: 14, fontSize: 13, color: "var(--ink2)", fontWeight: 600 }}>
              📌 {termData.term} Focus: <em style={{ fontWeight: 400 }}>{termData.focus}</em>
            </div>
          )}

          {/* Units table */}
          {termData && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {termData.units.map((unit, i) => (
                <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--sh)" }}>
                  {/* Unit header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "#F8FAFD" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{unit.week.split("–")[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{unit.title}</div>
                      <div style={{ fontSize: 11, color: "var(--slate)" }}>{unit.week}</div>
                    </div>
                    <div style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: (C3_COLORS[unit.c3] || "var(--ink)") + "18", color: C3_COLORS[unit.c3] || "var(--ink)", border: `1px solid ${(C3_COLORS[unit.c3] || "#ccc")}44` }}>C3 {unit.c3}</div>
                  </div>
                  {/* Unit body */}
                  <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".7px", color: "var(--slate)", marginBottom: 5 }}>❓ Compelling Question</div>
                      <div style={{ fontSize: 13, color: "var(--ink)", fontStyle: "italic", lineHeight: 1.5 }}>"{unit.compQuestion}"</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".7px", color: "var(--slate)", marginBottom: 5 }}>🇦🇪 UAE Context</div>
                      <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>{unit.uae}</div>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".7px", color: "var(--slate)", marginBottom: 5 }}>📝 Key Assessment</div>
                      <div style={{ display: "inline-block", background: "var(--orange-pale)", border: "1px solid #F0A060", borderRadius: 7, padding: "4px 11px", fontSize: 12, color: "var(--orange)", fontWeight: 600 }}>{unit.assessment}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--slate)", fontSize: 14 }}>
          Curriculum plan not yet available for this course. Contact your HOD.
        </div>
      )}
    </div>
  );
}

function getSubjectLessons(teacherCourseIds, allCourses) {
  const assigned = (teacherCourseIds || []).map(cid => allCourses.find(c => c.id === cid)).filter(Boolean);
  if (!assigned.length) return {
    lens: { intro: "No courses assigned yet. Ask your HOD to assign your courses in the Admin dashboard.", sections: [] },
    scenario: { context: "Ask your HOD to assign your courses in Admin so your scenario practice can be personalised.", cases: [{ setup: "No courses assigned yet.", question: "What should you do?", options: [{ label: "A", text: "Ask your HOD to assign your courses in the Admin dashboard" }], correct: 0, feedback: "Once your HOD assigns your courses, this scenario will be tailored to your specific subject." }] }
  };
  const allSections = [];
  assigned.forEach(c => { const s = SUBJECT_CONTENT[c.id]; if (s) allSections.push(...s.lens.sections); });
  const primary = SUBJECT_CONTENT[assigned[0].id];
  const subjects = assigned.map(c => c.name).join(", ");
  return {
    lens: { intro: assigned.length === 1 ? (primary?.lens.intro || "") : `You teach ${subjects}. This lesson covers C3 Dimension 2 for each of your subjects.`, sections: allSections },
    scenario: primary?.scenario || null
  };
}

function teacherPct(t) {
  const done = Object.values(t.progress).reduce((a, b) => a + b, 0);
  return Math.round((done / TOTAL_LESSONS) * 100);
}

/* ─────────────────────────────────────────────────────────────────
   DEFAULT TEACHERS
───────────────────────────────────────────────────────────────── */
const DEFAULT_TEACHERS = [
  { id: "t1", name: "Mr. Osama", subject: "Economics", role: "Current", email: "usama.barrak@cityamericanschool.ae", joined: "Aug 2023", courses: ["c1"], progress: { m1: 3, m2: 6, m3: 3, m4: 3, m5: 3 } },
  { id: "t2", name: "Mr. Mo", subject: "History", role: "Current", email: "m.mousa@cityamericanschool.ae", joined: "Sep 2021", courses: ["c2"], progress: { m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 } },
  { id: "t3", name: "Mr. Ajlony", subject: "Civics", role: "New Joiner", email: "muhammad.ahmad@cityamericanschool.ae", joined: "Jan 2026", courses: ["c4"], progress: { m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 } },
  { id: "t4", name: "James Kowalski", subject: "Geography", role: "Current", email: "j.kowalski@cas.ae", joined: "Aug 2022", courses: ["c3"], progress: { m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 } },
  { id: "t5", name: "Ms. Bahija", subject: "Civics", role: "New Joiner", email: "b.hamdi@cityamericanschool.ae", joined: "Jan 2026", courses: ["c4"], progress: { m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 } },
];

/* ─────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("home");
  const [teachers, setTeachers] = useState(null);
  const [courses, setCourses] = useState(null);
  const [adminIn, setAdminIn] = useState(false);
  const [toast, setToast] = useState(null);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Fetch Teachers and Courses from your Supabase tables
        const { data: tData, error: tError } = await supabase.from('teachers').select('*');
        const { data: cData, error: cError } = await supabase.from('courses').select('*');

        if (tError || cError) throw new Error("Cloud fetch failed");

        // 2. Use database data if it exists, otherwise use your defaults
        setTeachers(tData?.length ? tData : DEFAULT_TEACHERS);
        setCourses(cData?.length ? cData : DEFAULT_COURSES);

      } catch (err) {
        console.error("Supabase Error:", err);
        // Fallback to defaults if the database is unreachable
        setTeachers(DEFAULT_TEACHERS);
        setCourses(DEFAULT_COURSES);

      }
    };

    fetchInitialData();
  }, []);

  const saveTeachers = async (val) => {
    setTeachers(val);
    try {
      const { error } = await supabase.from('teachers').upsert(val);
      if (error) throw error;
    } catch (err) {
      notify("⚠️ Cloud Sync Error: " + err.message);
    }
  };

  const saveCourses = async (val) => {
    setCourses(val);
    try {
      const { error } = await supabase.from('courses').upsert(val);
      if (error) throw error;
    } catch (err) {
      notify("⚠️ Course Sync Error: " + err.message);
    }
  };

  // ── TRAINING SESSION ──────────────────────────────────────────
  // null = not yet chosen, "guest" = guest mode, teacher object = logged in


  // The "effective" progress used everywhere in the training tab
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  /* API CALL */
  // Robust JSON repair — handles all LLM output quirks via character-level state machine
  // Load jsonrepair from CDN (battle-tested LLM JSON fixer)
  /* ── JSON/XML PARSER ───────────────────────────────────────────
     All lesson content fields use XML tags to avoid quote-escaping.
     Simple scalar fields (dimension, dayNum etc) stay as JSON.
  ─────────────────────────────────────────────────────────────── */




  // Load this teacher's progress from persistent storage when they log in
  const switchTab = async (t) => {
    setTab(t);
    setActiveLesson(null);
    setActiveMod(null);

    // Pull fresh data from cloud to ensure Teacher Portal isn't using old local data
    try {
      const { data: tData } = await supabase.from('teachers').select('*');
      if (tData && tData.length > 0) {
        setTeachers(tData);
      }
    } catch (e) {
      console.log("Cloud sync failed", e);
    }
  };

  if (teachers === null || courses === null) {
    return (
      <div>
        <style>{CSS}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--ink2)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
          <p style={{ fontSize: 14, color: "var(--slate)" }}>Loading training hub…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{CSS}</style>

      <nav className="nav">
        <div className="nav-logo">CAS <em>Humanities</em> Training Hub</div>
        <div className="nav-pills">
          {[["home", "🏛️ Home"], ["training", "👤 Teachers Portal"], ["admin", "⚙️ Admin"]].map(([t, l]) => (
            <button key={t} className={"npill" + (tab === t ? " on" : "")} onClick={() => switchTab(t)}>{l}</button>
          ))}
        </div>

      </nav>

      {/* ═══ HOME ═══ */}
      {tab === "home" && (
        <HomeDeptPage teachers={teachers} courses={courses} />
      )}

      {/* ═══ TRAINING PORTAL ═══ */}
      {tab === "training" && (
        <TeacherTrainingPortal
          teachers={teachers}
          saveTeachers={saveTeachers}
          courses={courses}
          notify={notify}
        />
      )}

      {/* ═══ ADMIN ═══ */}
      {tab === "admin" && (
        <div className="wrap" style={{ paddingTop: 28 }}>
          {!adminIn
            ? <AdminLogin onLogin={() => setAdminIn(true)} />
            : <AdminDash teachers={teachers} saveTeachers={saveTeachers} courses={courses} saveCourses={saveCourses} notify={notify} />
          }
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   AI CHAT PANEL — reusable floating chat
───────────────────────────────────────────────────────────────── */
function AiChat({ systemPrompt, placeholder, title, accentColor = "var(--ink2)" }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg = { role: "user", content: text };
    setMsgs(m => [...m, userMsg]);
    setBusy(true);
    try {
      const history = [...msgs, userMsg].map(m => ({ role: m.role, content: m.content }));
      const anthropicKey = import.meta.env.VITE_ANTHROPIC_KEY;
      if (!anthropicKey) throw new Error("AI key not configured. Add VITE_ANTHROPIC_KEY to your .env file and Vercel settings.");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1200,
          system: systemPrompt,
          messages: history
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content.map(b => b.text || "").join("");
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMsgs(m => [...m, { role: "assistant", content: "⚠️ " + e.message }]);
    }
    setBusy(false);
  };

  return (
    <>
      {/* Toggle button */}
      <button onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px",
          background: open ? accentColor : "var(--card)", color: open ? "#fff" : accentColor,
          border: `2px solid ${accentColor}`, borderRadius: 9, fontWeight: 700, fontSize: 13,
          cursor: "pointer", transition: "all .18s", boxShadow: "0 2px 8px rgba(0,0,0,.07)"
        }}>
        💬 {open ? "Close AI Chat" : title}
      </button>

      {open && (
        <div style={{
          marginTop: 12, background: "var(--card)", border: `2px solid ${accentColor}`,
          borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.1)"
        }}>
          {/* Header */}
          <div style={{ background: accentColor, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{title}</span>
            <span style={{ marginLeft: "auto", color: "rgba(255,255,255,.7)", fontSize: 11 }}>Powered by Claude</span>
          </div>

          {/* Messages */}
          <div style={{ height: 320, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, background: "#F8FAFD" }}>
            {msgs.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--slate)", fontSize: 13, marginTop: 40, lineHeight: 1.7 }}>
                👋 Hi! I'm your AI assistant.<br />Ask me anything about this topic.
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "9px 13px", borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                  background: m.role === "user" ? accentColor : "#fff",
                  color: m.role === "user" ? "#fff" : "var(--ink)",
                  fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap",
                  boxShadow: "0 1px 4px rgba(0,0,0,.08)"
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "9px 14px", borderRadius: "12px 12px 12px 3px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.08)", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: accentColor, animation: `bounce .9s ${i * 0.2}s infinite alternate`, opacity: .7 }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid var(--border)", background: "#fff" }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={placeholder}
              style={{
                flex: 1, padding: "9px 12px", border: "2px solid var(--border)", borderRadius: 8, fontSize: 13,
                color: "var(--ink)", outline: "none", fontFamily: "'Outfit',sans-serif"
              }}
              disabled={busy} />
            <button onClick={send} disabled={busy || !input.trim()}
              style={{
                padding: "9px 16px", background: accentColor, color: "#fff", border: "none",
                borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: busy || !input.trim() ? .5 : 1
              }}>
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-5px)} }`}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LESSON VIEW ROUTER
───────────────────────────────────────────────────────────────── */



/* ─────────────────────────────────────────────────────────────────
   POST-LESSON REFLECTION TOOL
───────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────
   ADMIN REFLECTIONS PANEL
───────────────────────────────────────────────────────────────── */
function AdminReflectionsPanel({ teachers }) {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        // 1. Pull reflections from your Supabase table
        const { data, error } = await supabase
          .from('reflections')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) throw error;

        if (data) {
          // 2. Connect the database IDs back to your teacher names
          const mappedData = data.map(r => ({
            teacherId: r.teacher_id,
            lessonId: r.lesson_id,
            lessonTitle: r.lesson_title,
            question: r.question,
            answer: r.answer,
            timestamp: r.timestamp,
            teacherName: teachers.find(t => t.id === r.teacher_id)?.name || "Unknown Teacher",
            subject: teachers.find(t => t.id === r.teacher_id)?.subject || ""
          }));
          setReflections(mappedData);
        }
      } catch (err) {
        console.error("Error fetching reflections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReflections();
  }, [teachers]);

  const teacherIds = [...new Set(reflections.map(r => r.teacherId))];
  const filtered = filter === "all" ? reflections : reflections.filter(r => r.teacherId === filter);
  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " · " +
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div style={{ padding: 32, textAlign: "center", color: "var(--slate)" }}>Loading reflections…</div>;

  return (
    <div className="panel">
      <div className="panel-hd">
        <h3>Post-Lesson Reflections ({reflections.length})</h3>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ padding: "7px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--ink)" }}>
          <option value="all">All teachers</option>
          {teacherIds.map(id => {
            const t = teachers.find(t => t.id === id);
            return t ? <option key={id} value={id}>{t.name}</option> : null;
          })}
        </select>
      </div>
      {filtered.length === 0
        ? <div style={{ padding: "32px", textAlign: "center", color: "var(--slate)", fontSize: 14 }}>
          {reflections.length === 0 ? "No lesson reflections yet. Teachers answer reflection questions in media lessons (video and podcast)." : "No reflections for this teacher yet."}
        </div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 0 8px" }}>
          {filtered.map((r, i) => (
            <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", margin: "0 16px" }}>
              <div onClick={() => setOpen(open === i ? null : i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer",
                  background: open === i ? "var(--sky-pale)" : "var(--card)"
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", background: "#EAF2FF",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--ink2)", flexShrink: 0
                }}>
                  {r.teacherName?.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{r.teacherName}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{r.lessonTitle || "Untitled lesson"}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--slate)", textAlign: "right" }}>
                  {fmt(r.timestamp)}<br />
                  <span style={{ color: "var(--ink2)" }}>{r.subject}</span>
                </div>
                <span style={{ color: "var(--slate)", fontSize: 14 }}>{open === i ? "▲" : "▼"}</span>
              </div>
              {open === i && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px", background: "#FAFBFD", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".7px", color: "var(--orange)", marginBottom: 6 }}>📝 Reflection question</div>
                    <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600, lineHeight: 1.6 }}>{r.question}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".7px", color: "var(--ink2)", marginBottom: 6 }}>Teacher's answer</div>
                    <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.75, background: "var(--card)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>{r.answer}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TEACHER TRAINING PORTAL — full-page, self-contained
───────────────────────────────────────────────────────────────── */
function TeacherTrainingPortal({ teachers, saveTeachers, courses, notify }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [progress, setProgress] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeMod, setActiveMod] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [portalView, setPortalView] = useState("modules");

  const handleLogin = async () => {
    const found = teachers.find(t => t.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) { setErr("Email not recognised. Ask your HOD to add you in Admin."); return; }
    setErr("");

    setSaving(true);
    try {
      // Pull the latest progress for this teacher from Supabase
      const { data, error } = await supabase
        .from('teachers')
        .select('progress')
        .eq('id', found.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 just means no data found yet
      setProgress(data?.progress || {});
    } catch (e) {
      console.error("Cloud fetch failed, using local data", e);
      setProgress(found.progress || {});
    } finally {
      setTeacher(found);
      setSaving(false);
    }
  };

  const markDone = async (lessonId) => {
    const updatedProg = { ...progress, [lessonId]: true };
    setProgress(updatedProg);
    setSaving(true);

    try {
      const { error } = await supabase
        .from('teachers')
        .update({ progress: updatedProg })
        .eq('id', teacher.id);

      if (error) throw error;
      notify("✓ Progress synced to cloud!");
    } catch (err) {
      console.error("Sync error:", err);
      notify("⚠️ Offline mode: Progress saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const totalLessons = MODULES.flatMap(m => m.lessons).length;
  const totalDone = Object.values(progress).filter(Boolean).length;
  const totalPct = Math.round((totalDone / totalLessons) * 100);

  const modUnlocked = (mod) => {
    if (mod.seq === 1) return true;
    const prev = MODULES.find(m => m.seq === mod.seq - 1);
    return prev ? prev.lessons.every(l => progress[l.id]) : true;
  };
  const lessonUnlocked = (mod, idx) => {
    if (!modUnlocked(mod)) return false;
    if (idx === 0) return true;
    return !!progress[mod.lessons[idx - 1].id];
  };

  /* ── LOGIN ── */
  if (!teacher) {
    return (
      <div style={{ maxWidth: 420, margin: "60px auto" }}>
        <div style={{ background: "var(--card)", borderRadius: 14, boxShadow: "var(--sh)", padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📚</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "var(--ink)", marginBottom: 8 }}>Teacher Training</h2>
          <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.7, marginBottom: 24 }}>
            Enter your school email to access your training modules. Your progress is saved automatically.
          </p>
          {err && <div style={{ background: "var(--rose-pale)", border: "1px solid #F1948A", borderRadius: 8, padding: "9px 13px", fontSize: 13, color: "var(--rose)", marginBottom: 14, textAlign: "left" }}>{err}</div>}
          <input type="email" placeholder="e.g. a.almansouri@cas.ae" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "11px 13px", border: "2px solid var(--border)", borderRadius: 8, fontSize: 14, color: "var(--ink)", marginBottom: 12 }} />
          <button onClick={handleLogin} disabled={!email.trim()}
            style={{ width: "100%", padding: 12, background: "var(--ink2)", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: email.trim() ? 1 : .5 }}>
            Access My Training →
          </button>
        </div>
      </div>
    );
  }

  /* ── LESSON VIEW ── */
  if (activeLesson && activeMod) {
    let lesson = activeLesson;
    // Resolve subject-specific content for m4l1 and m4l2
    if (lesson.subjectSpecific) {
      const subjectData = getSubjectLessons(teacher.courses, courses);
      if (lesson.contentKey === "lens") {
        lesson = { ...lesson, type: "read", content: subjectData.lens };
      } else if (lesson.contentKey === "scenario" && subjectData.scenario) {
        lesson = { ...lesson, type: "scenario", scenario: subjectData.scenario };
      }
    }
    const isDone = !!progress[lesson.id];
    const modIdx = activeMod.lessons.findIndex(l => l.id === lesson.id);
    const nextLesson = activeMod.lessons[modIdx + 1] || null;
    const nextMod = !nextLesson ? MODULES.find(m => m.seq === activeMod.seq + 1) : null;
    return (
      <div>
        <button onClick={() => setActiveLesson(null)}
          style={{ background: "none", border: "none", color: "var(--sky)", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
          ← Back to modules
        </button>
        <div style={{ background: "var(--card)", borderRadius: 14, boxShadow: "var(--sh)", overflow: "hidden" }}>
          {/* Lesson header */}
          <div style={{ padding: "22px 28px 18px", borderBottom: "2px solid var(--border)" }}>
            <div style={{
              display: "inline-block", padding: "3px 11px", borderRadius: 99, fontSize: 11, fontWeight: 700,
              background: lesson.type === "quiz" ? "var(--orange-pale)" : lesson.type === "scenario" ? "var(--orange-pale)" : lesson.type === "drag" ? "var(--blue-pale)" : "var(--sky-pale)",
              color: lesson.type === "quiz" || lesson.type === "scenario" ? "var(--orange)" : lesson.type === "drag" ? "var(--blue)" : "var(--ink2)",
              marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px"
            }}>
              {lesson.type === "read" ? "Reading" : lesson.type === "quiz" ? "Quiz" : lesson.type === "scenario" ? "Scenario Practice" : lesson.type === "drag" ? "Sort Activity" : "Media"}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "var(--ink)", marginBottom: 4 }}>{lesson.title}</h2>
            <div style={{ fontSize: 13, color: "var(--slate)" }}>⏱ {lesson.dur}</div>
          </div>
          {/* Lesson body */}
          <div style={{ padding: "26px 28px" }}>
            {lesson.type === "read" && lesson.content && (
              <div>
                <div style={{
                  background: "var(--sky-pale)", borderLeft: "4px solid var(--ink2)", padding: "13px 16px",
                  borderRadius: "0 9px 9px 0", marginBottom: 24, fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontStyle: "italic"
                }}>
                  {lesson.content.intro}
                </div>
                {lesson.content.sections && lesson.content.sections.map((s, i) => (
                  <div key={i} style={{ marginBottom: 22 }}>
                    <h4 style={{
                      fontSize: 13, fontWeight: 700, color: "var(--ink2)", marginBottom: 7,
                      paddingBottom: 6, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 7
                    }}>
                      <span>{s.icon}</span>{s.heading}
                    </h4>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink)" }}>{s.body}</p>
                    {s.key && (
                      <div style={{ background: "var(--orange-pale)", border: "1px solid #F0A060", borderRadius: 9, padding: "12px 15px", marginTop: 9 }}>
                        <b style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--orange)", display: "block", marginBottom: 4 }}>{s.key.label}</b>
                        <p style={{ fontSize: 13, color: "#5A3010", lineHeight: 1.6, margin: 0 }}>{s.key.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {lesson.type === "quiz" && lesson.questions && (
              <QuizLesson lesson={lesson} done={isDone} onComplete={() => markDone(lesson.id)} />
            )}
            {lesson.type === "scenario" && lesson.scenario && (
              <ScenarioLesson lesson={lesson} done={isDone} onComplete={() => markDone(lesson.id)} />
            )}
            {lesson.type === "drag" && (
              <DragLesson lesson={lesson} done={isDone} onComplete={() => markDone(lesson.id)} />
            )}
            {lesson.type === "media" && (
              <MediaLesson lesson={lesson} done={isDone} onComplete={() => markDone(lesson.id)} teacherId={teacher.id} />
            )}
            {/* Complete button for read lessons */}
            {lesson.type === "read" && (
              <button onClick={() => { if (!isDone) markDone(lesson.id); }}
                className={isDone ? "complete-btn done" : "complete-btn"} style={{ marginTop: 16 }}>
                {isDone ? "✓ Lesson Complete" : "Mark as Complete"}
              </button>
            )}
            {/* Next lesson */}
            {isDone && (nextLesson || nextMod) && (
              <div style={{
                marginTop: 16, padding: "12px 16px", background: "var(--sky-pale)", borderRadius: 9,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span style={{ fontSize: 13, color: "var(--ink2)" }}>
                  {nextLesson ? `Next: ${nextLesson.title}` : `Next module: ${nextMod?.title}`}
                </span>
                <button onClick={() => {
                  if (nextLesson) setActiveLesson(nextLesson);
                  else { setActiveMod(nextMod); setActiveLesson(null); }
                }} style={{ padding: "6px 14px", background: "var(--ink2)", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── MODULE LIST ── */
  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,var(--ink),var(--ink2))", borderRadius: 14, padding: "24px 28px", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#fff", marginBottom: 3 }}>
              Welcome back, {teacher.name.split(" ")[0]}
            </div>
            <div style={{ fontSize: 12, color: "var(--sky2)" }}>{teacher.subject} · {teacher.email}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {saving && <span style={{ fontSize: 11, color: "var(--orange)", fontWeight: 600 }}>💾 Saving…</span>}
            <button onClick={() => { setTeacher(null); setProgress({}); setEmail(""); setActiveMod(null); setActiveLesson(null); setPortalView("modules"); }}
              style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 7, padding: "5px 13px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              Sign out
            </button>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 99, height: 8, marginBottom: 6 }}>
          <div style={{ background: "var(--orange)", height: 8, borderRadius: 99, width: totalPct + "%", transition: "width .5s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>{totalDone} of {totalLessons} lessons complete{totalPct === 100 ? " · 🎓 Certified!" : ""}</span>
          <span style={{ fontSize: 12, color: "var(--orange)", fontWeight: 700 }}>{totalPct}%</span>
        </div>
      </div>

      {/* Portal view tabs */}
      <div style={{ display: "flex", gap: 6, background: "var(--card)", padding: 5, borderRadius: 10, boxShadow: "var(--sh)", marginBottom: 18 }}>
        {[["modules", "📚 Training Modules"], ["curriculum", "📋 My Curriculum Plan"]].map(([v, l]) => (
          <button key={v} onClick={() => { setPortalView(v); setActiveMod(null); }}
            style={{ flex: 1, padding: "9px 12px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: portalView === v ? "var(--ink2)" : "transparent", color: portalView === v ? "#fff" : "var(--slate)", transition: "all .18s" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Curriculum plan view */}
      {portalView === "curriculum" && (
        <TeacherCurriculumPlan teacher={teacher} courses={courses} />
      )}

      {/* Module list — accordion style, each opens inline */}
      {portalView === "modules" && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MODULES.map(mod => {
          const modDone = mod.lessons.filter(l => progress[l.id]).length;
          const modPct = Math.round((modDone / mod.lessons.length) * 100);
          const unlocked = modUnlocked(mod);
          const complete = modPct === 100;
          const isOpen = activeMod?.id === mod.id;
          const typeColors = { read: "b-read", quiz: "b-quiz", scenario: "b-scenario", drag: "b-drag", media: "b-media" };
          const typeLabels = { read: "Reading", quiz: "Quiz", scenario: "Scenario", drag: "Sort", media: "Media" };
          return (
            <div key={mod.id} style={{
              background: "var(--card)", borderRadius: 14, boxShadow: "var(--sh)",
              border: `2px solid ${isOpen ? mod.color : complete ? "var(--orange)" : "transparent"}`,
              overflow: "hidden", transition: "border-color .2s", opacity: unlocked ? 1 : .55
            }}>
              {/* Module header — always visible */}
              <div onClick={() => { if (unlocked) setActiveMod(isOpen ? null : mod); }}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "18px 20px",
                  cursor: unlocked ? "pointer" : "not-allowed", userSelect: "none"
                }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11, flexShrink: 0,
                  background: unlocked ? mod.color + "22" : "#F1F5F9",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                }}>
                  {mod.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{mod.title}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.5 }}>{mod.desc}</div>
                  {!unlocked && <span className="lock-note" style={{ marginTop: 5 }}>🔒 Complete previous module first</span>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: complete ? "var(--orange)" : "var(--ink2)" }}>{modPct}%</span>
                  <div style={{ width: 80 }}><div className="pbar"><div className="pbar-fill" style={{ width: modPct + "%", background: complete ? "var(--orange)" : "var(--sky)" }} /></div></div>
                  <span style={{ fontSize: 11, color: "var(--slate)" }}>{modDone}/{mod.lessons.length} lessons</span>
                </div>
                {unlocked && <span style={{ fontSize: 18, color: "var(--slate)", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>}
              </div>
              {/* Lesson list — only when open */}
              {isOpen && (
                <div style={{ borderTop: "1px solid var(--border)" }}>
                  {mod.lessons.map((lesson, idx) => {
                    const isDone = !!progress[lesson.id];
                    const lUnlocked = lessonUnlocked(mod, idx);
                    return (
                      <div key={lesson.id}
                        className={"l-item" + (lUnlocked ? " go" : " dimmed")}
                        style={{ opacity: lUnlocked ? 1 : .45 }}
                        onClick={() => { if (lUnlocked) setActiveLesson(lesson); }}>
                        <div className={"l-num" + (isDone ? " done" : lUnlocked ? " next" : " wait")}>
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <div className="l-body">
                          <div className="l-title">{lesson.title}</div>
                          <div className="l-meta">⏱ {lesson.dur}{!lUnlocked ? " · 🔒 Complete previous lesson first" : ""}</div>
                        </div>
                        <span className={"l-badge " + (typeColors[lesson.type] || "b-read")}>{typeLabels[lesson.type] || "Read"}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>}

      {portalView === "modules" && totalPct === 100 && (
        <div style={{
          marginTop: 20, background: "linear-gradient(135deg,var(--ink2),var(--orange))", borderRadius: 12,
          padding: "20px 24px", textAlign: "center", color: "#fff"
        }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🎓</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 4 }}>Training Complete</div>
          <p style={{ fontSize: 13, opacity: .85, margin: 0 }}>You've completed all training modules. Well done!</p>
        </div>
      )}

    </div>
  );
}

function CoursesByGrade() {
  const [openCourse, setOpenCourse] = useState(null);
  const toggle = (key) => setOpenCourse(o => o === key ? null : key);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {GRADES.map(g => (
        <div key={g.grade} style={{
          background: "var(--card)", borderRadius: 16, padding: "28px 32px",
          boxShadow: "0 2px 16px rgba(10,31,68,.07)", border: "1px solid var(--border)"
        }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#534AB7", marginBottom: 8 }}>{g.grade}</h3>
          <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 20, lineHeight: 1.65 }}>{g.desc}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {g.courses.map(c => {
              const tc = TYPE_COLORS[c.type] || TYPE_COLORS["Mandatory"];
              const key = g.grade + c.name;
              const isOpen = openCourse === key;
              return (
                <div key={c.name} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  <button onClick={() => toggle(key)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
                      background: isOpen ? tc.color : tc.bg,
                      border: `1px solid ${tc.border}`, borderRadius: isOpen ? "99px 99px 8px 8px" : 99,
                      fontSize: 13, color: isOpen ? "#fff" : tc.color, fontWeight: 600, cursor: "pointer",
                      transition: "all .2s"
                    }}>
                    {c.icon} {c.name}
                    {c.type === "Elective" && <span style={{ fontSize: 11, opacity: .75 }}>(Elective)</span>}
                    <span style={{ fontSize: 10, marginLeft: 2 }}>{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && c.about && (
                    <div style={{
                      background: tc.bg, border: `1px solid ${tc.border}`, borderTop: "none",
                      borderRadius: "0 0 12px 12px", padding: "12px 16px", maxWidth: 320,
                      fontSize: 13, color: tc.color.replace("B7", "66").replace("56", "44"), lineHeight: 1.7
                    }}>
                      {c.about}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HOME DEPARTMENT PAGE
───────────────────────────────────────────────────────────────── */
const GRADES = [
  {
    grade: "Grade 9", desc: "Grade 9 students begin their humanities journey with foundational business concepts and civic understanding.", courses: [
      { name: "Business", icon: "💼", type: "Mandatory", about: "Introduces students to the world of business through concepts such as entrepreneurship, supply and demand, market structures, and consumer behaviour. Students develop practical skills in financial literacy and basic economic decision-making." },
      { name: "Civics", icon: "⚖️", type: "Mandatory", about: "Explores the rights and responsibilities of citizens, the structure of government, and the principles of democracy. Students examine local, national, and global civic issues and develop skills in deliberation and informed participation. Civics is taught from Grade 1 through Grade 11 across the school." },
    ]
  },
  {
    grade: "Grade 10", desc: "Grade 10 expands understanding through world history and offers specialised electives in accounting and sociology.", courses: [
      { name: "World History", icon: "🌍", type: "Mandatory", about: "A survey of major civilisations, turning points, and global forces that have shaped the modern world. Students apply historical thinking skills — causation, continuity and change, perspective — to events from ancient empires through the 20th century." },
      { name: "Accounting", icon: "📊", type: "Elective", about: "Develops students' understanding of financial record-keeping, the accounting cycle, and business financial statements. Students learn to record transactions, prepare balance sheets, and interpret financial data for real-world decision-making." },
      { name: "Sociology", icon: "👥", type: "Elective", about: "Examines how society shapes individuals and how individuals shape society. Topics include socialisation, culture, identity, power structures, social inequality, and collective behaviour. Students apply sociological concepts to contemporary events and issues." },
      { name: "Civics", icon: "⚖️", type: "Mandatory", about: "Continues the school-wide Civics thread (G1–G11) with deeper examination of political institutions, democratic participation, and human rights. Students engage with real civic issues and develop argumentation and evidence-based discussion skills." },
    ]
  },
  {
    grade: "Grade 11", desc: "Grade 11 focuses on geographical understanding with optional marketing specialisation for career preparation.", courses: [
      { name: "Geography", icon: "🗺️", type: "Mandatory", about: "Develops spatial thinking and understanding of human-environment relationships. Students examine population patterns, urbanisation, migration, climate, and resource distribution — building skills in map analysis, data interpretation, and geographic inquiry." },
      { name: "Marketing", icon: "📈", type: "Elective", about: "Explores the principles of marketing including market research, consumer psychology, branding, digital marketing, and campaign strategy. Students apply real-world marketing frameworks and develop creative, data-driven projects." },
      { name: "Civics", icon: "⚖️", type: "Mandatory", about: "The capstone year of the school-wide Civics programme (G1–G11). Students investigate complex policy questions, global governance, and the role of institutions in protecting rights, culminating in evidence-based argument and civic action." },
    ]
  },
];

const PROGRAMS = [
  {
    name: "CAS MUN Club", icon: "🌐", color: "#534AB7", bg: "#EEEDFE",
    desc: "Students engage in diplomatic simulations through our Model United Nations program, developing public speaking, negotiation, and leadership skills while exploring global issues and international relations.",
    features: ["Weekly club meetings", "Regional MUN conferences", "Diplomatic skills training", "Research and debate practice"],
    led: null, link: "https://www.instagram.com/casmunclub", linkLabel: "@casmunclub"
  },
  {
    name: "CASVoice", icon: "🎙️", color: "#D85A30", bg: "#FAECE7",
    desc: "Our student-run broadcasting and media company where students create content, develop media literacy, and gain hands-on experience in video production and digital marketing.",
    features: ["Student-led media production", "Broadcasting and media", "Digital content creation", "Social media management"],
    led: null, link: "https://www.instagram.com/cas.voice", linkLabel: "@cas.voice"
  },
  {
    name: "CASUNITY", icon: "❤️", color: "#993556", bg: "#FBEAF0",
    desc: "A student-led movement to bring real change, one act of kindness at a time. Collecting donations, spreading love, and showing the power of unity.",
    features: ["Community service projects", "Donation drives and fundraising", "Acts of kindness initiatives", "Unity and social impact programs"],
    led: null, link: null, linkLabel: null
  },
  {
    name: "CAS Talks", icon: "🎤", color: "#0F6E56", bg: "#E1F5EE",
    desc: "CAS's own version of TED Talks, rooted in the Sociology course. Students research real-world social issues, craft compelling narratives, and deliver powerful talks that challenge assumptions and inspire change.",
    features: ["Student-led public talks", "Sociology-driven research", "Real-world social issues", "Public speaking and presentation skills"],
    led: null, link: null, linkLabel: null
  },
  {
    name: "CAS Contracts", icon: "🤝", color: "#185FA5", bg: "#E6F1FB",
    desc: "Students pitch their own entertainment business projects in front of a panel of judges. The winner signs a real contract and runs their event — generating actual revenue and delivering a live experience for the school community.",
    features: ["Student business pitches to a panel", "Real contract awarded to the winner", "Live event planning and execution", "Entrepreneurship and financial management"],
    led: null, link: null, linkLabel: null
  },
];

const FACULTY = [
  { name: "Mr. Osama Al Barrak", role: "Head of Department", roleColor: "#534AB7", subjects: "Business, Accounting, Marketing", email: "usama.barrak@cityamericanschool.ae", phone: "+971 50 556 5549", initials: "OB" },
  { name: "Mr. Mustafa Mousa", role: "History & Sociology", roleColor: "#1D9E75", subjects: "World History, Sociology", email: "m.mousa@cityamericanschool.ae", phone: "+971 52 511 2360", initials: "MM" },
  { name: "Mr. X", role: "Geography & MUN Leader", roleColor: "#534AB7", subjects: "Geography, CAS MUN Club", email: "x@cityamericanschool.ae", phone: "+971 55 123 4567", initials: "MX" },
  { name: "Mr. Muhammad Ajlony", role: "Civics Teacher", roleColor: "#E8650A", subjects: "Civics Education", email: "muhammad.ahmad@cityamericanschool.ae", phone: "", initials: "MA" },
  { name: "Ms. Bahija Hamdi", role: "Civics Teacher", roleColor: "#993556", subjects: "Civics Education", email: "b.hamdi@cityamericanschool.ae", phone: "", initials: "BH" },
];

const TYPE_COLORS = {
  "Mandatory": { bg: "#E1F5EE", color: "#0F6E56", border: "#9FE1CB" },
  "Elective": { bg: "#EEEDFE", color: "#534AB7", border: "#CECBF6" },
};

function HomeDeptPage() {
  return (
    <div style={{ fontFamily: "'Outfit',sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(135deg,#0A0A2E 0%,#1A1060 40%,#3D1A8C 70%,#6B2FA0 100%)",
        margin: "-28px -28px 0", padding: "80px 40px 70px", textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        <div style={{ position: "absolute", bottom: -80, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,.03)" }} />
        <div style={{ position: "absolute", top: 20, right: 80, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)",
          border: "1px solid rgba(255,255,255,.2)", borderRadius: 99, padding: "6px 16px",
          fontSize: 13, color: "rgba(255,255,255,.85)", marginBottom: 24
        }}>
          🎓 Humanities Department
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 900, color: "#fff",
          lineHeight: 1.1, margin: "0 0 20px", textShadow: "0 2px 20px rgba(0,0,0,.3)"
        }}>
          Shaping Tomorrow's<br />
          <span style={{ color: "#A78BFA" }}>Global Leaders</span>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,.75)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.75 }}>
          Empowering students through comprehensive humanities education that builds critical thinking, cultural awareness, and leadership skills for the 21st century.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#courses" onClick={e => { e.preventDefault(); document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" }) }} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px",
            background: "#7C3AED", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700,
            textDecoration: "none", transition: "opacity .18s"
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            📚 Explore Our Courses
          </a>
          <a href="#programs" onClick={e => { e.preventDefault(); document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" }) }} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px",
            background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.25)",
            borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
            🚀 View Programs
          </a>
        </div>
      </div>

      {/* ── STATS BAND ── */}
      <div style={{ background: "linear-gradient(135deg,#2D1B8C,#6B2FA0)", padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          {[["3", "Grade Levels"], ["8+", "Subject Areas"], ["5", "Expert Faculty"], ["5", "Active Programs"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: "#fff", fontWeight: 900 }}>{n}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 4, textTransform: "uppercase", letterSpacing: ".8px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div style={{ padding: "64px 0 48px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: "var(--ink)", marginBottom: 16 }}>Discover Our Department</h2>
        <p style={{ fontSize: 15, color: "var(--slate)", maxWidth: 680, margin: "0 auto", lineHeight: 1.8 }}>
          Our Humanities department is dedicated to providing students with a comprehensive understanding of the world. We equip them with critical thinking, creativity, and communication skills to thrive in a global society.
        </p>
      </div>

      {/* ── COURSES BY GRADE ── */}
      <div id="courses" style={{ paddingBottom: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "var(--ink)", marginBottom: 8 }}>Our Courses by Grade</h2>
          <div style={{ width: 56, height: 3, background: "#E8650A", borderRadius: 99, margin: "0 auto" }} />
        </div>
        <CoursesByGrade />
      </div>

      {/* ── FACULTY ── */}
      <div id="faculty" style={{ paddingBottom: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "var(--ink)", marginBottom: 8 }}>Meet Our Faculty</h2>
          <div style={{ width: 56, height: 3, background: "#E8650A", borderRadius: 99, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {FACULTY.map(f => (
            <div key={f.name} style={{
              background: "var(--card)", borderRadius: 16, padding: "28px 24px",
              boxShadow: "0 2px 16px rgba(10,31,68,.07)", border: "1px solid var(--border)", textAlign: "center"
            }}>
              {/* Avatar circle */}
              <div style={{
                width: 72, height: 72, borderRadius: "50%", background: `${f.roleColor}22`,
                border: `3px solid ${f.roleColor}44`, display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 16px", fontSize: 22, fontWeight: 700, color: f.roleColor
              }}>
                {f.initials}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>{f.name}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: f.roleColor, marginBottom: 6 }}>{f.role}</div>
              <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14 }}>{f.subjects}</div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 5 }}>
                <a href={`mailto:${f.email}`} style={{
                  fontSize: 12, color: "var(--ink2)", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5
                }}>
                  ✉ {f.email}
                </a>
                {f.phone && <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  📞 {f.phone}
                </div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROGRAMS ── */}
      <div id="programs" style={{ paddingBottom: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "var(--ink)", marginBottom: 8 }}>Programs & Activities</h2>
          <div style={{ width: 56, height: 3, background: "#E8650A", borderRadius: 99, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {PROGRAMS.map(p => (
            <div key={p.name} style={{
              background: "var(--card)", borderRadius: 16, padding: "28px 24px",
              boxShadow: "0 2px 16px rgba(10,31,68,.07)", border: "1px solid var(--border)"
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%", background: p.bg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14
              }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 10 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.7, marginBottom: 14 }}>{p.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#1D9E75", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700,
                    color: p.color, textDecoration: "none"
                  }}>
                  📷 Follow {p.linkLabel} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function QuizLesson({ lesson, done, onComplete }) {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const qs = lesson.questions;
  const q = qs[cur];
  const chosen = answers[cur];
  const isAnswered = chosen !== undefined;
  const score = Object.entries(answers).filter(([i, a]) => qs[parseInt(i)].correct === a).length;
  const pass = score >= Math.ceil(qs.length * 0.75);

  if (submitted) {
    return (
      <div className="qresult">
        <div className="qresult-score" style={{ color: pass ? "var(--orange)" : "var(--rose)" }}>{score}/{qs.length}</div>
        <h3>{pass ? "🎉 Passed!" : "Keep going — almost there"}</h3>
        <p>{pass ? "Great work — you scored " + score + " out of " + qs.length + ". Mastery demonstrated." : "You need " + Math.ceil(qs.length * 0.75) + " correct to pass. Review the content and try again."}</p>
        <div className="qresult-btns">
          {!pass && <button className="btn-ghost" onClick={() => { setSubmitted(false); setAnswers({}); setCur(0); }}>↺ Retry Quiz</button>}
          {pass && !done && <button className="btn-success" onClick={onComplete}>Continue to Next Lesson →</button>}
          {pass && done && <button className="btn-success" disabled>✓ Already Completed</button>}
        </div>
      </div>
    );
  }

  const select = (oi) => { if (!isAnswered) setAnswers(a => ({ ...a, [cur]: oi })); };

  return (
    <div className="q-wrap">
      <div className="q-dots">{qs.map((_, i) => <div key={i} className={"q-dot" + (i < cur ? " done" : i === cur ? " cur" : "")} />)}</div>
      <div className="q-txt">{q.q}</div>
      {q.sub && <div className="q-sub">{q.sub}</div>}
      <div className="q-opts">
        {q.opts.map((opt, oi) => {
          let cls = "q-opt";
          if (isAnswered) { if (oi === q.correct) cls += " right"; else if (oi === chosen) cls += " wrong"; }
          let rc = "";
          if (isAnswered && oi === q.correct) rc = " r-ok";
          else if (isAnswered && oi === chosen && chosen !== q.correct) rc = " r-no";
          else if (chosen === oi) rc = " filled";
          return (
            <button key={oi} className={cls} onClick={() => select(oi)} disabled={isAnswered}>
              <div className={"q-radio" + rc}>{isAnswered && oi === q.correct ? "✓" : isAnswered && oi === chosen && chosen !== q.correct ? "✗" : ""}</div>
              <div className="q-opt-txt">{opt}</div>
            </button>
          );
        })}
      </div>
      {isAnswered && <div className="q-explain"><b>{chosen === q.correct ? "✓ Correct — " : "✗ Not quite — "}</b>{q.explain}</div>}
      <div style={{ display: "flex", gap: 9 }}>
        {cur > 0 && <button className="btn-ghost" onClick={() => setCur(c => c - 1)}>← Previous</button>}
        {cur < qs.length - 1 && isAnswered && <button className="btn-primary" onClick={() => setCur(c => c + 1)}>Next Question →</button>}
        {cur === qs.length - 1 && Object.keys(answers).length === qs.length && <button className="btn-primary" onClick={() => setSubmitted(true)}>Submit Quiz</button>}
      </div>
    </div>
  );
}

function ScenarioLesson({ lesson, done, onComplete }) {
  const [cIdx, setCIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [allDone, setAllDone] = useState(false);
  const cases = lesson.scenario.cases;
  const c = cases[cIdx];
  const choose = (oi) => { if (chosen !== null) return; setChosen(oi); };
  const next = () => { if (cIdx < cases.length - 1) { setCIdx(i => i + 1); setChosen(null); } else setAllDone(true); };

  if (allDone) {
    return (
      <div className="qresult">
        <div style={{ fontSize: 44, marginBottom: 7 }}>🏆</div>
        <h3>Scenario Practice Complete!</h3>
        <p>You have worked through all {cases.length} scenarios. These represent real classroom decisions you will encounter.</p>
        <div className="qresult-btns">
          {!done && <button className="btn-success" onClick={onComplete}>Continue →</button>}
          {done && <button className="btn-success" disabled>✓ Completed</button>}
        </div>
      </div>
    );
  }

  return (
    <>
      <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12, fontWeight: 600 }}>Scenario {cIdx + 1} of {cases.length}</p>
      <div className="scenario-card"><h4>📋 Situation</h4><p>{c.setup}</p></div>
      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>{c.question}</p>
      <div className="choice-grid">
        {c.options.map((opt, oi) => {
          let cls = "choice-btn";
          if (chosen !== null) { if (oi === c.correct) cls += " correct"; else if (oi === chosen && chosen !== c.correct) cls += " wrong"; }
          return (
            <button key={oi} className={cls} onClick={() => choose(oi)} disabled={chosen !== null}>
              <div className="choice-lbl">Option {opt.label}</div>
              <div className="choice-txt">{opt.text}</div>
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <>
          <div className={"fb-box" + (chosen === c.correct ? " fb-ok" : " fb-no")}><b>{chosen === c.correct ? "✓ Correct — " : "✗ Not the strongest answer — "}</b>{c.feedback}</div>
          <button className="btn-primary" onClick={next}>{cIdx < cases.length - 1 ? "Next Scenario →" : "Finish Scenarios"}</button>
        </>
      )}
    </>
  );
}

function DragLesson({ lesson, done, onComplete }) {
  const [items, setItems] = useState(() => [...lesson.drag.items].sort(() => Math.random() - 0.5));
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const correct = items.every((item, i) => item.order === i);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = (i) => {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setItems(next);
    setDragIdx(null); setOverIdx(null);
  };

  return (
    <>
      <div className="intro-box">{lesson.drag.instruction}</div>
      <div className="drag-list">
        {items.map((item, i) => (
          <div key={item.id} className={"drag-item" + (overIdx === i ? " over" : "")} draggable
            onDragStart={() => onDragStart(i)} onDragOver={(e) => onDragOver(e, i)} onDrop={() => onDrop(i)} onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}>
            <span className="drag-handle">⠿</span>
            <div className="drag-num">{i + 1}</div>
            <div className="drag-txt">{item.text}</div>
          </div>
        ))}
      </div>
      {!checked ? (
        <div style={{ display: "flex", gap: 9 }}>
          <button className="btn-primary" onClick={() => setChecked(true)}>Check My Order</button>
          <button className="btn-ghost" onClick={() => { setItems([...lesson.drag.items].sort(() => Math.random() - 0.5)); setChecked(false); }}>Shuffle Again</button>
        </div>
      ) : (
        <>
          <div className={(correct ? " fb-ok" : " fb-no") + " fb-box"} style={{ padding: "12px 15px", borderRadius: 9, marginBottom: 12, fontSize: 13 }}>
            {correct ? <span><b>✓ Correct order!</b> {lesson.drag.correctFeedback}</span> : <span><b>✗ Not quite right.</b> Try reordering and check again.</span>}
          </div>
          {!correct && <button className="btn-ghost" style={{ marginBottom: 10 }} onClick={() => setChecked(false)}>Try Again</button>}
          {correct && !done && <button className="complete-btn" onClick={onComplete}>Mark as Complete and Continue</button>}
          {correct && done && <button className="complete-btn done" disabled>✓ Completed</button>}
        </>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PLAN DAY VIEW (preview before approve)
───────────────────────────────────────────────────────────────── */
function PlanDayView({ lesson }) {
  if (!lesson) return null;
  return (
    <div className="plan-body">
      <div style={{ marginBottom: 12 }}>
        <div className="tpl-lbl">Lesson Objective</div>
        <div className="fe-txt">{lesson.lessonObjective}</div>
      </div>
      {[["engage", "Engage"], ["explore", "Explore"], ["explain", "Explain"], ["elaborate", "Elaborate"], ["evaluate", "Evaluate"]].map(([k, l]) => (
        <div key={k} className="fe-row">
          <div className="fe-badge" style={{ background: FE_COLORS[k] }}>{l}</div>
          <div className="fe-txt">{lesson[k]}</div>
        </div>
      ))}
      <div style={{ marginTop: 12 }}>
        <div className="tpl-lbl" style={{ marginBottom: 7 }}>Differentiation</div>
        <div className="diff-grid">
          {[["SEN", lesson.differentiation && lesson.differentiation.sen], ["LA", lesson.differentiation && lesson.differentiation.la], ["MA", lesson.differentiation && lesson.differentiation.ma], ["HA", lesson.differentiation && lesson.differentiation.ha], ["G&T", lesson.differentiation && lesson.differentiation.gt]].map(([k, v]) => (
            <div key={k} className="diff-col"><div className="diff-hd">{k}</div><div className="diff-body">{v || "—"}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FILLED TEMPLATE — editable
───────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────
   ORIENTATION TAB — New Staff Journey
───────────────────────────────────────────────────────────────── */
const WEEKLY_SCHEME_LINK = "https://cityamericanschoolae-my.sharepoint.com/:f:/g/personal/r_hijazeen_cityamericanschool_ae/IgDzo5eVithwSZpCWy-gvatzAZ4iqY1FPl9fFgyFOzSYqOU?e=TY7GJq";
const HUMANITIES_LINK = "https://cityamericanschoolae-my.sharepoint.com/:f:/g/personal/r_hijazeen_cityamericanschool_ae/IgDnngJDecZWS5cqMk-2pm_PAT0_ujfyue11rbH3vXBDEk4?e=VP84mU";


function MediaLesson({ lesson, done, onComplete, teacherId }) {
  const m = lesson.media;
  const isVideo = m.type === "video";
  const [reflection, setReflection] = useState("");
  return (
    <>
      <div className="intro-box">{m.description}</div>
      <div style={{ background: "var(--card)", border: "2px solid var(--border)", borderRadius: 11, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ background: isVideo ? "var(--ink2)" : "#E8650A", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{isVideo ? "🎬" : "🎧"}</span>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{isVideo ? "Video Training Material" : "Audio Podcast"} · Uploaded by HOD</div>
          </div>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 48 }}>{isVideo ? "🎬" : "🎧"}</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", textAlign: "center" }}>{m.label}</div>
          <div style={{ fontSize: 13, color: "var(--slate)", textAlign: "center", maxWidth: 420, lineHeight: 1.6 }}>
            {isVideo ? "Click below to open the training video in a new tab. Watch it fully before marking this lesson complete." : "Click below to open the podcast in a new tab. Listen to the full episode before marking this lesson complete."}
          </div>
          <a href={isVideo ? "https://drive.google.com/file/d/1zFTKy3qNWW4Paabc_hVvOjkoijHiOrg4/view" : "https://drive.google.com/file/d/1kQ8IO-Gj0F-uAVbB_bS1QhPOw_V1D-jW/view"}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "12px 28px", background: "linear-gradient(135deg,var(--ink2),var(--sky))", color: "#fff", borderRadius: 9, fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 14px rgba(30,58,95,.25)" }}>
            {isVideo ? "▶ Open Video in Google Drive" : "🎧 Open Podcast in Google Drive"}
          </a>
          <div style={{ fontSize: 11, color: "var(--slate)", opacity: .7 }}>Opens in a new tab · Google Drive</div>
        </div>
      </div>
      {m.note && (
        <div style={{ background: "var(--orange-pale)", border: "1px solid #F0A060", borderRadius: 9, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--orange)", marginBottom: 8 }}>📝 Reflection Question</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12, lineHeight: 1.5 }}>{m.note}</p>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="Write your answer here…"
            rows={3}
            style={{ width: "100%", padding: "10px 12px", border: "2px solid #F0A060", borderRadius: 8, fontSize: 13, color: "var(--ink)", lineHeight: 1.6, resize: "vertical", fontFamily: "'Outfit',sans-serif", background: "#fff" }}
          />
          {reflection.trim().length > 0 && (
            <div style={{ fontSize: 11, color: "var(--orange)", marginTop: 5, fontWeight: 600 }}>✓ Reflection written — you can now mark this lesson complete.</div>
          )}
        </div>
      )}
      <button className={"complete-btn" + (done ? " done" : "")} onClick={!done ? async () => {
        if (m.note && reflection.trim() && teacherId) {
          try {
            const { error } = await supabase
              .from('reflections')
              .insert([{
                teacher_id: teacherId,     // Note: using snake_case to match SQL
                lesson_id: lesson.id,
                lesson_title: lesson.title,
                question: m.note,
                answer: reflection.trim(),
                timestamp: new Date().toISOString()
              }]);

            if (error) console.error("Error saving reflection:", error);
          } catch { }
        }
        onComplete();
      } : undefined} disabled={!done && m.note && reflection.trim().length === 0}>
        {done ? "✓ Completed" : m.note && reflection.trim().length === 0 ? "Write your reflection to continue" : "Mark as Complete and Continue"}
      </button>
    </>
  );
}


function AdminLogin({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const attempt = () => { if (pwd === ADMIN_PWD) onLogin(); else setErr("Incorrect password."); };
  return (
    <div style={{ maxWidth: 400, margin: "56px auto" }}>
      <div style={{ background: "var(--card)", borderRadius: "var(--r)", boxShadow: "var(--sh)", padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🏛️</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "var(--ink)", marginBottom: 7 }}>HOD Dashboard</h2>
        <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 22 }}>Restricted to Head of Department. Add/remove teachers and courses, and track team training progress.</p>
        {err && <div style={{ color: "var(--rose)", fontSize: 13, marginBottom: 8 }}>{err}</div>}
        <input type="password" placeholder="Admin password" value={pwd}
          onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()}
          style={{ width: "100%", padding: "10px 13px", border: "2px solid var(--border)", borderRadius: 8, fontSize: 14, marginBottom: 11, color: "var(--ink)" }} />
        <button onClick={attempt} style={{ width: "100%", padding: 12, background: "var(--ink2)", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Access Dashboard</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ADMIN DASHBOARD
───────────────────────────────────────────────────────────────── */
function AdminDash({ teachers, saveTeachers, courses, saveCourses, notify }) {
  const [adminTab, setAdminTab] = useState("teachers");
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [delTeacherId, setDelTeacherId] = useState(null);
  const [delCourseId, setDelCourseId] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [editTeacher, setEditTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ name: "", subject: "AP Economics", role: "New Joiner", email: "", courses: [] });
  const [courseForm, setCourseForm] = useState({ name: "", icon: "📚", description: "" });

  const certCount = teachers.filter(t => teacherPct(t) === 100).length;
  const inProg = teachers.filter(t => { const p = teacherPct(t); return p > 0 && p < 100; }).length;
  const notStarted = teachers.filter(t => teacherPct(t) === 0).length;
  const avg = teachers.length ? Math.round(teachers.reduce((a, t) => a + teacherPct(t), 0) / teachers.length) : 0;

  const addTeacher = async () => {
    if (!teacherForm.name.trim() || !teacherForm.email.trim()) return;

    let updatedList;
    if (editTeacher) {
      updatedList = teachers.map(t => t.id === editTeacher.id ?
        { ...t, name: teacherForm.name.trim(), subject: teacherForm.subject, role: teacherForm.role, email: teacherForm.email.trim(), courses: teacherForm.courses }
        : t
      );
      notify("✓ Teacher updated");
    } else {
      const nt = {
        id: "t" + Date.now(),
        name: teacherForm.name.trim(),
        email: teacherForm.email.trim(),
        subject: teacherForm.subject,
        role: teacherForm.role,
        joined: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
        courses: teacherForm.courses,
        progress: {}
      };
      updatedList = [...teachers, nt];
      notify("✓ Teacher added");
    }

    // This sends the update to your Supabase 'teachers' table
    await saveTeachers(updatedList);

    setShowTeacherModal(false);
    setEditTeacher(null);
    setTeacherForm({ name: "", subject: "AP Economics", role: "New Joiner", email: "", courses: [] });
  };

  const removeTeacher = (id) => { saveTeachers(teachers.filter(t => t.id !== id)); setDelTeacherId(null); notify("Teacher removed"); };

  const addCourse = async () => {
    if (!courseForm.name.trim()) return;

    let updatedList;
    if (editCourse) {
      updatedList = courses.map(c => c.id === editCourse.id ? {
        ...c,
        name: courseForm.name,
        icon: courseForm.icon,
        description: courseForm.description // Force-mapping this name
      } : c);
      notify("✓ Course updated");
    } else {
      const nc = {
        id: "c" + Date.now(),
        name: courseForm.name,
        icon: courseForm.icon,
        description: courseForm.description // Force-mapping this name
      };
      updatedList = [...courses, nc];
      notify("✓ Course added");
    }

    // This sends the update to your Supabase 'courses' table
    await saveCourses(updatedList);

    setShowCourseModal(false);
    setCourseForm({ name: "", icon: "📚", description: "" });
    setEditCourse(null);
  };

  const removeCourse = (id) => { saveCourses(courses.filter(c => c.id !== id)); setDelCourseId(null); notify("Course removed"); };

  const toggleTeacherCourse = (cid) => {
    const cur = teacherForm.courses;
    setTeacherForm(f => ({ ...f, courses: cur.includes(cid) ? cur.filter(x => x !== cid) : [...cur, cid] }));
  };

  const redT = teachers.filter(t => teacherPct(t) === 0);
  const amberT = teachers.filter(t => { const p = teacherPct(t); return p > 0 && p < 50; });
  const greenT = teachers.filter(t => teacherPct(t) >= 50 && teacherPct(t) < 100);

  return (
    <div className="adash">
      <div className="sec-hd" style={{ marginBottom: 4 }}>HOD Dashboard</div>
      <p className="sec-sub">Manage teachers, courses, and track department training progress.</p>

      <div className="stat-row">
        {[[certCount, "Certified", "var(--orange)"], [inProg, "In Progress", "var(--orange)"], [notStarted, "Not Started", "var(--rose)"], [avg + "%", "Dept. Average", "var(--ink2)"]].map(([n, l, c]) => (
          <div key={l} className="stat-c"><div className="stat-n" style={{ color: c }}>{n}</div><div className="stat-l">{l}</div></div>
        ))}
      </div>

      {/* ADMIN TABS */}
      <div style={{ display: "flex", gap: 6, background: "var(--card)", padding: 6, borderRadius: 10, boxShadow: "var(--sh)" }}>
        {[["teachers", "👩‍🏫 Teachers"], ["courses", "📚 Courses"], ["recs", "💡 Recommendations"], ["reflections", "📝 Reflections"]].map(([t, l]) => (
          <button key={t} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: adminTab === t ? "var(--ink2)" : "transparent", color: adminTab === t ? "#fff" : "var(--slate)", transition: "all .18s" }} onClick={() => setAdminTab(t)}>{l}</button>
        ))}
      </div>

      {/* TEACHERS TABLE */}
      {adminTab === "teachers" && (
        <div className="panel">
          <div className="panel-hd">
            <h3>Team Members ({teachers.length})</h3>
            <button className="add-btn" onClick={() => setShowTeacherModal(true)}>+ Add Teacher</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr>
                <th>Teacher</th><th>Subject</th><th>Role</th><th>Courses</th><th>Overall</th>
                {MODULES.map(m => <th key={m.id}>{m.icon} {m.title.split(" ")[0]}</th>)}
                <th>Status</th><th></th>
              </tr></thead>
              <tbody>
                {teachers.map(t => {
                  const pct = teacherPct(t);
                  const status = pct === 100 ? "done" : pct > 0 ? "prog" : t.role === "New Joiner" ? "new" : "ns";
                  const statusLabel = pct === 100 ? "Certified" : pct > 0 ? "In Progress" : t.role === "New Joiner" ? "New Joiner" : "Not Started";
                  const tCourses = (t.courses || []).map(cid => courses.find(c => c.id === cid)).filter(Boolean);
                  return (
                    <tr key={t.id}>
                      <td><div style={{ fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 11, color: "var(--slate)" }}>{t.email}</div></td>
                      <td style={{ fontSize: 12 }}>{t.subject}</td>
                      <td><span className={"sb " + (t.role === "New Joiner" ? "sb-new" : "sb-prog")}>{t.role}</span></td>
                      <td><div className="tag-row">{tCourses.length > 0 ? tCourses.map(c => <span key={c.id} className="course-tag">{c.icon} {c.name}</span>) : <span style={{ fontSize: 12, color: "var(--slate)" }}>None assigned</span>}</div></td>
                      <td><div className="minibar"><div className="mb-o"><div className="mb-i" style={{ width: pct + "%", background: pct === 100 ? "var(--orange)" : "linear-gradient(90deg,var(--ink2),var(--sky))" }} /></div><div className="mb-p">{pct}%</div></div></td>
                      {MODULES.map(m => {
                        const md = t.progress[m.id] || 0;
                        const mt = m.lessons.length;
                        const mp = Math.round((md / mt) * 100);
                        return <td key={m.id}><div className="minibar"><div className="mb-o"><div className="mb-i" style={{ width: mp + "%", background: mp === 100 ? "var(--orange)" : "var(--ink2)" }} /></div><div className="mb-p">{mp}%</div></div></td>;
                      })}
                      <td><span className={"sb sb-" + status}>{statusLabel}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button style={{ padding: "3px 9px", border: "1px solid var(--border)", background: "var(--sky-pale)", color: "var(--ink2)", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }} onClick={() => { setEditTeacher(t); setTeacherForm({ name: t.name, subject: t.subject, role: t.role, email: t.email, courses: t.courses || [] }); setShowTeacherModal(true); }}>Edit</button>
                          <button className="btn-danger" onClick={() => setDelTeacherId(t.id)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COURSES */}
      {adminTab === "courses" && (
        <div className="panel">
          <div className="panel-hd">
            <h3>Courses ({courses.length})</h3>
            <button className="add-btn" onClick={() => { setCourseForm({ name: "", icon: "📚", description: "" }); setEditCourse(null); setShowCourseModal(true); }}>+ Add Course</button>
          </div>
          <div className="courses-grid">
            {courses.map(c => (
              <div key={c.id} className="course-card">
                <div className="course-card-hd">
                  <span className="course-icon">{c.icon}</span>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button style={{ padding: "3px 9px", border: "1px solid var(--border)", background: "var(--sky-pale)", color: "var(--ink2)", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }} onClick={() => { setCourseForm({ name: c.name, icon: c.icon, description: c.description }); setEditCourse(c); setShowCourseModal(true); }}>Edit</button>
                    <button className="btn-danger" style={{ padding: "3px 9px", fontSize: 11 }} onClick={() => setDelCourseId(c.id)}>Remove</button>
                  </div>
                </div>
                <h4>{c.name}</h4>
                <p>{c.description}</p>
                <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 6 }}>
                  {teachers.filter(t => (t.courses || []).includes(c.id)).length} teacher(s) assigned
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {adminTab === "recs" && (
        <div className="panel">
          <div className="panel-hd"><h3>HOD Recommendations</h3></div>
          {redT.length === 0 && amberT.length === 0 && greenT.length === 0
            ? <div style={{ padding: 24, textAlign: "center", color: "var(--slate)", fontSize: 14 }}>🎉 All teachers have started or completed their training. Great work!</div>
            : <div className="rec-list">
              {redT.length > 0 && <div className="rec-card rec-red"><span className="rec-icon">🔴</span><div className="rec-body"><h4>Needs Onboarding</h4><p>{redT.map(t => t.name).join(", ")} — has not started any module. Schedule a 1:1 this week to walk through Module 1 together and remove any barriers.</p></div></div>}
              {amberT.length > 0 && <div className="rec-card rec-amber"><span className="rec-icon">🟡</span><div className="rec-body"><h4>Early Progress — Check In</h4><p>{amberT.map(t => t.name).join(", ")} — under 50% complete. Raise in the next team meeting and ask what questions they have.</p></div></div>}
              {greenT.length > 0 && <div className="rec-card rec-green"><span className="rec-icon">🟢</span><div className="rec-body"><h4>Strong Progress — Encourage Completion</h4><p>{greenT.map(t => t.name).join(", ")} — over 50% complete. Acknowledge progress publicly and encourage them to use the Lesson Generator with their next unit.</p></div></div>}
            </div>
          }
        </div>
      )}

      {/* REFLECTIONS PANEL */}
      {adminTab === "reflections" && (
        <AdminReflectionsPanel teachers={teachers} />
      )}

      {/* ADD/EDIT TEACHER MODAL */}
      {showTeacherModal && (
        <div className="overlay">
          <div className="modal">
            <h3>{editTeacher ? "Edit Teacher" : "Add New Teacher"}</h3>
            <p>{editTeacher ? "Update this teacher's details below. Training progress is not affected." : "The teacher will be added with no training progress and will complete modules sequentially."}</p>
            <div className="fg"><label>Full Name *</label><input placeholder="e.g. Ahmed Al-Mansouri" value={teacherForm.name} onChange={e => setTeacherForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="fg"><label>Email *</label><input placeholder="e.g. a.almansouri@cas.ae" value={teacherForm.email} onChange={e => setTeacherForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="fg"><label>Subject / Department</label><input placeholder="e.g. AP Economics" value={teacherForm.subject} onChange={e => setTeacherForm(f => ({ ...f, subject: e.target.value }))} /></div>
            <div className="fg"><label>Role</label>
              <select value={teacherForm.role} onChange={e => setTeacherForm(f => ({ ...f, role: e.target.value }))}>
                <option>New Joiner</option><option>Current</option>
              </select>
            </div>
            <div className="fg">
              <label>Assign Courses</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {courses.map(c => (
                  <button key={c.id} style={{ padding: "4px 10px", border: "2px solid", borderColor: teacherForm.courses.includes(c.id) ? "var(--ink2)" : "var(--border)", background: teacherForm.courses.includes(c.id) ? "var(--sky-pale)" : "#fff", color: "var(--ink)", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }} onClick={() => toggleTeacherCourse(c.id)}>
                    {c.icon} {c.name} {teacherForm.courses.includes(c.id) ? "✓" : ""}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-btns">
              <button className="btn-ghost" onClick={() => { setShowTeacherModal(false); setEditTeacher(null); setTeacherForm({ name: "", subject: "AP Economics", role: "New Joiner", email: "", courses: [] }); }}>Cancel</button>
              <button className="btn-primary" onClick={addTeacher} disabled={!teacherForm.name || !teacherForm.email}>{editTeacher ? "Save Changes" : "Add Teacher"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT COURSE MODAL */}
      {showCourseModal && (
        <div className="overlay">
          <div className="modal">
            <h3>{editCourse ? "Edit Course" : "Add New Course"}</h3>
            <p>{editCourse ? "Update the course details below." : "Add a new course to the department. It will appear in the Lesson Generator subject list and teacher profiles."}</p>
            <div className="fg"><label>Course Name *</label><input placeholder="e.g. AP Psychology" value={courseForm.name} onChange={e => setCourseForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="fg"><label>Icon (emoji)</label><input placeholder="e.g. 🧠" value={courseForm.icon} onChange={e => setCourseForm(f => ({ ...f, icon: e.target.value }))} /></div>
            <div className="fg"><label>Description</label><input placeholder="Short description of the course" value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div className="modal-btns">
              <button className="btn-ghost" onClick={() => { setShowCourseModal(false); setEditCourse(null); }}>Cancel</button>
              <button className="btn-primary" onClick={addCourse} disabled={!courseForm.name}>{editCourse ? "Save Changes" : "Add Course"}</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TEACHER CONFIRM */}
      {delTeacherId && (
        <div className="overlay">
          <div className="modal">
            <h3>Remove Teacher</h3>
            <p>Are you sure you want to remove <b>{(teachers.find(t => t.id === delTeacherId) || {}).name}</b>? Their progress data will be deleted permanently.</p>
            <div className="modal-btns">
              <button className="btn-ghost" onClick={() => setDelTeacherId(null)}>Cancel</button>
              <button style={{ padding: "10px 20px", background: "var(--rose)", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={() => removeTeacher(delTeacherId)}>Remove Teacher</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE COURSE CONFIRM */}
      {delCourseId && (
        <div className="overlay">
          <div className="modal">
            <h3>Remove Course</h3>
            <p>Are you sure you want to remove <b>{(courses.find(c => c.id === delCourseId) || {}).name}</b>? It will be removed from all teacher profiles and the Lesson Generator.</p>
            <div className="modal-btns">
              <button className="btn-ghost" onClick={() => setDelCourseId(null)}>Cancel</button>
              <button style={{ padding: "10px 20px", background: "var(--rose)", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={() => removeCourse(delCourseId)}>Remove Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
