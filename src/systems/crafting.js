/**
 * 冒險書、鐵匠合成與錯題煉金模組 (src/systems/crafting.js)
 */
 import { GameState, StateManager } from '../core/state.js';
 import { MaterialsCatalog, EquipmentCatalog } from '../data/items.js';
 import { QuestionBank, normalizeQuestion } from '../data/questions.js';
 import { AudioSystem } from './audio.js';
 
 export const CraftingSystem = {
     // 打開跨頁冒險書並刷新所有資料
     openBookModal: (defaultTab = 'tab-craft', hudUpdater) => {
         AudioSystem.playSFX('click');
         CraftingSystem.renderPaperDoll();
         CraftingSystem.renderCraftTab(hudUpdater);
         CraftingSystem.renderBagTab();
         CraftingSystem.renderMistakesTab(hudUpdater);
 
         // 切換至指定分頁
         document.querySelectorAll('.tab-btn').forEach(b => {
             b.classList.toggle('active', b.dataset.tab === defaultTab);
         });
         document.querySelectorAll('.tab-panel').forEach(p => {
             p.classList.toggle('active', p.id === defaultTab);
         });
 
         document.getElementById('modal-book').classList.add('active');
     },
 
     // 渲染左頁：紙娃娃與 4 大核心裝備槽
     renderPaperDoll: () => {
         const stats = StateManager.getComputedStats({ Equipment: EquipmentCatalog });
         document.getElementById('doll-preview').innerText = stats.icon;
 
         const wep = EquipmentCatalog[GameState.equipment.weapon];
         const arm = EquipmentCatalog[GameState.equipment.armor];
         const rel = EquipmentCatalog[GameState.equipment.relic];
         const pot = EquipmentCatalog[GameState.equipment.potion];
 
         document.getElementById('eq-weapon-name').innerText = wep ? wep.name : '無';
         document.getElementById('eq-armor-name').innerText  = arm ? arm.name : '無';
         document.getElementById('eq-relic-name').innerText  = rel ? rel.name : '💍 無';
         document.getElementById('eq-potion-name').innerText = pot ? pot.name : '無';
     },
 
     // 渲染右頁分頁 1：鐵匠鍛造與裝備切換
     renderCraftTab: (hudUpdater) => {
         const container = document.getElementById('craft-recipe-list');
         container.innerHTML = '';
 
         Object.values(EquipmentCatalog).forEach(item => {
             if (!item.recipe) return; // 略過初始免費裝備
 
             const isUnlocked = GameState.unlockedEquipment.includes(item.id);
             const isEquipped = GameState.equipment[item.slot] === item.id;
 
             // 檢查材料與金幣是否足夠
             let canCraft = true;
             const reqParts = [];
             for (const [matKey, needCount] of Object.entries(item.recipe)) {
                 if (matKey === 'gold') {
                     const hasGold = GameState.gold >= needCount;
                     if (!hasGold) canCraft = false;
                     reqParts.push(`💰金幣 ${GameState.gold}/${needCount}`);
                 } else {
                     const matInfo = MaterialsCatalog[matKey];
                     const haveCount = GameState.materials[matKey] || 0;
                     if (haveCount < needCount) canCraft = false;
                     reqParts.push(`${matInfo.icon}${matInfo.name} ${haveCount}/${needCount}`);
                 }
             }
 
             const card = document.createElement('div');
             card.className = 'recipe-card';
 
             let actionBtnHtml = '';
             if (isEquipped) {
                 actionBtnHtml = `<button class="pixel-btn btn-small" disabled>✅ 已裝備</button>`;
             } else if (isUnlocked) {
                 actionBtnHtml = `<button class="pixel-btn btn-green btn-small" data-equip="${item.id}">🛡️ 穿戴</button>`;
             } else {
                 actionBtnHtml = `<button class="pixel-btn btn-gold btn-small" data-craft="${item.id}" ${canCraft ? '' : 'disabled'}>🔨 鍛造</button>`;
             }
 
             card.innerHTML = `
                 <div class="recipe-info">
                     <strong>${item.name}</strong>
                     <p style="font-size:12px; color:#4e342e; margin:2px 0;">${item.desc}</p>
                     <small class="req-text">${isUnlocked ? '✨ 已解鎖配方' : '需求：' + reqParts.join(' ＋ ')}</small>
                 </div>
                 <div>${actionBtnHtml}</div>
             `;
             container.appendChild(card);
         });
 
         // 綁定鍛造按鈕事件
         container.querySelectorAll('[data-craft]').forEach(btn => {
             btn.addEventListener('click', () => {
                 const itemId = btn.dataset.craft;
                 CraftingSystem.craftItem(itemId, hudUpdater);
             });
         });
 
         // 綁定穿戴按鈕事件
         container.querySelectorAll('[data-equip]').forEach(btn => {
             btn.addEventListener('click', () => {
                 const itemId = btn.dataset.equip;
                 const item = EquipmentCatalog[itemId];
                 GameState.equipment[item.slot] = itemId;
                 // 若該武器有專屬推薦職業，自動切換至該職業流派
                 if (item.forClass) {
                     GameState.heroClass = item.forClass;
                 }
                 AudioSystem.playSFX('correct');
                 StateManager.saveGame();
                 if (hudUpdater) hudUpdater();
                 CraftingSystem.renderPaperDoll();
                 CraftingSystem.renderCraftTab(hudUpdater);
             });
         });
     },
 
     // 執行扣除材料與鍛造裝備
     craftItem: (itemId, hudUpdater) => {
         const item = EquipmentCatalog[itemId];
         if (!item || !item.recipe) return;
 
         for (const [matKey, needCount] of Object.entries(item.recipe)) {
             if (matKey === 'gold') {
                 GameState.gold -= needCount;
             } else {
                 GameState.materials[matKey] -= needCount;
             }
         }
 
         GameState.unlockedEquipment.push(itemId);
         GameState.equipment[item.slot] = itemId; // 鍛造完成自動穿戴
         if (item.forClass) {
             GameState.heroClass = item.forClass;
         }
 
         AudioSystem.playSFX('craft');
         StateManager.saveGame();
         if (hudUpdater) hudUpdater();
         CraftingSystem.renderPaperDoll();
         CraftingSystem.renderCraftTab(hudUpdater);
         CraftingSystem.renderBagTab();
     },
 
     // 渲染右頁分頁 2：素材背包圖鑑
     renderBagTab: () => {
         const grid = document.getElementById('bag-material-grid');
         grid.innerHTML = '';
         Object.values(MaterialsCatalog).forEach(mat => {
             const count = GameState.materials[mat.id] || 0;
             const box = document.createElement('div');
             box.className = 'mat-box';
             box.innerHTML = `
                 <div style="font-weight:900;">${mat.icon} ${mat.name}: <b style="color:#d84315;">${count}</b></div>
                 <div style="font-size:11px; color:#6d4c41; margin-top:2px;">${mat.desc}</div>
             `;
             grid.appendChild(box);
         });
     },
 
     // 渲染右頁分頁 3：錯題煉金爐 (重溫錯題賺智慧結晶)
     renderMistakesTab: (hudUpdater) => {
         const container = document.getElementById('mistake-list-container');
         container.innerHTML = '';
 
         if (GameState.mistakes.length === 0) {
             container.innerHTML = `<div class="empty-msg" style="padding:20px; text-align:center; color:#5d4037; font-weight:bold;">🎉 目前沒有錯題紀錄，你的知識防線非常穩固！</div>`;
             return;
         }
 
         GameState.mistakes.forEach(qId => {
             const rawQ = QuestionBank.find(q => q.id === qId);
             if (!rawQ) return;
             const normQ = normalizeQuestion(rawQ);
 
             const itemDiv = document.createElement('div');
             itemDiv.className = 'recipe-card';
             itemDiv.style.flexDirection = 'column';
             itemDiv.style.alignItems = 'stretch';
             itemDiv.style.gap = '6px';
 
             const optsHtml = normQ.options.map(opt => 
                 `<button class="pixel-btn btn-parchment btn-small mistake-ans-btn" data-ans="${opt}">${opt}</button>`
             ).join(' ');
 
             itemDiv.innerHTML = `
                 <div><strong>❓ ${normQ.prompt}</strong></div>
                 <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">${optsHtml}</div>
             `;
 
             itemDiv.querySelectorAll('.mistake-ans-btn').forEach(btn => {
                 btn.addEventListener('click', () => {
                     if (btn.dataset.ans === normQ.answer) {
                         AudioSystem.playSFX('win');
                         StateManager.resolveMistake(qId);
                         StateManager.saveGame();
                         if (hudUpdater) hudUpdater();
                         CraftingSystem.renderMistakesTab(hudUpdater);
                     } else {
                         AudioSystem.playSFX('wrong');
                         btn.style.background = '#ef5350';
                         btn.style.color = '#fff';
                     }
                 });
             });
 
             container.appendChild(itemDiv);
         });
     }
 };
