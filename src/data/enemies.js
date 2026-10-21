/**
 * 冒險地圖與怪物圖鑑資料庫 (src/data/enemies.js)
 */

 export const MapsCatalog = [
  {
      id: 'grassland',
      index: 0,
      title: '🗺️ 第一章：晨曦微風草原',
      themeClass: 'map-theme-grassland',
      gatherSpot: { name: '✨ 閃光草叢', sprite: '🌿💧', drops: ['fiber', 'dew'] },
      enemies: ['slime_ink', 'sprite_paper', 'turtle_dict'],
      boss: 'boss_doodle'
  },
  {
      id: 'ruins',
      index: 1,
      title: '⏳ 第二章：時光沙漏遺跡',
      themeClass: 'map-theme-ruins',
      gatherSpot: { name: '⛏️ 考古沙堆', sprite: '🏺⛏️', drops: ['page', 'clay'] },
      enemies: ['bird_clock', 'guard_terra'],
      boss: 'boss_dragon'
  },
  {
      id: 'mine',
      index: 2,
      title: '💎 第三章：幾何水晶礦坑',
      themeClass: 'map-theme-mine',
      gatherSpot: { name: '🔋 能量水晶簇', sprite: '🔮⚡', drops: ['crystal', 'gear'] },
      enemies: ['goblin_tube', 'golem_magnet'],
      boss: 'boss_omega'
  }
];

export const EnemiesCatalog = {
  // --- 第一張地圖：晨曦微風草原 ---
  slime_ink: {
      id: 'slime_ink',
      name: '💧 墨水史萊姆',
      sprite: '🔵',
      level: 1,
      maxHp: 50,
      atk: 12,
      goldReward: 20,
      expReward: 25,
      traitType: 'split',
      traitDesc: '【分裂特性】答錯時史萊姆會吸收墨水，回復 15 點生命值！',
      drops: [{ mat: 'ink', chance: 0.9, amount: 2 }, { mat: 'dew', chance: 0.5, amount: 1 }]
  },
  sprite_paper: {
      id: 'sprite_paper',
      name: '✈️ 疾風紙飛機精靈',
      sprite: '🛩️',
      level: 2,
      maxHp: 65,
      atk: 15,
      goldReward: 28,
      expReward: 32,
      traitType: 'float_opt',
      traitDesc: '【疾風干擾】選項按鈕會隨風晃動，考驗眼力！',
      drops: [{ mat: 'wing', chance: 0.9, amount: 2 }, { mat: 'fiber', chance: 0.6, amount: 1 }]
  },
  turtle_dict: {
      id: 'turtle_dict',
      name: '🐢 字典岩龜',
      sprite: '🐢',
      level: 3,
      maxHp: 90,
      atk: 18,
      goldReward: 35,
      expReward: 40,
      traitType: 'heavy_shell',
      traitDesc: '【厚重書殼】第 1 擊傷害減半，連續答對 (Combo) 可造成破甲暴擊！',
      drops: [{ mat: 'page', chance: 0.95, amount: 2 }]
  },
  boss_doodle: {
      id: 'boss_doodle',
      name: '👑 暴走塗鴉獸 (BOSS)',
      sprite: '👹',
      isBoss: true,
      level: 5,
      maxHp: 140,
      atk: 24,
      goldReward: 80,
      expReward: 100,
      traitType: 'ink_blind',
      traitDesc: '【魔王・墨汁噴灑】高血量魔王，擊敗可獲得稀有「塗鴉核心」！',
      drops: [{ mat: 'core_doodle', chance: 1.0, amount: 1 }, { mat: 'ink', chance: 1.0, amount: 3 }]
  },

  // --- 第二張地圖：時光沙漏遺跡 ---
  bird_clock: {
      id: 'bird_clock',
      name: '🕰️ 發條盜賊鳥',
      sprite: '🦅',
      level: 4,
      maxHp: 80,
      atk: 18,
      goldReward: 45,
      expReward: 45,
      traitType: 'steal_gold',
      traitDesc: '【妙手空空】答錯時會偷走你 10 枚金幣（擊敗可全數奪回）！',
      drops: [{ mat: 'gear', chance: 0.9, amount: 2 }]
  },
  guard_terra: {
      id: 'guard_terra',
      name: '🗿 兵馬俑守衛',
      sprite: '🗿',
      level: 5,
      maxHp: 110,
      atk: 22,
      goldReward: 50,
      expReward: 55,
      traitType: 'heavy_shell',
      traitDesc: '【歷史重甲】擁有堅硬陶土護甲，高血量守衛。',
      drops: [{ mat: 'clay', chance: 0.9, amount: 2 }, { mat: 'page', chance: 0.6, amount: 1 }]
  },
  boss_dragon: {
      id: 'boss_dragon',
      name: '👑 歲月青銅巨龍 (BOSS)',
      sprite: '🐉',
      isBoss: true,
      level: 8,
      maxHp: 190,
      atk: 28,
      goldReward: 120,
      expReward: 150,
      traitType: 'boss_time',
      traitDesc: '【魔王・時空威壓】鎮守沙漏遺跡的機械巨龍！',
      drops: [{ mat: 'gear', chance: 1.0, amount: 4 }, { mat: 'clay', chance: 1.0, amount: 3 }]
  },

  // --- 第三張地圖：幾何水晶礦坑 ---
  goblin_tube: {
      id: 'goblin_tube',
      name: '🧪 瘋狂試管地精',
      sprite: '👺',
      level: 6,
      maxHp: 100,
      atk: 24,
      goldReward: 60,
      expReward: 65,
      traitType: 'shuffle',
      traitDesc: '【催眠毒霧】每次出題會徹底打亂選項順序！',
      drops: [{ mat: 'crystal', chance: 0.85, amount: 2 }, { mat: 'dew', chance: 0.7, amount: 2 }]
  },
  golem_magnet: {
      id: 'golem_magnet',
      name: '🧲 多面體磁石巨像',
      sprite: '🤖',
      level: 7,
      maxHp: 135,
      atk: 26,
      goldReward: 70,
      expReward: 75,
      traitType: 'shuffle',
      traitDesc: '【磁極洗牌】高防禦機械巨像，掉落珍貴幾何碎晶。',
      drops: [{ mat: 'crystal', chance: 0.95, amount: 2 }, { mat: 'gear', chance: 0.7, amount: 2 }]
  },
  boss_omega: {
      id: 'boss_omega',
      name: '👑 真理運算機甲・歐米茄',
      sprite: '🛸',
      isBoss: true,
      level: 10,
      maxHp: 240,
      atk: 32,
      goldReward: 200,
      expReward: 250,
      traitType: 'boss_omega',
      traitDesc: '【終極魔王・絕對邏輯】書境最深處的超級運算核心！',
      drops: [{ mat: 'crystal', chance: 1.0, amount: 5 }, { mat: 'core_doodle', chance: 1.0, amount: 2 }]
  }
};