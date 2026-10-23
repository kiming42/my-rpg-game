/**
 * 互動答題介面與 RPG 動態探索地圖模組 (src/systems/combat.js)
 * 1. 實作三大「非四選一」互動答題 UI：分類籃 (classify)、次序槽 (order)、看圖多重空格填充 (fill_blanks)
 * 2. 實作 RPG 動態地圖物件：巡邏魔物、黃金寶箱🎁、治療之泉⛲、神秘商人⛺、迷宮障礙物碰撞與天氣粒子特效
 */
 import { AudioSystem } from './audio.js';
 import { drawMatrixOnCtx } from '../data/enemies.js';
 import { MaterialsCatalog } from '../data/items.js';
 
 export const InteractiveQuizUI = {
     /**
      * 渲染非四選一互動題型 (分類題 / 次序題 / 看圖多重填空題)
      */
     render: (normQ, onCompleteVerify) => {
         const box = document.getElementById('ui-quiz-interactive');
         box.innerHTML = '';
         box.classList.remove('hidden');
 
         // =====================================================================
         // 模式 1：【分類題】點擊待分類項目，再點擊上方分類籃放入
         // =====================================================================
         if (normQ.interactiveType === 'classify') {
             let activeItemIdx = 0;
             const placements = {}; // itemIdx -> categoryName
 
             const renderClassifyState = () => {
                 box.innerHTML = '';
 
                 // 1. 分類籃區域
                 const basketsRow = document.createElement('div');
                 basketsRow.className = 'iq-baskets-grid';
                 normQ.categories.forEach(catName => {
                     const basket = document.createElement('div');
                     basket.className = 'iq-basket-card';
                     const assignedList = normQ.items
                         .map((it, idx) => placements[idx] === catName ? `<span class="iq-tag-in-basket" data-idx="${idx}">${it.label} ✖</span>` : '')
                         .filter(Boolean)
                         .join('');
 
                     basket.innerHTML = `
                         <div class="iq-basket-title">📥 ${catName} (點擊放入)</div>
                         <div class="iq-basket-items">${assignedList || '<span style="color:#9e8565; font-size:11px;">尚未放入項目</span>'}</div>
                     `;
 
                     basket.addEventListener('click', (e) => {
                         const removeTag = e.target.closest('.iq-tag-in-basket');
                         if (removeTag) {
                             e.stopPropagation();
                             AudioSystem.playSFX('click');
                             const rIdx = parseInt(removeTag.dataset.idx, 10);
                             delete placements[rIdx];
                             activeItemIdx = rIdx;
                             renderClassifyState();
                             return;
                         }
                         if (activeItemIdx !== null && activeItemIdx < normQ.items.length) {
                             AudioSystem.playSFX('click');
                             placements[activeItemIdx] = catName;
                             // 自動跳去下一個未分類項目
                             const nextUnplaced = normQ.items.findIndex((_, i) => placements[i] === undefined);
                             activeItemIdx = nextUnplaced !== -1 ? nextUnplaced : null;
                             renderClassifyState();
                         }
                     });
                     basketsRow.appendChild(basket);
                 });
                 box.appendChild(basketsRow);
 
                 // 2. 待分類項目池
                 const poolRow = document.createElement('div');
                 poolRow.className = 'iq-pool-row';
                 normQ.items.forEach((it, idx) => {
                     if (placements[idx] !== undefined) return;
                     const chip = document.createElement('button');
                     chip.type = 'button';
                     chip.className = `iq-item-chip ${activeItemIdx === idx ? 'selected' : ''}`;
                     chip.innerText = it.label;
                     chip.addEventListener('click', () => {
                         AudioSystem.playSFX('click');
                         activeItemIdx = idx;
                         renderClassifyState();
                     });
                     poolRow.appendChild(chip);
                 });
                 box.appendChild(poolRow);
 
                 // 3. 底部確認列
                 const allPlaced = Object.keys(placements).length === normQ.items.length;
                 const actionRow = document.createElement('div');
                 actionRow.className = 'spell-action-row';
                 actionRow.innerHTML = `
                     <div id="iq-feedback" class="spell-feedback-txt">
                         ${allPlaced ? '✅ 已全部分類！請點擊右側確認提交' : '💡 先選下方項目（紅框），再點擊上方分類籃放入！'}
                     </div>
                     <button type="button" id="btn-iq-submit" class="px-gold-btn spell-ctrl-btn" ${allPlaced ? '' : 'disabled'}>✅ 確認分類</button>
                 `;
                 box.appendChild(actionRow);
 
                 const subBtn = actionRow.querySelector('#btn-iq-submit');
                 if (subBtn && allPlaced) {
                     subBtn.addEventListener('click', () => {
                         subBtn.disabled = true;
                         const isAllCorrect = normQ.items.every((it, idx) => placements[idx] === it.cat);
                         const fb = actionRow.querySelector('#iq-feedback');
                         if (isAllCorrect) {
                             fb.style.color = '#2e7d32';
                             fb.innerText = '⭕ 分類完全正確！';
                         } else {
                             fb.style.color = '#c62828';
                             fb.innerText = `❌ 正確分類：${normQ.answer}`;
                         }
                         onCompleteVerify(isAllCorrect);
                     });
                 }
             };
 
             renderClassifyState();
             return;
         }
 
         // =====================================================================
         // 模式 2：【次序題】依先後次序 1 ➔ 2 ➔ 3 ➔ 4 點擊排列步驟
         // =====================================================================
         if (normQ.interactiveType === 'order') {
             const chosenOrder = [];
 
             const renderOrderState = () => {
                 box.innerHTML = '';
 
                 const slotsDiv = document.createElement('div');
                 slotsDiv.className = 'iq-order-slots';
                 normQ.correctOrder.forEach((_, idx) => {
                     const stepTxt = chosenOrder[idx];
                     const slot = document.createElement('div');
                     slot.className = `iq-order-slot ${stepTxt ? 'filled' : ''}`;
                     slot.innerHTML = `<b>步驟 ${idx + 1}：</b><span>${stepTxt || '（請點擊下方步驟卡放入）'}</span>`;
                     if (stepTxt) {
                         slot.addEventListener('click', () => {
                             AudioSystem.playSFX('click');
                             chosenOrder.splice(idx, 1);
                             renderOrderState();
                         });
                     }
                     slotsDiv.appendChild(slot);
                 });
                 box.appendChild(slotsDiv);
 
                 const poolDiv = document.createElement('div');
                 poolDiv.className = 'iq-pool-row';
                 normQ.shuffledSteps.forEach(st => {
                     if (chosenOrder.includes(st)) return;
                     const chip = document.createElement('button');
                     chip.type = 'button';
                     chip.className = 'iq-item-chip';
                     chip.innerText = st;
                     chip.addEventListener('click', () => {
                         AudioSystem.playSFX('click');
                         chosenOrder.push(st);
                         renderOrderState();
                     });
                     poolDiv.appendChild(chip);
                 });
                 box.appendChild(poolDiv);
 
                 const allFilled = chosenOrder.length === normQ.correctOrder.length;
                 const actionRow = document.createElement('div');
                 actionRow.className = 'spell-action-row';
                 actionRow.innerHTML = `
                     <div id="iq-feedback" class="spell-feedback-txt">💡 依正確先後次序點擊步驟（點擊已排步驟可撤回）</div>
                     <button type="button" id="btn-iq-submit" class="px-gold-btn spell-ctrl-btn" ${allFilled ? '' : 'disabled'}>✅ 確認次序</button>
                 `;
                 box.appendChild(actionRow);
 
                 const subBtn = actionRow.querySelector('#btn-iq-submit');
                 if (subBtn && allFilled) {
                     subBtn.addEventListener('click', () => {
                         subBtn.disabled = true;
                         const isAllCorrect = normQ.correctOrder.every((step, i) => chosenOrder[i] === step);
                         const fb = actionRow.querySelector('#iq-feedback');
                         if (isAllCorrect) {
                             fb.style.color = '#2e7d32';
                             fb.innerText = '⭕ 次序排列完全正確！';
                         } else {
                             fb.style.color = '#c62828';
                             fb.innerText = `❌ 正確次序：${normQ.answer}`;
                         }
                         onCompleteVerify(isAllCorrect);
                     });
                 }
             };
 
             renderOrderState();
             return;
         }
 
         // =====================================================================
         // 模式 3：【看圖多重空格填充題】點擊詞語池填入對應的空格 (1)、(2)、(3)
         // =====================================================================
         if (normQ.interactiveType === 'fill_blanks') {
             const userBlanks = new Array(normQ.blanks.length).fill('');
             let activeBlankIdx = 0;
 
             const renderBlanksState = () => {
                 box.innerHTML = '';
 
                 // 1. 空格槽列 (1) [____]  (2) [____]
                 const slotsRow = document.createElement('div');
                 slotsRow.className = 'iq-blanks-row';
                 normQ.blanks.forEach((_, idx) => {
                     const val = userBlanks[idx];
                     const slotBtn = document.createElement('div');
                     slotBtn.className = `iq-blank-slot ${activeBlankIdx === idx ? 'active' : ''} ${val ? 'filled' : ''}`;
                     slotBtn.innerHTML = `<span class="iq-blank-num">(${idx + 1})</span> <b>${val || '＿＿＿＿'}</b>`;
                     slotBtn.addEventListener('click', () => {
                         AudioSystem.playSFX('click');
                         userBlanks[idx] = '';
                         activeBlankIdx = idx;
                         renderBlanksState();
                     });
                     slotsRow.appendChild(slotBtn);
                 });
                 box.appendChild(slotsRow);
 
                 // 2. 詞語選擇池
                 const poolRow = document.createElement('div');
                 poolRow.className = 'iq-pool-row';
                 normQ.wordPool.forEach(word => {
                     const usedCount = userBlanks.filter(w => w === word).length;
                     const maxAllowed = normQ.blanks.filter(w => w === word).length || 1;
                     const isUsed = usedCount >= maxAllowed && userBlanks.includes(word);
 
                     const chip = document.createElement('button');
                     chip.type = 'button';
                     chip.className = 'iq-item-chip';
                     chip.style.fontSize = '15px';
                     chip.style.padding = '6px 14px';
                     if (isUsed) chip.style.opacity = '0.4';
                     chip.innerText = word;
 
                     chip.addEventListener('click', () => {
                         AudioSystem.playSFX('click');
                         if (activeBlankIdx < userBlanks.length) {
                             userBlanks[activeBlankIdx] = word;
                             const nextEmpty = userBlanks.findIndex(v => v === '');
                             if (nextEmpty !== -1) activeBlankIdx = nextEmpty;
                             renderBlanksState();
                         }
                     });
                     poolRow.appendChild(chip);
                 });
                 box.appendChild(poolRow);
 
                 const allFilled = userBlanks.every(v => v !== '');
                 const actionRow = document.createElement('div');
                 actionRow.className = 'spell-action-row';
                 actionRow.innerHTML = `
                     <div id="iq-feedback" class="spell-feedback-txt">💡 點擊詞語填入空格 (1)(2)（點擊空格可重選）</div>
                     <button type="button" id="btn-iq-submit" class="px-gold-btn spell-ctrl-btn" ${allFilled ? '' : 'disabled'}>✅ 確認填充</button>
                 `;
                 box.appendChild(actionRow);
 
                 const subBtn = actionRow.querySelector('#btn-iq-submit');
                 if (subBtn && allFilled) {
                     subBtn.addEventListener('click', () => {
                         subBtn.disabled = true;
                         const isAllCorrect = normQ.blanks.every((ans, i) => userBlanks[i] === ans);
                         const fb = actionRow.querySelector('#iq-feedback');
                         if (isAllCorrect) {
                             fb.style.color = '#2e7d32';
                             fb.innerText = `⭕ 填充完全正確！(${normQ.blanks.join('、')})`;
                         } else {
                             fb.style.color = '#c62828';
                             fb.innerText = `❌ 正確答案：${normQ.blanks.join('、')}`;
                         }
                         onCompleteVerify(isAllCorrect);
                     });
                 }
             };
 
             renderBlanksState();
         }
     }
 };
 
 /* ==========================================================================
    🗺️ RPG 動態探索地圖系統 (巡邏魔物、寶箱、治療之泉、神秘商人、障礙物與天氣粒子)
    ========================================================================== */
 export const WorldMapSystem = {
     roamingMobs: [],
     chests: [],
     fountainUsed: false,
     particles: [],
     obstacles: [
         // 河流/裂谷中央障礙區 (只留中間橋樑 y: 225~325 可通過)
         { x: 395, y: 60, w: 68, h: 160 },
         { x: 395, y: 332, w: 68, h: 200 }
     ],
 
     initStageObjects: (stageIdx, stageObj) => {
         WorldMapSystem.fountainUsed = false;
 
         // 產生 2 隻在地圖上來回巡邏的野生魔物
         WorldMapSystem.roamingMobs = [
             {
                 x: 520, y: 150, vx: 1.1, vy: 0.6,
                 minX: 480, maxX: 720, minY: 110, maxY: 230,
                 sprite: stageObj.roamPool[0].sprite,
                 name: stageObj.roamPool[0].name
             },
             {
                 x: 640, y: 360, vx: -1.0, vy: -0.7,
                 minX: 490, maxX: 760, minY: 310, maxY: 420,
                 sprite: stageObj.roamPool[1 % stageObj.roamPool.length].sprite,
                 name: stageObj.roamPool[1 % stageObj.roamPool.length].name
             }
         ];
 
         // 產生 2 個黃金尋寶寶箱
         WorldMapSystem.chests = [
             { x: 115, y: 385, opened: false, id: `c1_${stageIdx}` },
             { x: 705, y: 115, opened: false, id: `c2_${stageIdx}` }
         ];
 
         // 初始化 25 顆章節主題環境粒子 (花瓣/風沙/螢光/火星/飄雪)
         WorldMapSystem.particles = Array.from({ length: 25 }, () => ({
             x: Math.random() * 960,
             y: Math.random() * 540,
             vx: (Math.random() - 0.3) * 1.2,
             vy: Math.random() * 1.2 + 0.5,
             size: Math.random() > 0.5 ? 4 : 3
         }));
     },
 
     // 檢查座標是否撞到河流/深淵障礙物 (橋樑位置可自由通行)
     isBlocked: (nx, ny) => {
         for (const obs of WorldMapSystem.obstacles) {
             if (nx + 35 > obs.x && nx + 10 < obs.x + obs.w && ny + 45 > obs.y && ny + 15 < obs.y + obs.h) {
                 return true;
             }
         }
         return false;
     },
 
     updateAndDraw: (ctx, State, GameState, st, callbacks) => {
         // 1. 繪製治療之泉 ⛲ 與神秘流浪商人 ⛺
         ctx.font = 'bold 12px "DotGothic16", monospace';
         ctx.textAlign = 'center';
 
         // ⛲ 神聖治療之泉 (左上河畔)
         ctx.fillStyle = WorldMapSystem.fountainUsed ? '#78909c' : '#00e5ff';
         ctx.beginPath(); ctx.arc(345, 145, 20, 0, Math.PI * 2); ctx.fill();
         ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
         ctx.fillStyle = '#000';
         ctx.fillRect(285, 105, 120, 18);
         ctx.fillStyle = WorldMapSystem.fountainUsed ? '#cfd8dc' : '#80d8ff';
         ctx.fillText(WorldMapSystem.fountainUsed ? '⛲ 泉水已飲盡' : '⛲ 神聖治療之泉', 345, 118);
 
         // ⛺ 神秘流浪商人 (右上營地)
         ctx.fillStyle = '#6a1b9a';
         ctx.beginPath(); ctx.moveTo(535, 78); ctx.lineTo(505, 120); ctx.lineTo(565, 120); ctx.closePath(); ctx.fill();
         ctx.strokeStyle = '#ffca28'; ctx.stroke();
         ctx.fillStyle = '#000';
         ctx.fillRect(465, 58, 140, 18);
         ctx.fillStyle = '#ea80fc';
         ctx.fillText('⛺ 神秘商人(🟡80換稀有)', 535, 71);
 
         // 2. 繪製黃金寶箱 🎁
         WorldMapSystem.chests.forEach(ch => {
             ctx.fillStyle = ch.opened ? '#5d4037' : '#d84315';
             ctx.fillRect(ch.x, ch.y, 32, 24);
             ctx.strokeStyle = '#ffca28';
             ctx.lineWidth = 2;
             ctx.strokeRect(ch.x, ch.y, 32, 24);
             ctx.fillStyle = '#ffeb3b';
             ctx.fillRect(ch.x + 12, ch.y + 8, 8, 6);
             ctx.fillStyle = '#fff';
             ctx.fillText(ch.opened ? '空寶箱' : '🎁 黃金寶箱', ch.x + 16, ch.y - 5);
 
             // 主角觸碰開啟寶箱
             if (!ch.opened && Math.hypot(State.mapX - ch.x, State.mapY - ch.y) < 40) {
                 ch.opened = true;
                 AudioSystem.playSFX('win');
                 const bonusGold = 65 + State.stageIdx * 20;
                 State.gold += bonusGold;
                 const matKey = st.dropPool[Math.floor(Math.random() * st.dropPool.length)];
                 GameState.materials[matKey] = (GameState.materials[matKey] || 0) + 2;
                 const mInfo = MaterialsCatalog[matKey];
                 State.heroBuffText = `🎁 開啟寶箱！獲 🟡${bonusGold} ＋ ${mInfo.icon}${mInfo.name}x2！`;
                 State.heroBuffTimer = 75;
                 callbacks.onSync();
             }
         });
 
         // 3. 檢查治療之泉與神秘商人互動
         if (!WorldMapSystem.fountainUsed && Math.hypot(State.mapX - 330, State.mapY - 130) < 42) {
             WorldMapSystem.fountainUsed = true;
             AudioSystem.playSFX('win');
             State.heroHp = State.heroMaxHp;
             State.heroMp = State.heroMaxMp;
             State.shieldLayers += 1;
             State.heroBuffText = '⛲ 飲用聖泉！HP/SP全滿 ＋ 先手護盾+1！';
             State.heroBuffTimer = 75;
         }
 
         if (State.stepCooldown <= 0 && Math.hypot(State.mapX - 520, State.mapY - 105) < 40) {
             State.stepCooldown = 80;
             State.targetX = 520; State.targetY = 175;
             if (State.gold >= 80 && st.rareDrop) {
                 if (confirm(`⛺ 神秘流浪商人：\n「守護者，要用 🟡 80 金幣購買本章傳說稀有素材【${MaterialsCatalog[st.rareDrop].name}】x1 嗎？」`)) {
                     AudioSystem.playSFX('craft');
                     State.gold -= 80;
                     GameState.materials[st.rareDrop] = (GameState.materials[st.rareDrop] || 0) + 1;
                     State.heroBuffText = `🌟 購得稀有素材【${MaterialsCatalog[st.rareDrop].name}】+1！`;
                     State.heroBuffTimer = 75;
                     callbacks.onSync();
                 }
             } else {
                 AudioSystem.playSFX('click');
                 State.heroBuffText = '⛺ 商人：帶夠 🟡80 金幣再來買稀有素材吧！';
                 State.heroBuffTimer = 60;
             }
         }
 
         // 4. 更新並繪製移動巡邏魔物 👾
         WorldMapSystem.roamingMobs.forEach(mob => {
             mob.x += mob.vx;
             mob.y += mob.vy;
             if (mob.x < mob.minX || mob.x > mob.maxX) mob.vx *= -1;
             if (mob.y < mob.minY || mob.y > mob.maxY) mob.vy *= -1;
 
             drawMatrixOnCtx(ctx, mob.sprite, mob.x, mob.y, 4);
             ctx.fillStyle = '#ffeb3b';
             ctx.font = 'bold 11px "DotGothic16", monospace';
             ctx.fillText(`🐾巡邏:${mob.name}`, mob.x + 24, mob.y - 6);
 
             if (State.stepCooldown <= 0 && Math.hypot(State.mapX - mob.x, State.mapY - mob.y) < 38) {
                 State.stepCooldown = 65;
                 callbacks.onTriggerBattle(false);
             }
         });
 
         // 5. 繪製章節環境粒子特效 (飄花/風沙/螢光/火星/飄雪)
         const pColors = {
             grassland: '#f48fb1',
             ruins: '#ffe082',
             mine: '#00e5ff',
             volcano: '#ff5722',
             snowfield: '#ffffff',
             library: '#ce93d8'
         };
         ctx.fillStyle = pColors[st.theme] || '#ffffff';
         WorldMapSystem.particles.forEach(p => {
             p.x += p.vx;
             p.y += p.vy;
             if (p.y > 540) { p.y = 0; p.x = Math.random() * 960; }
             if (p.x > 960) p.x = 0;
             if (p.x < 0) p.x = 960;
             ctx.fillRect(p.x, p.y, p.size, p.size);
         });
     }
 };