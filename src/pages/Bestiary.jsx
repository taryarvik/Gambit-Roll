export default function BestiaryPage({
  bestiary, selectedEnemyId, setSelectedEnemyId,
  filteredEnemies, enemySearch, setEnemySearch, enemySortAZ, setEnemySortAZ,
  selectedEnemy,
  addEnemy, removeEnemy,
  setEnemyField, addEnemyAttack, updateEnemyAttack, removeEnemyAttack,
  sendToBattlefield
}) {
  return (
    <div className="grid-2" style={{ position: "relative", zIndex: 3 }}>
      <div className="panel">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="label">Бестиарий</div>
            <div className="hint">Поиск + сортировка.</div>
          </div>
          <button className="btn btn-gold" onClick={addEnemy}>+ Новый враг</button>
        </div>

        <div className="ruleline" />

        <div className="row">
          <input className="input" value={enemySearch} onChange={e => setEnemySearch(e.target.value)} placeholder="Поиск по названию..." />
          <button className="btn" style={{ minWidth: 110 }} onClick={() => setEnemySortAZ(v => !v)}>
            {enemySortAZ ? "A→Z" : "Z→A"}
          </button>
        </div>

        <div style={{ height: 10 }} />

        <div className="scroll" style={{ maxHeight: 620, display: "grid", gap: 10 }}>
          {filteredEnemies.map(e => (
            <button
              key={e.id}
              className="btn btn-ghost"
              style={{
                textAlign: "left",
                border: e.id === selectedEnemyId ? "1px solid rgba(233,201,129,.35)" : "1px solid rgba(59,29,99,.45)"
              }}
              onClick={() => setSelectedEnemyId(e.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b>{e.name}</b>
                <span className="chip">{`HP ${e.hp} • DEF ${e.defense}%`}</span>
              </div>
              <div className="hint" style={{ marginTop: 6 }}>
                {`Local ${e.dangerLocal} • Global ${e.dangerGlobal} • Element ${e.element || "—"}`}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="panel scroll" style={{ maxHeight: 720 }}>
        <div className="label">Редактор врага</div>
        <div className="hint">Картинка 256×256: лучше URL (не base64).</div>

        <div style={{ height: 10 }} />

        {selectedEnemy ? (
          <>
            <div className="row">
              <div className="panel-inner" style={{ width: 128, height: 128, padding: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {selectedEnemy.image ? (
                  <img
                    src={selectedEnemy.image}
                    alt="enemy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.src = ""; }}
                  />
                ) : (
                  <div className="hint" style={{ textAlign: "center" }}>256×256<br/>image</div>
                )}
              </div>

              <div style={{ flex: 1, display: "grid", gap: 10 }}>
                <input className="input" value={selectedEnemy.name} onChange={e => setEnemyField(selectedEnemy.id, "name", e.target.value)} placeholder="Имя" />
                <input className="input mono" value={selectedEnemy.image} onChange={e => setEnemyField(selectedEnemy.id, "image", e.target.value)} placeholder="Image URL / data:..." />
                <div className="row">
                  <select className="select" value={selectedEnemy.dangerLocal} onChange={e => setEnemyField(selectedEnemy.id, "dangerLocal", e.target.value)}>
                    {["C","B","A","S","SS","SSS"].map(x => <option key={x} value={x}>{`Local ${x}`}</option>)}
                  </select>
                  <select className="select" value={selectedEnemy.dangerGlobal} onChange={e => setEnemyField(selectedEnemy.id, "dangerGlobal", e.target.value)}>
                    {["C","B","A","S","SS","SSS"].map(x => <option key={x} value={x}>{`Global ${x}`}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="ruleline" />

            <div className="grid-2">
              <input className="input" value={selectedEnemy.habitat} onChange={e => setEnemyField(selectedEnemy.id, "habitat", e.target.value)} placeholder="Место обитания" />
              <input className="input" value={selectedEnemy.element} onChange={e => setEnemyField(selectedEnemy.id, "element", e.target.value)} placeholder="Элемент" />
              <input className="input" value={selectedEnemy.faction} onChange={e => setEnemyField(selectedEnemy.id, "faction", e.target.value)} placeholder="Фракция" />
              <input className="input" value={selectedEnemy.weapon} onChange={e => setEnemyField(selectedEnemy.id, "weapon", e.target.value)} placeholder="Оружие" />
            </div>

            <div className="ruleline" />

            <div className="panel-inner">
              <div className="label">Статистика</div>

              <div style={{ height: 10 }} />

              <div className="grid-2">
                <input className="input mono" type="number" value={selectedEnemy.hp} onChange={e => setEnemyField(selectedEnemy.id, "hp", Number(e.target.value))} placeholder="HP" />
                <select className="select" value={selectedEnemy.defense} onChange={e => setEnemyField(selectedEnemy.id, "defense", Number(e.target.value))}>
                  <option value={0}>Отсутствует - 0%</option>
                  <option value={20}>Легкая - 20%</option>
                  <option value={40}>Средняя - 40%</option>
                  <option value={60}>Тяжёлая - 60%</option>
                </select>

                <input className="input mono" type="number" value={selectedEnemy.agility} onChange={e => setEnemyField(selectedEnemy.id, "agility", Math.max(0, Math.min(100, Number(e.target.value))))} placeholder="Ловкость (%)" />
                <input className="input mono" type="number" value={selectedEnemy.size} onChange={e => setEnemyField(selectedEnemy.id, "size", Math.max(0, Math.min(100, Number(e.target.value))))} placeholder="Размер (%)" />
                <input className="input mono" type="number" value={selectedEnemy.intellect} onChange={e => setEnemyField(selectedEnemy.id, "intellect", Number(e.target.value))} placeholder="Интеллект" />
              </div>

              <div className="ruleline" />

              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div className="label">{`Атаки (${selectedEnemy.name})`}</div>
                <button className="btn btn-gold" onClick={() => addEnemyAttack(selectedEnemy.id)}>+ Add</button>
              </div>

              <div style={{ height: 10 }} />

              {(selectedEnemy.attacks ?? []).map(a => (
                <div key={a.id} className="row" style={{ alignItems: "center" }}>
                  <input className="input" style={{ flex: 1 }} value={a.name} onChange={e => updateEnemyAttack(selectedEnemy.id, a.id, "name", e.target.value)} placeholder="Название удара" />
                  <input className="input mono" style={{ width: 120 }} type="number" value={a.dmg} onChange={e => updateEnemyAttack(selectedEnemy.id, a.id, "dmg", Number(e.target.value))} placeholder="_ht" />
                  <button className="btn btn-danger" onClick={() => removeEnemyAttack(selectedEnemy.id, a.id)}>Del</button>
                </div>
              ))}
            </div>

            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn btn-gold" style={{ flex: 1 }} onClick={sendToBattlefield}>Send to Battlefield</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => removeEnemy(selectedEnemy.id)}>Delete preset</button>
            </div>
          </>
        ) : (
          <div className="hint">Выбери врага.</div>
        )}
      </div>
    </div>
  );
}
