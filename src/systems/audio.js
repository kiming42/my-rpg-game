/**
 * 音效、8-bit 背景音樂 (BGM) 與中英雙語朗讀模組 (src/systems/audio.js)
 */
import { GameState } from '../core/state.js';
import { SubjectMeta } from '../data/questions.js';

let audioCtx = null;
let bgmTimer = null;
let bgmStep = 0;
let currentBgmTheme = 'explore'; // 'explore' | 'combat'

// 輕快奇幻探索旋律 (音高頻率 Hz)
const MELODY_EXPLORE = [
    261.63, 329.63, 392.00, 523.25, 392.00, 329.63,
    293.66, 349.23, 440.00, 587.33, 440.00, 349.23,
    329.63, 392.00, 493.88, 659.25, 493.88, 392.00,
    261.63, 329.63, 392.00, 523.25, 392.00, 261.63
];

// 緊湊刺激戰鬥旋律 (音高頻率 Hz)
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
    // 啟動或切換 8-bit 背景音樂 (BGM)
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

                // 柔和背景音量，不掩蓋語音朗讀與戰鬥音效
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

    // 停止背景音樂
    stopBGM: () => {
        if (bgmTimer) {
            clearInterval(bgmTimer);
            bgmTimer = null;
        }
    },

    // 播放 8-bit 復古合成音效
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

    // 手動語音朗讀 (支援中英雙語與語速設定)
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
    }
};
