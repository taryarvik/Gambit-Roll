import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import DnDTheme from "./ui/DnDTheme.jsx";
import CharactersPage from "./pages/Characters.jsx";
import BestiaryPage from "./pages/Bestiary.jsx";
import BattlefieldPage from "./pages/Battlefield.jsx";

import { emptyBattleSlot, emptyCharacter, emptyEnemy, emptyEnemyAttack, emptyMod, emptyWeapon } from "./engine/models.js";
import { applyStageOps, uid } from "./engine/modifiers.js";
import { chaosRollBase, resolveRiskReroll } from "./engine/dice.js";
import { exportCode, importCode } from "./engine/sync.js";
import { safeLoad, saveWithImageGuard } from "./engine/storage.js";

const STORE_KEY = "chaos_engine_legendary_v1";

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function getRotationForFace(face) {
  switch (face) {
    case 1: return { x: 0, y: 0 };
    case 2: return { x: -90, y: 0 };
    case 3: return { x: 0, y: 90 };
    case 4: return { x: 0, y: -90 };
    case 5: return { x: 90, y: 0 };
    case 6: return { x: 180, y: 0 };
    default: return { x: 0, y: 0 };
  }
}

export default function App() {
  const [tab, setTab] = useState("battle"); // characters | bestiary | battle
  const [theme, setTheme] = useState("arcane"); // arcane | blood | toxic | gold

  const [characters, setCharacters] = useState([emptyCharacter(), emptyCharacter(), emptyCharacter()]);
  const [bestiary, setBestiary] = useState([emptyEnemy()]);
  const [selectedEnemyId, setSelectedEnemyId] = useState(null);

  const [activeCharId, setActiveCharId] = useState(null);

  const [battleSlots, setBattleSlots] = useState([emptyBattleSlot(), emptyBattleSlot(), emptyBattleSlot()]);
  const [activeBattleIndex, setActiveBattleIndex] = useState(0);

  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [rolling, setRolling] = useState(false);
  const [jackpotFlash, setJackpotFlash] = useState(false);

  const [enemySearch, setEnemySearch] = useState("");
  const [enemySortAZ, setEnemySortAZ] = useState(true);

  // risk modal for "2"
  const [riskModal, setRiskModal] = useState(null);
  // riskModal = null | { pre, chaosBase }

  // sync
  const [syncText, setSyncText] = useState("");
  const [syncInfo, setSyncInfo] = useState("");

  // load
  useEffect(() => {
    const saved = safeLoad(STORE_KEY, null);
    if (saved) {
      if (Array.isArray(saved.characters) && saved.characters.length) setCharacters(saved.characters);
      if (Array.isArray(saved.bestiary) && saved.bestiary.length) setBestiary(saved.bestiary);
      if (Array.isArray(saved.battleSlots) && saved.battleSlots.length) setBattleSlots(saved.battleSlots);
      if (saved.selectedEnemyId) setSelectedEnemyId(saved.selectedEnemyId);
      if (saved.activeCharId) setActiveCharId(saved.activeCharId);
      if (saved.theme) setTheme(saved.theme);
    } else {
      // initialize ids
      setActiveCharId((prev) => prev ?? characters[0]?.id ?? null);
      setSelectedEnemyId((prev) => prev ?? bestiary[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // save
  useEffect(() => {
    const payload = { characters, bestiary, battleSlots, selectedEnemyId, activeCharId, theme };
    const res = saveWithImageGuard(STORE_KEY, payload);
    if (res.ok && res.trimmed) setSyncInfo("⚠️ Сохранение: картинки врагов сброшены (лимит localStorage).");
  }, [characters, bestiary, battleSlots, selectedEnemyId, activeCharId, theme]);

  // derived active
  const activeChar = useMemo(() => characters.find(c => c.id === (activeCharId ?? characters[0]?.id)) ?? null, [characters, activeCharId]);
  const activeWeapon = useMemo(() => {
    if (!activeChar) return null;
    const wid = activeChar.activeWeaponId ?? activeChar.weapons?.[0]?.id ?? null;
    return (activeChar.weapons ?? []).find(w => w.id === wid) ?? activeChar.weapons?.[0] ?? null;
  }, [activeChar]);

  // filtered bestiary
  const filteredEnemies = useMemo(() => {
    const q = enemySearch.trim().toLowerCase();
    const arr = (bestiary ?? []).filter(e => !q || (e.name ?? "").toLowerCase().includes(q));
    arr.sort((a,b) => {
      const aa = (a.name ?? "").toLowerCase();
      const bb = (b.name ?? "").toLowerCase();
      return enemySortAZ ? aa.localeCompare(bb) : bb.localeCompare(aa);
    });
    return arr;
  }, [bestiary, enemySearch, enemySortAZ]);

  const selectedEnemy = useMemo(() => bestiary.find(e => e.id === (selectedEnemyId ?? bestiary[0]?.id)) ?? null, [bestiary, selectedEnemyId]);

  // stats
  const averageDamage = useMemo(() => {
    if (!activeChar || activeChar.stats.totalAttacks === 0) return 0;
    return Math.floor(activeChar.stats.totalDamage / activeChar.stats.totalAttacks);
  }, [activeChar]);

  const sixPercent = useMemo(() => {
    if (!activeChar || activeChar.stats.totalAttacks === 0) return "0.0";
    return ((activeChar.stats.sixCount / activeChar.stats.totalAttacks) * 100).toFixed(1);
  }, [activeChar]);

  /* ===================== Characters CRUD ===================== */
  function addCharacter(){
    const c = emptyCharacter();
    setCharacters(prev => [c, ...prev]);
    setActiveCharId(c.id);
  }
  function removeCharacter(id){
    setCharacters(prev => prev.filter(c => c.id !== id));
    if (activeCharId === id) setActiveCharId(characters.find(c => c.id !== id)?.id ?? null);
  }
  function setCharField(charId, field, value){
    setCharacters(prev => prev.map(c => c.id === charId ? { ...c, [field]: value } : c));
  }
  function addWeapon(charId){
    const w = emptyWeapon();
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      const weapons = [...(c.weapons ?? []), w];
      return { ...c, weapons, activeWeaponId: c.activeWeaponId ?? w.id };
    }));
  }
  function updateWeapon(charId, weaponId, field, value){
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      const weapons = (c.weapons ?? []).map(w => w.id === weaponId ? { ...w, [field]: value } : w);
      return { ...c, weapons };
    }));
  }
  function removeWeapon(charId, weaponId){
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      const weapons = (c.weapons ?? []).filter(w => w.id !== weaponId);
      const nextActive = (c.activeWeaponId === weaponId) ? (weapons[0]?.id ?? null) : c.activeWeaponId;
      return { ...c, weapons, activeWeaponId: nextActive };
    }));
  }

  /* ===================== Mods ===================== */
  function addMod(category){
    if (!activeChar) return;
    const mod = emptyMod(category);
    setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...c, modifiers: [mod, ...(c.modifiers ?? [])] } : c));
  }
  function updateMod(modId, field, value){
    if (!activeChar) return;
    setCharacters(prev => prev.map(c => {
      if (c.id !== activeChar.id) return c;
      return { ...c, modifiers: (c.modifiers ?? []).map(m => m.id === modId ? { ...m, [field]: value } : m) };
    }));
  }
  function removeMod(modId){
    if (!activeChar) return;
    setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...c, modifiers: (c.modifiers ?? []).filter(m => m.id !== modId) } : c));
  }

  function clearLog(){
    if (!activeChar) return;
    setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...c, log: [] } : c));
  }
  function resetStats(){
    if (!activeChar) return;
    setCharacters(prev => prev.map(c => c.id === activeChar.id ? { ...c, stats: emptyCharacter().stats, lastDamage: 0 } : c));
  }

  /* ===================== Bestiary CRUD ===================== */
  function addEnemy(){
    const e = emptyEnemy();
    setBestiary(prev => [e, ...prev]);
    setSelectedEnemyId(e.id);
  }
  function removeEnemy(id){
    setBestiary(prev => prev.filter(e => e.id !== id));
    if (selectedEnemyId === id) setSelectedEnemyId(bestiary.find(e => e.id !== id)?.id ?? null);
  }
  function setEnemyField(enemyId, field, value){
    setBestiary(prev => prev.map(e => e.id === enemyId ? { ...e, [field]: value } : e));
  }
  function addEnemyAttack(enemyId){
    const a = emptyEnemyAttack();
    setBestiary(prev => prev.map(e => e.id === enemyId ? { ...e, attacks: [...(e.attacks ?? []), a] } : e));
  }
  function updateEnemyAttack(enemyId, attackId, field, value){
    setBestiary(prev => prev.map(e => {
      if (e.id !== enemyId) return e;
      return { ...e, attacks: (e.attacks ?? []).map(a => a.id === attackId ? { ...a, [field]: value } : a) };
    }));
  }
  function removeEnemyAttack(enemyId, attackId){
    setBestiary(prev => prev.map(e => e.id === enemyId ? { ...e, attacks: (e.attacks ?? []).filter(a => a.id !== attackId) } : e));
  }

  function sendToBattlefield(){
    if (!selectedEnemy) return;
    const i = activeBattleIndex;
    setBattleSlots(prev => prev.map((s, idx) => {
      if (idx !== i) return s;
      return {
        ...s,
        enemyId: selectedEnemy.id,
        enemyHPMax: selectedEnemy.hp ?? 30,
        enemyHP: selectedEnemy.hp ?? 30
      };
    }));
    setTab("battle");
  }

  /* ===================== Battle wiring ===================== */
  const slot = battleSlots[activeBattleIndex];

  function setBattleField(field, value){
    setBattleSlots(prev => prev.map((s, idx) => idx === activeBattleIndex ? { ...s, [field]: value } : s));
  }

  function syncBattleSelectionFromCurrent(){
    if (!activeChar) return;
    const enemyId = selectedEnemyId ?? bestiary[0]?.id ?? null;
    setBattleSlots(prev => prev.map((s, idx) => {
      if (idx !== activeBattleIndex) return s;
      const enemy = bestiary.find(e => e.id === enemyId);
      return {
        ...s,
        playerCharId: activeChar.id,
        enemyId: enemyId,
        enemyHPMax: enemy?.hp ?? s.enemyHPMax,
        enemyHP: clamp(s.enemyHP, 0, enemy?.hp ?? s.enemyHPMax)
      };
    }));
  }

  function enemyAttackStub(){
    const dmg = 0; // stub
    setBattleSlots(prev => prev.map((s, idx) => {
      if (idx !== activeBattleIndex) return s;
      const enemyLog = [{ id: uid(), text: `EnemyATK (stub): ${dmg} DMG` }, ...(s.enemyLog ?? [])].slice(0, 80);
      return { ...s, lastEnemyDMG: dmg, enemyLog };
    }));
  }

  /* ===================== Damage math (Hard/Light/Final) ===================== */
  function precomputeTrueDMG(char, weapon) {
    const mods = (char.modifiers ?? []).filter(m => m.enabled);

    const hard = mods.filter(m => m.stage === "hard");
    const light = mods.filter(m => m.stage === "light");
    const fin = mods.filter(m => m.stage === "final");

    const breakdown = [];

    // [H] affects weaponDMG
    const weaponBase = Number(weapon?.dmg ?? 0);
    const weaponPrime = applyStageOps(weaponBase, hard, "H", breakdown);

    // level scale: +5% per level
    const level = clamp(Number(char.level ?? 1), 1, 20);
    const levelMult = 1 + 0.05 * level;
    const trueDMG = weaponPrime * levelMult;
    breakdown.push(`[T] level x${levelMult.toFixed(2)} => True DMG = ${trueDMG.toFixed(2)}`);

    // [L] adds right before chaos
    const lightPrime = applyStageOps(trueDMG, light, "L", breakdown);
    breakdown.push(`[T] pre-chaos = ${lightPrime.toFixed(2)}`);

    return { breakdown, hard, light, fin, weaponPrime, levelMult, trueDMG, preChaos: lightPrime, level };
  }

  function finalizeDamage(char, weapon, pre, chaos, riskUsed) {
    const breakdown = [...pre.breakdown];

    breakdown.push(`[C] rolls = ${chaos.rolls.join("→")}`);
    breakdown.push(`[C] Chaos x${chaos.multiplier} => ${(pre.preChaos * chaos.multiplier).toFixed(2)}`);

    let stage = pre.preChaos * chaos.multiplier;

    // final ops
    stage = applyStageOps(stage, pre.fin, "F", breakdown);

    const dmg = Math.floor(stage);
    return {
      dmg,
      rolls: chaos.rolls,
      jackpot: chaos.jackpot,
      sixSeries: chaos.sixSeries,
      riskUsed: !!riskUsed,
      breakdown
    };
  }

  /* ===================== Dice animation helpers ===================== */
  function spinToFace(face, extra = 720){
    const t = getRotationForFace(face);
    setCubeRotation(prev => ({ x: prev.x + extra + t.x, y: prev.y + extra + t.y }));
  }

  function animateBerserkSeries(rolls, onDone) {
    // Style B: fast chain
    const interval = 160; // ms
    const extra = 900;
    rolls.forEach((r, i) => {
      setTimeout(() => spinToFace(r, extra), i * interval);
    });
    setTimeout(onDone, rolls.length * interval + 120);
  }

  
  function setActiveSlotDiceSequence(seq){
    setBattleSlots(prev => prev.map((s, idx) => idx === activeBattleIndex ? ({ ...s, diceSequence: seq }) : s));
  }

