/**
 * 遊戲核心狀態管理器 (src/core/state.js)
 * 負責管理玩家數值、背包素材、穿戴裝備、錯題本與設定
 */

 const SAVE_KEY = 'TIME_BOOK_GUARDIAN_SAVE_V1';

 // 四大職業基礎數值
 export const ClassBaseStats = {
     warrior: { id: 'warrior', name: '重裝劍士', icon: '🛡️', baseHp: 140, baseAtk: 25, baseDef: 12, trait: '每連對 3 題獲得 1 層免傷護盾' },
     mage:    { id: 'mage',    name: '元素法師', icon: '🪄', baseHp: 95,  baseAtk: 40, baseDef: 4,  trait: '每場戰鬥可使用 1 次「智慧啟示」刪去兩項' },
     ranger:  { id: 'ranger',  name: '尋寶遊俠', icon: '🏹', baseHp: 110, baseAtk: 30, baseDef: 8,  trait: '達成 2 連擊時，素材與金幣掉落翻倍' },
     cleric:  { id: 'cleric',  name: '聖言神官', icon: '🌿', baseHp: 125, baseAtk: 22, baseDef: 10, trait: '可自由切換「攻擊」或「治療回血」答題模式' }
 };
 
 // 預設初始存檔
 const DefaultState = {
     heroName: '小朗',
     heroClass: 'warrior',
     level: 1,
     exp: 0,
     maxExp: 100,
 
     // 戰鬥即時數值
     hp: 140,
     gold: 100,
     gem: 5,
 
     // 當前地圖與座標 (0: 草原, 1: 遺跡, 2: 礦坑)
     currentMapIdx: 0,
     posX: 25,
     posY: 35,
 
     // 4 大核心裝備槽 (儲存裝備 ID)
     equipment: {
         weapon: 'wep_wood_sword',
         armor: 'arm_cloth',
         relic: null,
         potion: 'pot_dew'
     },
 
     // 已解鎖/合成的裝備清單
     unlockedEquipment: ['wep_wood_sword', 'arm_cloth'],
 
     // 素材背包 (對應三大地圖掉落物)
     materials: {
         fiber: 2,     // 🌿 柔韌草纖維
         dew: 2,       // 💧 清澈露水
         ink: 1,       // 🩸 魔法墨滴
         wing: 0,      // 🪽 輕盈紙翼
         page: 1,      // 📜 堅硬書頁
         core_doodle: 0, // 🔮 塗鴉核心
         gear: 0,      // ⚙️ 青銅齒輪
         clay: 0,      // 🏺 陶土碎片
         crystal: 0    // 💎 幾何碎晶
     },
 
     // 錯題煉金紀錄 (儲存答錯題目的 ID 陣列)
     mistakes: [],
 
     // 系統與溫習課題設定
     settings: {
         subjects: ['chi', 'hum', 'sci'], // 預設勾選中文、人文、科學
         bgm: true,
         sfx: true,
         zhSpeed: 1.0,
         enSpeed: 0.75
     },
 
     // 戰鬥暫存狀態 (不需永久存檔)
     combat: {
         inBattle: false,
         turn: 1,
         combo: 0,
         stance: 'attack', // 'attack' | 'heal'
         shieldCount: 0,   // 劍士護盾層數
         used5050: false,  // 法師是否已用提示
         activeEnemy: null,
         activeQuestion: null
     }
 };
 
 // 匯出全域可讀寫的 GameState
 export const GameState = structuredClone(DefaultState);
 
 export const StateManager = {
     // 計算包含裝備加成的總能力值
     getComputedStats: (itemsCatalog) => {
         const base = ClassBaseStats[GameState.heroClass] || ClassBaseStats.warrior;
         let maxHp = base.baseHp + (GameState.level - 1) * 15;
         let atk = base.baseAtk + (GameState.level - 1) * 4;
         let def = base.baseDef + (GameState.level - 1) * 2;
 
         if (itemsCatalog && itemsCatalog.Equipment) {
             const wep = itemsCatalog.Equipment[GameState.equipment.weapon];
             const arm = itemsCatalog.Equipment[GameState.equipment.armor];
             const rel = itemsCatalog.Equipment[GameState.equipment.relic];
 
             if (wep) { atk += (wep.atk || 0); maxHp += (wep.hp || 0); }
             if (arm) { def += (arm.def || 0); maxHp += (arm.hp || 0); }
             if (rel) { atk += (rel.atk || 0); def += (rel.def || 0); maxHp += (rel.hp || 0); }
         }
         return { maxHp, atk, def, icon: base.icon, className: base.name, trait: base.trait };
     },
 
     // 增加經驗值與自動升級檢查
     addExp: (amount) => {
         GameState.exp += amount;
         let leveledUp = false;
         while (GameState.exp >= GameState.maxExp) {
             GameState.exp -= GameState.maxExp;
             GameState.level += 1;
             GameState.maxExp = Math.floor(GameState.maxExp * 1.25);
             leveledUp = true;
         }
         return leveledUp;
     },
 
     // 記錄錯題
     addMistake: (questionId) => {
         if (!GameState.mistakes.includes(questionId)) {
             GameState.mistakes.push(questionId);
         }
     },
 
     // 移除已消滅的錯題並獎勵智慧結晶
     resolveMistake: (questionId) => {
         const idx = GameState.mistakes.indexOf(questionId);
         if (idx !== -1) {
             GameState.mistakes.splice(idx, 1);
             GameState.gem += 2;
             return true;
         }
         return false;
     },
 
     // 儲存進度到瀏覽器 LocalStorage
     saveGame: () => {
         try {
             const saveCopy = { ...GameState, combat: DefaultState.combat };
             localStorage.setItem(SAVE_KEY, JSON.stringify(saveCopy));
         } catch (e) {
             console.warn('無法儲存遊戲進度:', e);
         }
     },
 
     // 讀取進度
     loadGame: () => {
         try {
             const raw = localStorage.getItem(SAVE_KEY);
             if (!raw) return false;
             const parsed = JSON.parse(raw);
             Object.assign(GameState, parsed);
             return true;
         } catch (e) {
             console.warn('讀取存檔失敗:', e);
             return false;
         }
     }
 };