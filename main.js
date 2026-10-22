/**
 * 《時光書境守護者》模組化核心控制器 (main.js)
 * 配合 src/data/enemies.js、src/data/items.js、src/data/questions.js 運行
 */
import { QuestionBank, normalizeQuestion } from './src/data/questions.js';
import { AudioSystem } from './src/systems/audio.js';
import { GameState, StateManager, ClassBaseStats } from './src/core/state.js';
import { MaterialsCatalog, EquipmentCatalog, PotionsCatalog, ClassNamesMap } from './src/data/items.js';
import { getSpriteDataURL, drawMatrixOnCtx, CLASS_SKILL_TREES, STAGES, drawRichEnvironment } from './src/data/enemies.js';

const ALL_DEFAULT_UNITS = ['成語一', '成語二', '字詞一', '字詞三', '字詞五', '字詞六'];
const REQUIRED_KILLS_FOR_BOSS = 20;
const GATHER_COOLDOWN_SEC = 30;

const MOB_SLOTS_4 = [[520, 125], [535, 295], [730, 105], [745, 285]];
const BOSS_SLOTS_5 = [[510, 105], [510, 295], [680, 165], [825, 95], [825, 305]];

// 紙娃娃 11 個裝備槽對應的空槽壓紋圖示 (還原附圖 2)
const SLOT_WATERMARKS = {
    head: 'wm_head',
    weapon: 'wm_weapon',
    armor: 'wm_armor',
    offhand: 'wm_offhand',
    gloves_l: 'wm_gloves',
    legs: 'wm_legs',
    gloves_r: 'wm_gloves',
    boots: 'wm_boots',
    neck: 'wm_neck',
    ring1: 'wm_ring',
    ring2: 'wm_ring',
    relic1: 'wm_relic',
    relic2: 'wm_relic'
};

// 各職業初始專屬 T1 武器
const INITIAL_CLASS_WEAPON = {
    warrior: 'wep_wood_sword',
    mage: 'wep_apprentice_wand',
    ranger: 'wep_short_bow',
    cleric: 'wep_oak_mace'
};

const State = {
    mode: 'explore',
    turnPhase: 'player',
    stageIdx: 0,
    maxUnlockedStage: 0,
    stageKills: [0, 0, 0, 0, 0, 0],
    ngPlusCount: 0,
    gatherReadyTime: 0,
    currentBattleIsBoss: false,
    quizMode: 'mixed',

    questionQueue: [],
    skillCooldowns: {},

    turn: 1,
    heroHp: 145,
    heroMaxHp: 145,
    heroMp: 60,
    heroMaxMp: 60,
    shieldLayers: 0,
    heroBuffText: '',
    heroBuffTimer: 0,

    bagCapacity: 10,
    potions: { hp_pot_s: 3, mp_pot_s: 2, hp_pot_l: 0, atk_scroll: 1 },

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
    skillPts: 5,
    gold: 120
};

let canvas, ctx;
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
});

// 全自動螢幕等比例縮放引擎：適配任何手機、平板、電腦、全螢幕與非全螢幕
function autoFitViewport() {
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    // 預留 6px 邊距，確保外框陰影與按鈕永遠不會貼邊或被切掉
    const scaleX = (vw - 6) / 960;
    const scaleY = (vh - 6) / 540;
    const scale = Math.max(0.2, Math.min(scaleX, scaleY));
    document.documentElement.style.setProperty('--game-scale', scale.toFixed(4));
}

window.addEventListener('resize', autoFitViewport);
window.addEventListener('orientationchange', () => setTimeout(autoFitViewport, 150));
document.addEventListener('fullscreenchange', () => setTimeout(autoFitViewport, 100));
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', autoFitViewport);
}

document.addEventListener('DOMContentLoaded', () => {
    autoFitViewport(); // 啟動時立即計算最佳縮放比例

    canvas = document.getElementById('battle-canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (!GameState.settings.subjects || !GameState.settings.subjects.length) {
        GameState.settings.subjects = [...ALL_DEFAULT_UNITS];
    }

    initTitleAndCreateScreens();
    initGameHUDAndExploration();
    initBookModal();
    initVictoryAndQuizModals();

    requestAnimationFrame(renderLoop);
});

function getCurrentClassSkills() {
    return CLASS_SKILL_TREES[GameState.heroClass] || CLASS_SKILL_TREES.warrior;
}

// 計算當前職業已在技能樹投入的總點數
function getSpentPointsInCurrentTree() {
    return getCurrentClassSkills().reduce((sum, sk) => sum + (sk.lv || 0), 0);
}

function getDifficultyMultiplier() {
    return Math.pow(2, State.ngPlusCount || 0);
}

