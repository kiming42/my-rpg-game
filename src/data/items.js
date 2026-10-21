/**
 * 24 種六大章節素材 ＋ 28 件分類武器/護具/飾品 ＋ 4 種煉金藥水資料庫 (src/data/items.js)
 */

 export const MaterialsCatalog = {
  // 第一章：晨曦微風草原
  fiber:       { id: 'fiber',       name: '柔韌草纖維', icon: '🌿', sprite: 'icon_scroll', bg: 'bg-green',  desc: '草原基礎綁帶材料，亦可用於縫製擴充背包' },
  dew:         { id: 'dew',         name: '清澈露水',   icon: '💧', sprite: 'icon_blue_pot', bg: 'bg-blue', desc: '蘊含自然治癒能量的晨露，調配藥水必備' },
  ink:         { id: 'ink',         name: '魔法墨滴',   icon: '🩸', sprite: 'icon_blue_pot', bg: 'bg-purple', desc: '墨水史萊姆掉落的魔力液體' },
  wing:        { id: 'wing',        name: '輕盈紙翼',   icon: '🪽', sprite: 'icon_bow', bg: 'bg-green',     desc: '紙飛機精靈掉落，極度輕巧' },
  page:        { id: 'page',        name: '堅硬書頁',   icon: '📜', sprite: 'icon_scroll', bg: 'bg-blue',   desc: '字典岩龜掉落，比鋼鐵更堅硬' },
  core_doodle: { id: 'core_doodle', name: '塗鴉核心',   icon: '🔮', sprite: 'icon_shroom', bg: 'bg-orange', desc: '擊敗草原塗鴉魔王掉落的稀有結晶' },

  // 第二章：時光沙漏遺跡
  feather:     { id: 'feather',     name: '學者羽毛',   icon: '🪶', sprite: 'icon_dagger', bg: 'bg-blue',   desc: '幽靈歷史學者遺落的記憶羽毛筆' },
  coin_old:    { id: 'coin_old',    name: '古文明銅幣', icon: '🪙', sprite: 'icon_ring', bg: 'bg-orange',   desc: '刻印著古老朝代年號的銅錢' },
  gear:        { id: 'gear',        name: '青銅齒輪',   icon: '⚙️', sprite: 'icon_ring', bg: 'bg-blue',     desc: '發條盜賊鳥身上的精密古代零件' },
  clay:        { id: 'clay',        name: '陶土碎片',   icon: '🏺', sprite: 'icon_armor', bg: 'bg-green',   desc: '兵馬俑守衛身上的堅硬護甲殘片' },
  scale_time:  { id: 'scale_time',  name: '時光龍鱗',   icon: '🐉', sprite: 'icon_armor', bg: 'bg-orange',  desc: '歲月青銅巨龍掉落的傳說逆鱗' },

  // 第三章：幾何水晶礦坑
  acid:        { id: 'acid',        name: '不穩定溶液', icon: '🧪', sprite: 'icon_red_pot', bg: 'bg-purple', desc: '瘋狂試管地精調配的強效化學藥劑' },
  coil:        { id: 'coil',        name: '電磁線圈',   icon: '🧲', sprite: 'icon_ring', bg: 'bg-blue',     desc: '多面體磁石巨像的磁力核心線圈' },
  elec_core:   { id: 'elec_core',   name: '高壓電核',   icon: '⚡', sprite: 'icon_fire', bg: 'bg-orange',   desc: '靜電幾何史萊姆體內的雷電結晶' },
  crystal:     { id: 'crystal',     name: '幾何碎晶',   icon: '💎', sprite: 'icon_shroom', bg: 'bg-purple', desc: '水晶礦坑蘊含高能量的多面體結晶' },
  core_omega:  { id: 'core_omega',  name: '歐米茄核心', icon: '🛸', sprite: 'icon_ring', bg: 'bg-orange',   desc: '終極運算機甲掉落的最高權限核心' },

  // 第四章：熔岩煉金火口
  lava_rock:   { id: 'lava_rock',   name: '熾熱熔岩石', icon: '🌋', sprite: 'icon_fire', bg: 'bg-orange',   desc: '熔岩魔像體內永不熄滅的火成岩' },
  ash_powder:  { id: 'ash_powder',  name: '煉金火藥粉', icon: '💥', sprite: 'icon_red_pot', bg: 'bg-purple', desc: '爆裂火藥桶掉落的高純度火藥' },
  core_magma:  { id: 'core_magma',  name: '紅蓮業火核', icon: '🔥', sprite: 'icon_fire', bg: 'bg-orange',   desc: '擊敗熔岩火口魔王獲得的烈焰核心' },

  // 第五章：冰封星象雪原
  ice_shard:   { id: 'ice_shard',   name: '萬年永凍冰', icon: '❄️', sprite: 'icon_blue_pot', bg: 'bg-blue', desc: '冰晶雪怪身上的極寒冰稜' },
  star_dust:   { id: 'star_dust',   name: '星象觀測砂', icon: '🌟', sprite: 'icon_scroll', bg: 'bg-purple', desc: '星象貓頭鷹收集的夜空星砂' },
  core_frost:  { id: 'core_frost',  name: '極光冰凰羽', icon: '🧊', sprite: 'icon_bow', bg: 'bg-orange',    desc: '擊敗雪原魔王獲得的傳說冰羽' },

  // 第六章：虛空記憶圖書館
  void_ink:    { id: 'void_ink',    name: '虛空暗影墨', icon: '🌌', sprite: 'icon_blue_pot', bg: 'bg-purple', desc: '噬魂魔導書滲出的高維度墨水' },
  rune_origin: { id: 'rune_origin', name: '真理銘文石', icon: '🔯', sprite: 'icon_ring', bg: 'bg-orange',   desc: '虛空記憶圖書館記載萬物法則的符文' }
};

