// Audio management for Thread of Fate game

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicGain = null;
        this.sfxGain = null;
        this.isMuted = false;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.currentMusic = null;
    }

    // Initialize audio context and gain nodes
    async init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes for volume control
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();
            
            this.musicGain.connect(this.audioContext.destination);
            this.sfxGain.connect(this.audioContext.destination);
            
            this.musicGain.gain.value = this.musicVolume;
            this.sfxGain.gain.value = this.sfxVolume;
            
            // Generate retro sound effects
            this.generateSounds();
            
            console.log('Audio system initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    // Generate retro-style sound effects using Web Audio API
    generateSounds() {
        if (!this.audioContext) return;

        // Movement sound (short beep)
        this.sounds.move = this.createTone(200, 0.05, 'square');
        
        // Thread stretch sound (rising tone)
        this.sounds.threadStretch = this.createTone(150, 0.1, 'sawtooth', true);
        
        // Thread break sound (harsh noise)
        this.sounds.threadBreak = this.createNoise(0.3, 0.2);
        
        // Collect/win sound (ascending notes)
        this.sounds.win = this.createWinSound();
        
        // Level complete sound
        this.sounds.levelComplete = this.createLevelCompleteSound();
        
        // Enemy hit sound
        this.sounds.enemyHit = this.createTone(100, 0.2, 'triangle');
        
        // Button press sound
        this.sounds.button = this.createTone(300, 0.05, 'square');
    }

    // Create a simple tone
    createTone(frequency, duration, waveType = 'sine', rising = false) {
        return () => {
            if (!this.audioContext || this.isMuted) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            if (rising) {
                oscillator.frequency.exponentialRampToValueAtTime(
                    frequency * 2, 
                    this.audioContext.currentTime + duration
                );
            }
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.sfxGain);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    // Create noise for harsh sound effects
    createNoise(volume, duration) {
        return () => {
            if (!this.audioContext || this.isMuted) return;
            
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate white noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * volume;
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = buffer;
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            source.connect(gainNode);
            gainNode.connect(this.sfxGain);
            
            source.start(this.audioContext.currentTime);
        };
    }

    // Create win sound (ascending notes)
    createWinSound() {
        return () => {
            if (!this.audioContext || this.isMuted) return;
            
            const notes = [262, 330, 392, 523]; // C4, E4, G4, C5
            const noteDuration = 0.15;
            
            notes.forEach((frequency, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noteDuration);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.sfxGain);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + noteDuration);
                }, index * 100);
            });
        };
    }

    // Create level complete sound
    createLevelCompleteSound() {
        return () => {
            if (!this.audioContext || this.isMuted) return;
            
            // Play a fanfare-like sequence
            const sequence = [
                {freq: 392, start: 0, duration: 0.2},
                {freq: 523, start: 0.2, duration: 0.2},
                {freq: 659, start: 0.4, duration: 0.2},
                {freq: 784, start: 0.6, duration: 0.4}
            ];
            
            sequence.forEach(note => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.type = 'square';
                    oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + note.duration);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.sfxGain);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + note.duration);
                }, note.start * 1000);
            });
        };
    }

    // Play a sound effect
    playSound(soundName) {
        if (this.sounds[soundName] && !this.isMuted) {
            try {
                this.sounds[soundName]();
            } catch (error) {
                console.warn(`Failed to play sound ${soundName}:`, error);
            }
        }
    }

    // Resume audio context (required for mobile browsers)
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('Audio context resumed');
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }

    // Toggle mute state
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.musicGain && this.sfxGain) {
            const musicVolume = this.isMuted ? 0 : this.musicVolume;
            const sfxVolume = this.isMuted ? 0 : this.sfxVolume;
            
            this.musicGain.gain.setValueAtTime(musicVolume, this.audioContext.currentTime);
            this.sfxGain.gain.setValueAtTime(sfxVolume, this.audioContext.currentTime);
        }
        
        return this.isMuted;
    }

    // Set volume levels
    setVolume(musicVol, sfxVol) {
        this.musicVolume = Utils.clamp(musicVol, 0, 1);
        this.sfxVolume = Utils.clamp(sfxVol, 0, 1);
        
        if (this.musicGain && this.sfxGain && !this.isMuted) {
            this.musicGain.gain.setValueAtTime(this.musicVolume, this.audioContext.currentTime);
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.audioContext.currentTime);
        }
    }

    // Start ambient background tone
    startAmbientMusic() {
        if (!this.audioContext || this.isMuted || this.currentMusic) return;
        
        // Create a subtle ambient drone
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(55, this.audioContext.currentTime); // Low A
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 2);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        oscillator.start(this.audioContext.currentTime);
        
        this.currentMusic = {
            oscillator,
            gainNode
        };
    }

    // Stop ambient music
    stopAmbientMusic() {
        if (this.currentMusic) {
            this.currentMusic.gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 1
            );
            this.currentMusic.oscillator.stop(this.audioContext.currentTime + 1);
            this.currentMusic = null;
        }
    }

    // Cleanup audio resources
    cleanup() {
        this.stopAmbientMusic();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
