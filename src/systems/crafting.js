/**
 * 鍛造工坊與藥水鍊金模組 (src/systems/crafting.js)
 * 實現：武器、護具、飾品的「雙層精細分類」篩選與製作邏輯
 */
 import { EquipmentCatalog, PotionsCatalog, MaterialsCatalog, ClassNamesMap } from '../data/items.js';
 import { AudioSystem } from './audio.js';
 
 export const CraftingSystem = {
     // 渲染鐵匠工坊右頁內容 (支援雙層細分篩選)
     renderForgeView: (State, GameState, renderCallback) => {
         const subTab = State.forgeSubTab; // 'weapon', 'armor', 'relic', 'potion'
         const filterSub = State.forgeFilterSub || 'all'; // 子分類
 
         const forgeList = document.getElementById('book-forge-list');
         if (!forgeList) return;
         forgeList.innerHTML = '';
 
         // 1. 若為煉藥分頁
         if (subTab === 'potion') {
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
                         reqs.push(`${m ? m.icon : ''}${m ? m.name : k} ${have}/${need}`);
                     }
                 }
 
                 const card = document.createElement('div');
                 card.className = 'forge-card';
                 card.innerHTML = `
                     <div>
                         <strong style="font-size:12px; color:#1b5e20;">${pot.name} (持有: ${held})</strong>
                         <div style="color:#241409; font-weight:bold;">${pot.desc}</div>
                         <small style="color:#b71c1c; font-weight:bold;">材料：${reqs.join(' ＋ ')}</small>
                     </div>
                     <button class="px-gold-btn" style="padding:5px 10px; font-size:11px;" ${canCraft ? '' : 'disabled'}>
                         ⚗️ 調配 +1
                     </button>
                 `;
 
                 card.querySelector('button').addEventListener('click', () => {
                     AudioSystem.playSFX('craft');
                     for (const [k, need] of Object.entries(pot.recipe)) {
                         if (k === 'gold') State.gold -= need;
                         else GameState.materials[k] -= need;
                     }
                     State.potions[pot.id] = (State.potions[pot.id] || 0) + 1;
                     if (renderCallback) renderCallback();
                 });
                 forgeList.appendChild(card);
             });
             return;
         }
 
         // 2. 裝備分頁 (武器 / 護具 / 飾品) ➔ 顯示第二層子分類篩選列
         let subFilterHtml = '';
         if (subTab === 'weapon') {
             subFilterHtml = `
                 <div class="forge-sub-filter-row">
                     <button class="sub-filt-btn ${filterSub === 'all' ? 'active' : ''}" data-sub="all">全部武器</button>
                     <button class="sub-filt-btn ${filterSub === 'warrior' ? 'active' : ''}" data-sub="warrior">🛡️劍士</button>
                     <button class="sub-filt-btn ${filterSub === 'mage' ? 'active' : ''}" data-sub="mage">🪄法師</button>
                     <button class="sub-filt-btn ${filterSub === 'ranger' ? 'active' : ''}" data-sub="ranger">🏹遊俠</button>
                     <button class="sub-filt-btn ${filterSub === 'cleric' ? 'active' : ''}" data-sub="cleric">🌿神官</button>
                     <button class="sub-filt-btn ${filterSub === 'offhand' ? 'active' : ''}" data-sub="offhand">🛡️副手/盾</button>
                 </div>
             `;
         } else if (subTab === 'armor') {
             subFilterHtml = `
                 <div class="forge-sub-filter-row">
                     <button class="sub-filt-btn ${filterSub === 'all' ? 'active' : ''}" data-sub="all">全部護具</button>
                     <button class="sub-filt-btn ${filterSub === 'head' ? 'active' : ''}" data-sub="head">🪖頭盔</button>
                     <button class="sub-filt-btn ${filterSub === 'armor' ? 'active' : ''}" data-sub="armor">👕胸甲</button>
                     <button class="sub-filt-btn ${filterSub === 'gloves' ? 'active' : ''}" data-sub="gloves">🧤護手</button>
                     <button class="sub-filt-btn ${filterSub === 'legs' ? 'active' : ''}" data-sub="legs">🦵護腿</button>
                     <button class="sub-filt-btn ${filterSub === 'boots' ? 'active' : ''}" data-sub="boots">🥾戰靴</button>
                 </div>
             `;
         } else if (subTab === 'relic') {
             subFilterHtml = `
                 <div class="forge-sub-filter-row">
                     <button class="sub-filt-btn ${filterSub === 'all' ? 'active' : ''}" data-sub="all">全部飾品</button>
                     <button class="sub-filt-btn ${filterSub === 'neck' ? 'active' : ''}" data-sub="neck">📿項鍊</button>
                     <button class="sub-filt-btn ${filterSub === 'ring' ? 'active' : ''}" data-sub="ring">💍戒指</button>
                     <button class="sub-filt-btn ${filterSub === 'relic' ? 'active' : ''}" data-sub="relic">👑遺物</button>
                 </div>
             `;
         }
 
         const filterContainer = document.createElement('div');
         filterContainer.innerHTML = subFilterHtml;
         forgeList.appendChild(filterContainer);
 
         // 綁定第二層子分類按鈕事件
         forgeList.querySelectorAll('.sub-filt-btn').forEach(btn => {
             btn.addEventListener('click', () => {
                 AudioSystem.playSFX('click');
                 State.forgeFilterSub = btn.dataset.sub;
                 CraftingSystem.renderForgeView(State, GameState, renderCallback);
             });
         });
 
         // 篩選裝備清單
         const rawItems = Object.values(EquipmentCatalog).filter(item => item.recipe && item.category === subTab);
         const filteredItems = rawItems.filter(item => {
             if (filterSub === 'all') return true;
             if (subTab === 'weapon') {
                 if (filterSub === 'offhand') return item.slot === 'offhand';
                 return item.forClass === filterSub;
             } else if (subTab === 'armor') {
                 if (filterSub === 'gloves') return item.slot === 'gloves_l' || item.slot === 'gloves_r';
                 return item.slot === filterSub;
             } else if (subTab === 'relic') {
                 if (filterSub === 'neck') return item.slot === 'neck';
                 if (filterSub === 'ring') return item.slot === 'ring1' || item.slot === 'ring2';
                 if (filterSub === 'relic') return item.slot === 'relic1' || item.slot === 'relic2';
             }
             return true;
         });
 
         filteredItems.forEach(item => {
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
                     reqs.push(`${m ? m.icon : ''}${m ? m.name : k} ${have}/${need}`);
                 }
             }
 
             const clsBadge = item.forClass
                 ? `<span style="background:${isMyClass ? '#2e7d32' : '#757575'}; color:#fff; padding:1px 5px; font-size:10px; margin-left:4px;">${ClassNamesMap[item.forClass]}</span>`
                 : `<span style="background:#1565c0; color:#fff; padding:1px 5px; font-size:10px; margin-left:4px;">全職</span>`;
 
             const card = document.createElement('div');
             card.className = 'forge-card';
             card.innerHTML = `
                 <div>
                     <strong style="font-size:12px; color:#4a2311;">${item.name} ${clsBadge}</strong>
                     <div style="color:#2e7d32; font-weight:bold;">${item.desc}</div>
                     <small style="color:#b71c1c; font-weight:bold;">${isUnlocked ? '✨ 已擁有' : '需求：' + reqs.join(' ＋ ')}</small>
                 </div>
                 <button class="px-orange-action-btn" style="flex:0; padding:5px 10px;" ${(!canCraft || isUnlocked) ? 'disabled' : ''}>
                     ${isUnlocked ? '已擁有' : '🔨 鍛造'}
                 </button>
             `;
 
             const btn = card.querySelector('button');
             if (!isUnlocked && canCraft) {
                 btn.addEventListener('click', () => {
                     AudioSystem.playSFX('craft');
                     for (const [k, need] of Object.entries(item.recipe)) {
                         if (k === 'gold') State.gold -= need;
                         else GameState.materials[k] -= need;
                     }
                     GameState.unlockedEquipment.push(item.id);
                     if (isMyClass && item.slot && !GameState.equipment[item.slot]) {
                         GameState.equipment[item.slot] = item.id;
                     }
                     if (renderCallback) renderCallback();
                 });
             }
             forgeList.appendChild(card);
         });
     }
 };