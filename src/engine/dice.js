export function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Base chaos roll:
 * - 1 => miss
 * - 2 => x0.5 but UI must choose Keep/Risk (Risk uses resolveRiskReroll)
 * - 3 => x1
 * - 4 => x1.5
 * - 5 => x2
 * - 6 => jackpot x3 + AUTO combo rolls until non-6 (each extra 6 adds +1)
 */
export function chaosRollBase() {
  const rolls = [];
  const first = rollD6();
  rolls.push(first);

  if (first === 1) return { first, rolls, multiplier: 0, jackpot: false, sixSeries: 0, needsRiskChoice: false };
  if (first === 2) return { first, rolls, multiplier: 0.5, jackpot: false, sixSeries: 0, needsRiskChoice: true };
  if (first === 3) return { first, rolls, multiplier: 1, jackpot: false, sixSeries: 0, needsRiskChoice: false };
  if (first === 4) return { first, rolls, multiplier: 1.5, jackpot: false, sixSeries: 0, needsRiskChoice: false };
  if (first === 5) return { first, rolls, multiplier: 2, jackpot: false, sixSeries: 0, needsRiskChoice: false };

  let mult = 3;
  let sixSeries = 1;

  while (true) {
    const next = rollD6();
    rolls.push(next);
    if (next === 6) {
      mult += 1;
      sixSeries += 1;
    } else break;
  }

  return { first, rolls, multiplier: mult, jackpot: true, sixSeries, needsRiskChoice: false };
}

/**
 * Risk Re-roll:
 * success 4–6 => x1.25
 * fail 1–3 => x0
 */
export function resolveRiskReroll() {
  const r = rollD6();
  const success = r >= 4;
  return { roll: r, success, multiplier: success ? 1.25 : 0 };
}
