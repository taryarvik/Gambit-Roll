:root{
  --bg0:#06030a;
  --bg1:#0b0613;
  --panel0:#140a1f;
  --panel1:#0f0718;

  --ink:#f5efff;
  --muted:#b9a8dc;
  --muted2:#8f7fb4;

  --gold:#e9c981;
  --gold2:#b8892f;

  --rune:#a855f7;
  --rune2:#6d28d9;

  --edge:#3b1d63;
  --edge2:#24113e;

  --ok:#34d399;
  --danger:#fb7185;
}

*{ box-sizing:border-box; }
html, body{ height:100%; }
body{
  margin:0;
  color:var(--ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
  background: linear-gradient(180deg, var(--bg1), var(--bg0));
}

.app-shell{
  min-height:100vh;
  position:relative;
  overflow:hidden;
  padding: 18px;
  background:
    radial-gradient(1200px 700px at 50% -10%, rgba(168,85,247,.22), transparent 60%),
    radial-gradient(900px 600px at 85% 90%, rgba(109,40,217,.16), transparent 60%),
    radial-gradient(700px 500px at 10% 80%, rgba(168,85,247,.10), transparent 60%),
    linear-gradient(180deg, var(--bg1), var(--bg0));
}

@media (min-width: 640px){
  .app-shell{ padding: 26px; }
}

.arcane-vignette{
  position:absolute; inset:-2px;
  pointer-events:none;
  background: radial-gradient(circle at 50% 40%, transparent 35%, rgba(0,0,0,.55) 75%, rgba(0,0,0,.85) 100%);
  mix-blend-mode:multiply;
  z-index:1;
}
.arcane-grain{
  position:absolute; inset:0;
  pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E");
  opacity:.22;
  mix-blend-mode:overlay;
  z-index:2;
}
.arcane-smoke{
  position:absolute;
  inset:-40%;
  pointer-events:none;
  background:
    radial-gradient(closest-side at 30% 30%, rgba(168,85,247,.18), transparent 60%),
    radial-gradient(closest-side at 70% 40%, rgba(109,40,217,.14), transparent 62%),
    radial-gradient(closest-side at 55% 70%, rgba(168,85,247,.12), transparent 65%);
  filter: blur(18px) saturate(120%);
  opacity:.55;
  z-index:0;
  transform: translate3d(0,0,0);
  animation: smokeFloat 20s ease-in-out infinite;
}
.arcane-smoke.s2{
  opacity:.35;
  filter: blur(28px) saturate(120%);
  animation-duration: 28s;
  animation-direction: reverse;
}
.arcane-smoke.s3{
  opacity:.25;
  filter: blur(38px) saturate(120%);
  animation-duration: 36s;
}
@keyframes smokeFloat{
  0%{ transform: translate(-2%, -1%) scale(1.05) rotate(0deg); }
  50%{ transform: translate(2%, 2%) scale(1.10) rotate(7deg); }
  100%{ transform: translate(-2%, -1%) scale(1.05) rotate(0deg); }
}

.header{
  position:relative;
  z-index:3;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:14px;
  margin: 6px 0 16px;
  user-select:none;
}
.title{
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--ink);
  text-shadow: 0 0 6px rgba(168,85,247,.45), 0 0 18px rgba(109,40,217,.35);
  font-size: clamp(26px, 4vw, 44px);
  line-height:1.1;
  text-align:center;
}
.subtitle{
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  letter-spacing: .28em;
  color: var(--muted);
  font-size: 11px;
  text-transform: uppercase;
  margin-top:4px;
  text-align:center;
}
.sigil{
  width:44px;height:44px;
  border-radius:14px;
  background: radial-gradient(circle at 30% 30%, rgba(233,201,129,.35), rgba(168,85,247,.18) 55%, rgba(0,0,0,.35));
  border:1px solid rgba(233,201,129,.35);
  box-shadow: inset 0 0 22px rgba(168,85,247,.22), 0 0 18px rgba(168,85,247,.22);
  display:flex;align-items:center;justify-content:center;
}

.frame{
  position:relative;
  z-index:3;
  background: linear-gradient(145deg, rgba(20,10,31,.92), rgba(12,6,20,.92));
  border:1px solid rgba(233,201,129,.18);
  box-shadow: 0 0 0 1px rgba(59,29,99,.55), 0 12px 35px rgba(0,0,0,.55), inset 0 0 40px rgba(168,85,247,.10);
  border-radius: 22px;
  padding: 14px;
}
.panel{
  background: linear-gradient(145deg, rgba(18,8,28,.92), rgba(10,5,17,.92));
  border:1px solid rgba(59,29,99,.65);
  box-shadow: inset 0 0 30px rgba(168,85,247,.10), 0 0 22px rgba(0,0,0,.35);
  border-radius: 22px;
  padding: 14px;
}
.panel-inner{
  border-radius: 18px;
  border:1px solid rgba(233,201,129,.12);
  background: linear-gradient(180deg, rgba(0,0,0,.30), rgba(0,0,0,.05));
  padding: 12px;
}
.ruleline{
  height:1px;
  background: linear-gradient(90deg, transparent, rgba(233,201,129,.28), rgba(168,85,247,.22), transparent);
  margin: 12px 0;
}

