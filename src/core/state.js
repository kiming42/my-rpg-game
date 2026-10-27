/**
 * 遊戲核心狀態與存檔管理器 (src/core/state.js)
 * 修復：完整保存與讀取 unlockedEquipment(武器護具庫)、equipment(穿戴中裝備) 及 skillTrees(全職業技能樹等級與配置)
 */

const SAVE_KEY = 'TIME_BOOK_GUARDIAN_SAVE_V1';

export const ClassBaseStats = {
    warrior: {
        id: 'warrior', name: '重裝劍士', icon: '🛡️',
        baseHp: 145, baseAtk: 15, baseDef: 11,
        trait: '連擊達雙數時自動獲得 1 層護盾抵擋傷害'
    },
    mage: {
        id: 'mage', name: '元素法師', icon: '🪄',
        baseHp: 105, baseAtk: 20, baseDef: 6,
        trait: '選擇題詠唱時可使用「💡啟示」刪去兩個錯誤選項'
    },
    ranger: {
        id: 'ranger', name: '尋寶遊俠', icon: '🏹',
        baseHp: 120, baseAtk: 17, baseDef: 8,
        trait: '連擊 2 次以上獲勝時，金幣與戰利品素材雙倍掉落'
    },
    cleric: {
        id: 'cleric', name: '聖言神官', icon: '🌿',
        baseHp: 135, baseAtk: 14, baseDef: 9,
        trait: '擁有強大自我恢復與神聖群體淨化能力'
    }
};

export const GameState = {
    heroName: 'Justin',
    heroClass: 'warrior',
    level: 1,
    exp: 0,
    maxExp: 150,
    gold: 120,
    gem: 5,
    bagCapacity: 10,
    currentMapIdx: 0,
    maxUnlockedStage: 0,
    stageKills: [0, 0, 0, 0, 0, 0],
    ngPlusCount: 0,
    quizMode: 'mixed',
    engMode: 'mixed',
    sciMode: 'mixed',
    humMode: 'mixed',

    // 已解鎖/鍛造出的所有武器、護具、飾品 ID 清單
    unlockedEquipment: ['wep_wood_sword', 'arm_cloth'],

    // 13 個紙娃娃裝備槽當前穿戴的物品 ID
    equipment: {
        weapon: 'wep_wood_sword',
        offhand: null,
        head: null,
        armor: 'arm_cloth',
        gloves_l: null,
        legs: null,
        gloves_r: null,
        boots: null,
        neck: null,
        ring1: null,
        ring2: null,
        relic1: null,
        relic2: null
    },

    // 30 種鍛造與煉藥素材庫存
    materials: {},

    // 藥水持有數量
    potions: { hp_pot_s: 3, mp_pot_s: 2, hp_pot_l: 0, atk_scroll: 1 },

    // 四大職業技能樹的升級與裝配紀錄 { warrior: { skId: { lv, unlocked, equipped, dmg } }, ... }
    savedSkillTrees: {},

    // 錯題卷軸 ID 清單
    mistakes: [],

    settings: {
        bgm: true,
        sfx: true,
        zhSpeed: 1.0,
        enSpeed: 0.8,
        subjects: []
    },

    combat: {
        combo: 0,
        activeQuestion: null
    }
};

export const StateManager = {
    saveGame: () => {
        try {
            const payload = {
                heroName: GameState.heroName,
                heroClass: GameState.heroClass,
                level: GameState.level,
                exp: GameState.exp,
                maxExp: GameState.maxExp,
                gold: GameState.gold,
                gem: GameState.gem,
                bagCapacity: GameState.bagCapacity,
                currentMapIdx: GameState.currentMapIdx,
                maxUnlockedStage: GameState.maxUnlockedStage,
                stageKills: Array.isArray(GameState.stageKills) ? [...GameState.stageKills] : [0, 0, 0, 0, 0, 0],
                ngPlusCount: GameState.ngPlusCount || 0,
                quizMode: GameState.quizMode || 'mixed',
                engMode: GameState.engMode || 'mixed',
                sciMode: GameState.sciMode || 'mixed',
                humMode: GameState.humMode || 'mixed',

                // 完整儲存已擁有裝備、已穿戴裝備、素材、藥水與技能樹狀態
                unlockedEquipment: Array.isArray(GameState.unlockedEquipment) ? [...new Set(GameState.unlockedEquipment)] : ['wep_wood_sword', 'arm_cloth'],
                equipment: { ...GameState.equipment },
                materials: { ...GameState.materials },
                potions: { ...GameState.potions },
                savedSkillTrees: GameState.savedSkillTrees || {},
                mistakes: Array.isArray(GameState.mistakes) ? [...GameState.mistakes] : [],
                settings: { ...GameState.settings }
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn('存檔失敗:', e);
        }
    },

    loadGame: () => {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return false;
            const data = JSON.parse(raw);

            GameState.heroName = data.heroName || 'Justin';
            GameState.heroClass = data.heroClass || 'warrior';
            GameState.level = data.level || 1;
            GameState.exp = data.exp || 0;
            GameState.maxExp = data.maxExp || 150;
            GameState.gold = data.gold ?? 120;
            GameState.gem = data.gem ?? 5;
            GameState.bagCapacity = data.bagCapacity || 10;
            GameState.currentMapIdx = data.currentMapIdx || 0;
            GameState.maxUnlockedStage = data.maxUnlockedStage ?? 0;
            GameState.stageKills = Array.isArray(data.stageKills) && data.stageKills.length === 6
                ? [...data.stageKills]
                : [0, 0, 0, 0, 0, 0];
            GameState.ngPlusCount = data.ngPlusCount || 0;
            GameState.quizMode = data.quizMode || 'mixed';
            GameState.engMode = data.engMode || 'mixed';
            GameState.sciMode = data.sciMode || 'mixed';
            GameState.humMode = data.humMode || 'mixed';

            if (Array.isArray(data.unlockedEquipment) && data.unlockedEquipment.length > 0) {
                GameState.unlockedEquipment = [...new Set(data.unlockedEquipment)];
            }
            if (data.equipment && typeof data.equipment === 'object') {
                GameState.equipment = { ...GameState.equipment, ...data.equipment };
            }
            if (data.materials && typeof data.materials === 'object') {
                GameState.materials = { ...data.materials };
            }
            if (data.potions && typeof data.potions === 'object') {
                GameState.potions = { ...data.potions };
            }
            if (data.savedSkillTrees && typeof data.savedSkillTrees === 'object') {
                GameState.savedSkillTrees = data.savedSkillTrees;
            }
            if (Array.isArray(data.mistakes)) {
                GameState.mistakes = [...data.mistakes];
            }
            if (data.settings && typeof data.settings === 'object') {
                GameState.settings = { ...GameState.settings, ...data.settings };
            }
            return true;
        } catch (e) {
            console.warn('讀檔失敗:', e);
            return false;
        }
    },

    addExp: (amount) => {
        GameState.exp += amount;
        while (GameState.exp >= GameState.maxExp) {
            GameState.exp -= GameState.maxExp;
            GameState.level += 1;
            GameState.maxExp = Math.floor(GameState.maxExp * 1.25);
        }
    },

    addMistake: (qId) => {
        if (qId && !GameState.mistakes.includes(qId)) {
            GameState.mistakes.push(qId);
        }
    },

    resolveMistake: (qId) => {
        GameState.mistakes = GameState.mistakes.filter(id => id !== qId);
    }
};