/* ===================== Player Attack via Cube ===================== */
  function playerAttackViaCube(){
    if (rolling) return;
    if (!activeChar || !activeWeapon) return;

    setRolling(true);
    setSyncInfo("");

    const pre = precomputeTrueDMG(activeChar, activeWeapon);
    const base = chaosRollBase();
    setActiveSlotDiceSequence(base.rolls ?? [base.first ?? 1]);

    // If "2" -> show cube 2 and open modal
    if (base.needsRiskChoice) {
      setActiveSlotDiceSequence([2]);
      spinToFace(2, 900);
      setTimeout(() => {
        setRiskModal({ pre, chaosBase: base });
        setRolling(false); // allow modal buttons, but block attack via modal state
      }, 260);
      return;
    }

    // For 6-series: animate fast chain (includes final non-6)
    const doResolve = () => {
      if (base.jackpot) {
        setJackpotFlash(true);
        setTimeout(() => setJackpotFlash(false), 320);
      }

      const result = finalizeDamage(activeChar, activeWeapon, pre, base, false);
      applyResultToCharacter(activeChar.id, result);
      applyResultToBattlefield(result);
      setRolling(false);
    };

    if (base.rolls.length > 1) {
      animateBerserkSeries(base.rolls, doResolve);
    } else {
      spinToFace(base.rolls[0], 900);
      setTimeout(doResolve, 260);
    }
  }

  function applyResultToCharacter(charId, result){
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      const stats = { ...(c.stats ?? emptyCharacter().stats) };
      stats.totalAttacks += 1;
      stats.totalDamage += result.dmg;
      stats.maxDamage = Math.max(stats.maxDamage ?? 0, result.dmg);
      if (result.sixSeries > 0) stats.sixCount += 1;
      stats.maxSixSeries = Math.max(stats.maxSixSeries ?? 0, result.sixSeries);

      const log = [{ id: uid(), ...result }, ...(c.log ?? [])].slice(0, 200);

      return { ...c, lastDamage: result.dmg, stats, log };
    }));
  }

  function applyResultToBattlefield(result){
    setBattleSlots(prev => prev.map((s, idx) => {
      if (idx !== activeBattleIndex) return s;
      const enemyHP = clamp((s.enemyHP ?? s.enemyHPMax) - result.dmg, 0, s.enemyHPMax ?? 30);
      const playerLog = [{ id: uid(), text: `🎲 ${result.rolls.join("→")} | 💥 ${result.dmg} DMG` }, ...(s.playerLog ?? [])].slice(0, 80);
      const popup = { id: uid(), value: result.dmg, kind: result.jackpot ? "jackpot" : "hit", ts: Date.now() };
      // auto-clear popups a moment later (visual-only)
      setTimeout(() => {
        setBattleSlots(pp => pp.map((ss, j) => {
          if (j !== activeBattleIndex) return ss;
          const rest = (ss.popups ?? []).filter(x => x.id !== popup.id);
          return { ...ss, popups: rest };
        }));
      }, 900);

      return { ...s, lastPlayerDMG: result.dmg, enemyHP, playerLog, popups: [popup, ...(s.popups ?? [])].slice(0, 12) };
    }));
  }

  /* ===================== Risk Modal handlers ===================== */
  const modalOpen = !!riskModal;

  function riskKeep(){
    if (!riskModal || !activeChar || !activeWeapon) return;
    setRolling(true);
    const base = riskModal.chaosBase; // rolls: [2]
    const chaos = { ...base, multiplier: 0.5, rolls: [2], needsRiskChoice: false };
    setActiveSlotDiceSequence([2]);
    spinToFace(2, 540);
    setTimeout(() => {
      const result = finalizeDamage(activeChar, activeWeapon, riskModal.pre, chaos, false);
      applyResultToCharacter(activeChar.id, result);
      applyResultToBattlefield(result);
      setRiskModal(null);
      setRolling(false);
    }, 240);
  }

  function riskRoll(){
    if (!riskModal || !activeChar || !activeWeapon) return;
    setRolling(true);
    const rr = resolveRiskReroll(); // {roll, multiplier}
    setActiveSlotDiceSequence([2, rr.roll]);
    // animate to risk roll face quickly
    spinToFace(rr.roll, 780);

    setTimeout(() => {
      const chaos = {
        first: 2,
        rolls: [2, rr.roll],
        multiplier: rr.multiplier,
        jackpot: false,
        sixSeries: 0,
        needsRiskChoice: false
      };

      const result = finalizeDamage(activeChar, activeWeapon, riskModal.pre, chaos, true);
      applyResultToCharacter(activeChar.id, result);
      applyResultToBattlefield(result);

      setRiskModal(null);
      setRolling(false);
    }, 260);
  }

  /* ===================== Sync ===================== */
  function doExport(){
    const payload = { characters, bestiary, battleSlots, selectedEnemyId, activeCharId, theme };
    const code = exportCode(payload);
    setSyncText(code);
    setSyncInfo("✅ Код создан. Скопируй и отправь другу.");
  }
  function doImport(){
    try {
      const payload = importCode(syncText);
      if (payload.characters) setCharacters(payload.characters);
      if (payload.bestiary) setBestiary(payload.bestiary);
      if (payload.battleSlots) setBattleSlots(payload.battleSlots);
      if (payload.selectedEnemyId) setSelectedEnemyId(payload.selectedEnemyId);
      if (payload.activeCharId) setActiveCharId(payload.activeCharId);
      if (payload.theme) setTheme(payload.theme);
      setSyncInfo("✅ Импорт OK. Данные заменены.");
    } catch {
      setSyncInfo("❌ Неверный код.");
    }
  }

  /* ===================== UI ===================== */
  return (
    <div className="app-shell">
      <DnDTheme />

      <header className="header">
        <div className="sigil" aria-hidden>
          <span style={{ fontSize: 22, filter:"drop-shadow(0 0 10px rgba(168,85,247,.4))" }}>✦</span>
        </div>
        <div>
          <div className="title">CHAOS ENGINE</div>
          <div className="subtitle">Gambit Protocol • Legendary Build</div>
        </div>
      </header>

      <div className="row" style={{ justifyContent: "center", position:"relative", zIndex:3, gap: 10, marginBottom: 14, flexWrap:"wrap" }}>
        <button className={`btn ${tab === "characters" ? "btn-gold" : "btn-ghost"}`} onClick={() => setTab("characters")}>Персонажи</button>
        <button className={`btn ${tab === "bestiary" ? "btn-gold" : "btn-ghost"}`} onClick={() => setTab("bestiary")}>Бестиарий</button>
        <button className={`btn ${tab === "battle" ? "btn-gold" : "btn-ghost"}`} onClick={() => setTab("battle")}>Поле боя</button>

        <select className="select" style={{ maxWidth: 180 }} value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="arcane">Theme: Arcane</option>
          <option value="blood">Theme: Blood</option>
          <option value="toxic">Theme: Toxic</option>
          <option value="gold">Theme: Gold</option>
        </select>

        <button className="btn" onClick={doExport}>SYNC: Export</button>
      </div>

      <div className="row" style={{ justifyContent:"center", position:"relative", zIndex:3, marginBottom: 16 }}>
        <div className="panel-inner" style={{ width: "min(980px, 100%)" }}>
          <div className="label">SYNC CODE</div>
          <textarea className="textarea" rows={3} value={syncText} onChange={e => setSyncText(e.target.value)} placeholder="Сюда вставить код друга → Import" />
          <div className="row" style={{ marginTop: 10, justifyContent:"space-between", alignItems:"center" }}>
            <button className="btn btn-gold" onClick={doImport}>Import (Replace All)</button>
            <span className="hint">{syncInfo}</span>
          </div>
        </div>
      </div>

      <main style={{ position:"relative", zIndex:3 }}>
        {tab === "characters" && (
          <CharactersPage
            characters={characters}
            activeCharId={activeCharId ?? characters[0]?.id ?? null}
            setActiveCharId={setActiveCharId}
            activeChar={activeChar}
            activeWeapon={activeWeapon}
            addCharacter={addCharacter}
            removeCharacter={removeCharacter}
            setCharField={setCharField}
            addWeapon={addWeapon}
            updateWeapon={updateWeapon}
            removeWeapon={removeWeapon}
            addMod={addMod}
            updateMod={updateMod}
            removeMod={removeMod}
            clearLog={clearLog}
            resetStats={resetStats}
            averageDamage={averageDamage}
            sixPercent={sixPercent}
          />
        )}

        {tab === "bestiary" && (
          <BestiaryPage
            bestiary={bestiary}
            selectedEnemyId={selectedEnemyId ?? bestiary[0]?.id ?? null}
            setSelectedEnemyId={setSelectedEnemyId}
            filteredEnemies={filteredEnemies}
            enemySearch={enemySearch}
            setEnemySearch={setEnemySearch}
            enemySortAZ={enemySortAZ}
            setEnemySortAZ={setEnemySortAZ}
            selectedEnemy={selectedEnemy}
            addEnemy={addEnemy}
            removeEnemy={removeEnemy}
            setEnemyField={setEnemyField}
            addEnemyAttack={addEnemyAttack}
            updateEnemyAttack={updateEnemyAttack}
            removeEnemyAttack={removeEnemyAttack}
            sendToBattlefield={sendToBattlefield}
          />
        )}

        {tab === "battle" && (
          <BattlefieldPage
            characters={characters}
            bestiary={bestiary}
            activeChar={activeChar}
            activeWeapon={activeWeapon}
            selectedEnemyId={selectedEnemyId ?? bestiary[0]?.id ?? null}
            setSelectedEnemyId={setSelectedEnemyId}
            battleSlots={battleSlots}
            activeBattleIndex={activeBattleIndex}
            setActiveBattleIndex={setActiveBattleIndex}
            setBattleField={setBattleField}
            cubeRotation={cubeRotation}
            rolling={rolling || modalOpen}
            jackpotFlash={jackpotFlash}
            playerAttackViaCube={playerAttackViaCube}
            enemyAttackStub={enemyAttackStub}
            syncBattleSelectionFromCurrent={syncBattleSelectionFromCurrent}
          />
        )}
      </main>

      <AnimatePresence>
        {riskModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <div className="panel-inner">
                <h3>Double or Nothing</h3>
                <div className="hint">Выпало <b>2</b>. Выбор: оставить x0.5 или рискнуть.</div>
                <div className="ruleline" />
                <div className="row" style={{ alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div className="label">Keep</div>
                    <div className="big">×0.5</div>
                  </div>
                  <div>
                    <div className="label">Risk Re-roll</div>
                    <div className="hint">4–6 → ×1.25 • 1–3 → 0 DMG</div>
                  </div>
                </div>
                <div className="ruleline" />
                <div className="row" style={{ justifyContent:"space-between" }}>
                  <button className="btn btn-gold" onClick={riskKeep}>Оставить</button>
                  <button className="btn btn-danger" onClick={riskRoll}>Рискнуть</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hint" style={{ position:"relative", zIndex:3, textAlign:"center", marginTop: 14, opacity: .8 }}>
        Chaos Roll: 1 miss • 2 choice • 3×1 • 4×1.5 • 5×2 • 6 jackpot chain (berserk)
      </div>
    </div>
  );
}
