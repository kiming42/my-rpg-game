/**
 * 像素圖庫、六大章節魔物、5層分支技能樹與豐富地貌繪製模組 (src/data/enemies.js)
 */

export const PALETTE = {
    '.': null,
    'k': '#141013', 'w': '#ffffff', 's': '#ffccaa',
    'r': '#d32f2f', 'R': '#ff6659', 'g': '#388e3c', 'G': '#81c784',
    'b': '#1976d2', 'B': '#4fc3f7', 'y': '#fbc02d', 'Y': '#fff176',
    'p': '#7b1fa2', 'P': '#ce93d8', 'n': '#8d6e63', 'N': '#5d4037',
    'c': '#bdbdbd', 'o': '#e65100', 'd': '#9e8565' // 'd' 為裝備欄半透明壓紋色
};

export const SPRITES = {
    hero_warrior: [
        "...kkkkkk...","..kyyyyyyk..","..kybbbbbyk.","..kbsksksbk.",
        "...kbbbbbk.c","..kybbbbbykc","..kbbbbbbbcc","..kbyyyyybkc",
        "...kbbbbbk.n","...kbb.bbk..","...kN...Nk..","...kk...kk.."
    ],
    hero_mage: [
        "....kkkk....","...kwwwwk...","..kwwwwwwk..","..kwssskwk..",
        "..kskskss...","...krrrrk..R","..krrrrrrk.y","..kryyyyrrkn",
        "..krrrrrrk.n","...krrrrk..n","...kN..Nk..n","...kk...kk..."
    ],
    hero_ranger: [
        "....kkkk....","...kggggk...","..kgGGGGgk..","..kgssskgk.n",
        "..kskskss..n","...kggggk.wn","..kgGGGGgkwn","..kgnnnngk.n",
        "...kggggk...","...kN..Nk...","...kk..kk...","............"
    ],
    hero_cleric: [
        "....kkkk....","...kyyyyk...","..kwyyyywk..","..kwssskwk..",
        "..kskskss..y","...kwwwwk.yY","..kwyyyywk.n","..kwwwwwwk.n",
        "..kwwwwwwk..","...kwwwwk...","...kN..Nk...","...kk..kk..."
    ],
    smith_bear: [
        "..kkk..kkk..",".kwwwkkwwwk.",".kwwwwwwwwk.","kwwkwwwwkwwk",
        "kwwwwkkwwwwk",".kwwwwwwwwk.","..krrrrrrk..",".krrrrrrrrk.",
        ".knnnnnnnnk.","..kN....Nk..","..kk....kk..","............"
    ],
    slime_ink: [
        ".....kk.....","....kbbk....","...kbBBbk...","..kbBBBBbk..",
        ".kbBwkBwbBk.","kbBBkkkkBBbk","kbBBBBBBBBbk","kbbbbbbbbbbk",
        ".kkkkkkkkkk.","............","............","............"
    ],
    sprite_paper: [
        ".........kk.",".......kwwk.",".....kwwwwk.","...kwwwwwwk.",
        ".kwwwwwwwwk.","kwwwwwwwwwk.",".kkkkkwwwwk.","....kwwwwwk.",
        "....kwk.kwk.","....kk...kk.","............","............"
    ],
    turtle_dict: [
        "....kkkkkk..","...kyyyyyyk.","..knwwwwwwnk",".knnnnnnnnnk",
        "ggggkggggk..","gkgkggggggk.","ggggkggggggk","..kkkkkkkkk.",
        "..kgg...ggk.","..kkk...kkk.","............","............"
    ],
    bat_book: [
        ".kk......kk.","kppk.kk.kppk","kpppkkkkpppk","kppppppppppk",
        ".kppwkwwkppk","..kppppppppk","...kppppppk.","....kppppk..",
        "....k.k.k...","............","............","............"
    ],
    bird_clock: [
        "....kkkk....","...koooYk...","..kowkook...","yykoooookkk.",
        ".kkooooyyyok","...kooyyook.","...kooooook.","....k.k..k..",
        "...kk.kk....","............","............","............"
    ],
    guard_terra: [
        "....kkkk....","...knooonk..","..knooooonk.","..kokookok.c",
        "...koooook.c","..knnnnnnnkc","..knooooonkn","..knnnnnnnkn",
        "...koooook.n","...ko..ok...","...kN..Nk...","...kk..kk..."
    ],
    ghost_scholar: [
        "....kkkk....","..kkBBBBkk..",".kBBBBBBBBk.",".kBBkBBkBBk.",
        ".kBBBBBBBBk.",".kBwwwwwwBk.",".kBBBBBBBBk.","..kBBBBBBk..",
        "..kB.kB.kB..","..k..k..k...","............","............"
    ],
    lizard_sand: [
        "....kkkk....","...kggggk...","..kgGkkGgk..","..kggggggk..",
        ".kggggggggk.","..kggggggk.y","..kggggggk.n","..kggggggggk",
        "...kgg.ggk..","...kN...Nk..","...kk...kk..","............"
    ],
    goblin_tube: [
        "....kkkk....","...kggggk...","..kgBBBBgk..","..kggggggk.B",
        "...kggggk.wR","..knnnnnnkwr","..knggggngkw","...knnnnnk..",
        "...kgg.ggk..","...kN...Nk..","...kk...kk..","............"
    ],
    golem_magnet: [
        "..kkkkkkkk..",".krRRRRRRbk.",".krRkkkkBbk.",".krRkYYkBbk.",
        "kcccccccccck","kcrrrrrrrrck","kcbbbbbbbbck",".kcccccccck.",
        "..kcc..cck..","..krr..bbk..","..kkk..kkk..","............"
    ],
    slime_elec: [
        " ..kkkkkk.. "," .kyYYYYyk. ",".kyYYYYYYyk.","kyYwkYYkwYyk",
        "kyYYYYYYYYyk","kyYYkkkkYYyk",".kyYYYYYYyk."," .kkkkkkkk. ",
        "............","............","............"
    ],
    witch: [
        ".....kk.....","....kppk....","...kppppk...",".kkppppppkk.",
        "kppppppppppk","...kssssk...","...ksksks...","..kppppppk..",
        "..kpPPPPpk..",".kppppppppk.",".kppppppppk.","..kkkkkkkk.."
    ],
    skeleton: [
        "....kkkk....","...kwwwwk...","..kwkkkkwk..","..kwwwwwwk..",
        "...kckckc...","..kkkkkkkk..",".kc.kwwk.ck.",".k..kwwk..k.",
        "....kcck....","...kc..ck...","...kw..wk...","...kk..wk..."
    ],
    scorpion: [
        ".......kkk..","......koook.","........kook",".kkk....kook",
        "koook..koook","koookkkkkook",".koooooooook","..kooooooook",
        "..kN.kN.kN.k",".kN..kN.kN..","............","............"
    ],
    tentacle: [
        ".....kk.....","....kppk....","...kpPPpk...","...kppppk...",
        "..kpPppppk..","..kppppppk..","...kppppk...","...kpPPpk...",
        "..kppppppk..",".kppppppppk.",".kBBBBBBBBk.","..kkkkkkkk.."
    ],
    boss_omega: [
        "...kkkkkk...","..kppppppk..",".kpBBBBBBpk.","kpBwwkkwwBpk",
        "kpBwkrrkwBpk","kpBwwkkwwBpk",".kpBBBBBBpk.","..kppppppk..",
        ".kcc.kk.cck.",".kc......ck.","............","............"
    ],
    golem_lava: [
        "..kkkkkkkk..",".kNrooooorNk",".kNoYYYYoNk.",".kNokYYkoNk.",
        "kNrooooooorNk","kroYYYYYYork","kroooooooork",".kNrrrrrrNk.",
        "..kNr..rNk..","..krr..rrk..","..kkk..kkk..","............"
    ],
    drake_fire: [
        "..kk....kk..",".krrk..krrk.","..krrrrrrk..","..krYkrYrk..",
        ".krrrrrrrrk.","krrrooooorrk","krrroYYoorrk",".krrrrrrrrk.",
        "..krr..rrk..","..kN....Nk..","..kk....kk..","............"
    ],
    bomb_barrel: [
        ".....yY.....","....rRRr....","..kkkkkkkk..",".knnnnnnnnk.",
        ".kcccccccck.",".knnrRRrnnk.",".knnRRRRnnk.",".knnrRRrnnk.",
        ".kcccccccck.",".knnnnnnnnk.","..kkkkkkkk..","............"
    ],
    yeti_frost: [
        "..kkkkkkkk..",".kwwwwwwwwk.",".kwBBBBBBwk.",".kwBkkkkBwk.",
        "kwwwwwwwwwwk","kwBBBBBBBBwk","kwwwwwwwwwwk",".kwwwwwwwwk.",
        "..kww..wwk..","..kBB..BBk..","..kkk..kkk..","............"
    ],
    wolf_ice: [
        ".kk....kk...","kBBk..kBBk..","kBBBBBBBBk..","kBwkBBkwBk..",
        ".kBBBBBBBBkk","..kBBBBBBBBk","..kBBBBBBBBk","..kBB...BBk.",
        "..kB....Bk..","..kk....kk..","............","............"
    ],
    owl_star: [
        "..kk....kk..",".kppk..kppk.",".kppppppppk.",".kpYwkwwYpk.",
        "kppppoyopppk","kpppPPPPpppk","kppPYppYPppk",".kppppppppk.",
        "..kpp..ppk..","...ky..yk...","............","............"
    ],
    eye_void: [
        "...kkkkkk...","..kppppppk..",".kpPPPPPPpk.","kpPwwwwwwPpk",
        "kpPwkrRkwPpk","kpPwkrRkwPpk","kpPwwwwwwPpk",".kpPPPPPPpk.",
        "..kppppppk..","..kp.kp.kp..","............","............"
    ],
    tome_evil: [
        "..kkkkkkkk..",".krrrrrrrrk.",".krYYYYYYrk.",".krYkkkkYrk.",
        ".krYkRRkYrk.",".krYYYYYYrk.",".krrrrrrrrk.",".kwwwwwwwwk.",
        "..kkkkkkkk..","....p..p....","............","............"
    ],
    knight_void: [
        "...kkkkkk...","..kppppppk..","..kpRRRRpk..","...kppppk..P",
        "..kcccccck.p","..kcppppck.p","..kcccccck.p","...kppppk..n",
        "...kpp.ppk..","...kk...kk..","............","............"
    ],
    boss_void_king: [
        ".k..kkkk..k.","kykkyyyyykyk","kyyyyyyyyyyk",".kppppppppk.",
        "kpPwkRRkwPpk","kppppppppppk","kppYYYYYYppk","kppppppppppk",
        ".kppppppppk.","..kp.kp.kp..","..k..k..k...","............"
    ],
    // 技能與道具圖示
    icon_fire: [
        ".....rR.....","...rrRRr....","..rRYYYYRr..",".rRYwwwwYRr.",
        ".rRYwwwwYRr.","..rRYYYYRr..","...rrRRrr...","....rrrr...."
    ],
    icon_bow: [
        "....nnn.....","..nn..wc....",".n....w.c...",".n...w..RY..",
        ".n..w..RY...",".n.w....c...","..nn...c....","....nnn....."
    ],
    icon_dagger: [
        "........gg..",".......gGGg.","......gcccg.",".....gcccc..",
        "...nnccc....","..nNnc......",".nN.........","y..........."
    ],
    icon_sword: [
        ".........cc.","........ccc.",".......ccc..","......ccc...",
        "..y..ccc....","...yycc.....","..nn.y......",".nn........."
    ],
    icon_red_pot: [
        "....nnnn....","....wwww....","...wrrrrw...","..wrrRRrrw..",
        "..wrrrrrrw..","..wrrrrrrw..","...wwwwww...","............"
    ],
    icon_blue_pot: [
        "....nnnn....","....wwww....","...wbbbbw...","..wbbBBbbw..",
        "..wbbbbbbw..","..wbbbbbbw..","...wwwwww...","............"
    ],
    icon_scroll: [
        "..nnnnnnnn..",".nYYYYYYYYn.","..ykkkkkky..","..yYYYYYYy..",
        "..ykkkkkky..","..yYYYYYYy..",".nYYYYYYYYn.","..nnnnnnnn.."
    ],
    icon_armor: [
        ".nnn....nnn.","nNNNnnnnNNNn","nNNNNNNNNNNn",".nNNyyyyNNn.",
        ".nNNNNNNNNn.",".nNNNNNNNNn.","..nnnnnnnn..","............"
    ],
    icon_ring: [
        "....RRRR....","...RrrrrR...","..yyyyyyyy..",".yy......yy.",
        ".yy......yy.","..yy....yy..","...yyyyyy...","............"
    ],
    icon_shroom: [
        "...rrrrrr...","..rrwwwwrr..",".rrrrwwrrrr.",".rrwwrrrrww.",
        "..kkkkkkkk..","....wwww....","....wwww....","....kkkk...."
    ],
    icon_lock: [
        "....kkkk....","...kcccck...","...kc..ck...","..kkkkkkkk..",
        "..kyyyyyyk..","..kyykkyyk..","..kyykkyyk..","..kkkkkkkk.."
    ],
    // 附圖 2 專用：紙娃娃空槽位壓紋圖示 (Watermark Silhouettes)
    wm_head: [
        "...dddddd...","..dddddddd..","..dd....dd..","..dd....dd..",
        "..dd....dd..","............","............","............"
    ],
    wm_weapon: [
        ".........dd.","........ddd.",".......ddd..","..d...ddd...",
        "...ddddd....","..dd.d......",".dd.........","............"
    ],
    wm_armor: [
        ".ddd....ddd.","dddddddddddd",".dddddddddd.","..dddddddd..",
        "..dddddddd..","..dddddddd..","............","............"
    ],
    wm_offhand: [
        "..dddddddd..",".dddddddddd.",".dd..dd..dd.",".dddddddddd.",
        "..dddddddd..","....dddd....","............","............"
    ],
    wm_gloves: [
        "..d.d.d.d...","..ddddddd.d.","..dddddddd..","..ddddddd...",
        "...ddddd....","...ddddd....","............","............"
    ],
    wm_legs: [
        "..dddddddd..","..dddddddd..","..ddd..ddd..","..ddd..ddd..",
        "..ddd..ddd..","..ddd..ddd..","............","............"
    ],
    wm_boots: [
        "...dd...dd..","...dd...dd..","...dd...dd..",".dddd.dddd..",
        ".dddd.dddd..","............","............","............"
    ],
    wm_neck: [
        "..dd....dd..",".d........d.","..d......d..","...dddddd...",
        "....dddd....",".....dd.....","............","............"
    ],
    wm_ring: [
        "....dddd....","..dd....dd..",".d........d.",".d........d.",
        "..dd....dd..","....dddd....","............","............"
    ],
    wm_relic: [
        "....dddd....","..dddddddd..","..dddddddd..","....dddd....",
        "....dddd....","...dddddd...","............","............"
    ]
};

