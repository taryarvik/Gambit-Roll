import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Reel({ value, spinning, seed }) {
  // Make a long strip of numbers 1..6 repeated to animate like a slot drum
  const strip = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) arr.push((i % 6) + 1);
    return arr;
  }, []);

  const finalIndex = 12 + ((value - 1) % 6); // near end so it stops "down the strip"
  const yFinal = -finalIndex * 44;

  const spinY = -(strip.length - 1) * 44; // full spin

  return (
    <div style={{
      width: 72,
      height: 132,
      borderRadius: 18,
      overflow: "hidden",
      background: "rgba(0,0,0,.55)",
      border: "1px solid rgba(255,255,255,.10)",
      boxShadow: "inset 0 0 18px rgba(0,0,0,.6), 0 0 24px rgba(168,85,247,.25)"
    }}>
      <motion.div
        key={seed}
        initial={{ y: 0 }}
        animate={{ y: spinning ? [0, spinY] : yFinal }}
        transition={{
          duration: spinning ? 0.75 : 0.5,
          ease: spinning ? "linear" : [0.2, 0.9, 0.2, 1]
        }}
      >
        {strip.map((n, i) => (
          <div key={i} style={{
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 900,
            color: "rgba(255,245,215,1)",
            textShadow: "0 0 12px rgba(168,85,247,.65), 0 0 18px rgba(233,201,129,.25)"
          }}>
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function JackpotCasinoModal({ open, onResolve, baseMult }) {
  const [spinning, setSpinning] = useState(false);
  const [vals, setVals] = useState([1,1,1]);
  const [seed, setSeed] = useState(0);

  const sixCount = vals.filter(v => v === 6).length;
  const mappedMult = 3 + sixCount; // 0->x3, 1->x4, 2->x5, 3->x6
  const bonus = mappedMult - 3; // equals sixCount

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSeed(s => s + 1);

    // pick target values now, reveal after stop
    const next = [1,1,1].map(() => 1 + Math.floor(Math.random() * 6));
    // animate with small stagger via separate timeouts
    setTimeout(() => setVals(next), 680);

    setTimeout(() => {
      setSpinning(false);
    }, 820);
  };

  const apply = () => {
    if (spinning) return;
    onResolve({ vals, sixCount, bonus });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.92, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <div className="panel-inner">
              <h3>JACKPOT BONUS</h3>
              <div className="hint">Казино-бонус после джекпота: 0×6 → ×3, 1×6 → ×4, 2×6 → ×5, 3×6 → ×6</div>
              <div className="ruleline" />

              <div className="row" style={{ justifyContent:"center", gap: 12 }}>
                <Reel value={vals[0]} spinning={spinning} seed={seed*10+1} />
                <Reel value={vals[1]} spinning={spinning} seed={seed*10+2} />
                <Reel value={vals[2]} spinning={spinning} seed={seed*10+3} />
              </div>

              <div className="ruleline" />
              <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div className="label">Base jackpot multiplier</div>
                  <div className="big">×{baseMult}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div className="label">Bonus result</div>
                  <div className="big">+{bonus} (→ ×{mappedMult})</div>
                </div>
              </div>

              <div className="ruleline" />
              <div className="row" style={{ justifyContent:"space-between" }}>
                <button className="btn btn-gold" onClick={spin} disabled={spinning}>
                  {spinning ? "КРУТИТСЯ..." : "КРУТИТЬ 3 СЛОТА"}
                </button>
                <button className="btn btn-danger" onClick={apply} disabled={spinning}>
                  ПРИМЕНИТЬ
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
