/**
 * 30 種書境素材（含 6 種傳說稀有素材）＋ 四大職業專屬武器/全套護具/飾品/藥水資料庫 (src/data/items.js)
 */

export const MaterialsCatalog = {
    // ================= 基礎與章節素材 =================
    fiber:       { id: 'fiber',       name: '柔韌草纖維', icon: '🌿', rarity: 'common', sprite: 'icon_scroll', bg: 'bg-green',  desc: '草原基礎綁帶材料，亦可用於擴充背包' },
    dew:         { id: 'dew',         name: '清澈露水',   icon: '💧', rarity: 'common', sprite: 'icon_blue_pot', bg: 'bg-blue', desc: '蘊含自然治癒能量的晨露，調配藥水必備' },
    ink:         { id: 'ink',         name: '魔法墨滴',   icon: '🩸', rarity: 'common', sprite: 'icon_blue_pot', bg: 'bg-purple', desc: '墨水史萊姆掉落的魔力液體' },
    wing:        { id: 'wing',         name: '輕盈紙翼',   icon: '🪽', rarity: 'common', sprite: 'icon_bow', bg: 'bg-green',     desc: '紙飛機精靈掉落，極度輕巧' },
    page:        { id: 'page',        name: '堅硬書頁',   icon: '📜', rarity: 'common', sprite: 'icon_scroll', bg: 'bg-blue',   desc: '字典岩龜掉落，比鋼鐵更堅硬' },
    core_doodle: { id: 'core_doodle', name: '塗鴉核心',   icon: '🔮', rarity: 'rare',   sprite: 'icon_shroom', bg: 'bg-orange', desc: '【BOSS素材】擊敗草原塗鴉魔王掉落的結晶' },

    feather:     { id: 'feather',     name: '學者羽毛',   icon: '🪶', rarity: 'common', sprite: 'icon_dagger', bg: 'bg-blue',   desc: '幽靈歷史學者遺落的記憶羽毛筆' },
    coin_old:    { id: 'coin_old',    name: '古文明銅幣', icon: '🪙', rarity: 'common', sprite: 'icon_ring', bg: 'bg-orange',   desc: '刻印著古老朝代年號的銅錢' },
    gear:        { id: 'gear',        name: '青銅齒輪',   icon: '⚙️', rarity: 'common', sprite: 'icon_ring', bg: 'bg-blue',     desc: '發條盜賊鳥身上的精密古代零件' },
    clay:        { id: 'clay',        name: '陶土碎片',   icon: '🏺', rarity: 'common', sprite: 'icon_armor', bg: 'bg-green',   desc: '兵馬俑守衛身上的堅硬護甲殘片' },
    scale_time:  { id: 'scale_time',  name: '時光龍鱗',   icon: '🐉', rarity: 'rare',   sprite: 'icon_armor', bg: 'bg-orange',  desc: '【BOSS素材】歲月青銅巨龍掉落的傳說逆鱗' },

    acid:        { id: 'acid',        name: '不穩定溶液', icon: '🧪', rarity: 'common', sprite: 'icon_red_pot', bg: 'bg-purple', desc: '瘋狂試管地精調配的強效化學藥劑' },
    coil:        { id: 'coil',        name: '電磁線圈',   icon: '🧲', rarity: 'common', sprite: 'icon_ring', bg: 'bg-blue',     desc: '多面體磁石巨像的磁力核心線圈' },
    elec_core:   { id: 'elec_core',   name: '高壓電核',   icon: '⚡', rarity: 'common', sprite: 'icon_fire', bg: 'bg-orange',   desc: '靜電幾何史萊姆體內的雷電結晶' },
    crystal:     { id: 'crystal',     name: '幾何碎晶',   icon: '💎', rarity: 'common', sprite: 'icon_shroom', bg: 'bg-purple', desc: '水晶礦坑蘊含高能量的多面體結晶' },
    core_omega:  { id: 'core_omega',  name: '歐米茄核心', icon: '🛸', rarity: 'rare',   sprite: 'icon_ring', bg: 'bg-orange',   desc: '【BOSS素材】終極運算機甲掉落的核心' },

    lava_rock:   { id: 'lava_rock',   name: '熾熱熔岩石', icon: '🌋', rarity: 'common', sprite: 'icon_fire', bg: 'bg-orange',   desc: '熔岩魔像體內永不熄滅的火成岩' },
    ash_powder:  { id: 'ash_powder',  name: '煉金火藥粉', icon: '💥', rarity: 'common', sprite: 'icon_red_pot', bg: 'bg-purple', desc: '爆裂火藥桶掉落的高純度火藥' },
    core_magma:  { id: 'core_magma',  name: '紅蓮業火核', icon: '🔥', rarity: 'rare',   sprite: 'icon_fire', bg: 'bg-orange',   desc: '【BOSS素材】擊敗熔岩火口魔王獲得的核心' },

    ice_shard:   { id: 'ice_shard',   name: '萬年永凍冰', icon: '❄️', rarity: 'common', sprite: 'icon_blue_pot', bg: 'bg-blue', desc: '冰晶雪怪身上的極寒冰稜' },
    star_dust:   { id: 'star_dust',   name: '星象觀測砂', icon: '🌟', rarity: 'common', sprite: 'icon_scroll', bg: 'bg-purple', desc: '星象貓頭鷹收集的夜空星砂' },
    core_frost:  { id: 'core_frost',  name: '極光冰凰羽', icon: '🧊', rarity: 'rare',   sprite: 'icon_bow', bg: 'bg-orange',    desc: '【BOSS素材】擊敗雪原魔王獲得的傳說冰羽' },

    void_ink:    { id: 'void_ink',    name: '虛空暗影墨', icon: '🌌', rarity: 'common', sprite: 'icon_blue_pot', bg: 'bg-purple', desc: '噬魂魔導書滲出的高維度墨水' },
    rune_origin: { id: 'rune_origin', name: '真理銘文石', icon: '🔯', rarity: 'rare',   sprite: 'icon_ring', bg: 'bg-orange',   desc: '虛空記憶圖書館記載萬物法則的符文' },

    // ================= 🌟 新增 6 種傳說稀有素材 (Rare Materials) =================
    mithril:     { id: 'mithril',     name: '星辰秘銀',   icon: '🥈', rarity: 'epic',   sprite: 'icon_sword', bg: 'bg-orange',  desc: '【稀有素材】閃耀星光的秘銀，鍛造高階職業神武必備' },
    dragon_blood:{ id: 'dragon_blood',name: '遠古龍血',   icon: '🩸', rarity: 'epic',   sprite: 'icon_red_pot', bg: 'bg-orange',desc: '【稀有素材】蘊含狂暴生命力的龍族精血' },
    world_leaf:  { id: 'world_leaf',  name: '世界樹嫩枝', icon: '🌱', rarity: 'epic',   sprite: 'icon_bow', bg: 'bg-orange',    desc: '【稀有素材】散發神聖自然氣息的傳說樹枝' },
    philo_stone: { id: 'philo_stone', name: '賢者之石',   icon: '♦️', rarity: 'epic',   sprite: 'icon_shroom', bg: 'bg-orange', desc: '【稀有素材】煉金術的最高結晶，能放大法術威力' },
    chrono_sand: { id: 'chrono_sand', name: '時空流沙',   icon: '⏳', rarity: 'epic',   sprite: 'icon_scroll', bg: 'bg-orange', desc: '【稀有素材】流動著過去與未來記憶的金色流沙' },
    god_shard:   { id: 'god_shard',   name: '創世神格碎片',icon: '👑', rarity: 'epic',   sprite: 'icon_ring', bg: 'bg-orange',   desc: '【傳說素材】唯有討伐高難度魔王方能取得的至高碎片' }
};