const SpriteCache = {};
export function getSpriteDataURL(key, scale = 3) {
    const cacheKey = `${key}_${scale}`;
    if (SpriteCache[cacheKey]) return SpriteCache[cacheKey];
    const matrix = SPRITES[key] || SPRITES.icon_fire;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const c = document.createElement('canvas');
    c.width = cols * scale;
    c.height = rows * scale;
    const ctx = c.getContext('2d');
    for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
            const ch = matrix[r][col];
            if (PALETTE[ch]) {
                ctx.fillStyle = PALETTE[ch];
                ctx.fillRect(col * scale, r * scale, scale, scale);
            }
        }
    }
    SpriteCache[cacheKey] = c.toDataURL();
    return SpriteCache[cacheKey];
}

export function drawMatrixOnCtx(ctx, key, x, y, scale = 5) {
    const matrix = SPRITES[key] || SPRITES.hero_warrior;
    for (let r = 0; r < matrix.length; r++) {
        for (let col = 0; col < matrix[r].length; col++) {
            const ch = matrix[r][col];
            if (PALETTE[ch]) {
                ctx.fillStyle = PALETTE[ch];
                ctx.fillRect(x + col * scale, y + r * scale, scale, scale);
            }
        }
    }
}

/* ==========================================================================
   2. 附圖 1 風格：4 大職業 × 9 招「5 層分支延伸技能樹」
   座標對應 SVG 線條：(80,35), (240,35) -> (80,90), (160,90), (240,90) -> (160,150), (240,150) -> (80,210), (160,210) -> (160,270), (240,270)
   ========================================================================== */