export const EquipmentCatalog = {
  // =========================================================================
  // 🗡️ 武器類 (Category: weapon - 主手 weapon / 副手 offhand)
  // =========================================================================
  wep_wood_sword: {
      id: 'wep_wood_sword', category: 'weapon', slot: 'weapon', sprite: 'icon_sword', bg: 'bg-green',
      name: '🗡️ 練習木劍 (T1)', atk: 5, hp: 0, desc: '基礎練習用木劍 (攻擊+5)'
  },
  wep_book_greatsword: {
      id: 'wep_book_greatsword', category: 'weapon', slot: 'weapon', sprite: 'icon_sword', bg: 'bg-blue',
      name: '🗡️ 精裝書脊大劍 (T2)', atk: 15, hp: 35, desc: '【主手武器】攻擊+15、血量+35｜厚重字典鍛造的巨劍',
      recipe: { page: 2, fiber: 2, gold: 45 }
  },
  wep_ink_staff: {
      id: 'wep_ink_staff', category: 'weapon', slot: 'weapon', sprite: 'icon_fire', bg: 'bg-purple',
      name: '🪄 流雲水墨法杖 (T2)', atk: 19, hp: 15, desc: '【主手武器】攻擊+19、血量+15｜揮灑魔法墨水的高攻法杖',
      recipe: { ink: 2, dew: 2, gold: 45 }
  },
  wep_paper_dart: {
      id: 'wep_paper_dart', category: 'weapon', slot: 'weapon', sprite: 'icon_bow', bg: 'bg-purple',
      name: '🏹 疾風迴旋獵弓 (T2)', atk: 17, hp: 20, desc: '【主手武器】攻擊+17、血量+20｜精準連射獵弓',
      recipe: { wing: 2, fiber: 2, gold: 45 }
  },
  wep_dew_bell: {
      id: 'wep_dew_bell', category: 'weapon', slot: 'weapon', sprite: 'icon_scroll', bg: 'bg-blue',
      name: '🌿 純淨露水聖典 (T2)', atk: 14, hp: 45, desc: '【主手武器】攻擊+14、血量+45｜強化聖言治癒與續航',
      recipe: { dew: 3, ink: 1, gold: 45 }
  },
  off_feather_dagger: {
      id: 'off_feather_dagger', category: 'weapon', slot: 'offhand', sprite: 'icon_dagger', bg: 'bg-blue',
      name: '🗡️ 疾風羽刃短匕 (副手T2)', atk: 10, def: 4, hp: 20, desc: '【副手武器】攻擊+10、防禦+4、血量+20｜可與主手武器同時穿戴！',
      recipe: { wing: 2, page: 1, gold: 50 }
  },
  wep_clock_blade: {
      id: 'wep_clock_blade', category: 'weapon', slot: 'weapon', sprite: 'icon_dagger', bg: 'bg-orange',
      name: '🕰️ 時針青銅戰刃 (T3)', atk: 28, hp: 60, desc: '【主手武器】攻擊+28、血量+60｜蘊含時光沙漏之力',
      recipe: { gear: 3, coin_old: 2, feather: 2, gold: 110 }
  },
  off_bronze_buckler: {
      id: 'off_bronze_buckler', category: 'weapon', slot: 'offhand', sprite: 'icon_armor', bg: 'bg-purple',
      name: '🛡️ 齒輪機關圓盾 (副手T3)', atk: 8, def: 14, hp: 50, desc: '【副手盾牌】攻擊+8、防禦+14、血量+50｜大幅降低魔物圍攻傷害',
      recipe: { gear: 2, clay: 3, gold: 95 }
  },
  wep_omega_blade: {
      id: 'wep_omega_blade', category: 'weapon', slot: 'weapon', sprite: 'icon_sword', bg: 'bg-orange',
      name: '⚡ 等離子真理聖劍 (T4)', atk: 42, hp: 90, desc: '【主手武器】攻擊+42、血量+90｜電磁與水晶融合的聖劍',
      recipe: { crystal: 3, coil: 2, core_omega: 1, gold: 190 }
  },
  wep_magma_hammer: {
      id: 'wep_magma_hammer', category: 'weapon', slot: 'weapon', sprite: 'icon_fire', bg: 'bg-orange',
      name: '🌋 紅蓮業火戰錘 (T4.5)', atk: 56, hp: 120, desc: '【主手武器】攻擊+56、血量+120｜一擊粉碎魔物護甲',
      recipe: { lava_rock: 3, ash_powder: 2, core_magma: 1, gold: 270 }
  },
  off_star_orb: {
      id: 'off_star_orb', category: 'weapon', slot: 'offhand', sprite: 'icon_blue_pot', bg: 'bg-orange',
      name: '🔮 極光星象法球 (副手T4)', atk: 25, def: 12, hp: 65, desc: '【副手法器】攻擊+25、防禦+12、血量+65｜星砂凝聚的副手魔導器',
      recipe: { ice_shard: 2, star_dust: 3, gold: 220 }
  },
  wep_void_genesis: {
      id: 'wep_void_genesis', category: 'weapon', slot: 'weapon', sprite: 'icon_sword', bg: 'bg-orange',
      name: '🌌 創世萬象書皇劍 (T5終極)', atk: 80, hp: 180, desc: '【終極神武】攻擊+80、血量+180｜統御六大書境與多周目的傳說神劍！',
      recipe: { void_ink: 3, rune_origin: 2, core_frost: 1, gold: 420 }
  },

  // =========================================================================
  // 🛡️ 護具類 (Category: armor - 頭盔 head / 胸甲 armor / 護手 gloves / 護腿 legs / 戰靴 boots)
  // =========================================================================
  arm_cloth: {
      id: 'arm_cloth', category: 'armor', slot: 'armor', sprite: 'icon_armor', bg: 'bg-green',
      name: '👕 學者粗布衣 (T1)', def: 4, hp: 20, desc: '輕便的冒險者布衣 (防禦+4, 血量+20)'
  },
  arm_dict_plate: {
      id: 'arm_dict_plate', category: 'armor', slot: 'armor', sprite: 'icon_armor', bg: 'bg-blue',
      name: '🛡️ 硬殼字典胸甲 (胸甲T2)', def: 13, hp: 65, desc: '【胸甲】防禦+13、血量+65｜大幅減少魔物圍攻傷害',
      recipe: { page: 3, fiber: 2, gold: 55 }
  },
  gloves_ink: {
      id: 'gloves_ink', category: 'armor', slot: 'gloves', sprite: 'icon_armor', bg: 'bg-blue',
      name: '🧤 染墨靈巧護手 (護手T2)', atk: 6, def: 7, hp: 30, desc: '【護手】攻擊+6、防禦+7、血量+30｜提升出招穩定度',
      recipe: { fiber: 3, ink: 2, gold: 45 }
  },
  boots_wing: {
      id: 'boots_wing', category: 'armor', slot: 'boots', sprite: 'icon_bow', bg: 'bg-green',
      name: '🥾 輕盈紙翼戰靴 (戰靴T2)', def: 8, hp: 40, desc: '【戰靴】防禦+8、血量+40｜如紙飛機般輕盈的冒險戰靴',
      recipe: { wing: 3, fiber: 2, gold: 45 }
  },
  helm_scholar: {
      id: 'helm_scholar', category: 'armor', slot: 'head', sprite: 'icon_armor', bg: 'bg-purple',
      name: '🪖 青銅博學頭盔 (頭盔T3)', def: 12, hp: 50, desc: '【頭盔】防禦+12、血量+50｜保護頭部免受重創',
      recipe: { gear: 2, clay: 2, gold: 75 }
  },
  legs_terra: {
      id: 'legs_terra', category: 'armor', slot: 'legs', sprite: 'icon_armor', bg: 'bg-purple',
      name: '🦵 兵馬俑陶甲護腿 (護腿T3)', def: 15, hp: 70, desc: '【護腿】防禦+15、血量+70｜古代陶俑鍛造的厚重護腿',
      recipe: { clay: 3, coin_old: 2, gold: 90 }
  },
  arm_terra_mail: {
      id: 'arm_terra_mail', category: 'armor', slot: 'armor', sprite: 'icon_armor', bg: 'bg-orange',
      name: '🗿 兵馬俑戰神重鎧 (胸甲T3)', def: 24, hp: 120, desc: '【胸甲】防禦+24、血量+120｜堅不可摧的古代重鎧',
      recipe: { clay: 4, scale_time: 1, gold: 140 }
  },
  helm_crystal: {
      id: 'helm_crystal', category: 'armor', slot: 'head', sprite: 'icon_shroom', bg: 'bg-orange',
      name: '💎 幾何稜鏡戰盔 (頭盔T4)', atk: 10, def: 20, hp: 90, desc: '【頭盔】攻擊+10、防禦+20、血量+90｜折射能量光束的水晶頭盔',
      recipe: { crystal: 3, elec_core: 2, gold: 175 }
  },
  boots_magma: {
      id: 'boots_magma', category: 'armor', slot: 'boots', sprite: 'icon_fire', bg: 'bg-orange',
      name: '🌋 熔岩黑曜石戰靴 (戰靴T4)', atk: 12, def: 22, hp: 100, desc: '【戰靴】攻擊+12、防禦+22、血量+100｜踏碎烈焰的重型戰靴',
      recipe: { lava_rock: 3, ash_powder: 2, gold: 210 }
  },
  arm_frost_robe: {
      id: 'arm_frost_robe', category: 'armor', slot: 'armor', sprite: 'icon_armor', bg: 'bg-orange',
      name: '❄️ 極光星象聖鎧 (胸甲T5)', def: 38, hp: 190, desc: '【終極胸甲】防禦+38、血量+190｜萬年寒冰與星砂交織的傳說聖鎧',
      recipe: { ice_shard: 3, star_dust: 2, core_frost: 1, gold: 280 }
  },

  // =========================================================================
  // 💍 飾品與遺物類 (Category: relic - 項鍊 neck / 戒指 ring1, ring2 / 守護符 relic)
  // =========================================================================
  ring_copper: {
      id: 'ring_copper', category: 'relic', slot: 'ring1', sprite: 'icon_ring', bg: 'bg-blue',
      name: '💍 古文明銅戒', atk: 7, def: 5, hp: 25, desc: '【戒指1】攻擊+7、防禦+5、血量+25',
      recipe: { coin_old: 2, dew: 1, gold: 50 }
  },
  neck_feather: {
      id: 'neck_feather', category: 'relic', slot: 'neck', sprite: 'icon_scroll', bg: 'bg-purple',
      name: '📿 先知羽毛項鍊', atk: 11, def: 8, hp: 40, desc: '【項鍊】攻擊+11、防禦+8、血量+40｜寄宿歷史學者智慧的項鍊',
      recipe: { feather: 3, coin_old: 2, gold: 85 }
  },
  rel_doodle_charm: {
      id: 'rel_doodle_charm', category: 'relic', slot: 'relic', sprite: 'icon_shroom', bg: 'bg-orange',
      name: '🔮 塗鴉魔王御守', atk: 14, def: 10, hp: 55, desc: '【守護符】攻擊+14、防禦+10、血量+55',
      recipe: { core_doodle: 1, ink: 2, gold: 95 }
  },
  rel_magnet_ring: {
      id: 'rel_magnet_ring', category: 'relic', slot: 'ring2', sprite: 'icon_ring', bg: 'bg-purple',
      name: '🧲 電磁共鳴指環', atk: 18, def: 12, hp: 60, desc: '【戒指2】攻擊+18、防禦+12、血量+60',
      recipe: { coil: 2, crystal: 2, gold: 130 }
  },
  neck_magma_heart: {
      id: 'neck_magma_heart', category: 'relic', slot: 'neck', sprite: 'icon_fire', bg: 'bg-orange',
      name: '🔥 紅蓮龍心項鍊', atk: 24, def: 16, hp: 90, desc: '【高階項鍊】攻擊+24、防禦+16、血量+90',
      recipe: { core_magma: 1, lava_rock: 2, gold: 220 }
  },
  rel_void_crown: {
      id: 'rel_void_crown', category: 'relic', slot: 'relic', sprite: 'icon_ring', bg: 'bg-orange',
      name: '👑 虛空全知聖冠 (終極)', atk: 32, def: 24, hp: 120, desc: '【終極遺物】攻擊+32、防禦+24、血量+120',
      recipe: { void_ink: 2, rune_origin: 2, gold: 340 }
  }
};