.row{ display:flex; gap:10px; flex-wrap:wrap; }
.grid-2{ display:grid; gap:12px; grid-template-columns: 1fr; }
.grid-3{ display:grid; gap:12px; grid-template-columns: 1fr; }
@media (min-width: 980px){
  .grid-2{ grid-template-columns: 1fr 1fr; }
  .grid-3{ grid-template-columns: 1fr 1fr 1fr; }
}

.btn{
  background: linear-gradient(145deg, rgba(46,20,74,.9), rgba(22,10,36,.9));
  border:1px solid rgba(168,85,247,.55);
  color: var(--ink);
  box-shadow: 0 0 0 1px rgba(59,29,99,.55), inset 0 0 18px rgba(168,85,247,.12);
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
  border-radius: 14px;
  padding: 10px 12px;
  cursor:pointer;
}
.btn:hover{
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px rgba(233,201,129,.22), 0 0 18px rgba(168,85,247,.30), inset 0 0 22px rgba(168,85,247,.18);
  filter: brightness(1.05);
}
.btn:active{ transform: translateY(0px) scale(.99); }
.btn:disabled{
  opacity:.55;
  cursor:not-allowed;
  transform:none;
  filter:none;
}

.btn-gold{
  background: linear-gradient(145deg, rgba(233,201,129,.25), rgba(184,137,47,.12));
  border:1px solid rgba(233,201,129,.45);
}
.btn-ghost{
  background: rgba(0,0,0,.18);
  border:1px solid rgba(59,29,99,.55);
  color: var(--muted);
}
.btn-danger{
  background: linear-gradient(145deg, rgba(251,113,133,.18), rgba(0,0,0,.25));
  border:1px solid rgba(251,113,133,.35);
}

.input, .select, .textarea{
  width:100%;
  background: rgba(0,0,0,.35);
  border:1px solid rgba(59,29,99,.65);
  border-radius: 14px;
  padding: 10px 12px;
  color: var(--ink);
  outline:none;
}
.input:focus, .select:focus, .textarea:focus{
  border-color: rgba(233,201,129,.35);
  box-shadow: 0 0 0 3px rgba(168,85,247,.18);
}

.label{
  color: var(--muted);
  font-size: 12px;
  letter-spacing:.08em;
  text-transform: uppercase;
}
.hint{ color: var(--muted2); font-size: 11px; }
.mono{ font-family: ui-monospace, Menlo, Consolas, monospace; }

.chip{
  display:inline-flex; align-items:center; gap:6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0,0,0,.25);
  border:1px solid rgba(59,29,99,.55);
  color: var(--muted);
  font-size: 12px;
}
.chip-on{
  border-color: rgba(233,201,129,.35);
  color: var(--ink);
  box-shadow: 0 0 12px rgba(168,85,247,.22);
}

.scroll{
  overflow:auto;
  scrollbar-width: thin;
}
.scroll::-webkit-scrollbar{ width:10px; height:10px; }
.scroll::-webkit-scrollbar-thumb{
  background: linear-gradient(180deg, rgba(168,85,247,.40), rgba(233,201,129,.20));
  border-radius: 999px;
  border: 2px solid rgba(0,0,0,.35);
}
.scroll::-webkit-scrollbar-track{ background: rgba(0,0,0,.15); border-radius:999px; }

.jackpot-flash{
  position:absolute; inset:0;
  background: rgba(168,85,247,.55);
  mix-blend-mode: screen;
  pointer-events:none;
  z-index:4;
}

.dice-face{
  background: linear-gradient(145deg, rgba(168,85,247,.85), rgba(46,16,99,.95));
  border: 1px solid rgba(0,0,0,.55);
  box-shadow: inset 0 0 14px rgba(233,201,129,.12);
}

/* ===== Modal ===== */
.modal-backdrop{
  position:fixed; inset:0;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(6px);
  z-index: 999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 18px;
}
.modal{
  width: min(520px, 100%);
  border-radius: 22px;
  border:1px solid rgba(233,201,129,.22);
  background: linear-gradient(145deg, rgba(20,10,31,.95), rgba(8,4,14,.92));
  box-shadow: 0 0 0 1px rgba(59,29,99,.55), 0 20px 60px rgba(0,0,0,.7), inset 0 0 50px rgba(168,85,247,.12);
  padding: 14px;
}
.modal h3{
  margin: 4px 0 6px;
  font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.modal .big{
  font-size: 36px;
  font-weight: 900;
  color: var(--gold);
  text-shadow: 0 0 18px rgba(168,85,247,.35);
}

/* ===== Themes switch ===== */
:root[data-theme="arcane"]{ }

:root[data-theme="blood"]{
  --rune:#fb7185;
  --rune2:#be123c;
  --edge:#5a1a2b;
  --gold:#fda4af;
}

:root[data-theme="toxic"]{
  --rune:#34d399;
  --rune2:#16a34a;
  --edge:#0f3a2a;
  --gold:#86efac;
}

:root[data-theme="gold"]{
  --rune:#e9c981;
  --rune2:#b8892f;
  --edge:#4a3612;
  --gold:#ffe8b3;
}


@keyframes shake {
  0% { transform: translate(0,0); }
  20% { transform: translate(2px,-2px); }
  40% { transform: translate(-2px,2px); }
  60% { transform: translate(2px,2px); }
  80% { transform: translate(-2px,-2px); }
  100% { transform: translate(0,0); }
}
.shake { animation: shake 0.25s linear 2; }