function drawNextQuestionFromQueue() {
    const selectedUnits = (GameState.settings.subjects && GameState.settings.subjects.length)
        ? GameState.settings.subjects
        : ALL_DEFAULT_UNITS;

    let validPool = QuestionBank.filter(q => selectedUnits.includes(q.unit));
    if (!validPool.length) validPool = QuestionBank;

    const validIds = new Set(validPool.map(q => q.id));
    State.questionQueue = State.questionQueue.filter(id => validIds.has(id));

    if (State.questionQueue.length === 0) {
        const shuffledIds = validPool.map(q => q.id).sort(() => Math.random() - 0.5);
        State.questionQueue.push(...shuffledIds);
    }

    const nextId = State.questionQueue.shift();
    State.questionQueue.push(nextId);
    return validPool.find(q => q.id === nextId) || validPool[0];
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
    State.gold = GameState.gold ?? 120;
    State.skillPts = GameState.gem ?? 5;
    State.bagCapacity = GameState.bagCapacity || 10;
    State.maxUnlockedStage = GameState.maxUnlockedStage ?? 0;
    State.stageKills = Array.isArray(GameState.stageKills) && GameState.stageKills.length === 6
        ? [...GameState.stageKills]
        : [0, 0, 0, 0, 0, 0];
    State.ngPlusCount = GameState.ngPlusCount || 0;
    State.quizMode = GameState.quizMode || 'mixed';
    if (GameState.potions) State.potions = { ...GameState.potions };
    if (!GameState.settings.subjects || !GameState.settings.subjects.length) {
        GameState.settings.subjects = [...ALL_DEFAULT_UNITS];
    }
}

function toggleFullScreen() {
    const docEl = document.documentElement;
    if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) docEl.requestFullscreen().catch(() => {});
    } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
}

/* ==========================================================================
   1. 首頁 (Title Screen) 與創角畫面控制
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

    // 首頁全螢幕按鈕
    document.getElementById('btn-title-fullscreen').addEventListener('click', toggleFullScreen);

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

        const startWep = INITIAL_CLASS_WEAPON[chosenClass] || 'wep_wood_sword';
        GameState.heroName = nameVal;
        GameState.heroClass = chosenClass;
        GameState.level = 1;
        GameState.exp = 0;
        GameState.maxExp = 150;
        GameState.settings.subjects = [...ALL_DEFAULT_UNITS];
        GameState.unlockedEquipment = [startWep, 'arm_cloth'];
        GameState.equipment = {
            weapon: startWep, offhand: null,
            head: null, armor: 'arm_cloth', gloves_l: null, legs: null, gloves_r: null, boots: null,
            neck: null, ring1: null, ring2: null, relic1: null, relic2: null
        };

        State.gold = 120;
        State.skillPts = 5;
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
        AudioSystem.stopBGM();
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
   2. 探索、戰鬥切換與全套 13 裝備槽屬性計算
   ========================================================================== */