export const CLASS_SKILL_TREES = {
    warrior: [
        { id: 'w_1', name: '重劈斬', tier: 1, x: 80, y: 35, parentId: null, cost: 8, dmg: 18, cd: 0, aoe: false, sprite: 'icon_sword', unlocked: true, equipped: true, lv: 1, maxLv: 6, desc: '【T1基礎｜無CD】揮動武器對單一敵人造成沉重劈砍。' },
        { id: 'w_2', name: '裂地劍氣', tier: 1, x: 240, y: 35, parentId: null, cost: 15, dmg: 14, cd: 2, aoe: true, sprite: 'icon_dagger', unlocked: true, equipped: true, lv: 1, maxLv: 3, desc: '【T1基礎｜CD:2】釋放地面劍氣，對全體魔物造成傷害。' },
        { id: 'w_3', name: '鋼鐵聖盾', tier: 2, x: 80, y: 90, parentId: 'w_1', cost: 16, dmg: 22, cd: 2, aoe: false, addShield: 1, sprite: 'icon_armor', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】重擊敵人並立即為自身附加 1 層免傷護盾！' },
        { id: 'w_4', name: '旋風斬擊', tier: 2, x: 160, y: 90, parentId: 'w_2', cost: 20, dmg: 20, cd: 2, aoe: true, sprite: 'icon_sword', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】旋轉巨劍橫掃全場所有敵人。' },
        { id: 'w_5', name: '戰神號角', tier: 2, x: 240, y: 90, parentId: 'w_2', cost: 18, dmg: 16, cd: 3, aoe: true, healSelf: 25, sprite: 'icon_scroll', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T2分支｜CD:3】震懾全場魔物並恢復自身 25 點 HP。' },
        { id: 'w_6', name: '破甲貫刺', tier: 3, x: 160, y: 150, parentId: 'w_3', cost: 22, dmg: 34, cd: 3, aoe: false, sprite: 'icon_dagger', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T3專精｜CD:3】貫穿魔物厚重護甲，造成極高單體傷害！' },
        { id: 'w_7', name: '不屈壁壘', tier: 3, x: 240, y: 150, parentId: 'w_5', cost: 24, dmg: 24, cd: 3, aoe: true, addShield: 2, sprite: 'icon_armor', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T3專精｜CD:3】震退全體魔物並直接獲得 2 層免傷護盾！' },
        { id: 'w_8', name: '烈焰書脊斬', tier: 4, x: 80, y: 210, parentId: 'w_6', cost: 28, dmg: 42, cd: 3, aoe: false, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T4大師｜CD:3】將烈焰灌注巨劍，對頭目造成毀滅性劈砍！' },
        { id: 'w_9', name: '大地震盪波', tier: 4, x: 160, y: 210, parentId: 'w_7', cost: 30, dmg: 32, cd: 3, aoe: true, sprite: 'icon_ring', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T4大師｜CD:3】引發書境地脈震動，重創全體敵軍。' },
        { id: 'w_10', name: '創世萬劍歸宗', tier: 5, x: 160, y: 270, parentId: 'w_8', cost: 36, dmg: 48, cd: 4, aoe: true, isMeteor: true, addShield: 1, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T5終極奧義｜CD:4】召喚萬千聖劍轟炸全場並獲護盾！' }
    ],
    mage: [
        { id: 'm_1', name: '火球術', tier: 1, x: 80, y: 35, parentId: null, cost: 10, dmg: 20, cd: 0, aoe: false, sprite: 'icon_fire', unlocked: true, equipped: true, lv: 1, maxLv: 6, desc: '【T1基礎｜無CD】發射烈焰火球攻擊單一目標。' },
        { id: 'm_2', name: '冰霜新星', tier: 1, x: 240, y: 35, parentId: null, cost: 16, dmg: 15, cd: 2, aoe: true, sprite: 'icon_blue_pot', unlocked: true, equipped: true, lv: 1, maxLv: 3, desc: '【T1基礎｜CD:2】凍結空氣轟炸全體敵人。' },
        { id: 'm_3', name: '炎爆衝擊', tier: 2, x: 80, y: 90, parentId: 'm_1', cost: 18, dmg: 28, cd: 2, aoe: false, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】壓縮火球引發劇烈單體爆炸！' },
        { id: 'm_4', name: '連環閃電', tier: 2, x: 160, y: 90, parentId: 'm_2', cost: 20, dmg: 22, cd: 2, aoe: true, sprite: 'icon_scroll', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】釋放跳躍雷電同時電擊全場魔物。' },
        { id: 'm_5', name: '奧術水墨盾', tier: 2, x: 240, y: 90, parentId: 'm_2', cost: 18, dmg: 18, cd: 3, aoe: true, addShield: 1, sprite: 'icon_ring', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T2分支｜CD:3】以水墨法陣傷害敵群並獲得 1 層護盾。' },
        { id: 'm_6', name: '水墨雷暴', tier: 3, x: 160, y: 150, parentId: 'm_3', cost: 24, dmg: 28, cd: 3, aoe: true, sprite: 'icon_scroll', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T3專精｜CD:3】召喚狂暴水墨雷雲轟擊全體敵人！' },
        { id: 'm_7', name: '絕對零度', tier: 3, x: 240, y: 150, parentId: 'm_5', cost: 25, dmg: 30, cd: 3, aoe: true, sprite: 'icon_blue_pot', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T3專精｜CD:3】召喚極寒冰錐穿透敵方全體陣列。' },
        { id: 'm_8', name: '虛空黑洞', tier: 4, x: 80, y: 210, parentId: 'm_6', cost: 30, dmg: 38, cd: 3, aoe: true, sprite: 'icon_shroom', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T4大師｜CD:3】生成引力黑洞撕裂場上所有魔物！' },
        { id: 'm_9', name: '星象折射砲', tier: 4, x: 160, y: 210, parentId: 'm_7', cost: 28, dmg: 46, cd: 3, aoe: false, sprite: 'icon_ring', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T4大師｜CD:3】凝聚星光極限轟擊單一頭目。' },
        { id: 'm_10', name: '末日隕石降臨', tier: 5, x: 160, y: 270, parentId: 'm_8', cost: 38, dmg: 52, cd: 4, aoe: true, isMeteor: true, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T5終極禁咒｜CD:4】召喚巨型末日隕石毀滅全場所有魔物！' }
    ],
    ranger: [
        { id: 'r_1', name: '精準射擊', tier: 1, x: 80, y: 35, parentId: null, cost: 8, dmg: 19, cd: 0, aoe: false, sprite: 'icon_bow', unlocked: true, equipped: true, lv: 1, maxLv: 6, desc: '【T1基礎｜無CD】瞄準弱點射擊單一目標。' },
        { id: 'r_2', name: '二連矢', tier: 1, x: 240, y: 35, parentId: null, cost: 15, dmg: 15, cd: 2, aoe: true, sprite: 'icon_bow', unlocked: true, equipped: true, lv: 1, maxLv: 3, desc: '【T1基礎｜CD:2】疾速連射箭矢，同時攻擊場上所有敵人。' },
        { id: 'r_3', name: '穿雲重矢', tier: 2, x: 80, y: 90, parentId: 'r_1', cost: 16, dmg: 27, cd: 2, aoe: false, sprite: 'icon_bow', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】拉滿弓弦射出貫穿護甲的重箭。' },
        { id: 'r_4', name: '迴旋飛鏢陣', tier: 2, x: 160, y: 90, parentId: 'r_2', cost: 18, dmg: 21, cd: 2, aoe: true, sprite: 'icon_dagger', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】投擲多枚迴旋飛鏢切割全場敵人。' },
        { id: 'r_5', name: '翠風步伐', tier: 2, x: 240, y: 90, parentId: 'r_2', cost: 18, dmg: 18, cd: 3, aoe: false, addShield: 1, healSelf: 20, sprite: 'icon_scroll', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T2分支｜CD:3】射擊敵人同時恢復 20 HP 並獲 1 層閃避護盾。' },
        { id: 'r_6', name: '毒刃背刺', tier: 3, x: 160, y: 150, parentId: 'r_3', cost: 22, dmg: 38, cd: 3, aoe: false, sprite: 'icon_dagger', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T3專精｜CD:3】瞬移至敵人背後刺擊造成極高單體傷害！' },
        { id: 'r_7', name: '爆裂火藥矢', tier: 3, x: 240, y: 150, parentId: 'r_5', cost: 24, dmg: 28, cd: 3, aoe: true, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T3專精｜CD:3】射出綁有煉金火藥的箭矢炸傷全體魔物。' },
        { id: 'r_8', name: '疾風幻影連射', tier: 4, x: 80, y: 210, parentId: 'r_6', cost: 28, dmg: 44, cd: 3, aoe: false, sprite: 'icon_bow', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T4大師｜CD:3】化為疾風瞬間向頭目傾瀉十連矢！' },
        { id: 'r_9', name: '天羅地網陣', tier: 4, x: 160, y: 210, parentId: 'r_7', cost: 28, dmg: 34, cd: 3, aoe: true, sprite: 'icon_ring', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T4大師｜CD:3】佈下暗器陷阱重創場上所有敵人。' },
        { id: 'r_10', name: '漫天星火箭雨', tier: 5, x: 160, y: 270, parentId: 'r_8', cost: 34, dmg: 48, cd: 4, aoe: true, isMeteor: true, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T5終極奧義｜CD:4】向天空傾瀉星火箭雨轟炸全場！' }
    ],
    cleric: [
        { id: 'c_1', name: '聖光彈', tier: 1, x: 80, y: 35, parentId: null, cost: 10, dmg: 17, cd: 0, aoe: false, healSelf: 12, sprite: 'icon_scroll', unlocked: true, equipped: true, lv: 1, maxLv: 6, desc: '【T1基礎｜無CD】發射聖光攻擊單一敵人，並恢復 12 HP。' },
        { id: 'c_2', name: '聖露治癒', tier: 1, x: 240, y: 35, parentId: null, cost: 16, dmg: 14, cd: 2, aoe: true, healSelf: 35, sprite: 'icon_red_pot', unlocked: true, equipped: true, lv: 1, maxLv: 3, desc: '【T1基礎｜CD:2】恢復自身 35 HP，並以聖光波傷害全體魔物。' },
        { id: 'c_3', name: '懲戒聖鎚', tier: 2, x: 80, y: 90, parentId: 'c_1', cost: 16, dmg: 25, cd: 2, aoe: false, healSelf: 15, sprite: 'icon_sword', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】召喚光之聖鎚痛擊單一敵人並回血。' },
        { id: 'c_4', name: '神聖庇護盾', tier: 2, x: 160, y: 90, parentId: 'c_2', cost: 20, dmg: 18, cd: 2, aoe: true, addShield: 1, healSelf: 20, sprite: 'icon_armor', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T2分支｜CD:2】傷害全體敵人、恢復 20 HP 並獲 1 層護盾！' },
        { id: 'c_5', name: '生命湧泉', tier: 2, x: 240, y: 90, parentId: 'c_2', cost: 20, dmg: 15, cd: 3, aoe: false, healSelf: 60, sprite: 'icon_red_pot', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T2分支｜CD:3】瞬間恢復自身 60 點大量生命值！' },
        { id: 'c_6', name: '淨化新星', tier: 3, x: 160, y: 150, parentId: 'c_3', cost: 22, dmg: 26, cd: 3, aoe: true, healSelf: 25, sprite: 'icon_ring', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T3專精｜CD:3】釋放聖光波傷害全體魔物並恢復 25 HP！' },
        { id: 'c_7', name: '天使障壁', tier: 3, x: 240, y: 150, parentId: 'c_5', cost: 26, dmg: 22, cd: 3, aoe: true, addShield: 2, healSelf: 30, sprite: 'icon_armor', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T3專精｜CD:3】給予自身 2 層免傷護盾並恢復 30 HP！' },
        { id: 'c_8', name: '破邪聖言錄', tier: 4, x: 80, y: 210, parentId: 'c_6', cost: 28, dmg: 38, cd: 3, aoe: true, healSelf: 25, sprite: 'icon_scroll', unlocked: false, equipped: false, lv: 0, maxLv: 5, desc: '【T4大師｜CD:3】朗誦古老聖言重創全場魔物！' },
        { id: 'c_9', name: '星光制裁槍', tier: 4, x: 160, y: 210, parentId: 'c_7', cost: 28, dmg: 42, cd: 3, aoe: false, healSelf: 30, sprite: 'icon_sword', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T4大師｜CD:3】投擲光之聖槍貫穿頭目並回血。' },
        { id: 'c_10', name: '創世神聖審判', tier: 5, x: 160, y: 270, parentId: 'c_8', cost: 34, dmg: 46, cd: 4, aoe: true, isMeteor: true, healSelf: 50, addShield: 1, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 0, maxLv: 3, desc: '【T5終極聖言｜CD:4】天降審判之光重創全場、回 50 HP 並獲護盾！' }
    ]
};

/* ==========================================================================
   3. 六大章節與「5 魔物同場 BOSS 軍團」定義
   ========================================================================== */
export const STAGES = [
    {
        id: 'grassland',
        title: '🌿 第一章：晨曦微風草原',
        theme: 'grassland',
        dropPool: ['fiber', 'dew', 'ink', 'wing', 'page'],
        rareDrop: 'world_leaf',
        bossDrop: 'core_doodle',
        roamPool: [
            { name: '墨水史萊姆', sprite: 'slime_ink', hp: 95, maxHp: 95, atk: 16, shield: false, bleed: false, trait: 'split' },
            { name: '疾風紙飛機', sprite: 'sprite_paper', hp: 86, maxHp: 86, atk: 17, shield: false, bleed: true, trait: 'none' },
            { name: '暗影書蝠', sprite: 'bat_book', hp: 90, maxHp: 90, atk: 16, shield: false, bleed: true, trait: 'none' },
            { name: '字典岩龜', sprite: 'turtle_dict', hp: 135, maxHp: 135, atk: 18, shield: true, bleed: false, trait: 'shell' },
            { name: '荒沼女巫', sprite: 'witch', hp: 118, maxHp: 118, atk: 20, shield: true, bleed: true, trait: 'none' }
        ],
        bossParty: [
            { name: '字典岩龜', sprite: 'turtle_dict', hp: 140, maxHp: 140, atk: 18, shield: true, bleed: false, trait: 'shell' },
            { name: '墨水史萊姆', sprite: 'slime_ink', hp: 115, maxHp: 115, atk: 16, shield: false, bleed: false, trait: 'split' },
            { name: '暴走塗鴉魔王', sprite: 'witch', hp: 360, maxHp: 360, atk: 28, shield: true, bleed: true, isBoss: true, trait: 'split' },
            { name: '疾風紙飛機', sprite: 'sprite_paper', hp: 105, maxHp: 105, atk: 17, shield: false, bleed: true, trait: 'none' },
            { name: '暗影書蝠', sprite: 'bat_book', hp: 105, maxHp: 105, atk: 17, shield: false, bleed: true, trait: 'none' }
        ]
    },
    {
        id: 'ruins',
        title: '⏳ 第二章：時光沙漏遺跡',
        theme: 'ruins',
        dropPool: ['feather', 'coin_old', 'gear', 'clay'],
        rareDrop: 'chrono_sand',
        bossDrop: 'scale_time',
        roamPool: [
            { name: '發條盜賊鳥', sprite: 'bird_clock', hp: 140, maxHp: 140, atk: 22, shield: false, bleed: true, trait: 'steal' },
            { name: '幽靈歷史學者', sprite: 'ghost_scholar', hp: 155, maxHp: 155, atk: 24, shield: true, bleed: false, trait: 'shuffle' },
            { name: '荒漠蜥蜴人', sprite: 'lizard_sand', hp: 150, maxHp: 150, atk: 23, shield: false, bleed: true, trait: 'none' },
            { name: '兵馬俑守衛', sprite: 'guard_terra', hp: 205, maxHp: 205, atk: 26, shield: true, bleed: false, trait: 'shell' },
            { name: '巨大蠍子', sprite: 'scorpion', hp: 180, maxHp: 180, atk: 25, shield: true, bleed: true, trait: 'none' }
        ],
        bossParty: [
            { name: '兵馬俑守衛', sprite: 'guard_terra', hp: 200, maxHp: 200, atk: 25, shield: true, bleed: false, trait: 'shell' },
            { name: '荒漠蜥蜴人', sprite: 'lizard_sand', hp: 160, maxHp: 160, atk: 23, shield: false, bleed: true, trait: 'none' },
            { name: '歲月青銅巨龍', sprite: 'scorpion', hp: 480, maxHp: 480, atk: 34, shield: true, bleed: true, isBoss: true, trait: 'steal' },
            { name: '幽靈歷史學者', sprite: 'ghost_scholar', hp: 165, maxHp: 165, atk: 24, shield: true, bleed: false, trait: 'shuffle' },
            { name: '發條盜賊鳥', sprite: 'bird_clock', hp: 150, maxHp: 150, atk: 22, shield: false, bleed: true, trait: 'steal' }
        ]
    },
    {
        id: 'mine',
        title: '💎 第三章：幾何水晶礦坑',
        theme: 'mine',
        dropPool: ['acid', 'coil', 'elec_core', 'crystal'],
        rareDrop: 'mithril',
        bossDrop: 'core_omega',
        roamPool: [
            { name: '瘋狂試管地精', sprite: 'goblin_tube', hp: 185, maxHp: 185, atk: 28, shield: false, bleed: true, trait: 'shuffle' },
            { name: '靜電幾何史萊姆', sprite: 'slime_elec', hp: 180, maxHp: 180, atk: 30, shield: true, bleed: false, trait: 'split' },
            { name: '骷髏礦工', sprite: 'skeleton', hp: 175, maxHp: 175, atk: 27, shield: true, bleed: false, trait: 'none' },
            { name: '多面體磁石巨像', sprite: 'golem_magnet', hp: 245, maxHp: 245, atk: 32, shield: true, bleed: false, trait: 'shuffle' },
            { name: '深淵觸手', sprite: 'tentacle', hp: 195, maxHp: 195, atk: 29, shield: false, bleed: true, trait: 'none' }
        ],
        bossParty: [
            { name: '多面體磁石巨像', sprite: 'golem_magnet', hp: 250, maxHp: 250, atk: 30, shield: true, bleed: false, trait: 'shuffle' },
            { name: '骷髏礦工', sprite: 'skeleton', hp: 180, maxHp: 180, atk: 27, shield: true, bleed: false, trait: 'none' },
            { name: '真理機甲・歐米茄', sprite: 'boss_omega', hp: 620, maxHp: 620, atk: 40, shield: true, bleed: true, isBoss: true, trait: 'shuffle' },
            { name: '靜電幾何史萊姆', sprite: 'slime_elec', hp: 195, maxHp: 195, atk: 29, shield: true, bleed: false, trait: 'split' },
            { name: '瘋狂試管地精', sprite: 'goblin_tube', hp: 185, maxHp: 185, atk: 28, shield: false, bleed: true, trait: 'shuffle' }
        ]
    },
    {
        id: 'volcano',
        title: '🌋 第四章：熔岩煉金火口',
        theme: 'volcano',
        dropPool: ['lava_rock', 'ash_powder', 'elec_core', 'acid'],
        rareDrop: 'dragon_blood',
        bossDrop: 'core_magma',
        roamPool: [
            { name: '熾熱熔岩魔像', sprite: 'golem_lava', hp: 265, maxHp: 265, atk: 36, shield: true, bleed: false, trait: 'shell' },
            { name: '火蜥蜴戰士', sprite: 'drake_fire', hp: 230, maxHp: 230, atk: 34, shield: false, bleed: true, trait: 'none' },
            { name: '爆裂火藥桶', sprite: 'bomb_barrel', hp: 205, maxHp: 205, atk: 40, shield: false, bleed: true, trait: 'steal' },
            { name: '深淵炎魔觸手', sprite: 'tentacle', hp: 235, maxHp: 235, atk: 35, shield: true, bleed: false, trait: 'split' }
        ],
        bossParty: [
            { name: '熾熱熔岩魔像', sprite: 'golem_lava', hp: 275, maxHp: 275, atk: 36, shield: true, bleed: false, trait: 'shell' },
            { name: '火蜥蜴戰士', sprite: 'drake_fire', hp: 235, maxHp: 235, atk: 34, shield: false, bleed: true, trait: 'none' },
            { name: '紅蓮業火巨龍', sprite: 'drake_fire', hp: 750, maxHp: 750, atk: 46, shield: true, bleed: true, isBoss: true, trait: 'shell' },
            { name: '爆裂火藥桶', sprite: 'bomb_barrel', hp: 215, maxHp: 215, atk: 38, shield: false, bleed: true, trait: 'none' },
            { name: '深淵炎魔觸手', sprite: 'tentacle', hp: 230, maxHp: 230, atk: 35, shield: true, bleed: false, trait: 'split' }
        ]
    },
    {
        id: 'snowfield',
        title: '❄️ 第五章：冰封星象雪原',
        theme: 'snowfield',
        dropPool: ['ice_shard', 'star_dust', 'crystal', 'feather'],
        rareDrop: 'philo_stone',
        bossDrop: 'core_frost',
        roamPool: [
            { name: '冰晶雪怪', sprite: 'yeti_frost', hp: 315, maxHp: 315, atk: 40, shield: true, bleed: false, trait: 'shell' },
            { name: '極地冰原狼', sprite: 'wolf_ice', hp: 265, maxHp: 265, atk: 42, shield: false, bleed: true, trait: 'steal' },
            { name: '星象貓頭鷹', sprite: 'owl_star', hp: 280, maxHp: 280, atk: 39, shield: true, bleed: false, trait: 'shuffle' },
            { name: '寒霜骷髏衛', sprite: 'skeleton', hp: 255, maxHp: 255, atk: 38, shield: true, bleed: true, trait: 'none' }
        ],
        bossParty: [
            { name: '冰晶雪怪', sprite: 'yeti_frost', hp: 330, maxHp: 330, atk: 40, shield: true, bleed: false, trait: 'shell' },
            { name: '極地冰原狼', sprite: 'wolf_ice', hp: 275, maxHp: 275, atk: 42, shield: false, bleed: true, trait: 'none' },
            { name: '極光星象冰凰', sprite: 'owl_star', hp: 900, maxHp: 900, atk: 52, shield: true, bleed: true, isBoss: true, trait: 'shuffle' },
            { name: '星象貓頭鷹', sprite: 'owl_star', hp: 285, maxHp: 285, atk: 39, shield: true, bleed: false, trait: 'shuffle' },
            { name: '寒霜骷髏衛', sprite: 'skeleton', hp: 265, maxHp: 265, atk: 38, shield: true, bleed: true, trait: 'none' }
        ]
    },
    {
        id: 'library',
        title: '🌌 終章：虛空記憶圖書館',
        theme: 'library',
        dropPool: ['void_ink', 'rune_origin', 'star_dust', 'lava_rock'],
        rareDrop: 'god_shard',
        bossDrop: 'god_shard',
        roamPool: [
            { name: '虛空凝視者', sprite: 'eye_void', hp: 350, maxHp: 350, atk: 46, shield: true, bleed: true, trait: 'shuffle' },
            { name: '噬魂魔導書', sprite: 'tome_evil', hp: 330, maxHp: 330, atk: 48, shield: true, bleed: false, trait: 'split' },
            { name: '墮落書境騎士', sprite: 'knight_void', hp: 390, maxHp: 390, atk: 50, shield: true, bleed: true, trait: 'shell' }
        ],
        bossParty: [
            { name: '墮落書境騎士', sprite: 'knight_void', hp: 400, maxHp: 400, atk: 48, shield: true, bleed: true, trait: 'shell' },
            { name: '虛空凝視者', sprite: 'eye_void', hp: 350, maxHp: 350, atk: 46, shield: true, bleed: true, trait: 'shuffle' },
            { name: '終焉虛空書皇', sprite: 'boss_void_king', hp: 1150, maxHp: 1150, atk: 60, shield: true, bleed: true, isBoss: true, trait: 'shuffle' },
            { name: '噬魂魔導書', sprite: 'tome_evil', hp: 350, maxHp: 350, atk: 47, shield: true, bleed: false, trait: 'split' },
            { name: '墮落書境騎士', sprite: 'knight_void', hp: 400, maxHp: 400, atk: 48, shield: true, bleed: true, trait: 'shell' }
        ]
    }
];

/* ==========================================================================
   4. 超豐富像素地圖景觀繪製引擎 (告別空曠！加入木屋、轉動風車、金字塔、方尖碑、礦車、雪人、天文台)
   ========================================================================== */
export function drawRichEnvironment(c, theme) {
    const tick = Math.floor(Date.now() / 350);

    if (theme === 'grassland') {
        c.fillStyle = '#4b7a47';
        c.fillRect(0, 0, 960, 540);

        // 草地層次色塊与野花田
        c.fillStyle = '#3d663a';
        c.fillRect(30, 65, 310, 180);
        c.fillRect(465, 55, 430, 195);
        c.fillRect(340, 330, 510, 175);

        // 清澈溪流與水波紋
        c.fillStyle = '#29b6f6';
        c.fillRect(405, 0, 58, 540);
        c.fillStyle = '#81d4fa';
        c.fillRect(420, (tick % 2) * 12, 22, 540);

        // 蜿蜒泥土主幹道與縱向支線
        c.fillStyle = '#9c7a54';
        c.fillRect(60, 235, 830, 86);
        c.fillRect(280, 130, 68, 260);
        c.fillStyle = '#b5926b';
        c.fillRect(70, 245, 810, 66);
        c.fillRect(290, 140, 48, 240);

        // 橫跨溪流的木橋與護欄
        c.fillStyle = '#5d4037';
        c.fillRect(396, 226, 76, 104);
        c.fillStyle = '#8d6e63';
        for (let bx = 402; bx < 470; bx += 13) c.fillRect(bx, 234, 9, 88);

        // 🏠 左上營地像素紅頂小木屋
        c.fillStyle = '#8d6e63';
        c.fillRect(95, 95, 64, 46);
        c.fillStyle = '#c62828';
        c.fillRect(87, 78, 80, 22);
        c.fillStyle = '#3e2723';
        c.fillRect(118, 115, 18, 26);
        c.fillStyle = '#ffeb3b';
        c.fillRect(102, 106, 12, 12);

        // 🌾 右上轉動大風車與農田
        c.fillStyle = '#795548';
        c.fillRect(670, 78, 36, 56);
        c.fillStyle = '#fff8e1';
        if (tick % 2 === 0) {
            c.fillRect(650, 82, 76, 8);
            c.fillRect(684, 52, 8, 68);
        } else {
            c.fillRect(658, 62, 60, 8);
            c.fillRect(658, 102, 60, 8);
        }

        // 木柵欄、指示路牌與營火
        c.fillStyle = '#5d4037';
        for (let fx = 165; fx < 385; fx += 24) {
            c.fillRect(fx, 216, 5, 20);
            c.fillRect(fx - 4, 222, 24, 5);
        }
        // 營火與石頭圈
        c.fillStyle = '#9e9e9e';
        c.fillRect(212, 168, 36, 14);
        c.fillStyle = (tick % 2 === 0) ? '#ff5722' : '#ffeb3b';
        c.fillRect(222, 150, 16, 20);

        // 茂密雙層森林樹群
        [[45, 65], [240, 52], [350, 68], [520, 58], [765, 62], [885, 72], [65, 390], [210, 415], [495, 410], [640, 420], [880, 395]].forEach(([tx, ty]) => {
            drawPixelTree(c, tx, ty, '#2e572c', '#437a40');
        });

        // 遍地盛開的小花與紅白蘑菇圈
        for (let i = 0; i < 36; i++) {
            const gx = (i * 137) % 880 + 40;
            const gy = (i * 89) % 430 + 60;
            c.fillStyle = (i % 3 === 0) ? '#ffeb3b' : (i % 2 === 0 ? '#f48fb1' : '#7cb342');
            c.fillRect(gx, gy, 8, 6);
            c.fillStyle = '#33691e';
            c.fillRect(gx + 2, gy + 6, 4, 4);
        }
    } else if (theme === 'ruins') {
        c.fillStyle = '#c89656';
        c.fillRect(0, 0, 960, 540);

        // 古文明石板格紋与流沙河
        c.strokeStyle = '#a8793e';
        c.lineWidth = 2;
        for (let y = 60; y < 540; y += 48) { c.beginPath(); c.moveTo(0, y); c.lineTo(960, y); c.stroke(); }
        for (let x = 0; x < 960; x += 64) { c.beginPath(); c.moveTo(x, 60); c.lineTo(x, 540); c.stroke(); }

        // 黃金祭壇廣場與古代太陽圖騰
        c.fillStyle = '#ab7b40';
        c.fillRect(110, 120, 740, 300);
        c.strokeStyle = '#ffca28';
        c.lineWidth = 4;
        c.strokeRect(390, 180, 180, 180);
        c.strokeRect(430, 220, 100, 100);

        // 🔺 遠古階梯金字塔與方尖碑
        c.fillStyle = '#8d6e63';
        c.fillRect(420, 62, 120, 52);
        c.fillStyle = '#a1887f';
        c.fillRect(440, 48, 80, 48);
        c.fillStyle = '#d7ccc8';
        c.fillRect(460, 34, 40, 40);

        // 綠洲小水池與仙人掌群
        c.fillStyle = '#00acc1';
        c.fillRect(140, 350, 95, 55);
        c.fillStyle = '#2e7d32';
        [[75, 180], [260, 90], [720, 88], [890, 210], [80, 360], [660, 425]].forEach(([cx, cy]) => {
            c.fillRect(cx, cy, 12, 36);
            c.fillRect(cx - 8, cy + 8, 8, 8);
            c.fillRect(cx - 8, cy + 2, 6, 8);
            c.fillRect(cx + 12, cy + 12, 8, 8);
            c.fillRect(cx + 14, cy + 6, 6, 8);
        });

        // 浮雕石柱群與燃燒火盆
        [[105, 85], [310, 85], [620, 85], [855, 85], [105, 390], [310, 390], [620, 390], [855, 390]].forEach(([px, py]) => {
            c.fillStyle = '#6d4c41';
            c.fillRect(px, py, 32, 48);
            c.fillStyle = '#d7ccc8';
            c.fillRect(px - 4, py, 40, 9);
            c.fillRect(px - 4, py + 40, 40, 9);
            c.fillStyle = (tick % 2 === 0) ? '#ff9800' : '#ffeb3b';
            c.fillRect(px + 10, py - 12, 12, 12);
        });
    } else if (theme === 'mine') {
        c.fillStyle = '#262b3d';
        c.fillRect(0, 0, 960, 540);

        // 地底深淵裂縫與螢光能量瀑布
        c.fillStyle = '#00838f';
        c.fillRect(0, 28, 960, 58);
        c.fillRect(390, 86, 84, 454);
        c.fillStyle = '#00e5ff';
        c.fillRect(0, 42, 960, 24);
        c.fillRect(412, 86, 40, 454);

        // 雙向縱橫礦車鐵軌與滿載寶石的礦車
        c.fillStyle = '#5d4037';
        for (let rx = 60; rx < 890; rx += 20) c.fillRect(rx, 248, 10, 48);
        c.fillStyle = '#90a4ae';
        c.fillRect(60, 254, 830, 6);
        c.fillRect(60, 284, 830, 6);

        // 🛒 像素寶石礦車
        [[250, 238], [660, 238]].forEach(([mx, my]) => {
            c.fillStyle = '#455a64';
            c.fillRect(mx, my, 44, 28);
            c.fillStyle = '#ffca28';
            c.fillRect(mx + 6, my - 8, 14, 10);
            c.fillStyle = '#e040fb';
            c.fillRect(mx + 22, my - 10, 14, 12);
            c.fillStyle = '#212121';
            c.fillRect(mx + 6, my + 26, 10, 10);
            c.fillRect(mx + 28, my + 26, 10, 10);
        });

        // 巨型發光紫水晶簇與螢光藍礦脈
        [[80, 105], [220, 92], [330, 110], [540, 95], [710, 100], [850, 105], [95, 385], [260, 400], [560, 395], [730, 405], [860, 385]].forEach(([cx, cy]) => {
            c.fillStyle = '#ab47bc';
            c.fillRect(cx, cy, 18, 36);
            c.fillStyle = '#e1bee7';
            c.fillRect(cx + 4, cy + 4, 6, 24);
            c.fillStyle = '#00e5ff';
            c.fillRect(cx - 10, cy + 12, 12, 24);
        });
    } else if (theme === 'volcano') {
        c.fillStyle = '#2b1614';
        c.fillRect(0, 0, 960, 540);
        c.fillStyle = '#3e1f1c';
        c.fillRect(70, 100, 820, 340);

        // 滾燙雙岩漿河與噴發火口
        c.fillStyle = '#d84315';
        c.fillRect(0, 35, 960, 55);
        c.fillRect(410, 90, 80, 450);
        c.fillStyle = (tick % 2 === 0) ? '#ffeb3b' : '#ff9800';
        c.fillRect(0, 48, 960, 24);
        c.fillRect(432, 90, 36, 450);

        // 黑曜石鐵索橋與巨大龍骨遺跡
        c.fillStyle = '#4e342e';
        c.fillRect(385, 225, 135, 95);
        c.fillStyle = '#d7ccc8';
        for (let bx = 220; bx < 340; bx += 22) {
            c.fillRect(bx, 150, 10, 38);
            c.fillRect(bx, 350, 10, 38);
        }

        // 噴火熔岩柱與煉金巨釜
        [[90, 95], [280, 85], [580, 90], [850, 95], [100, 395], [590, 400], [855, 395]].forEach(([vx, vy]) => {
            c.fillStyle = '#4e342e';
            c.fillRect(vx, vy, 36, 44);
            c.fillStyle = (tick % 2 === 0) ? '#ff5722' : '#ffeb3b';
            c.fillRect(vx + 8, vy - 12, 20, 16);
        });
    } else if (theme === 'snowfield') {
        c.fillStyle = '#cfd8dc';
        c.fillRect(0, 0, 960, 540);
        c.fillStyle = '#eceff1';
        c.fillRect(60, 90, 840, 360);

        // 結冰極光鏡湖與冰橋
        c.fillStyle = '#80deea';
        c.fillRect(380, 0, 92, 540);
        c.fillStyle = '#e0f7fa';
        c.fillRect(405, 0, 32, 540);
        c.fillStyle = '#90a4ae';
        c.fillRect(370, 235, 112, 80);

        // ⛄ 可愛像素雪人與冰屋 (Igloo)
        c.fillStyle = '#ffffff';
        c.fillRect(220, 155, 28, 26);
        c.fillRect(224, 135, 20, 20);
        c.fillStyle = '#ff5722';
        c.fillRect(232, 143, 8, 5);
        // 冰屋
        c.fillStyle = '#b2ebf2';
        c.fillRect(520, 95, 68, 46);
        c.fillStyle = '#006064';
        c.fillRect(542, 115, 24, 26);

        // 冰晶雪松林
        [[65, 70], [180, 62], [310, 72], [640, 65], [865, 75], [80, 390], [260, 405], [560, 405], [740, 395], [870, 395]].forEach(([tx, ty]) => {
            drawPixelTree(c, tx, ty, '#006064', '#4dd0e1');
        });
    } else {
        // 🌌 終章：虛空記憶圖書館
        c.fillStyle = '#140c24';
        c.fillRect(0, 0, 960, 540);

        c.strokeStyle = '#311b92';
        c.lineWidth = 2;
        for (let y = 60; y < 540; y += 48) { c.beginPath(); c.moveTo(0, y); c.lineTo(960, y); c.stroke(); }
        for (let x = 0; x < 960; x += 64) { c.beginPath(); c.moveTo(x, 60); c.lineTo(x, 540); c.stroke(); }

        // 雙重黃金星象大法陣
        c.strokeStyle = '#ffca28';
        c.lineWidth = 3;
        c.strokeRect(140, 120, 680, 300);
        c.strokeRect(390, 180, 180, 180);

        // 漂浮發光魔導書架與魔法水晶燈
        [[85, 80], [240, 80], [460, 68], [660, 80], [845, 80], [85, 395], [240, 395], [660, 395], [845, 395]].forEach(([bx, by]) => {
            c.fillStyle = '#4a148c';
            c.fillRect(bx, by, 44, 54);
            c.fillStyle = '#ffca28';
            c.fillRect(bx + 6, by + 8, 32, 8);
            c.fillStyle = '#00e5ff';
            c.fillRect(bx + 6, by + 22, 32, 8);
            c.fillStyle = '#e040fb';
            c.fillRect(bx + 6, by + 36, 32, 8);
        });
    }
}

function drawPixelTree(c, x, y, darkColor, lightColor) {
    c.fillStyle = 'rgba(0,0,0,0.32)';
    c.fillRect(x - 18, y + 36, 52, 16);
    c.fillStyle = '#5d4037';
    c.fillRect(x, y + 18, 16, 26);
    c.fillStyle = darkColor;
    c.fillRect(x - 18, y - 12, 52, 34);
    c.fillStyle = lightColor;
    c.fillRect(x - 12, y - 22, 40, 26);
}
