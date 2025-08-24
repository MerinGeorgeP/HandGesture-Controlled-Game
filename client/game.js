// Main game class for Thread of Fate

class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.audioManager = null;
        this.levelManager = null;
        this.player = null;
        this.thread = null;
        
        // Game state
        this.gameState = 'loading'; // loading, playing, gameOver, levelComplete, gameComplete
        this.lives = 3;
        this.maxLives = 3;
        this.isRunning = false;
        this.lastTime = 0;
        this.debugMode = false;
        
        // Input handling
        this.keys = {};
        this.touchControls = {};
        
        // UI elements
        this.ui = {
            lives: null,
            level: null,
            message: null,
            messageText: null,
            messageInstructions: null,
            loadingScreen: null,
            loadingProgress: null,
            audioToggle: null
        };
        
        // Game settings
        this.settings = {
            canvasWidth: 800,
            canvasHeight: 400,
            targetFPS: 60
        };
        
        // Performance tracking
        this.frameCount = 0;
        this.fpsDisplay = 0;
        this.lastFPSUpdate = 0;
        
        // Mobile detection
        this.isMobile = Utils.isMobile();
        
        // Loading progress
        this.loadingProgress = 0;
        this.totalLoadingSteps = 5;
    }

    // Initialize the game
    async init() {
        try {
            this.setupCanvas();
            this.setupUI();
            this.setupInputHandlers();
            await this.loadAssets();
            this.initializeGameObjects();
            this.setupEventListeners();
            this.hideLoading();
            this.startGame();
        } catch (error) {
            console.error('Game initialization failed:', error);
            this.showError('Failed to initialize game. Please refresh and try again.');
        }
    }

    // Setup game canvas
    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.settings.canvasWidth;
        this.canvas.height = this.settings.canvasHeight;
        
        // Configure for pixel art
        Utils.scaleForPixelArt(this.ctx);
        
        // Show mobile controls if needed
        if (this.isMobile) {
            document.getElementById('mobileControls').classList.remove('mobile-only');
        }
        
        this.updateLoadingProgress();
        console.log('Canvas setup complete');
    }

    // Setup UI references
    setupUI() {
        this.ui.lives = document.getElementById('livesCount');
        this.ui.level = document.getElementById('levelCount');
        this.ui.message = document.getElementById('gameMessage');
        this.ui.messageText = document.getElementById('messageText');
        this.ui.messageInstructions = document.getElementById('messageInstructions');
        this.ui.loadingScreen = document.getElementById('loadingScreen');
        this.ui.loadingProgress = document.getElementById('loadingProgress');
        this.ui.audioToggle = document.getElementById('audioToggle');
        
        this.updateLoadingProgress();
        console.log('UI setup complete');
    }

    // Load game assets
    async loadAssets() {
        try {
            // Initialize audio
            this.audioManager = new AudioManager();
            await this.audioManager.init();
            this.updateLoadingProgress();
            
            // Initialize level manager
            this.levelManager = new LevelManager();
            this.updateLoadingProgress();
            
            console.log('Assets loaded successfully');
        } catch (error) {
            console.warn('Some assets failed to load:', error);
        }
        
        this.updateLoadingProgress();
    }

    // Initialize game objects
    initializeGameObjects() {
        const level = this.levelManager.getCurrentLevel();
        
        // Create player
        this.player = new Player(level.playerStart.x, level.playerStart.y);
        
        // Create thread
        this.thread = new Thread(level.threadStart.x, level.threadStart.y);
        
        // Update UI
        this.updateUI();
        
        this.updateLoadingProgress();
        console.log('Game objects initialized');
    }

    // Setup input handlers
    setupInputHandlers() {
        // Keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mobile touch controls
        if (this.isMobile) {
            this.setupTouchControls();
        }
        
        // Audio toggle
        this.ui.audioToggle.addEventListener('click', () => {
            const isMuted = this.audioManager.toggleMute();
            this.ui.audioToggle.classList.toggle('muted', isMuted);
            this.audioManager.playSound('button');
        });
        
        console.log('Input handlers setup complete');
    }

    // Setup touch controls for mobile
    setupTouchControls() {
        const buttons = ['up', 'down', 'left', 'right'];
        
        buttons.forEach(direction => {
            const button = document.getElementById(direction);
            
            // Touch start
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchControls[direction] = true;
                this.updatePlayerInput();
                this.audioManager.resumeAudioContext();
            });
            
            // Touch end
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchControls[direction] = false;
                this.updatePlayerInput();
            });
            
            // Prevent context menu
            button.addEventListener('contextmenu', (e) => e.preventDefault());
        });
    }

    // Setup additional event listeners
    setupEventListeners() {
        // Window focus/blur
        window.addEventListener('focus', () => {
            if (this.gameState === 'playing') {
                this.lastTime = performance.now();
            }
        });
        
        window.addEventListener('blur', () => {
            // Clear all inputs when window loses focus
            this.keys = {};
            this.touchControls = {};
            this.updatePlayerInput();
        });
        
        // Prevent right-click context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Debug mode toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.debugMode = !this.debugMode;
                console.log('Debug mode:', this.debugMode ? 'ON' : 'OFF');
            }
        });
    }

    // Handle keyboard input
    handleKeyDown(e) {
        // Prevent default for game keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyR', 'KeyN', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
        
        this.keys[e.code] = true;
        
        // Handle game state specific inputs
        if (this.gameState === 'gameOver' && e.code === 'KeyR') {
            this.restartLevel();
        } else if (this.gameState === 'levelComplete' && e.code === 'KeyN') {
            this.nextLevel();
        } else if (this.gameState === 'gameComplete' && e.code === 'KeyR') {
            this.restartGame();
        }
        
        // Resume audio context on first user interaction
        this.audioManager.resumeAudioContext();
        
        this.updatePlayerInput();
    }

    // Handle keyboard release
    handleKeyUp(e) {
        this.keys[e.code] = false;
        this.updatePlayerInput();
    }

    // Update player input based on current key/touch state
    updatePlayerInput() {
        if (!this.player || this.gameState !== 'playing') return;
        
        // Keyboard input
        const up = this.keys['ArrowUp'] || this.keys['KeyW'];
        const down = this.keys['ArrowDown'] || this.keys['KeyS'];
        const left = this.keys['ArrowLeft'] || this.keys['KeyA'];
        const right = this.keys['ArrowRight'] || this.keys['KeyD'];
        
        // Touch input
        const touchUp = this.touchControls['up'];
        const touchDown = this.touchControls['down'];
        const touchLeft = this.touchControls['left'];
        const touchRight = this.touchControls['right'];
        
        // Combine inputs
        this.player.setInput('up', up || touchUp);
        this.player.setInput('down', down || touchDown);
        this.player.setInput('left', left || touchLeft);
        this.player.setInput('right', right || touchRight);
        
        // Play movement sound
        if ((up || down || left || right || touchUp || touchDown || touchLeft || touchRight) && 
            this.gameState === 'playing') {
            // Throttle movement sound
            if (!this.lastMoveSoundTime || Date.now() - this.lastMoveSoundTime > 100) {
                this.audioManager.playSound('move');
                this.lastMoveSoundTime = Date.now();
            }
        }
    }

    // Start the game
    startGame() {
        this.gameState = 'playing';
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
        this.audioManager.startAmbientMusic();
        console.log('Game started');
    }

    // Main game loop
    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;
        
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap delta time
        this.lastTime = currentTime;
        
        // Update FPS counter
        this.updateFPS(currentTime);
        
        // Update game
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Update game state
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Update level
        this.levelManager.updateLevel(deltaTime);
        
        // Update player
        const boundaries = {
            left: 20,
            right: this.settings.canvasWidth - 20,
            top: 20,
            bottom: this.settings.canvasHeight - 20
        };
        
        this.player.update(deltaTime, boundaries);
        
        // Handle wall collisions
        this.player.handleWallCollision(this.levelManager.getWalls());
        
        // Update thread
        this.thread.update(deltaTime);
        const playerCenter = this.player.getCenter();
        this.thread.addPoint(playerCenter.x, playerCenter.y);
        
        // Check collisions
        this.checkCollisions();
        
        // Check win condition
        this.checkWinCondition();
    }

    // Check all collision types
    checkCollisions() {
        // Check thread collisions with hazards
        const hazards = this.levelManager.getHazards();
        if (this.thread.checkCollisions(hazards)) {
            this.audioManager.playSound('threadBreak');
            this.gameOver();
            return;
        }
        
        // Check thread tangling
        if (this.thread.checkTangling()) {
            this.audioManager.playSound('threadBreak');
            this.gameOver();
            return;
        }
        
        // Check player collision with hazards
        const hazardCollision = this.player.checkCollision(hazards);
        if (hazardCollision) {
            this.audioManager.playSound('enemyHit');
            this.gameOver();
            return;
        }
        
        // Check if thread is too stretched (optional mechanic)
        if (this.thread.isTooStretched(500)) {
            this.audioManager.playSound('threadStretch');
        }
    }

    // Check win condition
    checkWinCondition() {
        const level = this.levelManager.getCurrentLevel();
        const playerBounds = this.player.getBounds();
        
        if (Utils.rectCollision(playerBounds, level.exit)) {
            this.levelComplete();
        }
    }

    // Handle level completion
    levelComplete() {
        this.gameState = 'levelComplete';
        this.audioManager.playSound('levelComplete');
        
        if (this.levelManager.nextLevel()) {
            // More levels available
            this.showMessage(
                'Level Complete!',
                'Press N for Next Level or R to Restart'
            );
        } else {
            // Game completed
            this.gameComplete();
        }
    }

    // Handle game completion
    gameComplete() {
        this.gameState = 'gameComplete';
        this.audioManager.playSound('win');
        this.audioManager.stopAmbientMusic();
        
        this.showMessage(
            'Congratulations! You\'ve mastered the Thread of Fate!',
            'Press R to Play Again'
        );
        
        // Add win effect
        document.body.classList.add('win-effect');
        setTimeout(() => {
            document.body.classList.remove('win-effect');
        }, 2000);
    }

    // Handle game over
    gameOver() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
            this.showMessage(
                'Thread Broken – Game Over',
                'Press R to Restart'
            );
            
            // Add lose effect
            document.body.classList.add('lose-effect');
            setTimeout(() => {
                document.body.classList.remove('lose-effect');
            }, 500);
            
            // Vibrate on mobile
            if (this.isMobile) {
                Utils.vibrate(200);
            }
        } else {
            // Restart level with remaining lives
            this.restartLevel(false);
        }
    }

    // Restart current level
    restartLevel(resetLives = true) {
        if (resetLives) {
            this.lives = this.maxLives;
        }
        
        const level = this.levelManager.getCurrentLevel();
        this.player.reset(level.playerStart.x, level.playerStart.y);
        this.thread.reset(level.threadStart.x, level.threadStart.y);
        
        this.gameState = 'playing';
        this.hideMessage();
        this.updateUI();
        
        this.audioManager.playSound('button');
        this.audioManager.startAmbientMusic();
    }

    // Go to next level
    nextLevel() {
        const level = this.levelManager.getCurrentLevel();
        this.player.reset(level.playerStart.x, level.playerStart.y);
        this.thread.reset(level.threadStart.x, level.threadStart.y);
        
        this.gameState = 'playing';
        this.hideMessage();
        this.updateUI();
        
        this.audioManager.playSound('button');
    }

    // Restart entire game
    restartGame() {
        this.levelManager.reset();
        this.lives = this.maxLives;
        this.restartLevel();
        document.body.classList.remove('win-effect');
    }

    // Render game
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render level
        const level = this.levelManager.getCurrentLevel();
        this.levelManager.renderLevel(this.ctx, level);
        
        // Render thread
        this.thread.render(this.ctx);
        
        // Render player
        this.player.render(this.ctx);
        
        // Render debug info
        if (this.debugMode) {
            this.renderDebug();
        }
        
        // Render FPS
        this.renderFPS();
    }

    // Render debug information
    renderDebug() {
        this.ctx.save();
        
        // Player debug
        this.player.renderDebug(this.ctx);
        
        // Thread debug
        this.thread.renderDebug(this.ctx);
        
        // Level debug info
        this.ctx.fillStyle = 'yellow';
        this.ctx.font = '10px monospace';
        const level = this.levelManager.getCurrentLevel();
        this.ctx.fillText(`Level: ${level.id} - ${level.name}`, 10, this.canvas.height - 60);
        this.ctx.fillText(`Player: ${Math.floor(this.player.x)}, ${Math.floor(this.player.y)}`, 10, this.canvas.height - 50);
        this.ctx.fillText(`Thread Points: ${this.thread.points.length}`, 10, this.canvas.height - 40);
        this.ctx.fillText(`Thread Length: ${Math.floor(this.thread.getLength())}`, 10, this.canvas.height - 30);
        this.ctx.fillText(`Game State: ${this.gameState}`, 10, this.canvas.height - 20);
        this.ctx.fillText(`Lives: ${this.lives}`, 10, this.canvas.height - 10);
        
        this.ctx.restore();
    }

    // Update FPS counter
    updateFPS(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.lastFPSUpdate >= 1000) {
            this.fpsDisplay = this.frameCount;
            this.frameCount = 0;
            this.lastFPSUpdate = currentTime;
        }
    }

    // Render FPS counter
    renderFPS() {
        this.ctx.save();
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(`FPS: ${this.fpsDisplay}`, this.canvas.width - 60, 15);
        this.ctx.restore();
    }

    // Update UI elements
    updateUI() {
        this.ui.lives.textContent = this.lives;
        this.ui.level.textContent = this.levelManager.currentLevel;
    }

    // Show game message
    showMessage(text, instructions = '') {
        this.ui.messageText.textContent = text;
        this.ui.messageInstructions.textContent = instructions;
        this.ui.message.classList.remove('hidden');
    }

    // Hide game message
    hideMessage() {
        this.ui.message.classList.add('hidden');
    }

    // Update loading progress
    updateLoadingProgress() {
        this.loadingProgress++;
        const percentage = (this.loadingProgress / this.totalLoadingSteps) * 100;
        this.ui.loadingProgress.style.width = `${percentage}%`;
    }

    // Hide loading screen
    hideLoading() {
        setTimeout(() => {
            this.ui.loadingScreen.style.display = 'none';
        }, 500);
    }

    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff0000;
            color: #ffffff;
            padding: 20px;
            border: 2px solid #ffffff;
            font-family: 'Press Start 2P', monospace;
            font-size: 12px;
            z-index: 1000;
            text-align: center;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }

    // Cleanup when game is destroyed
    destroy() {
        this.isRunning = false;
        this.audioManager?.cleanup();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        
        console.log('Game destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}