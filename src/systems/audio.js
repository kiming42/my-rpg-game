/**
 * 音效、8-bit 背景音樂 (BGM) 與雙語朗讀模組 (src/systems/audio.js)
 * 升級：新增角色成功出招爆發音效 (cast_attack)、答錯失手音效與寶箱音效
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
 
                 gain.gain.setValueAtTime(0.028, now);
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
                 // 清脆答對叮咚聲
                 const osc = ctx.createOscillator();
                 const gain = ctx.createGain();
                 osc.type = 'triangle';
                 osc.frequency.setValueAtTime(523.25, now);
                 osc.frequency.setValueAtTime(659.25, now + 0.07);
                 osc.frequency.setValueAtTime(1046.50, now + 0.14);
                 gain.gain.setValueAtTime(0.22, now);
                 gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                 osc.connect(gain);
                 gain.connect(ctx.destination);
                 osc.start(now);
                 osc.stop(now + 0.36);
 
             } else if (type === 'cast_attack') {
                 // ⚔️ 角色成功出招音效：蓄力上揚音 + 劍氣/法術爆發音
                 const osc1 = ctx.createOscillator();
                 const gain1 = ctx.createGain();
                 osc1.type = 'square';
                 osc1.frequency.setValueAtTime(280, now);
                 osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18);
                 gain1.gain.setValueAtTime(0.2, now);
                 gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                 osc1.connect(gain1);
                 gain1.connect(ctx.destination);
                 osc1.start(now);
                 osc1.stop(now + 0.21);
 
                 // 爆發重擊低音
                 const osc2 = ctx.createOscillator();
                 const gain2 = ctx.createGain();
                 osc2.type = 'sawtooth';
                 osc2.frequency.setValueAtTime(420, now + 0.18);
                 osc2.frequency.exponentialRampToValueAtTime(65, now + 0.45);
                 gain2.gain.setValueAtTime(0.25, now + 0.18);
                 gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
                 osc2.connect(gain2);
                 gain2.connect(ctx.destination);
                 osc2.start(now + 0.18);
                 osc2.stop(now + 0.47);
 
             } else if (type === 'wrong') {
                 // ❌ 答錯失手音效：雙重下降低音警報 (Buzzer)
                 [0, 0.16].forEach((offset, idx) => {
                     const osc = ctx.createOscillator();
                     const gain = ctx.createGain();
                     osc.type = 'sawtooth';
                     const startFreq = idx === 0 ? 185 : 145;
                     osc.frequency.setValueAtTime(startFreq, now + offset);
                     osc.frequency.linearRampToValueAtTime(startFreq - 45, now + offset + 0.14);
                     gain.gain.setValueAtTime(0.22, now + offset);
                     gain.gain.linearRampToValueAtTime(0.001, now + offset + 0.15);
                     osc.connect(gain);
                     gain.connect(ctx.destination);
                     osc.start(now + offset);
                     osc.stop(now + offset + 0.16);
                 });
 
             } else if (type === 'craft' || type === 'win') {
                 const notes = [440, 554.37, 659.25, 880];
                 notes.forEach((freq, idx) => {
                     const osc = ctx.createOscillator();
                     const gain = ctx.createGain();
                     osc.type = 'square';
                     osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                     gain.gain.setValueAtTime(0.14, now + idx * 0.08);
                     gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
                     osc.connect(gain);
                     gain.connect(ctx.destination);
                     osc.start(now + idx * 0.08);
                     osc.stop(now + idx * 0.08 + 0.2);
                 });
             } else if (type === 'click') {
                 const osc = ctx.createOscillator();
                 const gain = ctx.createGain();
                 osc.type = 'sine';
                 osc.frequency.setValueAtTime(620, now);
                 gain.gain.setValueAtTime(0.09, now);
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
 
     stopSpeech: () => {
         if ('speechSynthesis' in window) {
             window.speechSynthesis.cancel();
         }
     },
 
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