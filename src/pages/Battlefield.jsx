import { motion, AnimatePresence } from "framer-motion";
import Dice from "../ui/Dice.jsx";

export default function BattlefieldPage({
  characters, bestiary,
  activeChar, activeWeapon,
  selectedEnemyId, setSelectedEnemyId,
  battleSlots, activeBattleIndex, setActiveBattleIndex,
  setBattleField,
  cubeRotation, rolling,
  jackpotFlash,
  playerAttackViaCube,
  enemyAttackStub,
  syncBattleSelectionFromCurrent
}) {
  const slot = battleSlots[activeBattleIndex];

  const enemyName = (() => {
    const enemy = bestiary.find(m => m.id === (slot.enemyId ?? selectedEnemyId));
    return enemy?.name ?? "ENEMY";
  })();

  const hpPct = (cur, max) => `${Math.max(0, Math.min(100, (cur / Math.max(1, max)) * 100))}%`;

  return (
    <div style={{ position: "relative", zIndex: 3 }}>
      <AnimatePresence>
        {jackpotFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            className="jackpot-flash"
          />
        )}
      </AnimatePresence>

      <div className="frame">
        <div className="row" style={{ justifyContent: "center" }}>
          {[0,1,2].map(i => (
            <button
              key={i}
              className={`btn ${activeBattleIndex === i ? "btn-gold" : "btn-ghost"}`}
              onClick={() => setActiveBattleIndex(i)}
            >
              BATTLE {i+1}
            </button>
          ))}
        </div>

        <div className="ruleline" />

        <div className="grid-2">
          <div className="panel-inner">
            <div className="row" style={{ justifyContent:"space-between" }}>
              <span className="label">HP (Player)</span>
              <span className="mono">{slot.playerHP}/{slot.playerHPMax}</span>
            </div>
            <div style={{ height: 10, background:"rgba(0,0,0,.25)", borderRadius:999, marginTop:8, overflow:"hidden", border:"1px solid rgba(59,29,99,.55)" }}>
              <motion.div style={{ height: 10, background:"linear-gradient(90deg, rgba(52,211,153,.85), rgba(233,201,129,.18))" }} animate={{ width: hpPct(slot.playerHP, slot.playerHPMax) }} transition={{ duration: 0.35, ease: "easeOut" }} />
            </div>
          </div>
          <div className="panel-inner">
            <div className="row" style={{ justifyContent:"space-between" }}>
              <span className="label">HP (Enemy)</span>
              <span className="mono">{slot.enemyHP}/{slot.enemyHPMax}</span>
            </div>
            <div style={{ height: 10, background:"rgba(0,0,0,.25)", borderRadius:999, marginTop:8, overflow:"hidden", border:"1px solid rgba(59,29,99,.55)" }}>
              <motion.div style={{ height: 10, background:"linear-gradient(90deg, rgba(52,211,153,.85), rgba(233,201,129,.18))" }} animate={{ width: hpPct(slot.enemyHP, slot.enemyHPMax) }} transition={{ duration: 0.35, ease: "easeOut" }} />
            </div>
          </div>
        </div>

        <div className="ruleline" />

        <div className="grid-2" style={{ gap: 14 }}>
          <div className="panel">
            <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div className="label">Chaos Roll D6</div>
                <div className="hint">Клик по кубу = атака игрока.</div>
              </div>
              <button className="btn btn-gold" onClick={syncBattleSelectionFromCurrent}>Sync Select</button>
            </div>

            <div style={{ height: 10 }} />

            <div className="row" style={{ justifyContent:"center" }}>
              <Dice
                sequence={slot.diceSequence ?? [1]}
                isRolling={rolling}
                disabled={rolling}
                onClick={playerAttackViaCube}
                label="CHAOS ROLL"
              />
            </div>

<div className="row" style={{ marginTop: 8 }}>
              {["D","C","B","A","S","SS","SSS"].map(d => (
                <button
                  key={d}
                  className={`btn ${slot.danger === d ? "btn-gold" : "btn-ghost"}`}
                  style={{ borderRadius: 999, padding:"8px 12px" }}
                  onClick={() => setBattleField("danger", d)}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="hint" style={{ marginTop: 8 }}>Пока без цифр (EnemyATK зарезервирован).</div>
          </div>

          <div className="panel">
            <div className="panel-inner">
              <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div className="label">Player</div>
                  <div className="hint">
                    {activeChar?.name ?? "PLAYER"} • Weapon: <b style={{ color:"var(--gold)" }}>{activeWeapon?.name ?? "—"}</b> • Base <b style={{ color:"var(--gold)" }}>{activeWeapon?.dmg ?? 0}</b>
                  </div>
                </div>
                <div className="chip">Final DMG only</div>
              </div>

              <div className="ruleline" />

              <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
                <div className="panel-inner" style={{ flex: 1, textAlign:"center" }}>
                  <div className="label" style={{ fontSize: 10 }}>PLAYER DMG → ENEMY</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color:"var(--gold)", textShadow:"0 0 16px rgba(168,85,247,.35)" }}>
                    {slot.lastPlayerDMG}
                  </div>
                </div>

                <div style={{ position: "relative", width: 110, height: 110, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <AnimatePresence>
                    {(slot.popups ?? []).map(p => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 14, scale: 0.85, filter: "blur(2px)" }}
                        animate={{
                          opacity: 1,
                          y: -26,
                          scale: p.kind === "jackpot" ? 1.25 : 1.05,
                          filter: "blur(0px)"
                        }}
                        exit={{ opacity: 0, y: -52, scale: 0.9, filter: "blur(3px)" }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%,-50%)",
                          fontSize: p.kind === "jackpot" ? 34 : 28,
                          fontWeight: 900,
                          letterSpacing: 0.5,
                          color: "var(--gold)",
                          textShadow:
                            p.kind === "jackpot"
                              ? "0 0 16px rgba(168,85,247,.65), 0 0 22px rgba(233,201,129,.35)"
                              : "0 0 14px rgba(168,85,247,.35)",
                          pointerEvents: "none",
                          userSelect: "none",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {p.kind === "jackpot" ? `✦ ${p.value} ✦` : `-${p.value}`}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div style={{ fontSize: 64, padding: "0 10px", filter:"drop-shadow(0 0 12px rgba(168,85,247,.35))" }}>
                    ⚔️
                  </div>
                </div>

                <div className="panel-inner" style={{ flex: 1, textAlign:"center" }}>
                  <div className="label" style={{ fontSize: 10 }}>ENEMY DMG → PLAYER</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color:"var(--muted)" }}>
                    {slot.lastEnemyDMG}
                  </div>
                </div>
              </div>

              <div className="ruleline" />

              <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div className="label">Enemy</div>
                  <div className="hint">{enemyName} • (EnemyATK stub)</div>
                </div>
                <div className="row">
                  <button className="btn" onClick={enemyAttackStub}>ENEMY ATK</button>
                </div>
              </div>

              <div className="ruleline" />

              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label" style={{ fontSize: 10, textAlign:"center" }}>PLAYER LIST</div>
                  <select
                    className="select"
                    value={slot.playerCharId ?? activeChar?.id ?? ""}
                    onChange={e => setBattleField("playerCharId", e.target.value)}
                  >
                    {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button className="btn btn-gold" style={{ width:"100%", marginTop: 8 }} onClick={syncBattleSelectionFromCurrent}>
                    Change Player
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="label" style={{ fontSize: 10, textAlign:"center" }}>ENEMY LIST</div>
                  <select
                    className="select"
                    value={slot.enemyId ?? selectedEnemyId ?? ""}
                    onChange={e => setSelectedEnemyId(e.target.value)}
                  >
                    {bestiary.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <button className="btn btn-gold" style={{ width:"100%", marginTop: 8 }} onClick={syncBattleSelectionFromCurrent}>
                    Change Enemy
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="ruleline" />

        <div className="grid-2">
          <div className="panel scroll" style={{ maxHeight: 260 }}>
            <div className="label">BATTLE LOG</div>
            <div style={{ height: 8 }} />
            {(slot.playerLog ?? []).slice(0, 40).map(e => (
              <div key={e.id} className="panel-inner mono" style={{ fontSize: 12, marginBottom: 8 }}>
                {e.text}
              </div>
            ))}
          </div>

          <div className="panel scroll" style={{ maxHeight: 260 }}>
            <div className="label">ENEMY BATTLE LOG</div>
            <div style={{ height: 8 }} />
            {(slot.enemyLog ?? []).slice(0, 40).map(e => (
              <div key={e.id} className="panel-inner mono" style={{ fontSize: 12, marginBottom: 8 }}>
                {e.text}
              </div>
            ))}
          </div>
        </div>

        <div className="hint" style={{ marginTop: 10 }}>
          Точная математика сейчас: только PLAYER Final DMG. EnemyATK/опасность — резерв (stub).
        </div>
      </div>
    </div>
  );
}