// ================= 藥水與消耗品鍊金目錄 (Category: potion) =================
export const PotionsCatalog = {
  hp_pot_s: {
      id: 'hp_pot_s', category: 'potion', sprite: 'icon_red_pot', bg: 'bg-green',
      name: '🧪 生命紅藥水 (小)', effectType: 'hp', val: 70,
      desc: '恢復 70 點 HP。戰鬥中飲用不消耗攻擊回合！',
      recipe: { dew: 1, fiber: 1, gold: 10 }
  },
  mp_pot_s: {
      id: 'mp_pot_s', category: 'potion', sprite: 'icon_blue_pot', bg: 'bg-blue',
      name: '💧 魔力藍藥水 (SP)', effectType: 'mp', val: 45,
      desc: '恢復 45 點 SP/MP 魔力值，確保持續施放高階技能！',
      recipe: { ink: 1, dew: 1, gold: 10 }
  },
  hp_pot_l: {
      id: 'hp_pot_l', category: 'potion', sprite: 'icon_red_pot', bg: 'bg-purple',
      name: '🍷 特級生命靈藥', effectType: 'hp', val: 180,
      desc: '瞬間恢復 180 點 HP！應對 4～5 隻魔物圍攻必備救命藥劑。',
      recipe: { acid: 1, dew: 2, fiber: 1, gold: 25 }
  },
  atk_scroll: {
      id: 'atk_scroll', category: 'potion', sprite: 'icon_scroll', bg: 'bg-orange',
      name: '📜 狂暴知識卷軸', effectType: 'buff', val: 40,
      desc: '立即恢復 40 HP 與 40 SP，並獲得免傷護盾 1 層！',
      recipe: { page: 1, ink: 1, gold: 20 }
  }
};