/**
 * 音效、8-bit 背景音樂 (BGM) 與中英雙語朗讀模組 (src/systems/audio.js)
 * 新增：stopSpeech() 關閉視窗立即停止語音、speakText() 獨立朗讀答案選項
 */
 import { GameState } from '../core/state.js';
 import { SubjectMeta } from '../data/questions.js';
 
 let audioCtx = null;
 let bgmTimer = null;
 let bgmStep = 0;
 let currentBgmTheme = 'explore';
 
 const MELODY_EXPLORE = [
     261.63, 329.63, 392.00, 523.25, 392.00, 329.63,
     293.66, 349.23, 440.00, 587.33, 440.00, 349.23,
     329.63, 392.00, 493.88, 659.25, 493.88, 392.00,
     261.63, 329.63, 392.00, 523.25, 392.00, 261.63
 ];
 
 const MELODY_COMBAT = [
     220.00, 220.00, 261.63, 293.66, 329.63, 293.66, 261.63, 246.94,
     196.00, 196.00, 246.94, 293.66, 349.23, 329.63, 293.66, 261.63
 ];
 
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
     startBGM: (theme = currentBgmTheme) => {
         currentBgmTheme = theme;
         if (!GameState.settings.bgm) {
             AudioSystem.stopBGM();
             return;
         }
         try {
             getAudioContext();
             if (bgmTimer) clearInterval(bgmTimer);
 
             const intervalMs = (currentBgmTheme === 'combat') ? 210 : 320;
             bgmTimer = setInterval(() => {
                 if (!GameState.settings.bgm) {
                     AudioSystem.stopBGM();
                     return;
                 }
                 const ctx = getAudioContext();
                 const now = ctx.currentTime;
                 const notes = (currentBgmTheme === 'combat') ? MELODY_COMBAT : MELODY_EXPLORE;
                 const freq = notes[bgmStep % notes.length];
                 bgmStep++;
 
                 const osc = ctx.createOscillator();
                 const gain = ctx.createGain();
                 osc.type = (currentBgmTheme === 'combat') ? 'square' : 'triangle';
                 osc.frequency.setValueAtTime(freq, now);
 
                 gain.gain.setValueAtTime(0.03, now);
                 gain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 0.9);
 
                 osc.connect(gain);
                 gain.connect(ctx.destination);
                 osc.start(now);
                 osc.stop(now + (intervalMs / 1000));
             }, intervalMs);
         } catch (e) {
             console.warn('BGM 啟動略過:', e);
         }
     },
 
     stopBGM: () => {
         if (bgmTimer) {
             clearInterval(bgmTimer);
             bgmTimer = null;
         }
     },
 
     playSFX: (type) => {
         if (!GameState.settings.sfx) return;
         try {
             const ctx = getAudioContext();
             const now = ctx.currentTime;
 
             if (type === 'correct') {
                 const osc = ctx.createOscillator();
                 const gain = ctx.createGain();
                 osc.type = 'triangle';
                 osc.frequency.setValueAtTime(523.25, now);
                 osc.frequency.setValueAtTime(659.25, now + 0.08);
                 osc.frequency.setValueAtTime(783.99, now + 0.16);
                 gain.gain.setValueAtTime(0.18, now);
                 gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                 osc.connect(gain);
                 gain.connect(ctx.destination);
                 osc.start(now);
                 osc.stop(now + 0.36);
 
             } else if (type === 'wrong') {
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
 
     // 立即停止所有正在播放的語音朗讀 (關閉問題視窗時呼叫)
     stopSpeech: () => {
         if ('speechSynthesis' in window) {
             window.speechSynthesis.cancel();
         }
     },
 
     // 朗讀整條題目
     speakQuestion: (questionObj) => {
         if (!questionObj || !('speechSynthesis' in window)) return;
         window.speechSynthesis.cancel();
 
         const subInfo = SubjectMeta[questionObj.subject] || SubjectMeta.chi;
         const utter = new SpeechSynthesisUtterance(questionObj.ttsText || questionObj.prompt);
         utter.lang = subInfo.lang;
 
         if (subInfo.lang.startsWith('en')) {
             utter.rate = GameState.settings.enSpeed || 0.8;
         } else {
             utter.rate = GameState.settings.zhSpeed || 1.0;
         }
 
         window.speechSynthesis.speak(utter);
     },
 
     // 獨立朗讀單一選項文字 (例如英文答案按鈕旁的 🔊 鍵)
     speakText: (text, subject = 'eng') => {
         if (!text || !('speechSynthesis' in window)) return;
         window.speechSynthesis.cancel();
 
         const subInfo = SubjectMeta[subject] || SubjectMeta.eng;
         const utter = new SpeechSynthesisUtterance(text);
         utter.lang = subInfo.lang;
 
         if (subInfo.lang.startsWith('en')) {
             utter.rate = GameState.settings.enSpeed || 0.8;
         } else {
             utter.rate = GameState.settings.zhSpeed || 1.0;
         }
 
         window.speechSynthesis.speak(utter);
     }
 };
