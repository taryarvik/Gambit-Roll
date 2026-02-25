import { uid } from "./modifiers.js";

export const emptyWeapon = () => ({ id: uid(), name: "Sword", dmg: 100 });

export const emptyCharacter = () => ({
  id: uid(),
  name: "Hero",
  level: 1,
  weapons: [emptyWeapon()],
  activeWeaponId: null,
  modifiers: [],
  lastDamage: 0,
  log: [],
  stats: { totalAttacks: 0, totalDamage: 0, maxDamage: 0, sixCount: 0, maxSixSeries: 0 }
});

export const emptyMod = (category = "artifact") => ({
  id: uid(),
  name: "Artifact Effect",
  category,
  stage: "hard", // hard | light | final
  op: "add",     // add | sub | mul | div
  value: 10,
  enabled: true,
  tag: "A1"
});

export const emptyEnemyAttack = () => ({ id: uid(), name: "Hit", dmg: 10 });

export const emptyEnemy = () => ({
  id: uid(),
  dangerLocal: "C",
  dangerGlobal: "C",
  name: "Goblin",
  image: "",
  habitat: "",
  element: "",
  faction: "",
  weapon: "",
  hp: 30,
  defense: 0,
  attacks: [emptyEnemyAttack()],
  agility: 10,
  size: 10,
  intellect: 5
});

export const emptyBattleSlot = () => ({
  id: uid(),
  playerCharId: null,
  enemyId: null,
  danger: "D",
  playerHP: 100,
  playerHPMax: 100,
  enemyHP: 30,
  enemyHPMax: 30,
  lastPlayerDMG: 0,
  lastEnemyDMG: 0,
  playerLog: [],
  enemyLog: []
});
