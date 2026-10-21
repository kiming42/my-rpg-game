/**
 * 《時光書境守護者》六課成語字詞與雙例句填充完整版總控制器 (main.js)
 * 1. 支援 6 大課節 (成語一、成語二、字詞一、字詞三、字詞五、字詞六) 精準勾選過濾
 * 2. 支援 3 種出題模式：混合出題 (字義+例句1+例句2) / 只出例句填充 / 只出字義配字
 * 3. 完整包含：20戰解封BOSS、採集點30秒冷卻、擊敗BOSS解鎖下一章、多周目(NG+)難度翻倍、3~5魔物同場、4大分類鍛造與背包擴充
 */
 import { QuestionBank, normalizeQuestion, SubjectMeta } from './src/data/questions.js';
 import { AudioSystem } from './src/systems/audio.js';
 import { GameState, StateManager, ClassBaseStats } from './src/core/state.js';
 import { MaterialsCatalog, EquipmentCatalog, PotionsCatalog } from './src/data/items.js';
 
 const ALL_UNITS = ['成語一', '成語二', '字詞一', '字詞三', '字詞五', '字詞六'];
 
 /* ==========================================================================
    1. 點陣像素圖庫 (26種怪物 + 4大職業 + 武器護具鎖頭)
    ========================================================================== */
 const PALETTE = {
     '.': null,
     'k': '#141013', 'w': '#ffffff', 's': '#ffccaa',
     'r': '#d32f2f', 'R': '#ff6659', 'g': '#388e3c', 'G': '#81c784',
     'b': '#1976d2', 'B': '#4fc3f7', 'y': '#fbc02d', 'Y': '#fff176',
     'p': '#7b1fa2', 'P': '#ce93d8', 'n': '#8d6e63', 'N': '#5d4037',
     'c': '#bdbdbd', 'o': '#e65100'
 };
 
 const SPRITES = {
     hero_warrior: [
         "...kkkkkk...","..kyyyyyyk..","..kybbbbbyk.","..kbsksksbk.",
         "...kbbbbbk.c","..kybbbbbykc","..kbbbbbbbcc","..kbyyyyybkc",
         "...kbbbbbk.n","...kbb.bbk..","...kN...Nk..","...kk...kk.."
     ],
     hero_mage: [
         "....kkkk....","...kwwwwk...","..kwwwwwwk..","..kwssskwk..",
         "..kskskss...","...krrrrk..R","..krrrrrrk.y","..kryyyyrrkn",
         "..krrrrrrk.n","...krrrrk..n","...kN..Nk..n","...kk...kk.."
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
         "............","............","............","............"
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
     ]
 };
 
 const SpriteCache = {};
 function getSpriteDataURL(key, scale = 3) {
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
 
 function drawMatrixOnCtx(ctx, key, x, y, scale = 5) {
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
    2. 六大章節與「5 魔物同場 BOSS 軍團」定義
    ========================================================================== */
 const REQUIRED_KILLS_FOR_BOSS = 20;
 const GATHER_COOLDOWN_SEC = 30;
 
 const MOB_SLOTS_4 = [
     [520, 125], [535, 295], [730, 105], [745, 285]
 ];
 const BOSS_SLOTS_5 = [
     [510, 105],
     [510, 295],
     [680, 165],
     [825, 95],
     [825, 305]
 ];
 
 const STAGES = [
     {
         id: 'grassland',
         title: '🌿 第一章：晨曦微風草原',
         theme: 'grassland',
         dropPool: ['fiber', 'dew', 'ink', 'wing', 'page'],
         bossDrop: 'core_doodle',
         roamPool: [
             { name: '墨水史萊姆', sprite: 'slime_ink', hp: 65, maxHp: 65, atk: 15, shield: false, bleed: false, trait: 'split' },
             { name: '疾風紙飛機', sprite: 'sprite_paper', hp: 58, maxHp: 58, atk: 16, shield: false, bleed: true, trait: 'none' },
             { name: '暗影書蝠', sprite: 'bat_book', hp: 62, maxHp: 62, atk: 15, shield: false, bleed: true, trait: 'none' },
             { name: '字典岩龜', sprite: 'turtle_dict', hp: 95, maxHp: 95, atk: 17, shield: true, bleed: false, trait: 'shell' },
             { name: '荒沼女巫', sprite: 'witch', hp: 82, maxHp: 82, atk: 19, shield: true, bleed: true, trait: 'none' }
         ],
         bossParty: [
             { name: '字典岩龜', sprite: 'turtle_dict', hp: 100, maxHp: 100, atk: 17, shield: true, bleed: false, trait: 'shell' },
             { name: '墨水史萊姆', sprite: 'slime_ink', hp: 80, maxHp: 80, atk: 15, shield: false, bleed: false, trait: 'split' },
             { name: '暴走塗鴉魔王', sprite: 'witch', hp: 260, maxHp: 260, atk: 26, shield: true, bleed: true, isBoss: true, trait: 'split' },
             { name: '疾風紙飛機', sprite: 'sprite_paper', hp: 75, maxHp: 75, atk: 16, shield: false, bleed: true, trait: 'none' },
             { name: '暗影書蝠', sprite: 'bat_book', hp: 75, maxHp: 75, atk: 16, shield: false, bleed: true, trait: 'none' }
         ]
     },
     {
         id: 'ruins',
         title: '⏳ 第二章：時光沙漏遺跡',
         theme: 'ruins',
         dropPool: ['feather', 'coin_old', 'gear', 'clay'],
         bossDrop: 'scale_time',
         roamPool: [
             { name: '發條盜賊鳥', sprite: 'bird_clock', hp: 95, maxHp: 95, atk: 21, shield: false, bleed: true, trait: 'steal' },
             { name: '幽靈歷史學者', sprite: 'ghost_scholar', hp: 110, maxHp: 110, atk: 22, shield: true, bleed: false, trait: 'shuffle' },
             { name: '荒漠蜥蜴人', sprite: 'lizard_sand', hp: 105, maxHp: 105, atk: 21, shield: false, bleed: true, trait: 'none' },
             { name: '兵馬俑守衛', sprite: 'guard_terra', hp: 145, maxHp: 145, atk: 24, shield: true, bleed: false, trait: 'shell' },
             { name: '巨大蠍子', sprite: 'scorpion', hp: 130, maxHp: 130, atk: 23, shield: true, bleed: true, trait: 'none' }
         ],
         bossParty: [
             { name: '兵馬俑守衛', sprite: 'guard_terra', hp: 145, maxHp: 145, atk: 23, shield: true, bleed: false, trait: 'shell' },
             { name: '荒漠蜥蜴人', sprite: 'lizard_sand', hp: 115, maxHp: 115, atk: 21, shield: false, bleed: true, trait: 'none' },
             { name: '歲月青銅巨龍', sprite: 'scorpion', hp: 350, maxHp: 350, atk: 32, shield: true, bleed: true, isBoss: true, trait: 'steal' },
             { name: '幽靈歷史學者', sprite: 'ghost_scholar', hp: 120, maxHp: 120, atk: 22, shield: true, bleed: false, trait: 'shuffle' },
             { name: '發條盜賊鳥', sprite: 'bird_clock', hp: 105, maxHp: 105, atk: 21, shield: false, bleed: true, trait: 'steal' }
         ]
     },
     {
         id: 'mine',
         title: '💎 第三章：幾何水晶礦坑',
         theme: 'mine',
         dropPool: ['acid', 'coil', 'elec_core', 'crystal'],
         bossDrop: 'core_omega',
         roamPool: [
             { name: '瘋狂試管地精', sprite: 'goblin_tube', hp: 130, maxHp: 130, atk: 26, shield: false, bleed: true, trait: 'shuffle' },
             { name: '靜電幾何史萊姆', sprite: 'slime_elec', hp: 125, maxHp: 125, atk: 28, shield: true, bleed: false, trait: 'split' },
             { name: '骷髏礦工', sprite: 'skeleton', hp: 120, maxHp: 120, atk: 25, shield: true, bleed: false, trait: 'none' },
             { name: '多面體磁石巨像', sprite: 'golem_magnet', hp: 175, maxHp: 175, atk: 30, shield: true, bleed: false, trait: 'shuffle' },
             { name: '深淵觸手', sprite: 'tentacle', hp: 140, maxHp: 140, atk: 27, shield: false, bleed: true, trait: 'none' }
         ],
         bossParty: [
             { name: '多面體磁石巨像', sprite: 'golem_magnet', hp: 180, maxHp: 180, atk: 28, shield: true, bleed: false, trait: 'shuffle' },
             { name: '骷髏礦工', sprite: 'skeleton', hp: 130, maxHp: 130, atk: 25, shield: true, bleed: false, trait: 'none' },
             { name: '真理機甲・歐米茄', sprite: 'boss_omega', hp: 460, maxHp: 460, atk: 38, shield: true, bleed: true, isBoss: true, trait: 'shuffle' },
             { name: '靜電幾何史萊姆', sprite: 'slime_elec', hp: 145, maxHp: 145, atk: 27, shield: true, bleed: false, trait: 'split' },
             { name: '瘋狂試管地精', sprite: 'goblin_tube', hp: 135, maxHp: 135, atk: 26, shield: false, bleed: true, trait: 'shuffle' }
         ]
     },
     {
         id: 'volcano',
         title: '🌋 第四章：熔岩煉金火口',
         theme: 'volcano',
         dropPool: ['lava_rock', 'ash_powder', 'elec_core', 'acid'],
         bossDrop: 'core_magma',
         roamPool: [
             { name: '熾熱熔岩魔像', sprite: 'golem_lava', hp: 195, maxHp: 195, atk: 34, shield: true, bleed: false, trait: 'shell' },
             { name: '火蜥蜴戰士', sprite: 'drake_fire', hp: 165, maxHp: 165, atk: 32, shield: false, bleed: true, trait: 'none' },
             { name: '爆裂火藥桶', sprite: 'bomb_barrel', hp: 145, maxHp: 145, atk: 38, shield: false, bleed: true, trait: 'steal' },
             { name: '深淵炎魔觸手', sprite: 'tentacle', hp: 170, maxHp: 170, atk: 33, shield: true, bleed: false, trait: 'split' }
         ],
         bossParty: [
             { name: '熾熱熔岩魔像', sprite: 'golem_lava', hp: 200, maxHp: 200, atk: 34, shield: true, bleed: false, trait: 'shell' },
             { name: '火蜥蜴戰士', sprite: 'drake_fire', hp: 170, maxHp: 170, atk: 32, shield: false, bleed: true, trait: 'none' },
             { name: '紅蓮業火巨龍', sprite: 'drake_fire', hp: 560, maxHp: 560, atk: 44, shield: true, bleed: true, isBoss: true, trait: 'shell' },
             { name: '爆裂火藥桶', sprite: 'bomb_barrel', hp: 155, maxHp: 155, atk: 36, shield: false, bleed: true, trait: 'none' },
             { name: '深淵炎魔觸手', sprite: 'tentacle', hp: 165, maxHp: 165, atk: 33, shield: true, bleed: false, trait: 'split' }
         ]
     },
     {
         id: 'snowfield',
         title: '❄️ 第五章：冰封星象雪原',
         theme: 'snowfield',
         dropPool: ['ice_shard', 'star_dust', 'crystal', 'feather'],
         bossDrop: 'core_frost',
         roamPool: [
             { name: '冰晶雪怪', sprite: 'yeti_frost', hp: 230, maxHp: 230, atk: 38, shield: true, bleed: false, trait: 'shell' },
             { name: '極地冰原狼', sprite: 'wolf_ice', hp: 190, maxHp: 190, atk: 40, shield: false, bleed: true, trait: 'steal' },
             { name: '星象貓頭鷹', sprite: 'owl_star', hp: 205, maxHp: 205, atk: 37, shield: true, bleed: false, trait: 'shuffle' },
             { name: '寒霜骷髏衛', sprite: 'skeleton', hp: 185, maxHp: 185, atk: 36, shield: true, bleed: true, trait: 'none' }
         ],
         bossParty: [
             { name: '冰晶雪怪', sprite: 'yeti_frost', hp: 240, maxHp: 240, atk: 38, shield: true, bleed: false, trait: 'shell' },
             { name: '極地冰原狼', sprite: 'wolf_ice', hp: 200, maxHp: 200, atk: 40, shield: false, bleed: true, trait: 'none' },
             { name: '極光星象冰凰', sprite: 'owl_star', hp: 680, maxHp: 680, atk: 50, shield: true, bleed: true, isBoss: true, trait: 'shuffle' },
             { name: '星象貓頭鷹', sprite: 'owl_star', hp: 210, maxHp: 210, atk: 37, shield: true, bleed: false, trait: 'shuffle' },
             { name: '寒霜骷髏衛', sprite: 'skeleton', hp: 190, maxHp: 190, atk: 36, shield: true, bleed: true, trait: 'none' }
         ]
     },
     {
         id: 'library',
         title: '🌌 終章：虛空記憶圖書館',
         theme: 'library',
         dropPool: ['void_ink', 'rune_origin', 'star_dust', 'lava_rock'],
         bossDrop: 'rune_origin',
         roamPool: [
             { name: '虛空凝視者', sprite: 'eye_void', hp: 260, maxHp: 260, atk: 44, shield: true, bleed: true, trait: 'shuffle' },
             { name: '噬魂魔導書', sprite: 'tome_evil', hp: 240, maxHp: 240, atk: 46, shield: true, bleed: false, trait: 'split' },
             { name: '墮落書境騎士', sprite: 'knight_void', hp: 290, maxHp: 290, atk: 48, shield: true, bleed: true, trait: 'shell' }
         ],
         bossParty: [
             { name: '墮落書境騎士', sprite: 'knight_void', hp: 300, maxHp: 300, atk: 46, shield: true, bleed: true, trait: 'shell' },
             { name: '虛空凝視者', sprite: 'eye_void', hp: 260, maxHp: 260, atk: 44, shield: true, bleed: true, trait: 'shuffle' },
             { name: '終焉虛空書皇', sprite: 'boss_void_king', hp: 850, maxHp: 850, atk: 58, shield: true, bleed: true, isBoss: true, trait: 'shuffle' },
             { name: '噬魂魔導書', sprite: 'tome_evil', hp: 260, maxHp: 260, atk: 45, shield: true, bleed: false, trait: 'split' },
             { name: '墮落書境騎士', sprite: 'knight_void', hp: 300, maxHp: 300, atk: 46, shield: true, bleed: true, trait: 'shell' }
         ]
     }
 ];
 
 const CLASS_SKILLS = [
     { id: 'w_slash', forClass: 'warrior', name: '重劈斬', cost: 10, dmg: 24, aoe: false, sprite: 'icon_sword', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'fiber', desc: '揮動武器對單一敵人造成沉重劈砍。' },
     { id: 'w_wave', forClass: 'warrior', name: '裂地劍氣', cost: 16, dmg: 18, aoe: true, sprite: 'icon_dagger', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'page', desc: '釋放地面劍氣，對全體 3~5 隻魔物造成範圍傷害。' },
     { id: 'w_shield', forClass: 'warrior', name: '聖盾猛擊', cost: 20, dmg: 28, aoe: false, sprite: 'icon_armor', unlocked: false, equipped: false, lv: 1, reqSp: 2, reqMat: 'page', addShield: 1, desc: '【研發技能】重擊敵人並立即獲得 1 層免傷護盾！' },
     { id: 'w_ult', forClass: 'warrior', name: '精裝書脊斬', cost: 30, dmg: 38, aoe: true, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 1, reqSp: 3, reqMat: 'gear', isMeteor: true, desc: '【終極劍技】召喚巨型書脊劍陣轟炸全場敵人！' },
 
     { id: 'm_fire', forClass: 'mage', name: '火球術', cost: 14, dmg: 28, aoe: false, sprite: 'icon_fire', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'ink', desc: '發射高溫烈焰火球，對單一目標造成高爆發傷害。' },
     { id: 'm_ice', forClass: 'mage', name: '冰霜新星', cost: 18, dmg: 19, aoe: true, sprite: 'icon_blue_pot', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'dew', desc: '凍結空氣轟炸全體敵人，造成範圍魔法傷害。' },
     { id: 'm_thunder', forClass: 'mage', name: '水墨雷暴', cost: 24, dmg: 28, aoe: true, sprite: 'icon_scroll', unlocked: false, equipped: false, lv: 1, reqSp: 2, reqMat: 'ink', desc: '【研發技能】召喚魔力水墨落雷，重創全體敵人！' },
     { id: 'm_meteor', forClass: 'mage', name: '末日降臨', cost: 34, dmg: 42, aoe: true, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 1, reqSp: 3, reqMat: 'crystal', isMeteor: true, desc: '【終極禁咒】召喚末日隕石毀滅全場所有魔物！' },
 
     { id: 'r_shot', forClass: 'ranger', name: '精準射擊', cost: 10, dmg: 26, aoe: false, sprite: 'icon_bow', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'wing', desc: '瞄準弱點射擊單一目標，高機率造成暴擊。' },
     { id: 'r_double', forClass: 'ranger', name: '二連矢', cost: 16, dmg: 18, aoe: true, sprite: 'icon_bow', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'fiber', desc: '疾速連射箭矢，同時攻擊場上所有敵人。' },
     { id: 'r_kunai', forClass: 'ranger', name: '毒刃背刺', cost: 22, dmg: 36, aoe: false, sprite: 'icon_dagger', unlocked: false, equipped: false, lv: 1, reqSp: 2, reqMat: 'wing', desc: '【研發技能】瞬移至敵人背後刺擊，造成極高單體傷害！' },
     { id: 'r_rain', forClass: 'ranger', name: '漫天箭雨', cost: 28, dmg: 36, aoe: true, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 1, reqSp: 3, reqMat: 'feather', isMeteor: true, desc: '【終極箭技】向天空傾瀉火焰箭雨轟炸全場！' },
 
     { id: 'c_light', forClass: 'cleric', name: '聖光彈', cost: 12, dmg: 22, aoe: false, sprite: 'icon_scroll', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'dew', healSelf: 15, desc: '發射聖光攻擊單一敵人，並為自己恢復 15 HP。' },
     { id: 'c_heal', forClass: 'cleric', name: '聖露治癒', cost: 16, dmg: 16, aoe: true, sprite: 'icon_red_pot', unlocked: true, equipped: true, lv: 1, reqSp: 1, reqMat: 'dew', healSelf: 38, desc: '大幅恢復自身 38 點 HP，並以聖光波傷害全體魔物。' },
     { id: 'c_nova', forClass: 'cleric', name: '淨化新星', cost: 22, dmg: 25, aoe: true, sprite: 'icon_ring', unlocked: false, equipped: false, lv: 1, reqSp: 2, reqMat: 'feather', healSelf: 25, desc: '【研發技能】釋放聖光波傷害全體魔物並恢復 25 HP！' },
     { id: 'c_judge', forClass: 'cleric', name: '神聖審判', cost: 32, dmg: 38, aoe: true, sprite: 'icon_fire', unlocked: false, equipped: false, lv: 1, reqSp: 3, reqMat: 'scale_time', isMeteor: true, healSelf: 35, desc: '【終極聖言】天降審判之光重創全場並恢復 35 HP！' }
 ];
 
 /* ==========================================================================
    3. 遊戲即時狀態
    ========================================================================== */
 const State = {
     mode: 'explore',
     turnPhase: 'player',
     stageIdx: 0,
     maxUnlockedStage: 0,
     stageKills: [0, 0, 0, 0, 0, 0],
     ngPlusCount: 0,
     gatherReadyTime: 0,
     currentBattleIsBoss: false,
     quizMode: 'mixed', // 'mixed' | 'sentence' | 'meaning'
 
     turn: 1,
     heroHp: 145,
     heroMaxHp: 145,
     heroMp: 60,
     heroMaxMp: 60,
     shieldLayers: 0,
     heroBuffText: '',
     heroBuffTimer: 0,
 
     bagCapacity: 10,
     potions: {
         hp_pot_s: 3,
         mp_pot_s: 2,
         hp_pot_l: 0,
         atk_scroll: 1
     },
 
     bagPage: 1,
     forgeSubTab: 'weapon',
 
     mapX: 220,
     mapY: 280,
     targetX: 220,
     targetY: 280,
     dangerGauge: 15,
     stepCooldown: 0,
 
     enemies: [],
     selectedTargetIdx: 0,
     projectiles: [],
     floatingDmgs: [],
     screenFlash: 0,
     selectedSkill: null,
     skillPts: 3,
     gold: 100
 };
 
 let canvas, ctx;
 
 document.addEventListener('DOMContentLoaded', () => {
     canvas = document.getElementById('battle-canvas');
     ctx = canvas.getContext('2d');
     ctx.imageSmoothingEnabled = false;
 
     // 確保預設勾選全部 6 個課節
     if (!GameState.settings.subjects || !GameState.settings.subjects.some(s => ALL_UNITS.includes(s))) {
         GameState.settings.subjects = [...ALL_UNITS];
     }
 
     initTitleAndCreateScreens();
     initGameHUDAndExploration();
     initBookModal();
     initVictoryAndQuizModals();
 
     requestAnimationFrame(renderLoop);
 });
 
 function getCurrentClassSkills() {
     return CLASS_SKILLS.filter(s => s.forClass === GameState.heroClass);
 }
 
 function getDifficultyMultiplier() {
     return Math.pow(2, State.ngPlusCount || 0);
 }
 
 function syncProgressToGameState() {
     GameState.gold = State.gold;
     GameState.gem = State.skillPts;
     GameState.bagCapacity = State.bagCapacity;
     GameState.maxUnlockedStage = State.maxUnlockedStage;
     GameState.stageKills = [...State.stageKills];
     GameState.ngPlusCount = State.ngPlusCount;
     GameState.potions = { ...State.potions };
     GameState.quizMode = State.quizMode;
     StateManager.saveGame();
 }
 
 function loadProgressFromGameState() {
     State.gold = GameState.gold ?? 100;
     State.skillPts = GameState.gem ?? 3;
     State.bagCapacity = GameState.bagCapacity || 10;
     State.maxUnlockedStage = GameState.maxUnlockedStage ?? 0;
     State.stageKills = Array.isArray(GameState.stageKills) && GameState.stageKills.length === 6
         ? [...GameState.stageKills]
         : [0, 0, 0, 0, 0, 0];
     State.ngPlusCount = GameState.ngPlusCount || 0;
     State.quizMode = GameState.quizMode || 'mixed';
     if (GameState.potions) {
         State.potions = { ...GameState.potions };
     }
     if (!GameState.settings.subjects || !GameState.settings.subjects.some(s => ALL_UNITS.includes(s))) {
         GameState.settings.subjects = [...ALL_UNITS];
     }
 }
 
 /* ==========================================================================
    4. 首頁 (Title Screen) 與創角畫面控制
    ========================================================================== */
 function initTitleAndCreateScreens() {
     const tCanvas = document.getElementById('title-bg-canvas');
     const tCtx = tCanvas.getContext('2d');
     tCtx.imageSmoothingEnabled = false;
     drawRichEnvironment(tCtx, 'grassland');
     drawMatrixOnCtx(tCtx, 'hero_warrior', 220, 250, 6);
     drawMatrixOnCtx(tCtx, 'hero_mage', 310, 260, 6);
     drawMatrixOnCtx(tCtx, 'witch', 660, 230, 6);
     drawMatrixOnCtx(tCtx, 'yeti_frost', 750, 260, 6);
 
     refreshTitleSaveDisplay();
 
     document.getElementById('btn-continue-game').addEventListener('click', () => {
         AudioSystem.playSFX('win');
         StateManager.loadGame();
         loadProgressFromGameState();
         enterExploreMode(Math.min(GameState.currentMapIdx || 0, State.maxUnlockedStage));
         switchScreen('screen-game');
     });
 
     document.getElementById('btn-new-game').addEventListener('click', () => {
         AudioSystem.playSFX('click');
         document.querySelectorAll('.cls-preview-cv').forEach(cv => {
             const c = cv.getContext('2d');
             c.imageSmoothingEnabled = false;
             c.clearRect(0, 0, 60, 60);
             drawMatrixOnCtx(c, cv.dataset.sprite, 6, 6, 4);
         });
         switchScreen('screen-create');
     });
 
     let chosenClass = 'warrior';
     document.querySelectorAll('.cls-select-card').forEach(card => {
         card.addEventListener('click', () => {
             AudioSystem.playSFX('click');
             document.querySelectorAll('.cls-select-card').forEach(c => c.classList.remove('selected'));
             card.classList.add('selected');
             chosenClass = card.dataset.cls;
         });
     });
 
     document.getElementById('btn-back-title').addEventListener('click', () => {
         AudioSystem.playSFX('click');
         switchScreen('screen-title');
     });
 
     document.getElementById('btn-confirm-create').addEventListener('click', () => {
         AudioSystem.playSFX('craft');
         const nameVal = document.getElementById('create-hero-name').value.trim() || 'Justin';
         localStorage.removeItem('TIME_BOOK_GUARDIAN_SAVE_V1');
 
         GameState.heroName = nameVal;
         GameState.heroClass = chosenClass;
         GameState.level = 1;
         GameState.exp = 0;
         GameState.settings.subjects = [...ALL_UNITS];
         GameState.unlockedEquipment = ['wep_wood_sword', 'arm_cloth'];
         GameState.equipment = {
             weapon: 'wep_wood_sword', offhand: null,
             head: null, armor: 'arm_cloth', gloves: null, legs: null, boots: null,
             neck: null, ring1: null, ring2: null, relic: null
         };
 
         State.gold = 100;
         State.skillPts = 3;
         State.bagCapacity = 10;
         State.maxUnlockedStage = 0;
         State.stageKills = [0, 0, 0, 0, 0, 0];
         State.ngPlusCount = 0;
         State.potions = { hp_pot_s: 3, mp_pot_s: 2, hp_pot_l: 0, atk_scroll: 1 };
 
         syncProgressToGameState();
         enterExploreMode(0);
         switchScreen('screen-game');
     });
 
     document.getElementById('btn-go-title').addEventListener('click', () => {
         AudioSystem.playSFX('click');
         syncProgressToGameState();
         refreshTitleSaveDisplay();
         switchScreen('screen-title');
     });
 }
 
 function refreshTitleSaveDisplay() {
     const hasSave = StateManager.loadGame();
     const continueBtn = document.getElementById('btn-continue-game');
     const saveInfo = document.getElementById('title-save-info');
     if (hasSave) {
         const clsInfo = ClassBaseStats[GameState.heroClass] || ClassBaseStats.warrior;
         const loopNum = (GameState.ngPlusCount || 0) + 1;
         document.getElementById('save-hero-summary').innerText =
             `${GameState.heroName} (第${loopNum}周目 Lv.${GameState.level} ${clsInfo.name}｜🟡${GameState.gold})`;
         continueBtn.classList.remove('hidden');
         saveInfo.classList.remove('hidden');
     } else {
         continueBtn.classList.add('hidden');
         saveInfo.classList.add('hidden');
     }
 }
 
 function switchScreen(screenId) {
     document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
     document.getElementById(screenId).classList.add('active');
 }
 
 /* ==========================================================================
    5. 章節探索、20戰解封BOSS檢查、3~5隻魔物軍團戰鬥生成
    ========================================================================== */
 function enterExploreMode(stageIdx = State.stageIdx) {
     State.mode = 'explore';
     State.turnPhase = 'player';
     State.stageIdx = Math.max(0, Math.min(stageIdx, State.maxUnlockedStage));
     GameState.currentMapIdx = State.stageIdx;
 
     const stats = getFullHeroStats();
     State.heroMaxHp = stats.maxHp;
     State.heroHp = stats.maxHp;
     State.heroMp = State.heroMaxMp;
     State.mapX = 210;
     State.mapY = 275;
     State.targetX = 210;
     State.targetY = 275;
     State.dangerGauge = 10;
 
     updateMapHeaderUI();
     document.getElementById('ui-mode-indicator').innerText = '🗺️ 探索模式';
     document.getElementById('ui-explore-bar').classList.remove('hidden');
     document.getElementById('hud-explore-controls').classList.remove('hidden');
     document.getElementById('hud-combat-controls').classList.add('hidden');
 
     document.getElementById('btn-flee-or-search').innerText = '🔍 尋敵';
     document.getElementById('btn-cast-turn').innerText = '⚔️';
 
     updateDangerBar();
     updateHeroTopHUD();
 }
 
 function updateMapHeaderUI() {
     const st = STAGES[State.stageIdx];
     const mult = getDifficultyMultiplier();
     const loopTag = State.ngPlusCount > 0 ? ` [第${State.ngPlusCount + 1}周目・難度x${mult}]` : '';
     document.getElementById('ui-map-title').innerText = `${st.title}${loopTag}`;
 
     const kills = State.stageKills[State.stageIdx] || 0;
     const bossTxt = document.getElementById('ui-boss-prog-txt');
     if (kills >= REQUIRED_KILLS_FOR_BOSS) {
         bossTxt.innerText = `👑 魔王已現身！(${kills}/${REQUIRED_KILLS_FOR_BOSS})`;
         bossTxt.style.color = '#76ff03';
     } else {
         bossTxt.innerText = `💀 魔王封印: ${kills}/${REQUIRED_KILLS_FOR_BOSS}戰`;
         bossTxt.style.color = '#ffca28';
     }
 
     document.getElementById('btn-prev-map').disabled = (State.stageIdx <= 0);
     const nextBtn = document.getElementById('btn-next-map');
     if (State.stageIdx >= STAGES.length - 1) {
         nextBtn.disabled = true;
         nextBtn.title = '已是最終章節';
     } else if (State.stageIdx >= State.maxUnlockedStage) {
         nextBtn.style.opacity = '0.45';
         nextBtn.title = '🔒 需先完成 20 次討伐並擊敗本章 BOSS 方可解鎖下一章！';
     } else {
         nextBtn.style.opacity = '1';
         nextBtn.disabled = false;
         nextBtn.title = '前往下一章節';
     }
 }
 
 function triggerEncounterBattle(isBossFight = false) {
     const kills = State.stageKills[State.stageIdx] || 0;
     if (isBossFight && kills < REQUIRED_KILLS_FOR_BOSS) {
         AudioSystem.playSFX('wrong');
         State.heroBuffText = `🔒 需再擊敗 ${REQUIRED_KILLS_FOR_BOSS - kills} 次小怪才可挑戰 BOSS！`;
         State.heroBuffTimer = 70;
         return;
     }
 
     AudioSystem.playSFX('wrong');
     State.mode = 'combat';
     State.turnPhase = 'player';
     State.turn = 1;
     State.screenFlash = 10;
     State.shieldLayers = 0;
     State.selectedTargetIdx = 0;
     State.currentBattleIsBoss = isBossFight;
 
     const st = STAGES[State.stageIdx];
     const diffMult = getDifficultyMultiplier();
 
     if (isBossFight) {
         State.enemies = st.bossParty.map((tpl, idx) => {
             const [px, py] = BOSS_SLOTS_5[idx] || [680, 165];
             const scaledHp = Math.floor(tpl.hp * diffMult);
             const scaledAtk = Math.floor(tpl.atk * diffMult);
             return {
                 ...structuredClone(tpl),
                 hp: scaledHp,
                 maxHp: scaledHp,
                 atk: scaledAtk,
                 x: px,
                 y: py
             };
         });
     } else {
         const count = Math.random() < 0.5 ? 3 : 4;
         State.enemies = MOB_SLOTS_4.slice(0, count).map(([px, py]) => {
             const tpl = st.roamPool[Math.floor(Math.random() * st.roamPool.length)];
             const scaledHp = Math.floor(tpl.hp * diffMult);
             const scaledAtk = Math.floor(tpl.atk * diffMult);
             return {
                 ...structuredClone(tpl),
                 hp: scaledHp,
                 maxHp: scaledHp,
                 atk: scaledAtk,
                 x: px,
                 y: py
             };
         });
     }
 
     document.getElementById('ui-mode-indicator').innerText = `🟢 我方回合 (第 ${State.turn} 回合)`;
     document.getElementById('ui-explore-bar').classList.add('hidden');
     document.getElementById('hud-explore-controls').classList.add('hidden');
     document.getElementById('hud-combat-controls').classList.remove('hidden');
 
     document.getElementById('btn-flee-or-search').innerText = '🏃 撤退';
     document.getElementById('btn-cast-turn').innerText = '≫';
 
     renderBottomLeftHUD();
 
     const scrollEl = document.getElementById('ui-cast-scroll');
     document.getElementById('ui-cast-name').innerText = isBossFight
         ? `👑 魔王軍團降臨 (5體同場)！`
         : `⚡ 遭遇魔物小隊 (${State.enemies.length}體圍攻)！`;
     scrollEl.classList.remove('hidden');
     setTimeout(() => scrollEl.classList.add('hidden'), 1200);
 }
 
 function getFullHeroStats() {
     const base = ClassBaseStats[GameState.heroClass] || ClassBaseStats.warrior;
     let maxHp = base.baseHp + (GameState.level - 1) * 16;
     let atk = base.baseAtk + (GameState.level - 1) * 3;
     let def = base.baseDef + (GameState.level - 1) * 2;
 
     ['weapon', 'offhand', 'head', 'armor', 'gloves', 'legs', 'boots', 'neck', 'ring1', 'ring2', 'relic'].forEach(slotKey => {
         const eqId = GameState.equipment[slotKey];
         const item = EquipmentCatalog[eqId];
         if (item) {
             atk += (item.atk || 0);
             def += (item.def || 0);
             maxHp += (item.hp || 0);
         }
     });
 
     return { maxHp, atk, def, icon: base.icon, className: base.name };
 }
 
 function initGameHUDAndExploration() {
     document.getElementById('btn-open-guild').addEventListener('click', () => openBook('guild'));
     document.getElementById('ui-class-badge').addEventListener('click', () => openBook('guild'));
 
     document.getElementById('btn-prev-map').addEventListener('click', () => {
         if (State.stageIdx > 0) {
             AudioSystem.playSFX('click');
             enterExploreMode(State.stageIdx - 1);
         }
     });
 
     document.getElementById('btn-next-map').addEventListener('click', () => {
         if (State.stageIdx >= STAGES.length - 1) return;
         if (State.stageIdx >= State.maxUnlockedStage) {
             AudioSystem.playSFX('wrong');
             const kills = State.stageKills[State.stageIdx] || 0;
             alert(`🔒 尚未解鎖下一章！\n請先在本章完成 20 次小怪討伐（目前 ${kills}/20），並擊敗鎮守本章的 BOSS！`);
             return;
         }
         AudioSystem.playSFX('click');
         enterExploreMode(State.stageIdx + 1);
     });
 
     const stepMove = (dx, dy) => {
         if (State.mode !== 'explore') return;
         State.targetX = Math.max(90, Math.min(870, State.mapX + dx));
         State.targetY = Math.max(105, Math.min(430, State.mapY + dy));
     };
 
     document.querySelectorAll('.dpad-btn').forEach(btn => {
         btn.addEventListener('click', () => {
             const dir = btn.dataset.dir;
             if (dir === 'up') stepMove(0, -48);
             if (dir === 'down') stepMove(0, 48);
             if (dir === 'left') stepMove(-48, 0);
             if (dir === 'right') stepMove(48, 0);
         });
     });
 
     window.addEventListener('keydown', (e) => {
         if (State.mode !== 'explore') return;
         if (e.key === 'ArrowUp' || e.key === 'w') stepMove(0, -42);
         if (e.key === 'ArrowDown' || e.key === 's') stepMove(0, 42);
         if (e.key === 'ArrowLeft' || e.key === 'a') stepMove(-42, 0);
         if (e.key === 'ArrowRight' || e.key === 'd') stepMove(42, 0);
     });
 
     canvas.addEventListener('click', (e) => {
         const rect = canvas.getBoundingClientRect();
         const cx = ((e.clientX - rect.left) / rect.width) * 960;
         const cy = ((e.clientY - rect.top) / rect.height) * 540;
 
         if (State.mode === 'explore') {
             State.targetX = Math.max(85, Math.min(875, cx - 25));
             State.targetY = Math.max(100, Math.min(435, cy - 30));
         } else if (State.mode === 'combat') {
             State.enemies.forEach((en, idx) => {
                 if (en.hp > 0 && Math.hypot(cx - (en.x + 30), cy - (en.y + 30)) < 50) {
                     AudioSystem.playSFX('click');
                     State.selectedTargetIdx = idx;
                 }
             });
         }
     });
 
     document.getElementById('btn-flee-or-search').addEventListener('click', () => {
         AudioSystem.playSFX('click');
         if (State.mode === 'explore') {
             triggerEncounterBattle(false);
         } else {
             enterExploreMode(State.stageIdx);
         }
     });
 
     document.getElementById('btn-cast-turn').addEventListener('click', () => {
         if (State.mode === 'explore') {
             triggerEncounterBattle(false);
         } else if (State.turnPhase === 'player') {
             const mySkills = getCurrentClassSkills().filter(s => s.unlocked && s.equipped);
             openQuizForSkill(mySkills[0] || getCurrentClassSkills()[0]);
         }
     });
 }
 
 function updateDangerBar() {
     document.getElementById('ui-danger-fill').style.width = `${Math.min(100, State.dangerGauge)}%`;
 }
 
 function updateHeroTopHUD() {
     const stats = getFullHeroStats();
     State.heroMaxHp = stats.maxHp;
     if (State.heroHp > State.heroMaxHp) State.heroHp = State.heroMaxHp;
 
     const icons = { warrior: '🛡️', mage: '🪄', ranger: '🏹', cleric: '🌿' };
     document.getElementById('ui-class-badge').innerText = icons[GameState.heroClass] || '🛡️';
     document.getElementById('ui-hero-name').innerText = GameState.heroName;
     document.getElementById('ui-hero-lv').innerText = GameState.level;
     document.getElementById('ui-loop-badge').innerText = `第${(State.ngPlusCount || 0) + 1}周目`;
     document.getElementById('ui-combo-tag').innerText = `🔥 ${GameState.combat.combo} 連擊`;
     document.getElementById('ui-class-name-txt').innerText = stats.className;
     document.getElementById('ui-stat-atk').innerText = stats.atk;
     document.getElementById('ui-stat-def').innerText = stats.def;
 }
 
 /* ==========================================================================
    6. 六大章節地貌渲染 + 採集冷卻倒數 + 20戰解封BOSS地標
    ========================================================================== */
 function renderLoop() {
     const theme = STAGES[State.stageIdx].theme;
     drawRichEnvironment(ctx, theme);
 
     if (State.mode === 'explore') {
         updateExplorationMovement();
         drawExploreLandmarks();
         drawHeroAt(State.mapX, State.mapY);
     } else {
         drawHeroAt(155, 215);
         drawEnemyUnits();
     }
 
     drawProjectilesAndFX();
     requestAnimationFrame(renderLoop);
 }
 
 function drawRichEnvironment(c, theme) {
     if (theme === 'grassland') {
         c.fillStyle = '#4b7a47';
         c.fillRect(0, 0, 960, 540);
         c.fillStyle = '#3d663a';
         c.fillRect(40, 70, 290, 190);
         c.fillRect(470, 60, 420, 210);
         c.fillRect(360, 320, 480, 175);
 
         c.fillStyle = '#29b6f6';
         c.fillRect(410, 0, 56, 540);
         c.fillStyle = '#81d4fa';
         c.fillRect(424, 0, 20, 540);
 
         c.fillStyle = '#9c7a54';
         c.fillRect(70, 235, 810, 88);
         c.fillStyle = '#b5926b';
         c.fillRect(80, 245, 790, 68);
         c.fillStyle = '#6d4c41';
         for (let bx = 402; bx < 472; bx += 14) {
             c.fillRect(bx, 230, 10, 98);
         }
 
         [[65, 65], [240, 55], [345, 70], [530, 60], [875, 70], [85, 390], [295, 410], [520, 415], [880, 395]].forEach(([tx, ty]) => {
             drawPixelTree(c, tx, ty, '#2e572c', '#437a40');
         });
     } else if (theme === 'ruins') {
         c.fillStyle = '#c89656';
         c.fillRect(0, 0, 960, 540);
         c.strokeStyle = '#a8793e';
         c.lineWidth = 3;
         for (let y = 65; y < 540; y += 52) {
             c.beginPath(); c.moveTo(0, y); c.lineTo(960, y); c.stroke();
         }
         for (let x = 0; x < 960; x += 68) {
             c.beginPath(); c.moveTo(x, 65); c.lineTo(x, 540); c.stroke();
         }
         c.fillStyle = '#ab7b40';
         c.fillRect(120, 125, 730, 295);
 
         [[105, 85], [310, 85], [620, 85], [855, 85], [105, 390], [310, 390], [620, 390], [855, 390]].forEach(([px, py]) => {
             c.fillStyle = '#8d6e63';
             c.fillRect(px, py, 32, 48);
             c.fillStyle = (Date.now() % 400 < 200) ? '#ff9800' : '#ffeb3b';
             c.fillRect(px + 10, py - 12, 12, 12);
         });
     } else if (theme === 'mine') {
         c.fillStyle = '#262b3d';
         c.fillRect(0, 0, 960, 540);
         c.fillStyle = '#00838f';
         c.fillRect(0, 28, 960, 58);
         c.fillRect(390, 86, 84, 454);
         c.fillStyle = '#00e5ff';
         c.fillRect(0, 42, 960, 24);
         c.fillRect(412, 86, 40, 454);
 
         c.fillStyle = '#5d4037';
         for (let rx = 70; rx < 880; rx += 22) c.fillRect(rx, 248, 10, 48);
         c.fillStyle = '#90a4ae';
         c.fillRect(70, 254, 810, 6);
         c.fillRect(70, 284, 810, 6);
 
         [[90, 105], [260, 95], [560, 95], [840, 105], [105, 385], [280, 400], [580, 395], [855, 385]].forEach(([cx, cy]) => {
             c.fillStyle = '#ab47bc';
             c.fillRect(cx, cy, 18, 34);
             c.fillStyle = '#00e5ff';
             c.fillRect(cx - 10, cy + 12, 12, 22);
         });
     } else if (theme === 'volcano') {
         c.fillStyle = '#2b1614';
         c.fillRect(0, 0, 960, 540);
         c.fillStyle = '#3e1f1c';
         c.fillRect(80, 110, 800, 330);
 
         c.fillStyle = '#d84315';
         c.fillRect(0, 35, 960, 55);
         c.fillRect(420, 90, 75, 450);
         c.fillStyle = (Date.now() % 500 < 250) ? '#ffeb3b' : '#ff9800';
         c.fillRect(0, 50, 960, 22);
         c.fillRect(440, 90, 35, 450);
 
         c.fillStyle = '#4e342e';
         c.fillRect(395, 225, 125, 95);
 
         [[95, 95], [280, 85], [610, 90], [850, 95], [105, 395], [620, 400], [855, 395]].forEach(([vx, vy]) => {
             c.fillStyle = '#4e342e';
             c.fillRect(vx, vy, 36, 44);
             c.fillStyle = '#ff5722';
             c.fillRect(vx + 8, vy - 8, 20, 12);
         });
     } else if (theme === 'snowfield') {
         c.fillStyle = '#cfd8dc';
         c.fillRect(0, 0, 960, 540);
         c.fillStyle = '#eceff1';
         c.fillRect(70, 95, 820, 350);
 
         c.fillStyle = '#80deea';
         c.fillRect(380, 0, 90, 540);
         c.fillStyle = '#e0f7fa';
         c.fillRect(405, 0, 30, 540);
 
         [[75, 70], [250, 65], [560, 65], [865, 75], [90, 390], [290, 405], [580, 405], [870, 395]].forEach(([tx, ty]) => {
             drawPixelTree(c, tx, ty, '#006064', '#4dd0e1');
         });
     } else {
         c.fillStyle = '#140c24';
         c.fillRect(0, 0, 960, 540);
 
         c.strokeStyle = '#311b92';
         c.lineWidth = 2;
         for (let y = 60; y < 540; y += 48) {
             c.beginPath(); c.moveTo(0, y); c.lineTo(960, y); c.stroke();
         }
         for (let x = 0; x < 960; x += 64) {
             c.beginPath(); c.moveTo(x, 60); c.lineTo(x, 540); c.stroke();
         }
 
         c.strokeStyle = '#ffca28';
         c.lineWidth = 3;
         c.strokeRect(160, 130, 640, 280);
         c.strokeRect(410, 190, 140, 160);
 
         [[95, 85], [290, 85], [640, 85], [845, 85], [95, 395], [845, 395]].forEach(([bx, by]) => {
             c.fillStyle = '#4a148c';
             c.fillRect(bx, by, 42, 52);
             c.fillStyle = '#ffca28';
             c.fillRect(bx + 6, by + 8, 30, 8);
             c.fillStyle = '#00e5ff';
             c.fillRect(bx + 6, by + 22, 30, 8);
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
 
 function drawExploreLandmarks() {
     const st = STAGES[State.stageIdx];
 
     drawLandmarkLabel(185, 130, '🔨 大熊鍛造與煉藥');
     drawMatrixOnCtx(ctx, 'smith_bear', 160, 138, 4);
 
     const now = Date.now();
     const remainSec = Math.ceil((State.gatherReadyTime - now) / 1000);
     if (remainSec > 0) {
         drawLandmarkLabel(330, 355, `⏳ 採集冷卻 (${remainSec}s)`, '#bdbdbd');
         ctx.globalAlpha = 0.4;
         drawMatrixOnCtx(ctx, 'icon_shroom', 312, 365, 3);
         ctx.globalAlpha = 1.0;
     } else {
         drawLandmarkLabel(330, 355, '✨ 素材採集點(可採集)', '#76ff03');
         drawMatrixOnCtx(ctx, 'icon_shroom', 312, 365, 3);
     }
 
     const roamMob = st.roamPool[0];
     drawLandmarkLabel(590, 195, `👾 ${roamMob.name}小隊`);
     drawMatrixOnCtx(ctx, roamMob.sprite, 565, 205, 5);
 
     const kills = State.stageKills[State.stageIdx] || 0;
     if (kills >= REQUIRED_KILLS_FOR_BOSS) {
         const bossMob = st.bossParty[2];
         drawLandmarkLabel(805, 235, `👑 ${bossMob.name} (BOSS)`, '#ffca28');
         drawMatrixOnCtx(ctx, bossMob.sprite, 770, 245, 6);
     } else {
         drawLandmarkLabel(805, 235, `🔒 魔王封印 (需再勝${REQUIRED_KILLS_FOR_BOSS - kills}場)`, '#ff8a80');
         drawMatrixOnCtx(ctx, 'icon_lock', 782, 255, 4);
     }
 }
 
 function drawLandmarkLabel(x, y, text, color = '#ffffff') {
     ctx.font = 'bold 12px "DotGothic16", monospace';
     ctx.textAlign = 'center';
     ctx.fillStyle = 'rgba(0,0,0,0.78)';
     ctx.fillRect(x - 84, y - 16, 168, 20);
     ctx.strokeStyle = '#c8a97e';
     ctx.lineWidth = 1;
     ctx.strokeRect(x - 84, y - 16, 168, 20);
     ctx.fillStyle = color;
     ctx.fillText(text, x, y - 2);
 }
 
 function updateExplorationMovement() {
     const dx = State.targetX - State.mapX;
     const dy = State.targetY - State.mapY;
     const dist = Math.hypot(dx, dy);
 
     if (dist > 3) {
         const speed = 3.6;
         State.mapX += (dx / dist) * speed;
         State.mapY += (dy / dist) * speed;
 
         State.dangerGauge += 0.45;
         updateDangerBar();
 
         if (State.dangerGauge >= 100) {
             State.dangerGauge = 10;
             State.targetX = State.mapX;
             State.targetY = State.mapY;
             triggerEncounterBattle(false);
             return;
         }
     }
 
     if (State.stepCooldown > 0) {
         State.stepCooldown--;
         return;
     }
 
     if (Math.hypot(State.mapX - 160, State.mapY - 138) < 42) {
         State.stepCooldown = 90;
         State.targetX = 220; State.targetY = 260;
         openBook('forge');
     } else if (Math.hypot(State.mapX - 312, State.mapY - 365) < 42) {
         State.stepCooldown = 70;
         State.targetX = 250; State.targetY = 280;
 
         const now = Date.now();
         const remainSec = Math.ceil((State.gatherReadyTime - now) / 1000);
         if (remainSec > 0) {
             AudioSystem.playSFX('wrong');
             State.heroBuffText = `⏳ 採集點冷卻中，請等 ${remainSec} 秒！`;
             State.heroBuffTimer = 60;
             return;
         }
 
         State.gatherReadyTime = now + GATHER_COOLDOWN_SEC * 1000;
         const pool = STAGES[State.stageIdx].dropPool;
         const matKey = pool[Math.floor(Math.random() * pool.length)];
         GameState.materials[matKey] = (GameState.materials[matKey] || 0) + 1;
         const matInfo = MaterialsCatalog[matKey];
         AudioSystem.playSFX('correct');
         State.heroBuffText = `✨ 採集獲得 ${matInfo.icon}${matInfo.name}+1 (冷卻30s)`;
         State.heroBuffTimer = 65;
         syncProgressToGameState();
     } else if (Math.hypot(State.mapX - 565, State.mapY - 205) < 48) {
         State.stepCooldown = 60;
         triggerEncounterBattle(false);
     } else if (Math.hypot(State.mapX - 770, State.mapY - 245) < 55) {
         State.stepCooldown = 65;
         State.targetX = 660; State.targetY = 260;
         triggerEncounterBattle(true);
     }
 }
 
 function drawHeroAt(hx, hy) {
     ctx.fillStyle = 'rgba(0,0,0,0.35)';
     ctx.fillRect(hx + 4, hy + 54, 52, 12);
 
     if (State.heroBuffTimer > 0) {
         State.heroBuffTimer--;
         ctx.font = 'bold 15px "DotGothic16", monospace';
         ctx.textAlign = 'center';
         ctx.fillStyle = '#000';
         ctx.fillText(State.heroBuffText, hx + 31, hy - 28);
         ctx.fillStyle = '#ffca28';
         ctx.fillText(State.heroBuffText, hx + 30, hy - 30);
     }
 
     ctx.font = 'bold 14px "DotGothic16", monospace';
     ctx.textAlign = 'center';
     ctx.fillStyle = '#000';
     ctx.fillText(GameState.heroName, hx + 31, hy - 10);
     ctx.fillStyle = '#fff';
     ctx.fillText(GameState.heroName, hx + 30, hy - 11);
 
     const clsSpriteMap = {
         warrior: 'hero_warrior',
         mage: 'hero_mage',
         ranger: 'hero_ranger',
         cleric: 'hero_cleric'
     };
     drawMatrixOnCtx(ctx, clsSpriteMap[GameState.heroClass] || 'hero_warrior', hx, hy, 5);
 
     drawPixelBar(hx - 4, hy + 66, 68, 13, State.heroHp, State.heroMaxHp, '#e53935');
     drawPixelBar(hx - 4, hy + 82, 68, 13, State.heroMp, State.heroMaxMp, '#2979ff');
 
     if (State.shieldLayers > 0) {
         ctx.fillStyle = '#1976d2';
         ctx.fillRect(hx + 18, hy + 98, 28, 16);
         ctx.strokeStyle = '#fff';
         ctx.strokeRect(hx + 18, hy + 98, 28, 16);
         ctx.font = 'bold 11px monospace';
         ctx.fillStyle = '#fff';
         ctx.fillText(`🛡️${State.shieldLayers}`, hx + 32, hy + 110);
     }
 }
 
 function drawEnemyUnits() {
     if (!State.enemies[State.selectedTargetIdx] || State.enemies[State.selectedTargetIdx].hp <= 0) {
         const firstAlive = State.enemies.findIndex(e => e.hp > 0);
         if (firstAlive !== -1) State.selectedTargetIdx = firstAlive;
     }
 
     State.enemies.forEach((en, idx) => {
         if (en.hp <= 0) return;
         const scale = en.isBoss ? 6 : 5;
         const w = 12 * scale;
 
         if (idx === State.selectedTargetIdx) {
             ctx.fillStyle = '#ffeb3b';
             ctx.font = 'bold 13px monospace';
             ctx.textAlign = 'center';
             ctx.fillText('▼ 目標', en.x + w / 2, en.y - 24);
         }
 
         ctx.fillStyle = 'rgba(0,0,0,0.35)';
         ctx.fillRect(en.x + 6, en.y + w - 6, w - 12, 10);
 
         ctx.font = 'bold 13px "DotGothic16", monospace';
         ctx.textAlign = 'center';
         ctx.fillStyle = '#000';
         ctx.fillText(en.name, en.x + w / 2 + 1, en.y - 8);
         ctx.fillStyle = en.isBoss ? '#ffca28' : '#fff';
         ctx.fillText(en.name, en.x + w / 2, en.y - 9);
 
         drawMatrixOnCtx(ctx, en.sprite, en.x, en.y, scale);
         drawPixelBar(en.x - 4, en.y + w + 4, 72, 12, en.hp, en.maxHp, '#e53935');
 
         ctx.font = 'bold 11px monospace';
         ctx.fillStyle = '#ffcc80';
         ctx.fillText(`⚔️${en.atk}`, en.x + w / 2, en.y + w + 28);
     });
 }
 
 function drawPixelBar(x, y, w, h, val, max, color) {
     ctx.fillStyle = '#111';
     ctx.fillRect(x, y, w, h);
     const fillW = Math.max(0, Math.floor((val / max) * (w - 2)));
     ctx.fillStyle = color;
     ctx.fillRect(x + 1, y + 1, fillW, h - 2);
     ctx.strokeStyle = '#fff';
     ctx.lineWidth = 1;
     ctx.strokeRect(x, y, w, h);
 
     ctx.font = 'bold 10px monospace';
     ctx.textAlign = 'center';
     ctx.fillStyle = '#000';
     ctx.fillText(val, x + w / 2 + 1, y + h - 2);
     ctx.fillStyle = '#fff';
     ctx.fillText(val, x + w / 2, y + h - 3);
 }
 
 function drawProjectilesAndFX() {
     for (let i = State.projectiles.length - 1; i >= 0; i--) {
         const p = State.projectiles[i];
         p.x += p.vx;
         p.y += p.vy;
         p.life--;
 
         if (p.isMeteor) {
             ctx.fillStyle = '#b71c1c';
             ctx.beginPath(); ctx.arc(p.x, p.y, 70, 0, Math.PI * 2); ctx.fill();
             ctx.fillStyle = '#ff5722';
             ctx.beginPath(); ctx.arc(p.x - 10, p.y + 10, 48, 0, Math.PI * 2); ctx.fill();
             ctx.fillStyle = '#ffeb3b';
             ctx.fillRect(p.x - 22, p.y - 12, 20, 20);
         } else {
             drawMatrixOnCtx(ctx, p.sprite, p.x, p.y, 4);
         }
 
         if (p.life <= 0) {
             State.projectiles.splice(i, 1);
             if (p.onHit) p.onHit();
         }
     }
 
     if (State.screenFlash > 0) {
         ctx.fillStyle = `rgba(255,255,255,${State.screenFlash / 12})`;
         ctx.fillRect(0, 0, 960, 540);
         State.screenFlash--;
     }
 
     for (let i = State.floatingDmgs.length - 1; i >= 0; i--) {
         const fd = State.floatingDmgs[i];
         fd.y -= 1.2;
         fd.life--;
         ctx.font = 'bold 24px "DotGothic16", monospace';
         ctx.textAlign = 'center';
         ctx.fillStyle = '#000';
         ctx.fillText(fd.text, fd.x + 2, fd.y + 2);
         ctx.fillStyle = fd.color || '#ffca28';
         ctx.fillText(fd.text, fd.x, fd.y);
         if (fd.life <= 0) State.floatingDmgs.splice(i, 1);
     }
 }
 
 /* ==========================================================================
    7. 按課節與模式抽題 (支援字義配字 ＋ 例句1填充 ＋ 例句2填充)
    ========================================================================== */
 function renderBottomLeftHUD() {
     const skillRow = document.getElementById('ui-active-skills');
     skillRow.innerHTML = '';
 
     const mySkills = getCurrentClassSkills().filter(s => s.unlocked && s.equipped).slice(0, 4);
     mySkills.forEach(sk => {
         const box = document.createElement('div');
         box.className = 'px-skill-box';
         box.title = `${sk.name} (消耗 ${sk.cost} SP｜威力 ${sk.dmg})：點擊答題施放`;
         box.innerHTML = `
             <span class="px-skill-cost">消耗 ${sk.cost}</span>
             <img src="${getSpriteDataURL(sk.sprite, 4)}" alt="${sk.name}"/>
         `;
         box.addEventListener('click', () => {
             if (State.turnPhase !== 'player') return;
             if (State.heroMp < sk.cost) {
                 AudioSystem.playSFX('wrong');
                 State.heroBuffText = '💧 SP魔力不足！請飲用藍藥水';
                 State.heroBuffTimer = 60;
                 return;
             }
             openQuizForSkill(sk);
         });
         skillRow.appendChild(box);
     });
 
     const beltRow = document.getElementById('ui-belt-potions');
     beltRow.innerHTML = '';
     Object.values(PotionsCatalog).forEach(pot => {
         const count = State.potions[pot.id] || 0;
         const slot = document.createElement('div');
         slot.className = 'px-belt-circle';
         slot.style.opacity = count > 0 ? '1' : '0.45';
         slot.title = `${pot.name} (持有: ${count})：${pot.desc}`;
         slot.innerHTML = `
             <img src="${getSpriteDataURL(pot.sprite, 3)}" />
             <span class="cell-qty">x${count}</span>
         `;
         slot.addEventListener('click', () => usePotionInBattle(pot));
         beltRow.appendChild(slot);
     });
 }
 
 function usePotionInBattle(pot) {
     if ((State.potions[pot.id] || 0) <= 0) {
         AudioSystem.playSFX('wrong');
         State.heroBuffText = '⚠️ 藥水已用盡！請去工坊調配';
         State.heroBuffTimer = 60;
         return;
     }
     AudioSystem.playSFX('correct');
     State.potions[pot.id]--;
 
     if (pot.effectType === 'hp') {
         State.heroHp = Math.min(State.heroMaxHp, State.heroHp + pot.val);
         State.heroBuffText = `+${pot.val} HP`;
     } else if (pot.effectType === 'mp') {
         State.heroMp = Math.min(State.heroMaxMp, State.heroMp + pot.val);
         State.heroBuffText = `+${pot.val} SP`;
     } else {
         State.heroHp = Math.min(State.heroMaxHp, State.heroHp + pot.val);
         State.heroMp = Math.min(State.heroMaxMp, State.heroMp + pot.val);
         State.shieldLayers += 1;
         State.heroBuffText = '🛡️ 護盾+1 & 狀態恢復!';
     }
     State.heroBuffTimer = 55;
     syncProgressToGameState();
     renderBottomLeftHUD();
 }
 
 function openQuizForSkill(skill) {
     State.selectedSkill = skill;
     const selectedUnits = (GameState.settings.subjects && GameState.settings.subjects.length)
         ? GameState.settings.subjects
         : ALL_UNITS;
 
     // 根據玩家勾選的課節 (成語一、成語二、字詞一等) 過濾題庫
     let pool = QuestionBank.filter(q => selectedUnits.includes(q.unit));
     if (!pool.length) pool = QuestionBank;
 
     const rawQ = pool[Math.floor(Math.random() * pool.length)];
     const normQ = normalizeQuestion(rawQ, State.quizMode || 'mixed');
 
     if (State.enemies.some(e => e.hp > 0 && e.trait === 'shuffle')) {
         normQ.options.sort(() => Math.random() - 0.5);
     }
 
     GameState.combat.activeQuestion = normQ;
 
     document.getElementById('ui-quiz-title').innerText =
         `⚔️ 詠唱【${skill.name}】｜📘 ${normQ.unit}・${normQ.modeLabel}`;
     document.getElementById('ui-quiz-prompt').innerText = normQ.prompt;
 
     const btn5050 = document.getElementById('btn-quiz-5050');
     btn5050.disabled = false;
     btn5050.style.display = (GameState.heroClass === 'mage') ? 'inline-block' : 'none';
 
     const optsBox = document.getElementById('ui-quiz-options');
     optsBox.innerHTML = '';
     normQ.options.forEach(opt => {
         const btn = document.createElement('button');
         btn.className = 'quiz-ans-btn';
         btn.dataset.val = opt;
         btn.innerText = opt;
         btn.addEventListener('click', () => verifyQuizAnswer(opt, normQ.answer, btn));
         optsBox.appendChild(btn);
     });
 
     document.getElementById('modal-quiz').classList.remove('hidden');
 }
 
 function verifyQuizAnswer(chosen, correct, btnEl) {
     const allBtns = document.querySelectorAll('.quiz-ans-btn');
     allBtns.forEach(b => b.disabled = true);
 
     const isCorrect = (chosen === correct);
     if (isCorrect) {
         btnEl.classList.add('correct');
         AudioSystem.playSFX('correct');
         GameState.combat.combo += 1;
         if (GameState.heroClass === 'warrior' && GameState.combat.combo % 2 === 0) {
             State.shieldLayers += 1;
         }
     } else {
         btnEl.classList.add('wrong');
         allBtns.forEach(b => { if (b.dataset.val === correct) b.classList.add('correct'); });
         AudioSystem.playSFX('wrong');
         GameState.combat.combo = 0;
         StateManager.addMistake(GameState.combat.activeQuestion.id);
         syncProgressToGameState();
     }
 
     updateHeroTopHUD();
 
     setTimeout(() => {
         document.getElementById('modal-quiz').classList.add('hidden');
         executePlayerTurnAction(State.selectedSkill, isCorrect);
     }, 550);
 }
 
 function executePlayerTurnAction(skill, isCorrect) {
     State.turnPhase = 'busy';
     const scrollEl = document.getElementById('ui-cast-scroll');
     const nameEl = document.getElementById('ui-cast-name');
     const stats = getFullHeroStats();
 
     if (!isCorrect) {
         nameEl.innerText = '❌ 答錯了！詠唱失手，損失本次攻擊機會！';
         scrollEl.classList.remove('hidden');
         State.heroBuffText = '失手空過！';
         State.heroBuffTimer = 45;
 
         setTimeout(() => {
             scrollEl.classList.add('hidden');
             startEnemyTurnPhase();
         }, 1050);
         return;
     }
 
     State.heroMp = Math.max(0, State.heroMp - skill.cost);
     if (skill.addShield) State.shieldLayers += skill.addShield;
     if (skill.healSelf) {
         State.heroHp = Math.min(State.heroMaxHp, State.heroHp + skill.healSelf);
         State.heroBuffText = `🌿 恢復 +${skill.healSelf} HP`;
     } else {
         State.heroBuffText = GameState.combat.combo >= 2 ? `🔥 ${GameState.combat.combo}連擊加成！` : '詠唱成功！';
     }
     State.heroBuffTimer = 50;
 
     nameEl.innerText = `✨ 施放【${skill.name}】！`;
     scrollEl.classList.remove('hidden');
 
     const aliveEnemies = State.enemies.filter(e => e.hp > 0);
     if (!aliveEnemies.length) return;
 
     const comboBonus = Math.min(18, GameState.combat.combo * 3);
     const totalPower = skill.dmg + Math.floor(stats.atk * 0.75) + comboBonus;
 
     if (skill.isMeteor) {
         State.projectiles.push({
             x: 520, y: -60, vx: 4.5, vy: 8.5, life: 30, isMeteor: true,
             onHit: () => {
                 State.screenFlash = 10;
                 AudioSystem.playSFX('win');
                 aliveEnemies.forEach(en => hitEnemy(en, totalPower));
                 checkAfterPlayerAttack();
             }
         });
     } else if (skill.aoe) {
         aliveEnemies.forEach((en, idx) => {
             State.projectiles.push({
                 x: 205, y: 240 + idx * 10,
                 vx: (en.x - 205) / 20, vy: (en.y - 240) / 20,
                 life: 20, sprite: skill.sprite,
                 onHit: () => {
                     hitEnemy(en, totalPower);
                     if (idx === aliveEnemies.length - 1) checkAfterPlayerAttack();
                 }
             });
         });
     } else {
         let target = State.enemies[State.selectedTargetIdx];
         if (!target || target.hp <= 0) target = aliveEnemies[0];
 
         State.projectiles.push({
             x: 205, y: 240,
             vx: (target.x - 205) / 18, vy: (target.y - 240) / 18,
             life: 18, sprite: skill.sprite,
             onHit: () => {
                 hitEnemy(target, Math.floor(totalPower * 1.25));
                 checkAfterPlayerAttack();
             }
         });
     }
 }
 
 function hitEnemy(en, rawDmg) {
     let finalDmg = rawDmg;
     if (en.trait === 'shell' && GameState.combat.combo < 2) {
         finalDmg = Math.floor(rawDmg * 0.7);
     }
     en.hp = Math.max(0, en.hp - finalDmg);
     State.floatingDmgs.push({
         x: en.x + 35,
         y: en.y + 10,
         text: `-${finalDmg}`,
         color: '#ffca28',
         life: 45
     });
 }
 
 function checkAfterPlayerAttack() {
     setTimeout(() => {
         document.getElementById('ui-cast-scroll').classList.add('hidden');
         if (!State.enemies.some(e => e.hp > 0)) {
             showVictoryModal();
         } else {
             startEnemyTurnPhase();
         }
     }, 400);
 }
 
 function startEnemyTurnPhase() {
     document.getElementById('ui-mode-indicator').innerText = `🔴 敵方回合`;
     const aliveEnemies = State.enemies.filter(e => e.hp > 0);
     if (!aliveEnemies.length) {
         showVictoryModal();
         return;
     }
 
     const scrollEl = document.getElementById('ui-cast-scroll');
     const nameEl = document.getElementById('ui-cast-name');
     const stats = getFullHeroStats();
 
     aliveEnemies.forEach((en, idx) => {
         setTimeout(() => {
             if (State.mode !== 'combat' || State.heroHp <= 0) return;
 
             nameEl.innerText = `👾 ${en.name} 發動攻擊！`;
             scrollEl.classList.remove('hidden');
 
             State.projectiles.push({
                 x: en.x, y: en.y + 20,
                 vx: (185 - en.x) / 15, vy: (235 - (en.y + 20)) / 15,
                 life: 15, sprite: 'icon_dagger',
                 onHit: () => {
                     if (State.shieldLayers > 0) {
                         State.shieldLayers -= 1;
                         AudioSystem.playSFX('click');
                         State.floatingDmgs.push({ x: 185, y: 200, text: '🛡️抵擋!', color: '#4fc3f7', life: 40 });
                     } else {
                         AudioSystem.playSFX('wrong');
                         const dmg = Math.max(6, en.atk - Math.floor(stats.def * 0.6));
                         State.heroHp = Math.max(0, State.heroHp - dmg);
                         State.floatingDmgs.push({ x: 185, y: 200, text: `-${dmg}`, color: '#ef5350', life: 45 });
 
                         if (en.trait === 'split' && en.hp < en.maxHp) {
                             en.hp = Math.min(en.maxHp, en.hp + 10);
                         } else if (en.trait === 'steal' && State.gold >= 5) {
                             State.gold -= 5;
                             GameState.gold = State.gold;
                         }
                     }
 
                     if (State.heroHp <= 0) {
                         setTimeout(() => {
                             scrollEl.classList.add('hidden');
                             alert('💀 守護者不敵魔物軍團圍攻倒下了！快去大熊工坊鍛造主副手武器、全套護具與調配藥水吧！');
                             enterExploreMode(State.stageIdx);
                         }, 500);
                     }
                 }
             });
         }, idx * 560);
     });
 
     setTimeout(() => {
         if (State.mode !== 'combat' || State.heroHp <= 0) return;
         scrollEl.classList.add('hidden');
         State.turn += 1;
         State.turnPhase = 'player';
         State.heroMp = Math.min(State.heroMaxMp, State.heroMp + 5);
         document.getElementById('ui-mode-indicator').innerText = `🟢 我方回合 (第 ${State.turn} 回合)`;
     }, aliveEnemies.length * 560 + 420);
 }
 
 /* ==========================================================================
    8. 雙頁策略冒險書：含 4 大分類鍛造工坊、背包擴充與錯題煉金
    ========================================================================== */
 function initBookModal() {
     const bearCanvas = document.getElementById('smith-bear-canvas');
     const bCtx = bearCanvas.getContext('2d');
     bCtx.imageSmoothingEnabled = false;
     drawMatrixOnCtx(bCtx, 'smith_bear', 4, 4, 4);
 
     document.getElementById('btn-open-equip').addEventListener('click', () => openBook('equip'));
     document.getElementById('btn-open-skill').addEventListener('click', () => openBook('skill'));
     document.getElementById('btn-open-forge').addEventListener('click', () => openBook('forge'));
 
     document.getElementById('btn-close-book').addEventListener('click', () => {
         document.getElementById('modal-book').classList.add('hidden');
         document.getElementById('ui-item-tooltip').classList.add('hidden');
         renderBottomLeftHUD();
     });
 
     document.querySelectorAll('.bookmark-tab').forEach(btn => {
         btn.addEventListener('click', () => {
             AudioSystem.playSFX('click');
             openBook(btn.dataset.tab);
         });
     });
 
     document.querySelectorAll('.pent-tab').forEach(tab => {
         tab.addEventListener('click', () => {
             AudioSystem.playSFX('click');
             document.querySelectorAll('.pent-tab').forEach(t => t.classList.remove('active'));
             tab.classList.add('active');
             State.bagPage = parseInt(tab.dataset.page, 10);
             renderBookEquipView();
         });
     });
 
     document.querySelectorAll('.pd-slot[data-slot]').forEach(slotEl => {
         slotEl.addEventListener('click', () => {
             const slotKey = slotEl.dataset.slot;
             if (GameState.equipment[slotKey]) {
                 AudioSystem.playSFX('click');
                 GameState.equipment[slotKey] = null;
                 syncProgressToGameState();
                 updateHeroTopHUD();
                 renderBookEquipView();
             }
         });
     });
 
     document.getElementById('btn-expand-bag').addEventListener('click', () => {
         tryExpandBagCapacity();
     });
 
     document.querySelectorAll('.forge-cat-btn').forEach(btn => {
         btn.addEventListener('click', () => {
             AudioSystem.playSFX('click');
             State.forgeSubTab = btn.dataset.fcat;
             renderBookForgeView();
         });
     });
 }
 
 function getBagExpandCost() {
     const step = Math.floor((State.bagCapacity - 10) / 5) + 1;
     return {
         gold: step * 100,
         fiber: step * 2
     };
 }
 
 function tryExpandBagCapacity() {
     if (State.bagCapacity >= 30) {
         alert('🎉 背包容量已達最高上限 (30/30 格)！');
         return;
     }
     const cost = getBagExpandCost();
     const haveFiber = GameState.materials.fiber || 0;
 
     if (State.gold < cost.gold || haveFiber < cost.fiber) {
         AudioSystem.playSFX('wrong');
         alert(`⚠️ 擴充背包 (+5格) 材料不足！\n需要：🟡 ${cost.gold} 金幣 (持有 ${State.gold}) ＋ 🌿 柔韌草纖維 x${cost.fiber} (持有 ${haveFiber})`);
         return;
     }
 
     AudioSystem.playSFX('win');
     State.gold -= cost.gold;
     GameState.materials.fiber -= cost.fiber;
     State.bagCapacity = Math.min(30, State.bagCapacity + 5);
     syncProgressToGameState();
 
     document.getElementById('ui-gold').innerText = State.gold;
     renderBookEquipView();
 }
 
 function openBook(mode = 'equip') {
     AudioSystem.playSFX('click');
     document.querySelectorAll('.bookmark-tab').forEach(b => {
         b.classList.toggle('active', b.dataset.tab === mode);
     });
 
     ['equip', 'skill', 'forge', 'guild', 'mistake'].forEach(key => {
         document.getElementById(`view-left-${key}`).classList.toggle('active', key === mode);
         document.getElementById(`view-right-${key}`).classList.toggle('active', key === mode);
     });
 
     document.getElementById('ui-gold').innerText = State.gold;
     document.getElementById('ui-footer-sp').innerText = State.skillPts;
     document.getElementById('ui-footer-cap').innerText = `${State.bagCapacity}/30`;
 
     renderBookEquipView();
     renderBookSkillView();
     renderBookForgeView();
     renderBookGuildView();
     renderBookMistakeView();
     document.getElementById('modal-book').classList.remove('hidden');
 }
 
 function renderBookEquipView() {
     document.querySelectorAll('.pd-slot[data-slot]').forEach(slotEl => {
         const slotKey = slotEl.dataset.slot;
         const eqId = GameState.equipment[slotKey];
         const eqObj = EquipmentCatalog[eqId];
         slotEl.innerHTML = eqObj ? `<img src="${getSpriteDataURL(eqObj.sprite, 3)}"/>` : '';
     });
 
     const beltRow = document.getElementById('book-belt-slots');
     beltRow.innerHTML = '';
     Object.values(PotionsCatalog).forEach(pot => {
         const qty = State.potions[pot.id] || 0;
         const c = document.createElement('div');
         c.className = 'px-belt-circle';
         c.innerHTML = `<img src="${getSpriteDataURL(pot.sprite, 3)}"/><span class="cell-qty">x${qty}</span>`;
         beltRow.appendChild(c);
     });
 
     let itemsToShow = [];
     if (State.bagPage === 1) {
         itemsToShow = Object.values(EquipmentCatalog).filter(e => e.category === 'weapon' && GameState.unlockedEquipment.includes(e.id));
     } else if (State.bagPage === 2) {
         itemsToShow = Object.values(EquipmentCatalog).filter(e => e.category === 'armor' && GameState.unlockedEquipment.includes(e.id));
     } else if (State.bagPage === 3) {
         itemsToShow = Object.values(EquipmentCatalog).filter(e => e.category === 'relic' && GameState.unlockedEquipment.includes(e.id));
     } else if (State.bagPage === 4) {
         itemsToShow = Object.values(PotionsCatalog).filter(p => (State.potions[p.id] || 0) > 0);
     } else if (State.bagPage === 5) {
         itemsToShow = Object.values(MaterialsCatalog).filter(m => (GameState.materials[m.id] || 0) > 0);
     }
 
     const catNames = { 1: '1. 🗡️ 武器', 2: '2. 🛡️ 護具', 3: '3. 💍 飾品', 4: '4. 🧪 藥水', 5: '5. 📦 素材' };
     document.getElementById('ui-bag-cat-title').innerText = `${catNames[State.bagPage]} (${itemsToShow.length}/${State.bagCapacity}格)`;
     document.getElementById('ui-footer-cap').innerText = `${State.bagCapacity}/30`;
 
     const expBtn = document.getElementById('btn-expand-bag');
     if (State.bagCapacity >= 30) {
         expBtn.innerText = '✅ 已滿(30格)';
         expBtn.disabled = true;
     } else {
         const cost = getBagExpandCost();
         expBtn.innerText = `➕ 擴充+5格 (🟡${cost.gold}+🌿${cost.fiber})`;
         expBtn.disabled = false;
     }
 
     const bagGrid = document.getElementById('book-bag-grid');
     const tooltip = document.getElementById('ui-item-tooltip');
     bagGrid.innerHTML = '';
 
     for (let i = 0; i < 30; i++) {
         const cell = document.createElement('div');
 
         if (i >= State.bagCapacity) {
             cell.className = 'px-item-cell bg-empty';
             cell.style.background = '#9e8565';
             cell.style.opacity = '0.75';
             cell.innerHTML = `<img src="${getSpriteDataURL('icon_lock', 2)}" />`;
             cell.title = '🔒 尚未解鎖的背包格仔（點擊可擴充容量）';
             cell.addEventListener('click', () => tryExpandBagCapacity());
             bagGrid.appendChild(cell);
             continue;
         }
 
         const item = itemsToShow[i];
         if (!item) {
             cell.className = 'px-item-cell bg-empty';
             bagGrid.appendChild(cell);
             continue;
         }
 
         const isEq = item.slot && (GameState.equipment[item.slot] === item.id);
         let qtyText = '';
         if (State.bagPage === 4) qtyText = `x${State.potions[item.id]}`;
         else if (State.bagPage === 5) qtyText = `x${GameState.materials[item.id]}`;
         else qtyText = isEq ? '已裝' : 'x1';
 
         cell.className = `px-item-cell ${item.bg || 'bg-blue'}`;
         if (isEq) cell.style.outline = '3px solid #ffeb3b';
 
         cell.innerHTML = `
             <img src="${getSpriteDataURL(item.sprite, 3)}"/>
             <span class="cell-qty">${qtyText}</span>
             ${isEq ? '<span class="cell-plus">E</span>' : ''}
         `;
 
         cell.addEventListener('mouseenter', () => {
             tooltip.innerHTML = `
                 <div class="tt-header">${item.name}</div>
                 <div class="tt-sub">${item.slot ? `穿戴部位：${item.slot}｜狀態：${isEq ? '✅穿戴中' : '未穿戴'}` : `數量：${qtyText}`}</div>
                 <div class="tt-green">${item.desc}</div>
                 <div class="tt-flavor">${item.slot ? (isEq ? '🖱️ 點擊即可除下此裝備' : '🖱️ 點擊即可穿戴此裝備') : '🖱️ 點擊使用'}</div>
             `;
             tooltip.classList.remove('hidden');
         });
         cell.addEventListener('mouseleave', () => tooltip.classList.add('hidden'));
 
         cell.addEventListener('click', () => {
             if (item.slot) {
                 AudioSystem.playSFX('correct');
                 if (GameState.equipment[item.slot] === item.id) {
                     GameState.equipment[item.slot] = null;
                 } else {
                     GameState.equipment[item.slot] = item.id;
                 }
                 syncProgressToGameState();
                 updateHeroTopHUD();
                 renderBookEquipView();
             } else if (State.bagPage === 4) {
                 usePotionInBattle(item);
                 renderBookEquipView();
             }
         });
 
         bagGrid.appendChild(cell);
     }
 }
 
 function renderBookSkillView() {
     document.getElementById('ui-sp-count').innerText = State.skillPts;
     document.getElementById('ui-footer-sp').innerText = State.skillPts;
 
     const clsInfo = ClassBaseStats[GameState.heroClass] || ClassBaseStats.warrior;
     document.getElementById('skill-cur-cls-name').innerText = `${clsInfo.icon} ${clsInfo.name}`;
 
     const mySkills = getCurrentClassSkills();
 
     const eqRow = document.getElementById('book-equipped-skills');
     eqRow.innerHTML = '';
     mySkills.filter(s => s.unlocked && s.equipped).forEach(sk => {
         const box = document.createElement('div');
         box.className = 'px-skill-box';
         box.title = `點擊卸下【${sk.name}】`;
         box.innerHTML = `<img src="${getSpriteDataURL(sk.sprite, 3)}"/>`;
         box.addEventListener('click', () => {
             if (mySkills.filter(s => s.unlocked && s.equipped).length <= 1) {
                 alert('最少需保留 1 招出戰技能！');
                 return;
             }
             AudioSystem.playSFX('click');
             sk.equipped = false;
             renderBookSkillView();
             renderBottomLeftHUD();
         });
         eqRow.appendChild(box);
     });
 
     const listEl = document.getElementById('book-skill-research-list');
     listEl.innerHTML = '';
 
     mySkills.forEach(sk => {
         const matInfo = MaterialsCatalog[sk.reqMat] || MaterialsCatalog.fiber;
         const haveMat = GameState.materials[sk.reqMat] || 0;
         const canResearch = (State.skillPts >= sk.reqSp && haveMat >= 2);
         const canUpgrade = (State.skillPts >= 1);
 
         const card = document.createElement('div');
         card.className = 'forge-card';
 
         let actionHtml = '';
         if (!sk.unlocked) {
             actionHtml = `
                 <button class="px-gold-btn" style="padding:6px 10px; font-size:12px;" data-act="research" ${canResearch ? '' : 'disabled'}>
                     🔬 研發解鎖
                 </button>
             `;
         } else {
             actionHtml = `
                 <div style="display:flex; flex-direction:column; gap:4px;">
                     <button class="px-orange-action-btn" style="padding:4px 8px; font-size:11px;" data-act="toggle">
                         ${sk.equipped ? '✅ 已裝配 (卸下)' : '📥 裝配出戰'}
                     </button>
                     <button class="px-gold-btn" style="padding:4px 8px; font-size:11px;" data-act="upgrade" ${canUpgrade ? '' : 'disabled'}>
                         ⬆️ 強化 Lv.${sk.lv} (💎1)
                     </button>
                 </div>
             `;
         }
 
         card.innerHTML = `
             <div style="display:flex; gap:8px; align-items:center;">
                 <div class="px-skill-box" style="width:42px; height:42px; opacity:${sk.unlocked ? '1' : '0.45'};">
                     <img src="${getSpriteDataURL(sk.sprite, 3)}"/>
                 </div>
                 <div>
                     <strong style="font-size:13px; color:#241409;">
                         ${sk.unlocked ? `✨ ${sk.name} (Lv.${sk.lv})` : `🔒 ${sk.name} [未研發]`}
                     </strong>
                     <div style="font-size:11px; color:#b71c1c; font-weight:bold;">
                         消耗 SP：${sk.cost} ｜ 威力：${sk.dmg} ${sk.aoe ? '｜全體範圍' : '｜單體'}
                     </div>
                     <div style="font-size:11px; color:#2e7d32; font-weight:bold;">${sk.desc}</div>
                     ${!sk.unlocked ? `<small style="color:#d84315; font-weight:900;">研發需求：💎技能點 ${State.skillPts}/${sk.reqSp} ＋ ${matInfo.icon}${matInfo.name} ${haveMat}/2</small>` : ''}
                 </div>
             </div>
             ${actionHtml}
         `;
 
         const resBtn = card.querySelector('[data-act="research"]');
         if (resBtn) {
             resBtn.addEventListener('click', () => {
                 AudioSystem.playSFX('win');
                 State.skillPts -= sk.reqSp;
                 GameState.materials[sk.reqMat] -= 2;
                 sk.unlocked = true;
                 sk.equipped = true;
                 syncProgressToGameState();
                 renderBookSkillView();
                 renderBottomLeftHUD();
             });
         }
 
         const togBtn = card.querySelector('[data-act="toggle"]');
         if (togBtn) {
             togBtn.addEventListener('click', () => {
                 if (sk.equipped && mySkills.filter(s => s.unlocked && s.equipped).length <= 1) {
                     alert('最少需保留 1 招出戰技能！');
                     return;
                 }
                 AudioSystem.playSFX('click');
                 sk.equipped = !sk.equipped;
                 renderBookSkillView();
                 renderBottomLeftHUD();
             });
         }
 
         const upgBtn = card.querySelector('[data-act="upgrade"]');
         if (upgBtn) {
             upgBtn.addEventListener('click', () => {
                 AudioSystem.playSFX('craft');
                 State.skillPts -= 1;
                 sk.lv += 1;
                 sk.dmg += 5;
                 syncProgressToGameState();
                 renderBookSkillView();
                 renderBottomLeftHUD();
             });
         }
 
         listEl.appendChild(card);
     });
 }
 
 function renderBookForgeView() {
     const stockBox = document.getElementById('book-mat-stock');
     stockBox.innerHTML = '';
     Object.values(MaterialsCatalog).forEach(mat => {
         const count = GameState.materials[mat.id] || 0;
         const pill = document.createElement('div');
         pill.className = 'mat-pill';
         pill.innerHTML = `<span>${mat.icon} ${mat.name}</span><b style="color:#b71c1c;">${count}</b>`;
         stockBox.appendChild(pill);
     });
 
     document.querySelectorAll('.forge-cat-btn').forEach(btn => {
         btn.style.outline = (btn.dataset.fcat === State.forgeSubTab) ? '3px solid #241409' : 'none';
     });
 
     const forgeList = document.getElementById('book-forge-list');
     forgeList.innerHTML = '';
 
     if (State.forgeSubTab === 'potion') {
         Object.values(PotionsCatalog).forEach(pot => {
             const held = State.potions[pot.id] || 0;
             const reqs = [];
             let canCraft = true;
             for (const [k, need] of Object.entries(pot.recipe)) {
                 if (k === 'gold') {
                     if (State.gold < need) canCraft = false;
                     reqs.push(`🟡${need}`);
                 } else {
                     const have = GameState.materials[k] || 0;
                     if (have < need) canCraft = false;
                     const m = MaterialsCatalog[k];
                     reqs.push(`${m.icon}${m.name} ${have}/${need}`);
                 }
             }
 
             const card = document.createElement('div');
             card.className = 'forge-card';
             card.innerHTML = `
                 <div>
                     <strong style="font-size:13px; color:#1b5e20;">${pot.name} (持有: ${held})</strong>
                     <div style="color:#241409; font-weight:bold;">${pot.desc}</div>
                     <small style="color:#b71c1c; font-weight:bold;">調配材料：${reqs.join(' ＋ ')}</small>
                 </div>
                 <button class="px-gold-btn" style="padding:6px 12px; font-size:12px;" ${canCraft ? '' : 'disabled'}>
                     ⚗️ 調配 +1
                 </button>
             `;
 
             const btn = card.querySelector('button');
             if (canCraft) {
                 btn.addEventListener('click', () => {
                     AudioSystem.playSFX('craft');
                     for (const [k, need] of Object.entries(pot.recipe)) {
                         if (k === 'gold') State.gold -= need;
                         else GameState.materials[k] -= need;
                     }
                     State.potions[pot.id] = (State.potions[pot.id] || 0) + 1;
                     document.getElementById('ui-gold').innerText = State.gold;
                     syncProgressToGameState();
                     renderBookForgeView();
                     renderBottomLeftHUD();
                 });
             }
             forgeList.appendChild(card);
         });
         return;
     }
 
     const filteredEquip = Object.values(EquipmentCatalog).filter(
         item => item.recipe && item.category === State.forgeSubTab
     );
 
     filteredEquip.forEach(item => {
         const isUnlocked = GameState.unlockedEquipment.includes(item.id);
 
         const reqs = [];
         let canCraft = true;
         for (const [k, need] of Object.entries(item.recipe)) {
             if (k === 'gold') {
                 if (State.gold < need) canCraft = false;
                 reqs.push(`🟡${need}`);
             } else {
                 const have = GameState.materials[k] || 0;
                 if (have < need) canCraft = false;
                 const m = MaterialsCatalog[k];
                 reqs.push(`${m.icon}${m.name} ${have}/${need}`);
             }
         }
 
         const card = document.createElement('div');
         card.className = 'forge-card';
         card.innerHTML = `
             <div>
                 <strong style="font-size:13px; color:#4a2311;">${item.name}</strong>
                 <div style="color:#2e7d32; font-weight:bold;">${item.desc}</div>
                 <small style="color:#b71c1c; font-weight:bold;">${isUnlocked ? '✨ 已鍛造並收入分類背包' : '需求：' + reqs.join(' ＋ ')}</small>
             </div>
             <button class="px-orange-action-btn" style="flex:0; padding:6px 12px;" ${(!canCraft || isUnlocked) ? 'disabled' : ''}>
                 ${isUnlocked ? '已擁有' : '🔨 鍛造'}
             </button>
         `;
 
         const btn = card.querySelector('button');
         if (!isUnlocked && canCraft) {
             btn.addEventListener('click', () => {
                 const catCount = Object.values(EquipmentCatalog).filter(
                     e => e.category === item.category && GameState.unlockedEquipment.includes(e.id)
                 ).length;
                 if (catCount >= State.bagCapacity) {
                     alert('⚠️ 該分類背包容量已滿！請先前往【🎒 背包】分頁點擊「➕ 擴充容量」！');
                     return;
                 }
 
                 AudioSystem.playSFX('craft');
                 for (const [k, need] of Object.entries(item.recipe)) {
                     if (k === 'gold') State.gold -= need;
                     else GameState.materials[k] -= need;
                 }
                 GameState.unlockedEquipment.push(item.id);
                 GameState.equipment[item.slot] = item.id;
                 document.getElementById('ui-gold').innerText = State.gold;
                 syncProgressToGameState();
                 updateHeroTopHUD();
                 renderBookForgeView();
             });
         }
         forgeList.appendChild(card);
     });
 }
 
 function renderBookGuildView() {
     const curCls = ClassBaseStats[GameState.heroClass] || ClassBaseStats.warrior;
     document.getElementById('guild-cur-class').innerText = `${curCls.icon} ${curCls.name}`;
 
     const guildList = document.getElementById('book-guild-list');
     guildList.innerHTML = '';
 
     const COST_GOLD = 500;
     const COST_SP = 5;
 
     Object.values(ClassBaseStats).forEach(cls => {
         const isCurrent = (GameState.heroClass === cls.id);
         const canAfford = (State.gold >= COST_GOLD && State.skillPts >= COST_SP);
 
         const card = document.createElement('div');
         card.className = 'forge-card';
         card.innerHTML = `
             <div>
                 <strong style="font-size:14px; color:#241409;">${cls.icon} ${cls.name}</strong>
                 <div style="font-size:11px; color:#b71c1c; font-weight:bold;">基礎 HP:${cls.baseHp} ｜ ATK:${cls.baseAtk} ｜ DEF:${cls.baseDef}</div>
                 <div style="color:#2e7d32; font-weight:bold;">${cls.trait}</div>
                 <small style="color:#b71c1c; font-weight:900;">${isCurrent ? '✅ 當前修煉職業' : `轉職獻祭：🟡${COST_GOLD} 金幣 (持有${State.gold}) ＋ 💎${COST_SP} 技能點 (持有${State.skillPts})`}</small>
             </div>
             <button class="px-gold-btn" style="padding:6px 12px; font-size:13px;" ${(isCurrent || !canAfford) ? 'disabled' : ''}>
                 ${isCurrent ? '當前職業' : '🔄 轉職'}
             </button>
         `;
 
         const btn = card.querySelector('button');
         if (!isCurrent && canAfford) {
             btn.addEventListener('click', () => {
                 AudioSystem.playSFX('win');
                 State.gold -= COST_GOLD;
                 State.skillPts -= COST_SP;
                 GameState.heroClass = cls.id;
 
                 syncProgressToGameState();
                 updateHeroTopHUD();
                 renderBottomLeftHUD();
                 openBook('guild');
             });
         }
         guildList.appendChild(card);
     });
 }
 
 function renderBookMistakeView() {
     document.getElementById('ui-mistake-count').innerText = GameState.mistakes.length;
     const list = document.getElementById('book-mistake-list');
     list.innerHTML = '';
 
     if (GameState.mistakes.length === 0) {
         list.innerHTML = `<div class="forge-card" style="justify-content:center; padding:24px; font-weight:900;">🎉 目前沒有任何錯題紀錄，繼續保持！</div>`;
         return;
     }
 
     GameState.mistakes.forEach(qId => {
         const rawQ = QuestionBank.find(q => q.id === qId);
         if (!rawQ) return;
         const normQ = normalizeQuestion(rawQ, State.quizMode || 'mixed');
 
         const card = document.createElement('div');
         card.className = 'forge-card';
         card.style.flexDirection = 'column';
         card.style.alignItems = 'stretch';
         card.style.gap = '6px';
 
         const optsHtml = normQ.options.map(opt =>
             `<button class="px-orange-action-btn mistake-opt-btn" style="padding:4px 10px; font-size:12px;" data-ans="${opt}">${opt}</button>`
         ).join(' ');
 
         card.innerHTML = `
             <div style="font-size:11px; color:#7b1fa2; font-weight:900;">📘 ${normQ.unit}｜${normQ.modeLabel}</div>
             <div style="font-weight:900; color:#241409; white-space:pre-line;">❓ ${normQ.prompt}</div>
             <div style="display:flex; gap:6px; flex-wrap:wrap;">${optsHtml}</div>
         `;
 
         card.querySelectorAll('.mistake-opt-btn').forEach(b => {
             b.addEventListener('click', () => {
                 if (b.dataset.ans === normQ.answer) {
                     AudioSystem.playSFX('win');
                     StateManager.resolveMistake(qId);
                     State.skillPts += 1;
                     State.gold += 30;
                     syncProgressToGameState();
                     renderBookMistakeView();
                 } else {
                     AudioSystem.playSFX('wrong');
                     b.style.background = '#c62828';
                     b.style.color = '#fff';
                 }
             });
         });
 
         list.appendChild(card);
     });
 }
 
 /* ==========================================================================
    9. 戰鬥獲勝結算與設定介面 (含全選/清空課節與出題模式切換)
    ========================================================================== */
 function initVictoryAndQuizModals() {
     const vicCanvas = document.getElementById('vic-hero-canvas');
     const vCtx = vicCanvas.getContext('2d');
     vCtx.imageSmoothingEnabled = false;
     drawMatrixOnCtx(vCtx, 'hero_warrior', 12, 12, 6);
 
     document.getElementById('btn-vic-forge').addEventListener('click', () => {
         document.getElementById('modal-victory').classList.add('hidden');
         enterExploreMode(State.stageIdx);
         openBook('forge');
     });
     document.getElementById('btn-vic-another').addEventListener('click', () => {
         document.getElementById('modal-victory').classList.add('hidden');
         triggerEncounterBattle(false);
     });
     document.getElementById('btn-vic-explore').addEventListener('click', () => {
         document.getElementById('modal-victory').classList.add('hidden');
         enterExploreMode(State.stageIdx);
     });
 
     document.getElementById('btn-quiz-5050').addEventListener('click', (e) => {
         AudioSystem.playSFX('click');
         e.currentTarget.disabled = true;
         const ans = GameState.combat.activeQuestion.answer;
         const wrongBtns = Array.from(document.querySelectorAll('.quiz-ans-btn')).filter(b => b.dataset.val !== ans);
         wrongBtns.slice(0, 2).forEach(b => { b.style.visibility = 'hidden'; });
     });
 
     document.getElementById('btn-quiz-cancel').addEventListener('click', () => {
         document.getElementById('modal-quiz').classList.add('hidden');
     });
     document.getElementById('btn-quiz-tts').addEventListener('click', () => {
         AudioSystem.speakQuestion(GameState.combat.activeQuestion);
     });
 
     // 全選 / 清空課節按鈕
     document.getElementById('btn-check-all-units').addEventListener('click', () => {
         document.querySelectorAll('#ui-subject-checks input[type="checkbox"]').forEach(cb => { cb.checked = true; });
     });
     document.getElementById('btn-uncheck-all-units').addEventListener('click', () => {
         document.querySelectorAll('#ui-subject-checks input[type="checkbox"]').forEach(cb => { cb.checked = false; });
     });
 
     document.getElementById('btn-open-settings').addEventListener('click', () => {
         document.getElementById('inp-hero-name').value = GameState.heroName;
         document.getElementById('sel-quiz-mode').value = State.quizMode || 'mixed';
         const curSubs = GameState.settings.subjects || ALL_UNITS;
         document.querySelectorAll('#ui-subject-checks input[type="checkbox"]').forEach(cb => {
             cb.checked = curSubs.includes(cb.value);
         });
         document.getElementById('modal-settings').classList.remove('hidden');
     });
 
     document.getElementById('btn-save-settings').addEventListener('click', () => {
         AudioSystem.playSFX('correct');
         GameState.heroName = document.getElementById('inp-hero-name').value.trim() || 'Justin';
         State.quizMode = document.getElementById('sel-quiz-mode').value;
 
         const subs = [];
         document.querySelectorAll('#ui-subject-checks input:checked').forEach(cb => subs.push(cb.value));
         GameState.settings.subjects = subs.length ? subs : [...ALL_UNITS];
         GameState.settings.sfx = document.getElementById('chk-sfx').checked;
         GameState.settings.zhSpeed = parseFloat(document.getElementById('sel-zh-speed').value);
 
         syncProgressToGameState();
         updateHeroTopHUD();
         document.getElementById('modal-settings').classList.add('hidden');
     });
 }
 
 function showVictoryModal() {
     AudioSystem.playSFX('win');
     const st = STAGES[State.stageIdx];
     const isRangerDouble = (GameState.heroClass === 'ranger' && GameState.combat.combo >= 2);
     const diffMult = getDifficultyMultiplier();
     const mult = (isRangerDouble ? 2 : 1);
 
     State.stageKills[State.stageIdx] = (State.stageKills[State.stageIdx] || 0) + 1;
     const curKills = State.stageKills[State.stageIdx];
 
     let subHeaderMsg = `本章討伐進度：${curKills} / ${REQUIRED_KILLS_FOR_BOSS} 戰`;
     if (!State.currentBattleIsBoss && curKills === REQUIRED_KILLS_FOR_BOSS) {
         subHeaderMsg = `🔥 已達成 20 戰！本章【區域魔王 BOSS】已於地圖右側現身！`;
     }
 
     if (State.currentBattleIsBoss) {
         if (State.stageIdx < STAGES.length - 1) {
             if (State.maxUnlockedStage <= State.stageIdx) {
                 State.maxUnlockedStage = State.stageIdx + 1;
             }
             subHeaderMsg = `🎉 成功討伐本章魔王！已正式解鎖【${STAGES[State.stageIdx + 1].title}】！`;
         } else {
             State.ngPlusCount = (State.ngPlusCount || 0) + 1;
             State.stageIdx = 0;
             State.maxUnlockedStage = 0;
             State.stageKills = [0, 0, 0, 0, 0, 0];
             const newMult = getDifficultyMultiplier();
             subHeaderMsg = `🌌 恭喜破關！已進入【第 ${State.ngPlusCount + 1} 周目】由第一章重新開始（全魔物難度翻倍 x${newMult}）！`;
         }
     }
 
     document.getElementById('ui-vic-sub-msg').innerText = subHeaderMsg;
 
     const baseGold = (38 + State.stageIdx * 16) * diffMult;
     const goldGain = baseGold * mult;
     State.gold += goldGain;
     State.skillPts += State.currentBattleIsBoss ? 2 : 1;
     StateManager.addExp((60 + State.stageIdx * 20) * diffMult);
 
     document.getElementById('vic-gold-gain').innerText = goldGain;
     document.getElementById('vic-exp-txt').innerText = `${GameState.exp} / ${GameState.maxExp}`;
     document.getElementById('vic-exp-bar').style.width = `${Math.min(100, (GameState.exp / GameState.maxExp) * 100)}%`;
 
     const matBox = document.getElementById('vic-mat-drops');
     matBox.innerHTML = '';
     const drops = [...st.dropPool].sort(() => Math.random() - 0.5).slice(0, 3);
     if (State.currentBattleIsBoss) {
         drops.push(st.bossDrop);
     }
 
     const lootGrid = document.getElementById('vic-loot-grid');
     lootGrid.innerHTML = '';
 
     drops.forEach(matKey => {
         const qty = 2 * mult;
         GameState.materials[matKey] = (GameState.materials[matKey] || 0) + qty;
         const m = MaterialsCatalog[matKey];
         if (!m) return;
         const tag = document.createElement('div');
         tag.className = 'mat-pill';
         tag.style.gap = '6px';
         tag.innerHTML = `<span>${m.icon} ${m.name}</span><b>+${qty}</b>`;
         matBox.appendChild(tag);
 
         const cell = document.createElement('div');
         cell.className = `px-item-cell ${m.bg}`;
         cell.innerHTML = `<img src="${getSpriteDataURL(m.sprite, 2)}"/><span class="cell-qty">+${qty}</span>`;
         lootGrid.appendChild(cell);
     });
 
     syncProgressToGameState();
     updateHeroTopHUD();
     updateMapHeaderUI();
     document.getElementById('modal-victory').classList.remove('hidden');
 }