export const ClassNamesMap = {
    warrior: '🛡️重裝劍士',
    mage:    '🪄元素法師',
    ranger:  '🏹尋寶遊俠',
    cleric:  '🌿聖言神官'
};

export const EquipmentCatalog = {
    // =========================================================================
    // 🗡️ 武器類 (Category: weapon) —— 嚴格配合專屬職業 (forClass)！
    // =========================================================================

    // --- 🛡️ 重裝劍士專屬武器 (warrior) ---
    wep_wood_sword: {
        id: 'wep_wood_sword', category: 'weapon', slot: 'weapon', forClass: 'warrior', sprite: 'icon_sword', bg: 'bg-green',
        name: '🗡️ 鐵木練習劍 (T1)', atk: 6, hp: 15, desc: '【劍士專用】基礎練習長劍 (攻擊+6, 血量+15)'
    },
    wep_book_greatsword: {
        id: 'wep_book_greatsword', category: 'weapon', slot: 'weapon', forClass: 'warrior', sprite: 'icon_sword', bg: 'bg-blue',
        name: '🗡️ 精裝書脊大劍 (T2)', atk: 16, hp: 40, desc: '【劍士專用】攻擊+16、血量+40｜厚重字典鍛造的巨劍',
        recipe: { page: 3, fiber: 2, gold: 45 }
    },
    off_iron_shield: {
        id: 'off_iron_shield', category: 'weapon', slot: 'offhand', forClass: 'warrior', sprite: 'icon_armor', bg: 'bg-blue',
        name: '🛡️ 字典硬殼圓盾 (副手T2)', atk: 4, def: 12, hp: 45, desc: '【劍士副手】攻擊+4、防禦+12、血量+45｜堅固的副手盾牌',
        recipe: { page: 3, clay: 2, gold: 50 }
    },
    wep_clock_blade: {
        id: 'wep_clock_blade', category: 'weapon', slot: 'weapon', forClass: 'warrior', sprite: 'icon_sword', bg: 'bg-purple',
        name: '🕰️ 時針青銅重劍 (T3)', atk: 30, def: 8, hp: 75, desc: '【劍士專用】攻擊+30、防禦+8、血量+75｜蘊含沙漏重力的巨劍',
        recipe: { gear: 3, clay: 3, mithril: 1, gold: 120 }
    },
    wep_magma_breaker: {
        id: 'wep_magma_breaker', category: 'weapon', slot: 'weapon', forClass: 'warrior', sprite: 'icon_fire', bg: 'bg-orange',
        name: '🌋 紅蓮業火斬龍劍 (T4)', atk: 52, def: 14, hp: 130, desc: '【劍士專用】攻擊+52、防禦+14、血量+130｜熔岩與龍血鍛造的神劍',
        recipe: { lava_rock: 3, core_magma: 1, dragon_blood: 1, gold: 240 }
    },
    wep_void_excalibur: {
        id: 'wep_void_excalibur', category: 'weapon', slot: 'weapon', forClass: 'warrior', sprite: 'icon_sword', bg: 'bg-orange',
        name: '🌌 創世萬象書皇聖劍 (T5)', atk: 82, def: 25, hp: 220, desc: '【劍士終極神武】攻擊+82、防禦+25、血量+220｜斬斷一切迷霧！',
        recipe: { void_ink: 3, mithril: 2, god_shard: 1, gold: 420 }
    },

    // --- 🪄 元素法師專屬武器 (mage) ---
    wep_apprentice_wand: {
        id: 'wep_apprentice_wand', category: 'weapon', slot: 'weapon', forClass: 'mage', sprite: 'icon_fire', bg: 'bg-green',
        name: '🪄 學徒木枝短杖 (T1)', atk: 8, hp: 5, desc: '【法師專用】基礎魔力短杖 (攻擊+8, 血量+5)'
    },
    wep_ink_staff: {
        id: 'wep_ink_staff', category: 'weapon', slot: 'weapon', forClass: 'mage', sprite: 'icon_fire', bg: 'bg-blue',
        name: '🪄 流雲水墨法杖 (T2)', atk: 21, hp: 20, desc: '【法師專用】攻擊+21、血量+20｜揮灑魔法墨水的高攻法杖',
        recipe: { ink: 3, dew: 2, gold: 45 }
    },
    off_spell_tome: {
        id: 'off_spell_tome', category: 'weapon', slot: 'offhand', forClass: 'mage', sprite: 'icon_scroll', bg: 'bg-blue',
        name: '📕 星羅秘法典籍 (副手T2)', atk: 12, def: 4, hp: 25, desc: '【法師副手】攻擊+12、防禦+4、血量+25｜記載元素咒文的副手書',
        recipe: { page: 3, ink: 2, gold: 50 }
    },
    wep_crystal_scepter: {
        id: 'wep_crystal_scepter', category: 'weapon', slot: 'weapon', forClass: 'mage', sprite: 'icon_fire', bg: 'bg-purple',
        name: '💎 幾何稜鏡魔導杖 (T3)', atk: 36, hp: 45, desc: '【法師專用】攻擊+36、血量+45｜放大元素折射的魔杖',
        recipe: { crystal: 3, elec_core: 2, philo_stone: 1, gold: 120 }
    },
    off_star_orb: {
        id: 'off_star_orb', category: 'weapon', slot: 'offhand', forClass: 'mage', sprite: 'icon_blue_pot', bg: 'bg-orange',
        name: '🔮 極光星象寶球 (副手T4)', atk: 28, def: 10, hp: 65, desc: '【法師副手】攻擊+28、防禦+10、血量+65｜凝聚星砂與賢者之石的法球',
        recipe: { star_dust: 3, philo_stone: 1, gold: 210 }
    },
    wep_void_staff: {
        id: 'wep_void_staff', category: 'weapon', slot: 'weapon', forClass: 'mage', sprite: 'icon_fire', bg: 'bg-orange',
        name: '🌌 虛空全知元素神杖 (T5)', atk: 90, hp: 150, desc: '【法師終極神武】攻擊+90、血量+150｜毀天滅地的禁咒法杖！',
        recipe: { void_ink: 3, philo_stone: 2, god_shard: 1, gold: 420 }
    },

    // --- 🏹 尋寶遊俠專屬武器 (ranger) ---
    wep_short_bow: {
        id: 'wep_short_bow', category: 'weapon', slot: 'weapon', forClass: 'ranger', sprite: 'icon_bow', bg: 'bg-green',
        name: '🏹 輕木獵手短弓 (T1)', atk: 7, hp: 10, desc: '【遊俠專用】輕便的藤木短弓 (攻擊+7, 血量+10)'
    },
    wep_paper_dart: {
        id: 'wep_paper_dart', category: 'weapon', slot: 'weapon', forClass: 'ranger', sprite: 'icon_bow', bg: 'bg-blue',
        name: '🏹 疾風紙翼獵弓 (T2)', atk: 18, hp: 25, desc: '【遊俠專用】攻擊+18、血量+25｜精準連射獵弓',
        recipe: { wing: 3, fiber: 2, gold: 45 }
    },
    off_feather_dagger: {
        id: 'off_feather_dagger', category: 'weapon', slot: 'offhand', forClass: 'ranger', sprite: 'icon_dagger', bg: 'bg-blue',
        name: '🗡️ 翠羽淬毒短匕 (副手T2)', atk: 11, def: 4, hp: 20, desc: '【遊俠副手】攻擊+11、防禦+4、血量+20｜遊俠雙持暗殺短匕',
        recipe: { wing: 2, feather: 2, gold: 50 }
    },
    wep_gear_crossbow: {
        id: 'wep_gear_crossbow', category: 'weapon', slot: 'weapon', forClass: 'ranger', sprite: 'icon_bow', bg: 'bg-purple',
        name: '⚙️ 發條連射重弩 (T3)', atk: 33, hp: 55, desc: '【遊俠專用】攻擊+33、血量+55｜古代齒輪驅動的高速連弩',
        recipe: { gear: 3, feather: 2, world_leaf: 1, gold: 120 }
    },
    wep_frost_windbow: {
        id: 'wep_frost_windbow', category: 'weapon', slot: 'weapon', forClass: 'ranger', sprite: 'icon_bow', bg: 'bg-orange',
        name: '❄️ 極光冰凰神弓 (T4)', atk: 56, hp: 100, desc: '【遊俠專用】攻擊+56、血量+100｜冰凰羽翼與世界樹枝鍛造的神弓',
        recipe: { ice_shard: 3, core_frost: 1, world_leaf: 1, gold: 240 }
    },
    wep_void_artemis: {
        id: 'wep_void_artemis', category: 'weapon', slot: 'weapon', forClass: 'ranger', sprite: 'icon_bow', bg: 'bg-orange',
        name: '🌌 穿越時空星界神弓 (T5)', atk: 85, hp: 170, desc: '【遊俠終極神武】攻擊+85、血量+170｜箭矢跨越時空必中弱點！',
        recipe: { star_dust: 3, chrono_sand: 2, god_shard: 1, gold: 420 }
    },

    // --- 🌿 聖言神官專屬武器 (cleric) ---
    wep_oak_mace: {
        id: 'wep_oak_mace', category: 'weapon', slot: 'weapon', forClass: 'cleric', sprite: 'icon_scroll', bg: 'bg-green',
        name: '🌿 橡木祈禱短杖 (T1)', atk: 6, hp: 20, desc: '【神官專用】基礎祈禱木杖 (攻擊+6, 血量+20)'
    },
    wep_dew_bell: {
        id: 'wep_dew_bell', category: 'weapon', slot: 'weapon', forClass: 'cleric', sprite: 'icon_scroll', bg: 'bg-blue',
        name: '🌿 純淨露水聖鈴 (T2)', atk: 15, hp: 50, desc: '【神官專用】攻擊+15、血量+50｜強化聖言治癒與續航',
        recipe: { dew: 3, ink: 2, gold: 45 }
    },
    off_holy_chalice: {
        id: 'off_holy_chalice', category: 'weapon', slot: 'offhand', forClass: 'cleric', sprite: 'icon_blue_pot', bg: 'bg-blue',
        name: '🏆 晨曦祝福聖杯 (副手T2)', atk: 7, def: 8, hp: 45, desc: '【神官副手】攻擊+7、防禦+8、血量+45｜盛滿生命晨露的聖杯',
        recipe: { dew: 3, coin_old: 2, gold: 50 }
    },
    wep_time_scepter: {
        id: 'wep_time_scepter', category: 'weapon', slot: 'weapon', forClass: 'cleric', sprite: 'icon_scroll', bg: 'bg-purple',
        name: '⏳ 歲月沙漏權杖 (T3)', atk: 27, def: 10, hp: 90, desc: '【神官專用】攻擊+27、防禦+10、血量+90｜逆轉傷勢的古老權杖',
        recipe: { coin_old: 3, feather: 2, chrono_sand: 1, gold: 120 }
    },
    wep_starlight_hammer: {
        id: 'wep_starlight_hammer', category: 'weapon', slot: 'weapon', forClass: 'cleric', sprite: 'icon_sword', bg: 'bg-orange',
        name: '🌟 星象審判聖錘 (T4)', atk: 48, def: 18, hp: 150, desc: '【神官專用】攻擊+48、防禦+18、血量+150｜制裁魔物的神聖戰錘',
        recipe: { crystal: 3, star_dust: 2, mithril: 1, gold: 240 }
    },
    wep_void_genesis_codex: {
        id: 'wep_void_genesis_codex', category: 'weapon', slot: 'weapon', forClass: 'cleric', sprite: 'icon_scroll', bg: 'bg-orange',
        name: '🌌 創世神恩福音聖典 (T5)', atk: 76, def: 28, hp: 250, desc: '【神官終極神武】攻擊+76、防禦+28、血量+250｜永生不滅的神聖庇護！',
        recipe: { rune_origin: 3, world_leaf: 2, god_shard: 1, gold: 420 }
    },

    // =========================================================================
    // 🛡️ 護具類 (Category: armor —— 全職業通用，細分：頭盔/胸甲/左護手/右護手/護腿/戰靴)
    // =========================================================================
    arm_cloth: {
        id: 'arm_cloth', category: 'armor', slot: 'armor', sprite: 'icon_armor', bg: 'bg-green',
        name: '👕 學者粗布衣 (胸甲T1)', def: 4, hp: 20, desc: '【胸甲】輕便的冒險者布衣 (防禦+4, 血量+20)'
    },
    arm_dict_plate: {
        id: 'arm_dict_plate', category: 'armor', slot: 'armor', sprite: 'icon_armor', bg: 'bg-blue',
        name: '🛡️ 硬殼字典胸甲 (胸甲T2)', def: 13, hp: 65, desc: '【胸甲】防禦+13、血量+65｜大幅減少魔物圍攻傷害',
        recipe: { page: 3, fiber: 2, gold: 55 }
    },
    gloves_ink_l: {
        id: 'gloves_ink_l', category: 'armor', slot: 'gloves_l', sprite: 'icon_armor', bg: 'bg-blue',
        name: '🧤 染墨靈巧左護手 (左腕T2)', atk: 5, def: 6, hp: 25, desc: '【左護手】攻擊+5、防禦+6、血量+25｜保護左手腕的輕甲',
        recipe: { fiber: 2, ink: 2, gold: 40 }
    },
    gloves_ink_r: {
        id: 'gloves_ink_r', category: 'armor', slot: 'gloves_r', sprite: 'icon_armor', bg: 'bg-blue',
        name: '🧤 堅韌書頁右護手 (右腕T2)', atk: 6, def: 7, hp: 30, desc: '【右護手】攻擊+6、防禦+7、血量+30｜強化右手出招穩定度',
        recipe: { page: 2, fiber: 2, gold: 45 }
    },
    boots_wing: {
        id: 'boots_wing', category: 'armor', slot: 'boots', sprite: 'icon_bow', bg: 'bg-green',
        name: '🥾 輕盈紙翼戰靴 (戰靴T2)', def: 8, hp: 40, desc: '【戰靴】防禦+8、血量+40｜如紙飛機般輕盈的冒險戰靴',
        recipe: { wing: 3, fiber: 2, gold: 45 }
    },
    helm_scholar: {
        id: 'helm_scholar', category: 'armor', slot: 'head', sprite: 'icon_armor', bg: 'bg-purple',
        name: '🪖 青銅博學頭盔 (頭盔T3)', def: 12, hp: 55, desc: '【頭盔】防禦+12、血量+55｜保護頭部免受重創',
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
        recipe: { crystal: 3, elec_core: 2, mithril: 1, gold: 175 }
    },
    boots_magma: {
        id: 'boots_magma', category: 'armor', slot: 'boots', sprite: 'icon_fire', bg: 'bg-orange',
        name: '🌋 熔岩黑曜石戰靴 (戰靴T4)', atk: 12, def: 22, hp: 100, desc: '【戰靴】攻擊+12、防禦+22、血量+100｜踏碎烈焰的重型戰靴',
        recipe: { lava_rock: 3, ash_powder: 2, dragon_blood: 1, gold: 210 }
    },
    arm_frost_robe: {
        id: 'arm_frost_robe', category: 'armor', slot: 'armor', sprite: 'icon_armor', bg: 'bg-orange',
        name: '❄️ 極光星象聖鎧 (胸甲T5)', def: 40, hp: 200, desc: '【終極胸甲】防禦+40、血量+200｜萬年寒冰與秘銀交織的傳說聖鎧',
        recipe: { ice_shard: 3, core_frost: 1, mithril: 2, gold: 290 }
    },

    // =========================================================================
    // 💍 飾品與遺物類 (Category: relic —— 項鍊 neck / 戒指 ring1, ring2 / 遺物 relic1, relic2)
    // =========================================================================
    ring_copper: {
        id: 'ring_copper', category: 'relic', slot: 'ring1', sprite: 'icon_ring', bg: 'bg-blue',
        name: '💍 古文明銅戒 (左戒)', atk: 7, def: 5, hp: 25, desc: '【戒指1】攻擊+7、防禦+5、血量+25',
        recipe: { coin_old: 2, dew: 1, gold: 50 }
    },
    neck_feather: {
        id: 'neck_feather', category: 'relic', slot: 'neck', sprite: 'icon_scroll', bg: 'bg-purple',
        name: '📿 先知羽毛項鍊 (項鍊)', atk: 11, def: 8, hp: 40, desc: '【項鍊】攻擊+11、防禦+8、血量+40｜寄宿歷史學者智慧的項鍊',
        recipe: { feather: 3, coin_old: 2, gold: 85 }
    },
    rel_doodle_charm: {
        id: 'rel_doodle_charm', category: 'relic', slot: 'relic1', sprite: 'icon_shroom', bg: 'bg-orange',
        name: '🔮 塗鴉魔王御守 (遺物1)', atk: 14, def: 10, hp: 55, desc: '【遺物槽1】攻擊+14、防禦+10、血量+55',
        recipe: { core_doodle: 1, ink: 2, gold: 95 }
    },
    rel_magnet_ring: {
        id: 'rel_magnet_ring', category: 'relic', slot: 'ring2', sprite: 'icon_ring', bg: 'bg-purple',
        name: '🧲 電磁共鳴指環 (右戒)', atk: 18, def: 12, hp: 60, desc: '【戒指2】攻擊+18、防禦+12、血量+60',
        recipe: { coil: 2, crystal: 2, gold: 130 }
    },
    neck_magma_heart: {
        id: 'neck_magma_heart', category: 'relic', slot: 'neck', sprite: 'icon_fire', bg: 'bg-orange',
        name: '🔥 紅蓮龍心項鍊 (項鍊T4)', atk: 25, def: 16, hp: 95, desc: '【項鍊】攻擊+25、防禦+16、血量+95｜遠古龍血結晶項鍊',
        recipe: { core_magma: 1, dragon_blood: 1, gold: 220 }
    },
    rel_void_crown: {
        id: 'rel_void_crown', category: 'relic', slot: 'relic2', sprite: 'icon_ring', bg: 'bg-orange',
        name: '👑 虛空全知聖冠 (遺物2)', atk: 34, def: 24, hp: 130, desc: '【遺物槽2】攻擊+34、防禦+24、血量+130｜創世神格碎片鍛造的王冠',
        recipe: { void_ink: 2, rune_origin: 1, god_shard: 1, gold: 350 }
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
