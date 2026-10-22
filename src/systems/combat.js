/**
 * 戰鬥與萬用抽題引擎 (src/systems/combat.js)
 */
 import { GameState, StateManager } from '../core/state.js';
 import { QuestionBank, SubjectMeta, normalizeQuestion } from '../data/questions.js';
 import { MapsCatalog, EnemiesCatalog } from '../data/enemies.js';
 import { MaterialsCatalog, EquipmentCatalog } from '../data/items.js';
 import { AudioSystem } from './audio.js';
 
 export const CombatSystem = {
     hudUpdater: null,
     screenSwitcher: null,
 
     init: (hudUpdater, screenSwitcher) => {
         CombatSystem.hudUpdater = hudUpdater;
         CombatSystem.screenSwitcher = screenSwitcher;
         CombatSystem.bindEvents();
     },
 
     bindEvents: () => {
         // 逃跑返回營地
         document.getElementById('btn-flee-combat').addEventListener('click', () => {
             AudioSystem.playSFX('click');
             GameState.combat.inBattle = false;
             CombatSystem.screenSwitcher('screen-map');
         });
 
         // 手動語音朗讀按鈕
         document.getElementById('btn-tts-speak').addEventListener('click', () => {
             AudioSystem.speakQuestion(GameState.combat.activeQuestion);
         });
 
         // 聖言神官：切換「攻擊 / 治療」模式
         const stanceBtn = document.getElementById('btn-stance-toggle');
         stanceBtn.addEventListener('click', () => {
             AudioSystem.playSFX('click');
             GameState.combat.stance = GameState.combat.stance === 'attack' ? 'heal' : 'attack';
             stanceBtn.innerText = GameState.combat.stance === 'attack' ? '⚔️ 模式：攻擊中' : '🌿 模式：治療回血';
         });
 
         // 元素法師：智慧啟示 (刪去兩個錯誤選項)
         document.getElementById('btn-skill-5050').addEventListener('click', (e) => {
             if (GameState.combat.used5050 || !GameState.combat.activeQuestion) return;
             AudioSystem.playSFX('click');
             GameState.combat.used5050 = true;
             e.currentTarget.disabled = true;
 
             const correctAns = GameState.combat.activeQuestion.answer;
             const wrongBtns = Array.from(document.querySelectorAll('.quiz-opt-btn'))
                 .filter(b => b.dataset.val !== correctAns);
 
             wrongBtns.slice(0, 2).forEach(b => {
                 b.style.visibility = 'hidden';
             });
         });
     },
 
     // 觸發戰鬥 (可指定怪物 ID，或從當前地圖隨機抽怪)
     startBattle: (enemyId = null, isBoss = false) => {
         const currentMap = MapsCatalog[GameState.currentMapIdx] || MapsCatalog[0];
         let targetId = enemyId;
         if (!targetId) {
             targetId = isBoss 
                 ? currentMap.boss 
                 : currentMap.enemies[Math.floor(Math.random() * currentMap.enemies.length)];
         }
 
         const template = EnemiesCatalog[targetId] || EnemiesCatalog.slime_ink;
         GameState.combat.inBattle = true;
         GameState.combat.turn = 1;
         GameState.combat.stance = 'attack';
         GameState.combat.used5050 = false;
         GameState.combat.stolenGold = 0;
         GameState.combat.activeEnemy = {
             ...structuredClone(template),
             hp: template.maxHp
         };
 
         // 設定戰鬥背景主題
         const stage = document.getElementById('combat-stage');
         stage.className = currentMap.themeClass;
 
         // 根據玩家職業顯示專屬技能按鈕
         const stanceBtn = document.getElementById('btn-stance-toggle');
         const skill5050Btn = document.getElementById('btn-skill-5050');
         stanceBtn.innerText = '⚔️ 模式：攻擊中';
         stanceBtn.style.display = GameState.heroClass === 'cleric' ? 'inline-flex' : 'none';
         skill5050Btn.style.display = GameState.heroClass === 'mage' ? 'inline-flex' : 'none';
         skill5050Btn.disabled = false;
 
         CombatSystem.updateFighterUI();
         CombatSystem.screenSwitcher('screen-combat');
         CombatSystem.nextQuestionRound();
     },
 
     // 抽取下一道題目並展開第二幕「知識魔法書」
     nextQuestionRound: () => {
         const activeSubs = GameState.settings.subjects.length > 0 ? GameState.settings.subjects : ['chi'];
         let pool = QuestionBank.filter(q => activeSubs.includes(q.subject));
         if (pool.length === 0) pool = QuestionBank;
 
         const rawQ = pool[Math.floor(Math.random() * pool.length)];
         const normQ = normalizeQuestion(rawQ);
 
         // 若怪物有「磁極洗牌 / 催眠毒霧」特性，打亂選項順序
         const enemy = GameState.combat.activeEnemy;
         if (enemy && enemy.traitType === 'shuffle') {
             normQ.options.sort(() => Math.random() - 0.5);
         }
 
         GameState.combat.activeQuestion = normQ;
 
         // 更新書本頂部科目光環與題目文字
         const subMeta = SubjectMeta[normQ.subject] || SubjectMeta.chi;
         document.getElementById('quiz-subject-tag').innerText = subMeta.name;
         document.getElementById('quiz-question-text').innerText = normQ.prompt;
 
         // 動態生成選項按鈕
         const optContainer = document.getElementById('quiz-options-container');
         optContainer.innerHTML = '';
         const labels = ['A', 'B', 'C', 'D'];
 
         normQ.options.forEach((optText, idx) => {
             const btn = document.createElement('button');
             btn.className = 'quiz-opt-btn';
             btn.dataset.val = optText;
             btn.innerText = `${labels[idx] || ''}. ${optText}`;
 
             // 怪物特性：紙飛機精靈會讓其中一個選項上下浮動
             if (enemy && enemy.traitType === 'float_opt' && idx === 1) {
                 btn.style.animation = 'heroBob 0.9s infinite ease-in-out';
             }
 
             btn.addEventListener('click', () => CombatSystem.submitAnswer(optText, btn));
             optContainer.appendChild(btn);
         });
 
         document.getElementById('combat-center-msg').innerText = `⏳ 第 ${GameState.combat.turn} 回合：請作答詠唱！`;
         document.getElementById('quiz-book-overlay').classList.add('active');
     },
 
     // 檢查答案並進入第三幕「全螢幕處決/受擊演出」
     submitAnswer: (selectedVal, clickedBtn) => {
         const allBtns = document.querySelectorAll('.quiz-opt-btn');
         allBtns.forEach(b => b.disabled = true);
 
         const q = GameState.combat.activeQuestion;
         const isCorrect = (selectedVal === q.answer);
 
         if (isCorrect) {
             clickedBtn.classList.add('correct');
             AudioSystem.playSFX('correct');
             GameState.combat.combo += 1;
         } else {
             clickedBtn.classList.add('wrong');
             allBtns.forEach(b => {
                 if (b.dataset.val === q.answer) b.classList.add('correct');
             });
             AudioSystem.playSFX('wrong');
             GameState.combat.combo = 0;
             StateManager.addMistake(q.id);
         }
 
         document.getElementById('combat-combo').innerText = GameState.combat.combo;
 
         // 0.65 秒後收起魔法書，讓小朋友看清楚全螢幕戰鬥扣血演出！
         setTimeout(() => {
             document.getElementById('quiz-book-overlay').classList.remove('active');
             CombatSystem.resolveTurnAction(isCorrect);
         }, 650);
     },
 
     // 第三幕：計算傷害、職業特效與怪物反擊
     resolveTurnAction: (isCorrect) => {
         const stats = StateManager.getComputedStats({ Equipment: EquipmentCatalog });
         const enemy = GameState.combat.activeEnemy;
         const centerMsg = document.getElementById('combat-center-msg');
 
         if (isCorrect) {
             // 聖言神官選擇「治療回血」模式
             if (GameState.heroClass === 'cleric' && GameState.combat.stance === 'heal') {
                 const healAmt = Math.floor(stats.atk * 1.4);
                 GameState.hp = Math.min(stats.maxHp, GameState.hp + healAmt);
                 centerMsg.innerText = `🌿 聖言治癒！成功恢復 +${healAmt} 點生命值！`;
             } else {
                 // 計算攻擊傷害與連擊加成
                 let dmg = stats.atk;
                 if (GameState.combat.combo >= 2) {
                     dmg = Math.floor(dmg * 1.35);
                 }
                 // 字典岩龜特性：第一擊沒有 Combo 時傷害減半
                 if (enemy.traitType === 'heavy_shell' && GameState.combat.combo < 2) {
                     dmg = Math.floor(dmg * 0.6);
                 }
 
                 enemy.hp = Math.max(0, enemy.hp - dmg);
                 centerMsg.innerText = `💥 答對了！對 ${enemy.name} 造成 -${dmg} 點傷害！`;
 
                 // 重裝劍士特性：每連對 3 題獲得 1 層免傷護盾
                 if (GameState.heroClass === 'warrior' && GameState.combat.combo % 3 === 0) {
                     GameState.combat.shieldCount += 1;
                     centerMsg.innerText += ` (🛡️獲得堅韌護盾！)`;
                 }
             }
         } else {
             // 答錯：檢查是否有重裝劍士護盾
             if (GameState.combat.shieldCount > 0) {
                 GameState.combat.shieldCount -= 1;
                 centerMsg.innerText = `🛡️ 答錯了，但【堅韌護盾】成功抵擋了怪物攻擊！`;
             } else {
                 const rawDmg = Math.max(5, enemy.atk - Math.floor(stats.def * 0.5));
                 GameState.hp = Math.max(0, GameState.hp - rawDmg);
                 let traitNote = '';
 
                 // 觸發怪物專屬干擾特性
                 if (enemy.traitType === 'split') {
                     enemy.hp = Math.min(enemy.maxHp, enemy.hp + 15);
                     traitNote = '（💧史萊姆分裂回復了 15 HP！）';
                 } else if (enemy.traitType === 'steal_gold' && GameState.gold >= 10) {
                     GameState.gold -= 10;
                     GameState.combat.stolenGold += 10;
                     traitNote = '（🕰️盜賊鳥偷走了 10 金幣！）';
                 }
 
                 centerMsg.innerText = `❌ 答錯了！受到反擊 -${rawDmg} HP ${traitNote}`;
             }
         }
 
         CombatSystem.updateFighterUI();
         if (CombatSystem.hudUpdater) CombatSystem.hudUpdater();
 
         // 1.2 秒後判斷勝負或進入下一回合
         setTimeout(() => {
             if (enemy.hp <= 0) {
                 CombatSystem.handleVictory();
             } else if (GameState.hp <= 0) {
                 CombatSystem.handleDefeat();
             } else {
                 GameState.combat.turn += 1;
                 document.getElementById('combat-turn').innerText = GameState.combat.turn;
                 CombatSystem.nextQuestionRound();
             }
         }, 1250);
     },
 
     // 戰鬥勝利：結算金幣、經驗值與掉落素材
     handleVictory: () => {
         AudioSystem.playSFX('win');
         const enemy = GameState.combat.activeEnemy;
         const isRangerBoost = (GameState.heroClass === 'ranger' && GameState.combat.combo >= 2);
         const dropMultiplier = isRangerBoost ? 2 : 1;
 
         const goldEarned = (enemy.goldReward * dropMultiplier) + (GameState.combat.stolenGold || 0);
         GameState.gold += goldEarned;
 
         const dropTexts = [];
         enemy.drops.forEach(d => {
             if (Math.random() <= d.chance) {
                 const qty = d.amount * dropMultiplier;
                 GameState.materials[d.mat] = (GameState.materials[d.mat] || 0) + qty;
                 const matInfo = MaterialsCatalog[d.mat];
                 dropTexts.push(`${matInfo.icon}${matInfo.name} x${qty}`);
             }
         });
 
         const leveledUp = StateManager.addExp(enemy.expReward);
         if (leveledUp) {
             const stats = StateManager.getComputedStats({ Equipment: EquipmentCatalog });
             GameState.hp = stats.maxHp; // 升級自動補滿血
         }
 
         StateManager.saveGame();
         if (CombatSystem.hudUpdater) CombatSystem.hudUpdater();
 
         const centerMsg = document.getElementById('combat-center-msg');
         centerMsg.innerText = `🎉 戰鬥勝利！獲得 💰+${goldEarned}、${dropTexts.join('、') || '經驗值'} ${leveledUp ? '🌟升級了！' : ''}`;
 
         setTimeout(() => {
             GameState.combat.inBattle = false;
             CombatSystem.screenSwitcher('screen-map');
         }, 1600);
     },
 
     // 戰鬥失敗：送回營地並恢復生命值
     handleDefeat: () => {
         const stats = StateManager.getComputedStats({ Equipment: EquipmentCatalog });
         GameState.hp = stats.maxHp;
         StateManager.saveGame();
         if (CombatSystem.hudUpdater) CombatSystem.hudUpdater();
 
         document.getElementById('combat-center-msg').innerText = '💫 體力耗盡！大熊老師將你救回營地休息並補滿了體力！';
         setTimeout(() => {
             GameState.combat.inBattle = false;
             CombatSystem.screenSwitcher('screen-map');
         }, 1700);
     },
 
     // 更新戰鬥畫面雙方血條與名字
     updateFighterUI: () => {
         const stats = StateManager.getComputedStats({ Equipment: EquipmentCatalog });
         const enemy = GameState.combat.activeEnemy;
 
         document.getElementById('combat-hero-name').innerText = GameState.heroName;
         document.getElementById('combat-hero-sprite').innerText = stats.icon;
         document.getElementById('combat-hero-hp').innerText = GameState.hp;
         document.getElementById('combat-hero-hp-fill').style.width = `${Math.max(0, (GameState.hp / stats.maxHp) * 100)}%`;
 
         if (enemy) {
             document.getElementById('combat-enemy-name').innerText = enemy.name;
             document.getElementById('combat-enemy-sprite').innerText = enemy.sprite;
             document.getElementById('combat-enemy-hp').innerText = enemy.hp;
             document.getElementById('combat-enemy-max-hp').innerText = enemy.maxHp;
             document.getElementById('combat-enemy-hp-fill').style.width = `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`;
             document.getElementById('combat-enemy-trait').innerText = enemy.traitDesc;
         }
     }
 };