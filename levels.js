// Level definitions and management for Thread of Fate game

class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.maxLevel = 3;
        this.levels = this.createLevels();
    }

    // Create all level definitions
    createLevels() {
        return {
            1: this.createLevel1(),
            2: this.createLevel2(),
            3: this.createLevel3()
        };
    }

    // Level 1: Simple introduction to thread mechanics
    createLevel1() {
        return {
            id: 1,
            name: "First Steps",
            description: "Learn to move without breaking the thread",
            playerStart: { x: 50, y: 200 },
            threadStart: { x: 50, y: 200 },
            exit: { x: 650, y: 200, width: 20, height: 40 },
            walls: [
                // Outer boundaries
                { x: 0, y: 0, width: 800, height: 20, type: 'wall' },           // Top
                { x: 0, y: 380, width: 800, height: 20, type: 'wall' },         // Bottom
                { x: 0, y: 0, width: 20, height: 400, type: 'wall' },           // Left
                { x: 780, y: 0, width: 20, height: 400, type: 'wall' },         // Right
                
                // Simple obstacles
                { x: 200, y: 150, width: 60, height: 20, type: 'wall' },
                { x: 350, y: 250, width: 60, height: 20, type: 'wall' },
                { x: 500, y: 100, width: 20, height: 80, type: 'wall' }
            ],
            spikes: [],
            enemies: [],
            background: '#001100',
            tips: [
                "Use WASD or arrow keys to move",
                "Keep the green thread from touching walls",
                "Reach the glowing exit portal"
            ]
        };
    }

    // Level 2: Add spikes and moving enemy
    createLevel2() {
        return {
            id: 2,
            name: "Dangerous Path",
            description: "Avoid spikes and the moving enemy",
            playerStart: { x: 50, y: 300 },
            threadStart: { x: 50, y: 300 },
            exit: { x: 650, y: 100, width: 20, height: 40 },
            walls: [
                // Outer boundaries
                { x: 0, y: 0, width: 800, height: 20, type: 'wall' },
                { x: 0, y: 380, width: 800, height: 20, type: 'wall' },
                { x: 0, y: 0, width: 20, height: 400, type: 'wall' },
                { x: 780, y: 0, width: 20, height: 400, type: 'wall' },
                
                // Maze-like walls
                { x: 150, y: 100, width: 20, height: 150, type: 'wall' },
                { x: 170, y: 100, width: 180, height: 20, type: 'wall' },
                { x: 330, y: 120, width: 20, height: 100, type: 'wall' },
                { x: 400, y: 200, width: 150, height: 20, type: 'wall' },
                { x: 530, y: 220, width: 20, height: 100, type: 'wall' },
                { x: 200, y: 300, width: 250, height: 20, type: 'wall' }
            ],
            spikes: [
                { x: 250, y: 200, width: 60, height: 12, type: 'spikes' },
                { x: 400, y: 150, width: 80, height: 12, type: 'spikes' },
                { x: 450, y: 300, width: 60, height: 12, type: 'spikes' }
            ],
            enemies: [
                {
                    x: 300, y: 250, width: 16, height: 16, type: 'enemy',
                    patrol: { start: { x: 280, y: 250 }, end: { x: 450, y: 250 }, speed: 60 },
                    direction: 1, startTime: 0
                }
            ],
            background: '#110011',
            tips: [
                "Avoid the red spikes!",
                "The purple enemy will break your thread",
                "Plan your path carefully"
            ]
        };
    }

    // Level 3: Complex puzzle requiring careful movement
    createLevel3() {
        return {
            id: 3,
            name: "Thread of Fate",
            description: "Navigate the final maze without tangling",
            playerStart: { x: 50, y: 350 },
            threadStart: { x: 50, y: 350 },
            exit: { x: 700, y: 50, width: 20, height: 40 },
            walls: [
                // Outer boundaries
                { x: 0, y: 0, width: 800, height: 20, type: 'wall' },
                { x: 0, y: 380, width: 800, height: 20, type: 'wall' },
                { x: 0, y: 0, width: 20, height: 400, type: 'wall' },
                { x: 780, y: 0, width: 20, height: 400, type: 'wall' },
                
                // Complex maze
                { x: 100, y: 100, width: 20, height: 200, type: 'wall' },
                { x: 120, y: 280, width: 100, height: 20, type: 'wall' },
                { x: 200, y: 180, width: 20, height: 120, type: 'wall' },
                { x: 220, y: 180, width: 80, height: 20, type: 'wall' },
                { x: 280, y: 100, width: 20, height: 100, type: 'wall' },
                { x: 350, y: 150, width: 100, height: 20, type: 'wall' },
                { x: 430, y: 50, width: 20, height: 120, type: 'wall' },
                { x: 500, y: 200, width: 150, height: 20, type: 'wall' },
                { x: 600, y: 100, width: 20, height: 120, type: 'wall' },
                { x: 550, y: 300, width: 100, height: 20, type: 'wall' },
                { x: 400, y: 250, width: 20, height: 100, type: 'wall' }
            ],
            spikes: [
                { x: 150, y: 250, width: 40, height: 12, type: 'spikes' },
                { x: 320, y: 120, width: 50, height: 12, type: 'spikes' },
                { x: 480, y: 180, width: 60, height: 12, type: 'spikes' },
                { x: 550, y: 280, width: 40, height: 12, type: 'spikes' }
            ],
            enemies: [
                {
                    x: 250, y: 220, width: 16, height: 16, type: 'enemy',
                    patrol: { start: { x: 230, y: 220 }, end: { x: 350, y: 220 }, speed: 40 },
                    direction: 1, startTime: 0
                },
                {
                    x: 500, y: 120, width: 16, height: 16, type: 'enemy',
                    patrol: { start: { x: 470, y: 120 }, end: { x: 580, y: 120 }, speed: 50 },
                    direction: 1, startTime: 1.5
                }
            ],
            background: '#001122',
            tips: [
                "This is the final test",
                "Don't let your thread cross itself",
                "Multiple enemies patrol different areas",
                "Victory is within reach!"
            ]
        };
    }

    // Get current level data
    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    // Move to next level
    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            return true;
        }
        return false; // Game completed
    }

    // Reset to first level
    reset() {
        this.currentLevel = 1;
    }

    // Get level completion status
    isGameComplete() {
        return this.currentLevel > this.maxLevel;
    }

    // Get level progress
    getProgress() {
        return {
            current: this.currentLevel,
            total: this.maxLevel,
            percentage: (this.currentLevel / this.maxLevel) * 100
        };
    }

    // Update dynamic elements in current level
    updateLevel(deltaTime) {
        const level = this.getCurrentLevel();
        
        // Update enemies
        level.enemies.forEach(enemy => {
            this.updateEnemy(enemy, deltaTime);
        });
    }

    // Update enemy movement
    updateEnemy(enemy, deltaTime) {
        if (!enemy.patrol) return;
        
        // Update enemy timer
        enemy.startTime += deltaTime;
        
        // Calculate patrol movement
        const { start, end, speed } = enemy.patrol;
        const distance = Utils.distance(start, end);
        const travelTime = distance / speed;
        
        // Calculate position along patrol path
        const cycle = (enemy.startTime % (travelTime * 2));
        let t;
        
        if (cycle < travelTime) {
            // Moving from start to end
            t = cycle / travelTime;
            enemy.x = Utils.lerp(start.x, end.x, t);
            enemy.y = Utils.lerp(start.y, end.y, t);
            enemy.direction = 1;
        } else {
            // Moving from end to start
            t = (cycle - travelTime) / travelTime;
            enemy.x = Utils.lerp(end.x, start.x, t);
            enemy.y = Utils.lerp(end.y, start.y, t);
            enemy.direction = -1;
        }
    }

    // Render level elements
    renderLevel(ctx, levelData) {
        ctx.save();
        
        // Set background
        ctx.fillStyle = levelData.background;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Render walls
        this.renderWalls(ctx, levelData.walls);
        
        // Render spikes
        this.renderSpikes(ctx, levelData.spikes);
        
        // Render enemies
        this.renderEnemies(ctx, levelData.enemies);
        
        // Render exit portal
        this.renderExit(ctx, levelData.exit);
        
        ctx.restore();
    }

    // Render walls
    renderWalls(ctx, walls) {
        walls.forEach(wall => {
            Utils.createGlowEffect(ctx, '#00ff00', 2);
            Utils.drawPixelRect(ctx, wall.x, wall.y, wall.width, wall.height, '#008800');
            Utils.removeGlowEffect(ctx);
            
            // Add border effect
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 1;
            ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
        });
    }

    // Render spikes
    renderSpikes(ctx, spikes) {
        spikes.forEach(spike => {
            // Draw spike base
            Utils.createGlowEffect(ctx, '#ff0000', 3);
            Utils.drawPixelRect(ctx, spike.x, spike.y, spike.width, spike.height, '#aa0000');
            Utils.removeGlowEffect(ctx);
            
            // Draw spike points
            ctx.fillStyle = '#ff0000';
            const spikeCount = Math.floor(spike.width / 8);
            for (let i = 0; i < spikeCount; i++) {
                const spikeX = spike.x + i * 8 + 4;
                const spikeY = spike.y;
                
                ctx.beginPath();
                ctx.moveTo(spikeX - 3, spikeY + spike.height);
                ctx.lineTo(spikeX, spikeY - 3);
                ctx.lineTo(spikeX + 3, spikeY + spike.height);
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    // Render enemies
    renderEnemies(ctx, enemies) {
        enemies.forEach(enemy => {
            // Draw enemy glow
            Utils.createGlowEffect(ctx, '#ff00ff', 4);
            Utils.drawPixelRect(ctx, enemy.x, enemy.y, enemy.width, enemy.height, '#aa00aa');
            Utils.removeGlowEffect(ctx);
            
            // Draw enemy details
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(enemy.x + 2, enemy.y + 2, enemy.width - 4, enemy.height - 4);
            
            // Draw eyes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(enemy.x + 3, enemy.y + 3, 2, 2);
            ctx.fillRect(enemy.x + enemy.width - 5, enemy.y + 3, 2, 2);
            
            // Draw direction indicator
            if (enemy.direction > 0) {
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(enemy.x + enemy.width - 2, enemy.y + enemy.height / 2 - 1, 2, 2);
            } else {
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(enemy.x, enemy.y + enemy.height / 2 - 1, 2, 2);
            }
        });
    }

    // Render exit portal
    renderExit(ctx, exit) {
        const time = Date.now() * 0.005;
        
        // Draw portal base
        const gradient = Utils.createRetroGradient(
            ctx, 
            exit.x, exit.y, 
            exit.x + exit.width, exit.y + exit.height,
            ['#00ffff', '#0088ff', '#0044ff', '#0000ff']
        );
        
        ctx.fillStyle = gradient;
        ctx.fillRect(exit.x, exit.y, exit.width, exit.height);
        
        // Draw pulsing glow
        const glowSize = 15 + Math.sin(time * 3) * 5;
        Utils.createGlowEffect(ctx, '#00ffff', glowSize);
        Utils.drawPixelRect(ctx, exit.x - 2, exit.y - 2, exit.width + 4, exit.height + 4, '#00aaff');
        Utils.removeGlowEffect(ctx);
        
        // Draw portal effects
        ctx.save();
        ctx.globalAlpha = 0.7;
        for (let i = 0; i < 3; i++) {
            const offset = Math.sin(time * 2 + i) * 3;
            Utils.drawPixelRect(
                ctx, 
                exit.x + offset, 
                exit.y, 
                exit.width, 
                exit.height, 
                '#88ffff'
            );
        }
        ctx.restore();
    }

    // Get all collidable objects for current level
    getObstacles() {
        const level = this.getCurrentLevel();
        return [...level.walls, ...level.spikes, ...level.enemies];
    }

    // Get walls only (for wall collision)
    getWalls() {
        const level = this.getCurrentLevel();
        return level.walls;
    }

    // Get hazards (spikes and enemies)
    getHazards() {
        const level = this.getCurrentLevel();
        return [...level.spikes, ...level.enemies];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelManager;
}