function enterExploreMode(stageIdx = State.stageIdx) {
    State.mode = 'explore';
    State.turnPhase = 'player';
    State.stageIdx = Math.max(0, Math.min(stageIdx, State.maxUnlockedStage));
    GameState.currentMapIdx = State.stageIdx;

    AudioSystem.startBGM('explore');

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
    const loopTag = State.ngPlusCount > 0 ? ` [NG+${State.ngPlusCount}]` : '';
    document.getElementById('ui-map-title').innerText = `${st.title}${loopTag}`;

    const kills = State.stageKills[State.stageIdx] || 0;
    const bossTxt = document.getElementById('ui-boss-prog-txt');
    if (kills >= REQUIRED_KILLS_FOR_BOSS) {
        bossTxt.innerText = `👑 魔王現身(${kills}/${REQUIRED_KILLS_FOR_BOSS})`;
        bossTxt.style.color = '#76ff03';
    } else {
        bossTxt.innerText = `💀 討伐:${kills}/${REQUIRED_KILLS_FOR_BOSS}`;
        bossTxt.style.color = '#ffca28';
    }

    document.getElementById('btn-prev-map').disabled = (State.stageIdx <= 0);
    const nextBtn = document.getElementById('btn-next-map');
    if (State.stageIdx >= STAGES.length - 1) {
        nextBtn.disabled = true;
    } else if (State.stageIdx >= State.maxUnlockedStage) {
        nextBtn.style.opacity = '0.45';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.disabled = false;
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
    AudioSystem.startBGM('combat');

    State.mode = 'combat';
    State.turnPhase = 'player';
    State.turn = 1;
    State.screenFlash = 10;
    State.shieldLayers = 0;
    State.selectedTargetIdx = 0;
    State.currentBattleIsBoss = isBossFight;
    State.skillCooldowns = {};

    const st = STAGES[State.stageIdx];
    const diffMult = getDifficultyMultiplier();

    if (isBossFight) {
        State.enemies = st.bossParty.map((tpl, idx) => {
            const [px, py] = BOSS_SLOTS_5[idx] || [680, 165];
            const scaledHp = Math.floor(tpl.hp * diffMult);
            const scaledAtk = Math.floor(tpl.atk * diffMult);
            return { ...structuredClone(tpl), hp: scaledHp, maxHp: scaledHp, atk: scaledAtk, x: px, y: py };
        });
    } else {
        const count = Math.random() < 0.45 ? 3 : 4;
        State.enemies = MOB_SLOTS_4.slice(0, count).map(([px, py]) => {
            const tpl = st.roamPool[Math.floor(Math.random() * st.roamPool.length)];
            const scaledHp = Math.floor(tpl.hp * diffMult);
            const scaledAtk = Math.floor(tpl.atk * diffMult);
            return { ...structuredClone(tpl), hp: scaledHp, maxHp: scaledHp, atk: scaledAtk, x: px, y: py };
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
    let maxHp = base.baseHp + (GameState.level - 1) * 14;
    let atk = base.baseAtk + (GameState.level - 1) * 2;
    let def = base.baseDef + (GameState.level - 1) * 2;

    Object.keys(SLOT_WATERMARKS).forEach(slotKey => {
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
    document.getElementById('btn-fullscreen').addEventListener('click', toggleFullScreen);

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
            const readySkill = getCurrentClassSkills().find(
                s => s.unlocked && s.equipped && !(State.skillCooldowns[s.id] > 0) && State.heroMp >= s.cost
            );
            openQuizForSkill(readySkill || getCurrentClassSkills()[0]);
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
    document.getElementById('ui-combo-tag').innerText = `🔥${GameState.combat.combo}`;
    document.getElementById('ui-class-name-txt').innerText = stats.className;
    document.getElementById('ui-stat-atk').innerText = stats.atk;
    document.getElementById('ui-stat-def').innerText = stats.def;
}

/* ==========================================================================
   3. 畫面渲染迴圈與地圖互動地標 (採集有機會獲得 🌟 稀有素材！)
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
        drawLandmarkLabel(330, 355, '✨ 素材採集點(含稀有)', '#76ff03');
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
        const st = STAGES[State.stageIdx];
        // 30% 機率採集到該章節專屬【稀有素材】！
        const isRare = Math.random() < 0.3 && st.rareDrop;
        const matKey = isRare ? st.rareDrop : st.dropPool[Math.floor(Math.random() * st.dropPool.length)];
        GameState.materials[matKey] = (GameState.materials[matKey] || 0) + 1;
        const matInfo = MaterialsCatalog[matKey];
        AudioSystem.playSFX(isRare ? 'win' : 'correct');
        State.heroBuffText = isRare
            ? `🌟 幸運採集稀有素材【${matInfo.icon}${matInfo.name}】+1！`
            : `✨ 採集獲得 ${matInfo.icon}${matInfo.name}+1 (冷卻30s)`;
        State.heroBuffTimer = 70;
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
   4. 戰鬥技能冷卻 (CD) ＋ 智慧佇列抽題 ＋ 輪流回合結算
   ========================================================================== */
function renderBottomLeftHUD() {
    const skillRow = document.getElementById('ui-active-skills');
    skillRow.innerHTML = '';

    const mySkills = getCurrentClassSkills().filter(s => s.unlocked && s.equipped).slice(0, 4);
    mySkills.forEach(sk => {
        const cdLeft = State.skillCooldowns[sk.id] || 0;
        const box = document.createElement('div');
        box.className = `px-skill-box ${cdLeft > 0 ? 'on-cooldown' : ''}`;
        box.title = `${sk.name} (消耗 ${sk.cost} SP｜威力 ${sk.dmg}｜冷卻 ${sk.cd} 回合)`;
        box.innerHTML = `
            <span class="px-skill-cost">消耗 ${sk.cost}</span>
            <img src="${getSpriteDataURL(sk.sprite, 4)}" alt="${sk.name}"/>
            ${cdLeft > 0 ? `<div class="skill-cd-overlay">⏳${cdLeft}T</div>` : ''}
        `;
        box.addEventListener('click', () => {
            if (State.turnPhase !== 'player') return;
            if (cdLeft > 0) {
                AudioSystem.playSFX('wrong');
                State.heroBuffText = `⏳【${sk.name}】冷卻中 (還需 ${cdLeft} 回合)`;
                State.heroBuffTimer = 55;
                return;
            }
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
    const rawQ = drawNextQuestionFromQueue();
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
    if (skill.cd && skill.cd > 0) {
        State.skillCooldowns[skill.id] = skill.cd + 1;
    }
    renderBottomLeftHUD();

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

    const comboBonus = Math.min(14, GameState.combat.combo * 2);
    const totalPower = skill.dmg + Math.floor(stats.atk * 0.55) + comboBonus;

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
                hitEnemy(target, Math.floor(totalPower * 1.2));
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
                            en.hp = Math.min(en.maxHp, en.hp + 12);
                        } else if (en.trait === 'steal' && State.gold >= 5) {
                            State.gold -= 5;
                            GameState.gold = State.gold;
                        }
                    }

                    if (State.heroHp <= 0) {
                        setTimeout(() => {
                            scrollEl.classList.add('hidden');
                            alert('💀 守護者不敵魔物軍團圍攻倒下了！快去大熊工坊鍛造職業專屬神武、全套護具與調配藥水吧！');
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

        Object.keys(State.skillCooldowns).forEach(skId => {
            if (State.skillCooldowns[skId] > 0) State.skillCooldowns[skId] -= 1;
        });

        renderBottomLeftHUD();
        document.getElementById('ui-mode-indicator').innerText = `🟢 我方回合 (第 ${State.turn} 回合)`;
    }, aliveEnemies.length * 560 + 420);
}

/* ==========================================================================
   5. 雙頁策略書：壓紋裝備欄、可關閉介紹彈窗、5層分支技能樹、職業武器限制
   ========================================================================== */
function hideItemTooltip() {
    document.getElementById('ui-item-tooltip').classList.add('hidden');
}

function showItemTooltip(htmlContent) {
    document.getElementById('ui-tooltip-content').innerHTML = htmlContent;
    document.getElementById('ui-item-tooltip').classList.remove('hidden');
}

function initBookModal() {
    const bearCanvas = document.getElementById('smith-bear-canvas');
    const bCtx = bearCanvas.getContext('2d');
    bCtx.imageSmoothingEnabled = false;
    drawMatrixOnCtx(bCtx, 'smith_bear', 4, 4, 3);

    document.getElementById('btn-open-equip').addEventListener('click', () => openBook('equip'));
    document.getElementById('btn-open-skill').addEventListener('click', () => openBook('skill'));
    document.getElementById('btn-open-forge').addEventListener('click', () => openBook('forge'));

    document.getElementById('btn-close-book').addEventListener('click', () => {
        document.getElementById('modal-book').classList.add('hidden');
        hideItemTooltip();
        renderBottomLeftHUD();
    });

    // 點擊介紹彈窗右上角 ✖ 按鈕關閉
    document.getElementById('btn-close-tooltip').addEventListener('click', (e) => {
        e.stopPropagation();
        AudioSystem.playSFX('click');
        hideItemTooltip();
    });

    // 點擊書本空白處自動關閉介紹彈窗
    document.querySelector('.px-open-book').addEventListener('click', (e) => {
        if (!e.target.closest('.px-item-cell') && !e.target.closest('.st-node-card') && !e.target.closest('#ui-item-tooltip')) {
            hideItemTooltip();
        }
    });

    document.querySelectorAll('.bookmark-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            AudioSystem.playSFX('click');
            hideItemTooltip();
            openBook(btn.dataset.tab);
        });
    });

    document.querySelectorAll('.pent-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            AudioSystem.playSFX('click');
            hideItemTooltip();
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

    document.getElementById('btn-expand-bag').addEventListener('click', tryExpandBagCapacity);

    // 重置技能樹點數按鈕 (附圖 1 右上角功能)
    document.getElementById('btn-reset-skills').addEventListener('click', () => {
        const mySkills = getCurrentClassSkills();
        let refunded = 0;
        mySkills.forEach((sk, idx) => {
            if (idx < 2) {
                if (sk.lv > 1) {
                    refunded += (sk.lv - 1);
                    sk.dmg -= (sk.lv - 1) * 4;
                    sk.lv = 1;
                }
                sk.unlocked = true;
                sk.equipped = true;
            } else {
                if (sk.lv > 0) {
                    refunded += sk.lv;
                    sk.dmg -= (sk.lv - 1) * 4;
                    sk.lv = 0;
                }
                sk.unlocked = false;
                sk.equipped = false;
            }
        });
        if (refunded > 0) {
            AudioSystem.playSFX('win');
            State.skillPts += refunded;
            syncProgressToGameState();
            renderBookSkillView();
            renderBottomLeftHUD();
        }
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
    return { gold: step * 100, fiber: step * 2 };
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
    renderBookEquipView();
}

function openBook(mode = 'equip') {
    AudioSystem.playSFX('click');
    hideItemTooltip();
    document.querySelectorAll('.bookmark-tab').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === mode);
    });

    ['equip', 'skill', 'forge', 'guild', 'mistake'].forEach(key => {
        document.getElementById(`view-left-${key}`).classList.toggle('active', key === mode);
        document.getElementById(`view-right-${key}`).classList.toggle('active', key === mode);
    });

    renderBookEquipView();
    renderBookSkillView();
    renderBookForgeView();
    renderBookGuildView();
    renderBookMistakeView();
    document.getElementById('modal-book').classList.remove('hidden');
}

// 渲染分頁 1：附圖 2 壓紋紙娃娃裝備欄 ＋ 職業專屬武器穿戴檢查 ＋ 介紹彈窗
function renderBookEquipView() {
    document.querySelectorAll('.pd-slot[data-slot]').forEach(slotEl => {
        const slotKey = slotEl.dataset.slot;
        const eqId = GameState.equipment[slotKey];
        const eqObj = EquipmentCatalog[eqId];
        if (eqObj) {
            slotEl.innerHTML = `<img src="${getSpriteDataURL(eqObj.sprite, 3)}"/>`;
        } else {
            // 未穿戴時顯示半透明部位壓紋 (還原附圖 2)
            const wmKey = SLOT_WATERMARKS[slotKey] || 'wm_armor';
            slotEl.innerHTML = `<img src="${getSpriteDataURL(wmKey, 3)}" style="opacity:0.45;"/>`;
        }
    });

    // 腰帶 6 圓槽 (還原附圖 2)
    const beltRow = document.getElementById('book-belt-slots');
    beltRow.innerHTML = '';
    const potList = Object.values(PotionsCatalog);
    for (let i = 0; i < 6; i++) {
        const pot = potList[i];
        const c = document.createElement('div');
        c.className = 'px-belt-circle';
        if (pot) {
            const qty = State.potions[pot.id] || 0;
            c.innerHTML = `<img src="${getSpriteDataURL(pot.sprite, 3)}"/><span class="cell-qty">x${qty}</span>`;
            c.addEventListener('click', () => {
                usePotionInBattle(pot);
                renderBookEquipView();
            });
        }
        beltRow.appendChild(c);
    }

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
    bagGrid.innerHTML = '';

    for (let i = 0; i < 30; i++) {
        const cell = document.createElement('div');

        if (i >= State.bagCapacity) {
            cell.className = 'px-item-cell bg-empty';
            cell.style.background = '#9e8565';
            cell.style.opacity = '0.75';
            cell.innerHTML = `<img src="${getSpriteDataURL('icon_lock', 2)}" />`;
            cell.addEventListener('click', tryExpandBagCapacity);
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
        const wrongClass = item.forClass && item.forClass !== GameState.heroClass;

        let qtyText = '';
        if (State.bagPage === 4) qtyText = `x${State.potions[item.id]}`;
        else if (State.bagPage === 5) qtyText = `x${GameState.materials[item.id]}`;
        else qtyText = isEq ? '已裝' : (wrongClass ? '限職' : 'x1');

        cell.className = `px-item-cell ${item.bg || 'bg-blue'}`;
        if (isEq) cell.style.outline = '3px solid #ffeb3b';
        if (wrongClass) cell.style.opacity = '0.55';

        cell.innerHTML = `
            <img src="${getSpriteDataURL(item.sprite, 3)}"/>
            <span class="cell-qty">${qtyText}</span>
            ${isEq ? '<span class="cell-plus">E</span>' : ''}
        `;

        // 點擊物品：彈出帶有「穿戴/卸下」與「✖關閉」按鈕的詳細介紹卡
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            AudioSystem.playSFX('click');

            const clsReqTxt = item.forClass
                ? `｜限定職業：<b style="color:${wrongClass ? '#c62828' : '#1b5e20'};">${ClassNamesMap[item.forClass]}</b>`
                : '｜全職業通用';

            let actionBtnHtml = '';
            if (item.slot) {
                if (wrongClass) {
                    actionBtnHtml = `<div style="margin-top:8px; color:#c62828; font-weight:900;">⚠️ 你的當前職業無法穿戴此專屬武器！</div>`;
                } else {
                    actionBtnHtml = `
                        <button id="btn-tt-equip" class="px-gold-btn" style="width:100%; margin-top:8px; padding:5px;">
                            ${isEq ? '📤 卸下此裝備' : '📥 立即穿戴此裝備'}
                        </button>
                    `;
                }
            } else if (State.bagPage === 4) {
                actionBtnHtml = `<button id="btn-tt-usepot" class="px-gold-btn" style="width:100%; margin-top:8px; padding:5px;">🧪 立即飲用</button>`;
            }

            showItemTooltip(`
                <div class="tt-header">${item.name}</div>
                <div class="tt-sub">${item.slot ? `部位：${item.slot}` : `持有：${qtyText}`}${clsReqTxt}</div>
                <div class="tt-green">${item.desc}</div>
                ${actionBtnHtml}
            `);

            const eqBtn = document.getElementById('btn-tt-equip');
            if (eqBtn) {
                eqBtn.addEventListener('click', () => {
                    AudioSystem.playSFX('correct');
                    if (GameState.equipment[item.slot] === item.id) {
                        GameState.equipment[item.slot] = null;
                    } else {
                        GameState.equipment[item.slot] = item.id;
                    }
                    syncProgressToGameState();
                    updateHeroTopHUD();
                    hideItemTooltip();
                    renderBookEquipView();
                });
            }

            const potBtn = document.getElementById('btn-tt-usepot');
            if (potBtn) {
                potBtn.addEventListener('click', () => {
                    usePotionInBattle(item);
                    hideItemTooltip();
                    renderBookEquipView();
                });
            }
        });

        bagGrid.appendChild(cell);
    }
}

// 渲染分頁 2：附圖 1 風格「5 層分支延伸技能樹」
function renderBookSkillView() {
    const spentPts = getSpentPointsInCurrentTree();
    document.getElementById('ui-sp-count').innerText = State.skillPts;

    const clsInfo = ClassBaseStats[GameState.heroClass] || ClassBaseStats.warrior;
    document.getElementById('skill-cur-cls-name').innerText = `${clsInfo.icon} ${clsInfo.name}`;

    const mySkills = getCurrentClassSkills();

    // 左頁：出戰技能欄 (最多 4 招)
    const eqRow = document.getElementById('book-equipped-skills');
    eqRow.innerHTML = '';
    mySkills.filter(s => s.unlocked && s.equipped).slice(0, 4).forEach(sk => {
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

    // 右頁：繪製 5 層分支節點 (含右側 5+, 10+, 20+, 30+ 門檻標記)
    const nodesLayer = document.getElementById('book-skill-tree-nodes');
    nodesLayer.innerHTML = '';

    // 繪製右側階層門檻標籤 (還原附圖 1)
    [
        { y: 90, req: 3, txt: '💎3+' },
        { y: 150, req: 6, txt: '💎6+' },
        { y: 210, req: 10, txt: '💎10+' },
        { y: 270, req: 15, txt: '💎15+' }
    ].forEach(tierInfo => {
        const tag = document.createElement('div');
        tag.style.position = 'absolute';
        tag.style.right = '6px';
        tag.style.top = `${tierInfo.y - 8}px`;
        tag.style.fontSize = '10px';
        tag.style.fontWeight = '900';
        tag.style.color = spentPts >= tierInfo.req ? '#1b5e20' : '#795548';
        tag.innerText = tierInfo.txt;
        nodesLayer.appendChild(tag);
    });

    mySkills.forEach(sk => {
        const parentSkill = sk.parentId ? mySkills.find(p => p.id === sk.parentId) : null;
        const parentUnlocked = !parentSkill || parentSkill.unlocked;

        const node = document.createElement('div');
        node.className = `st-node-card ${sk.unlocked ? 'unlocked' : ''}`;
        node.style.left = `${(sk.x / 320) * 100}%`;
        node.style.top = `${(sk.y / 300) * 100}%`;
        if (!parentUnlocked) node.style.opacity = '0.5';

        node.innerHTML = `
            <img src="${getSpriteDataURL(sk.sprite, 3)}"/>
            <span class="st-node-badge">${sk.lv}/${sk.maxLv} ${sk.lv < sk.maxLv ? '➕' : ''}</span>
        `;

        node.addEventListener('click', (e) => {
            e.stopPropagation();
            AudioSystem.playSFX('click');

            const canUnlockOrUpgrade = parentUnlocked && State.skillPts >= 1 && sk.lv < sk.maxLv;

            showItemTooltip(`
                <div class="tt-header">${sk.name} (Lv.${sk.lv}/${sk.maxLv})</div>
                <div class="tt-sub">💧消耗：${sk.cost} SP ｜ ⚔️威力：${sk.dmg} ｜ ⏳CD：${sk.cd}回合</div>
                <div class="tt-green">${sk.desc}</div>
                ${!parentUnlocked ? `<div style="color:#c62828; font-weight:900; margin-top:4px;">🔒 需先研發上層前置技能【${parentSkill.name}】！</div>` : ''}
                <div style="display:flex; flex-direction:column; gap:5px; margin-top:8px;">
                    <button id="btn-st-upg" class="px-gold-btn" style="padding:5px;" ${canUnlockOrUpgrade ? '' : 'disabled'}>
                        ${sk.unlocked ? `➕ 投入 1 技能點強化 (持有💎${State.skillPts})` : `🔬 消耗 1 技能點研發解鎖`}
                    </button>
                    ${sk.unlocked ? `
                        <button id="btn-st-eq" class="px-orange-action-btn" style="padding:5px;">
                            ${sk.equipped ? '📤 從出戰欄卸下' : '📥 裝配至左下角出戰欄'}
                        </button>
                    ` : ''}
                </div>
            `);

            const upgBtn = document.getElementById('btn-st-upg');
            if (upgBtn && canUnlockOrUpgrade) {
                upgBtn.addEventListener('click', () => {
                    AudioSystem.playSFX('win');
                    State.skillPts -= 1;
                    if (!sk.unlocked) {
                        sk.unlocked = true;
                        if (mySkills.filter(s => s.unlocked && s.equipped).length < 4) {
                            sk.equipped = true;
                        }
                    } else {
                        sk.dmg += 4;
                    }
                    sk.lv += 1;
                    syncProgressToGameState();
                    hideItemTooltip();
                    renderBookSkillView();
                    renderBottomLeftHUD();
                });
            }

            const eqBtn = document.getElementById('btn-st-eq');
            if (eqBtn) {
                eqBtn.addEventListener('click', () => {
                    if (sk.equipped && mySkills.filter(s => s.unlocked && s.equipped).length <= 1) {
                        alert('最少需保留 1 招出戰技能！');
                        return;
                    }
                    if (!sk.equipped && mySkills.filter(s => s.unlocked && s.equipped).length >= 4) {
                        alert('出戰欄最多裝配 4 招技能！請先點擊左頁卸下一招。');
                        return;
                    }
                    AudioSystem.playSFX('correct');
                    sk.equipped = !sk.equipped;
                    hideItemTooltip();
                    renderBookSkillView();
                    renderBottomLeftHUD();
                });
            }
        });

        nodesLayer.appendChild(node);
    });
}

// 渲染分頁 3：4 大分類鍛造列表 (武器標示專屬職業與稀有素材)
function renderBookForgeView() {
    const stockBox = document.getElementById('book-mat-stock');
    stockBox.innerHTML = '';
    Object.values(MaterialsCatalog).forEach(mat => {
        const count = GameState.materials[mat.id] || 0;
        const pill = document.createElement('div');
        pill.className = 'mat-pill';
        if (mat.rarity === 'epic') pill.style.background = '#fff2be';
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
                    <strong style="font-size:12px; color:#1b5e20;">${pot.name} (持有: ${held})</strong>
                    <div style="color:#241409; font-weight:bold;">${pot.desc}</div>
                    <small style="color:#b71c1c; font-weight:bold;">調配材料：${reqs.join(' ＋ ')}</small>
                </div>
                <button class="px-gold-btn" style="padding:5px 10px; font-size:11px;" ${canCraft ? '' : 'disabled'}>
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
        const isMyClass = !item.forClass || item.forClass === GameState.heroClass;

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

        const clsBadge = item.forClass
            ? `<span style="background:${isMyClass ? '#2e7d32' : '#757575'}; color:#fff; padding:1px 5px; font-size:10px; margin-left:4px;">${ClassNamesMap[item.forClass]}</span>`
            : `<span style="background:#1565c0; color:#fff; padding:1px 5px; font-size:10px; margin-left:4px;">全職業通用</span>`;

        const card = document.createElement('div');
        card.className = 'forge-card';
        card.innerHTML = `
            <div>
                <strong style="font-size:12px; color:#4a2311;">${item.name} ${clsBadge}</strong>
                <div style="color:#2e7d32; font-weight:bold;">${item.desc}</div>
                <small style="color:#b71c1c; font-weight:bold;">${isUnlocked ? '✨ 已鍛造並收入分類背包' : '需求：' + reqs.join(' ＋ ')}</small>
            </div>
            <button class="px-orange-action-btn" style="flex:0; padding:5px 10px;" ${(!canCraft || isUnlocked) ? 'disabled' : ''}>
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
                // 若符合當前職業，自動幫玩家穿戴上身
                if (isMyClass) {
                    GameState.equipment[item.slot] = item.id;
                }
                syncProgressToGameState();
                updateHeroTopHUD();
                renderBookForgeView();
            });
        }
        forgeList.appendChild(card);
    });
}

// 渲染分頁 4：轉職聖殿 (轉職時自動卸下不合新職業的舊武器，並贈與新職業基礎武器)
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
                <strong style="font-size:13px; color:#241409;">${cls.icon} ${cls.name}</strong>
                <div style="font-size:10px; color:#b71c1c; font-weight:bold;">基礎 HP:${cls.baseHp} ｜ ATK:${cls.baseAtk} ｜ DEF:${cls.baseDef}</div>
                <div style="color:#2e7d32; font-weight:bold;">${cls.trait}</div>
                <small style="color:#b71c1c; font-weight:900;">${isCurrent ? '✅ 當前修煉職業' : `轉職獻祭：🟡${COST_GOLD} 金幣 (持有${State.gold}) ＋ 💎${COST_SP} 技能點 (持有${State.skillPts})`}</small>
            </div>
            <button class="px-gold-btn" style="padding:5px 10px; font-size:12px;" ${(isCurrent || !canAfford) ? 'disabled' : ''}>
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

                // 解鎖並換上新職業的專屬初始武器
                const baseWep = INITIAL_CLASS_WEAPON[cls.id];
                if (baseWep && !GameState.unlockedEquipment.includes(baseWep)) {
                    GameState.unlockedEquipment.push(baseWep);
                }
                ['weapon', 'offhand'].forEach(slotKey => {
                    const curEq = EquipmentCatalog[GameState.equipment[slotKey]];
                    if (curEq && curEq.forClass && curEq.forClass !== cls.id) {
                        GameState.equipment[slotKey] = (slotKey === 'weapon') ? baseWep : null;
                    }
                });

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
   6. 戰鬥獲勝結算（含 🌟 稀有素材掉落）與設定視窗
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

    document.getElementById('btn-check-all-units').addEventListener('click', () => {
        document.querySelectorAll('#ui-subject-checks input[type="checkbox"]').forEach(cb => {
            cb.checked = ALL_DEFAULT_UNITS.includes(cb.value);
        });
    });
    document.getElementById('btn-uncheck-all-units').addEventListener('click', () => {
        document.querySelectorAll('#ui-subject-checks input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    });

    document.getElementById('btn-settings-fullscreen').addEventListener('click', toggleFullScreen);

    document.getElementById('btn-install-app').addEventListener('click', async () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
        } else {
            alert('📲 安裝提示：\n・iPhone / iPad (Safari)：請點擊瀏覽器下方「分享」按鈕，選擇「加入主畫面」。\n・Android / 電腦 (Chrome)：請點擊右上角選單選擇「安裝應用程式 / 加到主畫面」。');
        }
    });

    document.getElementById('btn-force-update').addEventListener('click', async () => {
        syncProgressToGameState();
        try {
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (const r of regs) await r.unregister();
            }
            if ('caches' in window) {
                const keys = await caches.keys();
                for (const k of keys) await caches.delete(k);
            }
        } catch (e) {
            console.warn(e);
        }
        const cleanUrl = window.location.origin + window.location.pathname;
        window.location.replace(`${cleanUrl}?v=${Date.now()}`);
    });

    document.getElementById('btn-open-settings').addEventListener('click', () => {
        document.getElementById('inp-hero-name').value = GameState.heroName;
        document.getElementById('sel-quiz-mode').value = State.quizMode || 'mixed';
        document.getElementById('chk-bgm').checked = GameState.settings.bgm !== false;
        document.getElementById('chk-sfx').checked = GameState.settings.sfx !== false;
        const curSubs = GameState.settings.subjects || ALL_DEFAULT_UNITS;
        document.querySelectorAll('#ui-subject-checks input[type="checkbox"]').forEach(cb => {
            cb.checked = curSubs.includes(cb.value);
        });
        document.getElementById('modal-settings').classList.remove('hidden');
    });

    document.getElementById('btn-close-settings-x').addEventListener('click', () => {
        document.getElementById('modal-settings').classList.add('hidden');
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
        AudioSystem.playSFX('correct');
        GameState.heroName = document.getElementById('inp-hero-name').value.trim() || 'Justin';
        State.quizMode = document.getElementById('sel-quiz-mode').value;

        const subs = [];
        document.querySelectorAll('#ui-subject-checks input:checked').forEach(cb => subs.push(cb.value));
        GameState.settings.subjects = subs.length ? subs : [...ALL_DEFAULT_UNITS];
        GameState.settings.bgm = document.getElementById('chk-bgm').checked;
        GameState.settings.sfx = document.getElementById('chk-sfx').checked;
        GameState.settings.zhSpeed = parseFloat(document.getElementById('sel-zh-speed').value);

        State.questionQueue = [];

        if (GameState.settings.bgm) {
            AudioSystem.startBGM(State.mode === 'combat' ? 'combat' : 'explore');
        } else {
            AudioSystem.stopBGM();
        }

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

    const baseGold = (35 + State.stageIdx * 14) * diffMult;
    const goldGain = baseGold * mult;
    State.gold += goldGain;
    State.skillPts += State.currentBattleIsBoss ? 2 : 1;

    StateManager.addExp(35 + State.stageIdx * 10);

    document.getElementById('vic-gold-gain').innerText = goldGain;
    document.getElementById('vic-exp-txt').innerText = `${GameState.exp} / ${GameState.maxExp}`;
    document.getElementById('vic-exp-bar').style.width = `${Math.min(100, (GameState.exp / GameState.maxExp) * 100)}%`;

    const matBox = document.getElementById('vic-mat-drops');
    matBox.innerHTML = '';
    const drops = [...st.dropPool].sort(() => Math.random() - 0.5).slice(0, 3);
    // 35% 機率額外掉落該章節的【傳說稀有素材】
    if (st.rareDrop && (State.currentBattleIsBoss || Math.random() < 0.35)) {
        drops.push(st.rareDrop);
    }
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
        if (m.rarity === 'epic') tag.style.background = '#fff2be';
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
