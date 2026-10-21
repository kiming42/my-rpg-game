/**
 * 音效與語音朗讀模組 (src/systems/audio.js)
 */
 import { GameState } from '../core/state.js';
 import { SubjectMeta } from '../data/questions.js';
 
 let audioCtx = null;
 
 function getAudioContext() {
     if (!audioCtx) {
         const AudioContextClass = window.AudioContext || window.webkitAudioContext;
         audioCtx = new AudioContextClass();
     }
     if (audioCtx.state === 'suspended') {
         audioCtx.resume();
     }
     return audioCtx;
 }
 
 export const AudioSystem = {
     // 播放 8-bit 復古合成音效
     playSFX: (type) => {
         if (!GameState.settings.sfx) return;
         try {
             const ctx = getAudioContext();
             const now = ctx.currentTime;
 
             if (type === 'correct') {
                 // 清脆雙音階上升 (金幣/答對叮噹聲)
                 const osc = ctx.createOscillator();
                 const gain = ctx.createGain();
                 osc.type = 'triangle';
                 osc.frequency.setValueAtTime(523.25, now);       // C5
                 osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                 osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                 gain.gain.setValueAtTime(0.18, now);
                 gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                 osc.connect(gain);
                 gain.connect(ctx.destination);
                 osc.start(now);
                 osc.stop(now + 0.36);
 
             } else if (type === 'wrong') {
                 // 低沉柔和降音 (受擊/答錯聲)
                 const osc = ctx.createOscillator();
                 const gain = ctx.createGain();
                 osc.type = 'sawtooth';
                 osc.frequency.setValueAtTime(190, now);
                 osc.frequency.linearRampToValueAtTime(95, now + 0.28);
                 gain.gain.setValueAtTime(0.15, now);
                 gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
                 osc.connect(gain);
                 gain.connect(ctx.destination);
                 osc.start(now);
                 osc.stop(now + 0.32);
 
             } else if (type === 'craft' || type === 'win') {
                 // 鐵匠合成 / 戰鬥勝利號角
                 const notes = [440, 554.37, 659.25, 880];
                 notes.forEach((freq, idx) => {
                     const osc = ctx.createOscillator();
                     const gain = ctx.createGain();
                     osc.type = 'square';
                     osc.frequency.setValueAtTime(freq, now + idx * 0.09);
                     gain.gain.setValueAtTime(0.12, now + idx * 0.09);
                     gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.18);
                     osc.connect(gain);
                     gain.connect(ctx.destination);
                     osc.start(now + idx * 0.09);
                     osc.stop(now + idx * 0.09 + 0.2);
                 });
             } else if (type === 'click') {
                 const osc = ctx.createOscillator();
                 const gain = ctx.createGain();
                 osc.type = 'sine';
                 osc.frequency.setValueAtTime(600, now);
                 gain.gain.setValueAtTime(0.08, now);
                 gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                 osc.connect(gain);
                 gain.connect(ctx.destination);
                 osc.start(now);
                 osc.stop(now + 0.06);
             }
         } catch (e) {
             console.warn('音效播放略過:', e);
         }
     },
 
     // 按鍵觸發手動語音朗讀 (支援中英雙語與獨立語速)
     speakQuestion: (questionObj) => {
         if (!questionObj || !('speechSynthesis' in window)) return;
         window.speechSynthesis.cancel();
 
         const subInfo = SubjectMeta[questionObj.subject] || SubjectMeta.chi;
         const utter = new SpeechSynthesisUtterance(questionObj.ttsText || questionObj.prompt);
         utter.lang = subInfo.lang;
 
         // 根據科目套用對應語速
         if (subInfo.lang.startsWith('en')) {
             utter.rate = GameState.settings.enSpeed || 0.75;
         } else {
             utter.rate = GameState.settings.zhSpeed || 1.0;
         }
 
         window.speechSynthesis.speak(utter);
     }
 };