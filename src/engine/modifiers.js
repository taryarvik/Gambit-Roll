export function uid() {
  return (crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

/**
 * Stable order: (+/-) then (×) then (÷)
 * out = (base + addNet) * mul / div
 */
export function applyStageOps(base, mods, stageChar, logLines) {
  let addNet = 0;
  let mul = 1;
  let div = 1;

  // add/sub
  mods.forEach(m => {
    const v = Number(m.value);
    if (!Number.isFinite(v)) return;
    const label = `[${stageChar}][${m.tag || "—"}] ${m.name}`;
    if (m.op === "add") { addNet += v; logLines.push(`${label} +${v}`); }
    if (m.op === "sub") { addNet -= v; logLines.push(`${label} -${v}`); }
  });

  // mul
  mods.forEach(m => {
    const v = Number(m.value);
    if (!Number.isFinite(v)) return;
    const label = `[${stageChar}][${m.tag || "—"}] ${m.name}`;
    if (m.op === "mul") { mul *= v; logLines.push(`${label} ×${v}`); }
  });

  // div
  mods.forEach(m => {
    const v = Number(m.value);
    if (!Number.isFinite(v) || v === 0) return;
    const label = `[${stageChar}][${m.tag || "—"}] ${m.name}`;
    if (m.op === "div") { div *= v; logLines.push(`${label} ÷${v}`); }
  });

  const out = (base + addNet) * mul / div;
  const sign = addNet >= 0 ? "+" : "-";
  logLines.push(`[${stageChar}] result = (${base} ${sign} ${Math.abs(addNet)}) ×${mul} ÷${div} = ${out.toFixed(2)}`);
  return out;
}
