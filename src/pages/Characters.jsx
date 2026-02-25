export default function CharactersPage({
  characters, activeCharId, setActiveCharId,
  activeChar, activeWeapon,
  addCharacter, removeCharacter,
  setCharField, addWeapon, updateWeapon, removeWeapon,
  addMod, updateMod, removeMod,
  clearLog, resetStats,
  averageDamage, sixPercent
}) {
  return (
    <div className="grid-3" style={{ position: "relative", zIndex: 3 }}>
      {/* Presets */}
      <div className="panel">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="label">Персонажи</div>
            <div className="hint">Слоты с автосохранением.</div>
          </div>
          <button className="btn btn-gold" onClick={addCharacter}>+ Новый</button>
        </div>

        <div className="ruleline" />

        <div className="scroll" style={{ maxHeight: 620, display: "grid", gap: 10 }}>
          {characters.map(c => (
            <div
              key={c.id}
              className="panel-inner"
              style={{ border: c.id === activeCharId ? "1px solid rgba(233,201,129,.35)" : "1px solid rgba(59,29,99,.45)" }}
            >
              <button className="btn btn-ghost" style={{ width: "100%", textAlign: "left" }} onClick={() => setActiveCharId(c.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b>{c.name}</b>
                  <span className="chip">{`Lv ${c.level}`}</span>
                </div>
                <div className="hint" style={{ marginTop: 6 }}>Weapons: {(c.weapons ?? []).length}</div>
              </button>

              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setActiveCharId(c.id)}>Open</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => removeCharacter(c.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="panel scroll" style={{ maxHeight: 720 }}>
        <div className="label">Редактор</div>
        <div className="hint">Оружие определяет базовый урон.</div>

        <div style={{ height: 10 }} />

        {activeChar ? (
          <>
            <input className="input" value={activeChar.name} onChange={e => setCharField(activeChar.id, "name", e.target.value)} placeholder="Имя" />

            <div className="row" style={{ marginTop: 10 }}>
              <input className="input mono" style={{ flex: 1 }} type="number" value={activeChar.level} onChange={e => setCharField(activeChar.id, "level", Number(e.target.value))} placeholder="Level" />
              <span className="chip chip-on">Chaos v1.0</span>
            </div>

            <div className="ruleline" />

            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div className="label">Оружие</div>
              <button className="btn btn-gold" onClick={() => addWeapon(activeChar.id)}>+ Add weapon</button>
            </div>

            <div style={{ height: 8 }} />

            {(activeChar.weapons ?? []).map(w => {
              const isActive = (activeChar.activeWeaponId ?? activeChar.weapons?.[0]?.id) === w.id;
              return (
                <div key={w.id} className="panel-inner" style={{ marginBottom: 10 }}>
                  <div className="row">
                    <button className={`btn ${isActive ? "btn-gold" : "btn-ghost"}`} onClick={() => setCharField(activeChar.id, "activeWeaponId", w.id)}>Active</button>
                    <input className="input" style={{ flex: 1 }} value={w.name} onChange={e => updateWeapon(activeChar.id, w.id, "name", e.target.value)} />
                    <input className="input mono" style={{ width: 110 }} type="number" value={w.dmg} onChange={e => updateWeapon(activeChar.id, w.id, "dmg", Number(e.target.value))} />
                  </div>

                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <div className="hint">
                      Base DMG: <b style={{ color: "var(--gold)" }}>{w.dmg}</b>
                    </div>
                    <button className="btn btn-danger" onClick={() => removeWeapon(activeChar.id, w.id)}>Remove</button>
                  </div>
                </div>
              );
            })}

            <div className="panel-inner">
              <div className="label">Статистика</div>
              <div className="hint" style={{ marginTop: 6 }}>
                Avg: <b>{averageDamage}</b> • Max: <b>{activeChar.stats.maxDamage}</b> • Six%: <b>{sixPercent}%</b> • Max6:{" "}
                <b>{activeChar.stats.maxSixSeries}</b>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={clearLog}>Clear Log</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={resetStats}>Reset Stats</button>
              </div>
              <div className="hint" style={{ marginTop: 8 }}>
                Active weapon: <b style={{ color: "var(--gold)" }}>{activeWeapon?.name ?? "—"}</b>
              </div>
            </div>
          </>
        ) : (
          <div className="hint">Выбери персонажа.</div>
        )}
      </div>

      {/* Effects + log */}
      <div className="panel scroll" style={{ maxHeight: 720 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="label">Эффекты</div>
            <div className="hint">Hard/Light/Final + (+ - × ÷)</div>
          </div>
          <div className="row">
            <button className="btn btn-gold" onClick={() => addMod("artifact")}>+ Artifact</button>
            <button className="btn" onClick={() => addMod("buff")}>+ Buff</button>
            <button className="btn" onClick={() => addMod("debuff")}>+ Debuff</button>
          </div>
        </div>

        <div className="ruleline" />

        {(activeChar?.modifiers ?? []).map(mod => (
          <div key={mod.id} className="panel-inner" style={{ marginBottom: 10 }}>
            <div className="row">
              <input className="input mono" style={{ width: 80 }} value={mod.tag ?? ""} onChange={e => updateMod(mod.id, "tag", e.target.value)} />
              <input className="input" style={{ flex: 1 }} value={mod.name} onChange={e => updateMod(mod.id, "name", e.target.value)} />
            </div>

            <div className="row" style={{ marginTop: 8 }}>
              <select className="select" value={mod.category} onChange={e => updateMod(mod.id, "category", e.target.value)}>
                <option value="artifact">artifact</option>
                <option value="buff">buff</option>
                <option value="debuff">debuff</option>
              </select>

              <select className="select" value={mod.stage} onChange={e => updateMod(mod.id, "stage", e.target.value)}>
                <option value="hard">Hard [H]</option>
                <option value="light">Light [L]</option>
                <option value="final">Final [F]</option>
              </select>

              <select className="select" value={mod.op} onChange={e => updateMod(mod.id, "op", e.target.value)}>
                <option value="add">+ add</option>
                <option value="sub">- sub</option>
                <option value="mul">× mul</option>
                <option value="div">÷ div</option>
              </select>

              <input className="input mono" type="number" value={mod.value} onChange={e => updateMod(mod.id, "value", Number(e.target.value))} />
            </div>

            <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <label className={`chip ${mod.enabled ? "chip-on" : ""}`} style={{ cursor: "pointer" }}>
                <input type="checkbox" checked={!!mod.enabled} onChange={e => updateMod(mod.id, "enabled", e.target.checked)} />
                Active
              </label>

              <div className="row" style={{ alignItems: "center" }}>
                <span className="chip">{`[${stageLabel(mod.stage)}] ${opSymbol(mod.op)}${mod.value}`}</span>
                <button className="btn btn-danger" onClick={() => removeMod(mod.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}

        <div className="ruleline" />

        <div className="label">Personal Log</div>
        <div className="hint">Breakdown формулы (укорочено).</div>

        {(activeChar?.log ?? []).map(entry => (
          <div key={entry.id} className="panel-inner" style={{ marginTop: 10 }}>
            <div className="mono" style={{ fontSize: 12 }}>
              🎲 {entry.rolls.join(" → ")} | 💥 <b style={{ color: "var(--gold)" }}>{entry.dmg}</b> DMG {entry.riskUsed ? "(risk)" : ""}
            </div>
            <div className="hint" style={{ marginTop: 8 }}>
              {entry.breakdown.slice(0, 8).map((line, i) => <div key={i}>{line}</div>)}
              {entry.breakdown.length > 8 ? <div>…</div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* small helpers (no extra file imports) */
function stageLabel(stage) {
  if (stage === "hard") return "H";
  if (stage === "light") return "L";
  return "F";
}
function opSymbol(op) {
  if (op === "add") return "+";
  if (op === "sub") return "-";
  if (op === "mul") return "×";
  return "÷";
}
