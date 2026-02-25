import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// Standard D6 pips layout (always upright)
function Pips({ n }) {
  const dots = useMemo(() => {
    const map = {
      1: [[2, 2]],
      2: [[1, 1], [3, 3]],
      3: [[1, 1], [2, 2], [3, 3]],
      4: [[1, 1], [1, 3], [3, 1], [3, 3]],
      5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
      6: [[1, 1], [1, 2], [1, 3], [3, 1], [3, 2], [3, 3]],
    };
    return map[n] ?? map[1];
  }, [n]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: 8,
        width: "100%",
        height: "100%",
        padding: 18,
      }}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const r = Math.floor(i / 3) + 1;
        const c = (i % 3) + 1;
        const on = dots.some(([rr, cc]) => rr === r && cc === c);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: on ? 1 : 0,
              transform: on ? "scale(1)" : "scale(0.7)",
              transition: "opacity .12s ease, transform .12s ease",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,.92)",
                boxShadow: "0 0 10px rgba(168,85,247,.55)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Dice:
 * - sequence: array of faces to "flip through" (e.g. [6,6,4])
 * - isRolling: triggers animation
 */
export default function Dice({
  sequence = [1],
  isRolling = false,
  onClick,
  disabled,
  label = "CHAOS ROLL",
}) {
  const [face, setFace] = useState(sequence?.[sequence.length - 1] ?? 1);

  useEffect(() => {
    if (!isRolling) {
      setFace(sequence?.[sequence.length - 1] ?? 1);
      return;
    }

    let idx = 0;
    setFace(sequence[0] ?? 1);

    // Berserk style (B): fast chain, slightly faster on longer sequences
    const stepMs = Math.max(55, 120 - (sequence.length * 6));

    const t = setInterval(() => {
      idx += 1;
      if (idx >= sequence.length) {
        clearInterval(t);
        setFace(sequence[sequence.length - 1] ?? 1);
        return;
      }
      setFace(sequence[idx]);
    }, stepMs);

    return () => clearInterval(t);
  }, [isRolling, sequence]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn"
      style={{ borderRadius: 22, padding: 14, width: 170 }}
      aria-label="Roll D6"
    >
      <motion.div
        animate={
          isRolling
            ? { rotate: [0, 40, -35, 30, -25, 18, -12, 0], scale: [1, 1.04, 1, 1.03, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={{ duration: isRolling ? 0.75 : 0.2, ease: "easeInOut" }}
        style={{
          width: 110,
          height: 110,
          margin: "0 auto",
          borderRadius: 26,
          background: "linear-gradient(145deg, rgba(168,85,247,.85), rgba(46,16,99,.95))",
          border: "1px solid rgba(0,0,0,.55)",
          boxShadow: "0 0 24px rgba(168,85,247,.45), inset 0 0 22px rgba(233,201,129,.10)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Pips n={face} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(closest-side at 30% 25%, rgba(255,255,255,.18), transparent 55%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      <div className="label" style={{ fontSize: 10, marginTop: 10, textAlign: "center" }}>
        {label}
      </div>
    </button>
  );
}
