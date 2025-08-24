// Player class for Thread of Fate game

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 12;
        this.height = 12;
        this.speed = 120; // pixels per second
        this.color = '#00ffff';
        this.glowColor = '#88ffff';
        
        // Animation properties
        this.animationTime = 0;
        this.bobOffset = 0;
        this.isMoving = false;
        this.lastDirection = { x: 0, y: 0 };
        
        // Visual effects
        this.trailPoints = [];
        this.maxTrailPoints = 8;
        this.pixelSize = 2;
        
        // Input state
        this.inputState = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // Movement smoothing
        this.velocity = { x: 0, y: 0 };
        this.acceleration = 800; // pixels per second squared
        this.friction = 0.85;
    }

    // Update player position and animation
    update(deltaTime, boundaries) {
        this.animationTime += deltaTime;
        
        // Calculate movement direction
        const direction = { x: 0, y: 0 };
        
        if (this.inputState.left) direction.x -= 1;
        if (this.inputState.right) direction.x += 1;
        if (this.inputState.up) direction.y -= 1;
        if (this.inputState.down) direction.y += 1;
        
        // Normalize diagonal movement
        if (direction.x !== 0 && direction.y !== 0) {
            const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            direction.x /= length;
            direction.y /= length;
        }
        
        // Apply acceleration
        if (direction.x !== 0 || direction.y !== 0) {
            this.velocity.x += direction.x * this.acceleration * deltaTime;
            this.velocity.y += direction.y * this.acceleration * deltaTime;
            this.isMoving = true;
            this.lastDirection = { ...direction };
        } else {
            this.isMoving = false;
        }
        
        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        
        // Limit velocity to max speed
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.speed) {
            this.velocity.x = (this.velocity.x / speed) * this.speed;
            this.velocity.y = (this.velocity.y / speed) * this.speed;
        }
        
        // Store old position for collision checking
        const oldX = this.x;
        const oldY = this.y;
        
        // Update position
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        // Check boundaries and revert if out of bounds
        if (this.x < boundaries.left || 
            this.x + this.width > boundaries.right ||
            this.y < boundaries.top || 
            this.y + this.height > boundaries.bottom) {
            
            this.x = oldX;
            this.y = oldY;
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
        
        // Update bob animation
        if (this.isMoving) {
            this.bobOffset = Math.sin(this.animationTime * 12) * 1;
        } else {
            this.bobOffset = Math.sin(this.animationTime * 4) * 0.5;
        }
        
        // Update trail points
        this.updateTrail();
        
        // Stop velocity if very small (to prevent jitter)
        if (Math.abs(this.velocity.x) < 1) this.velocity.x = 0;
        if (Math.abs(this.velocity.y) < 1) this.velocity.y = 0;
    }

    // Update trail effect
    updateTrail() {
        if (this.isMoving) {
            this.trailPoints.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                life: 1.0
            });
            
            if (this.trailPoints.length > this.maxTrailPoints) {
                this.trailPoints.shift();
            }
        }
        
        // Fade trail points
        for (let i = 0; i < this.trailPoints.length; i++) {
            this.trailPoints[i].life -= 0.03;
            if (this.trailPoints[i].life <= 0) {
                this.trailPoints.splice(i, 1);
                i--;
            }
        }
    }

    // Check collision with obstacles
    checkCollision(obstacles) {
        const playerRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        
        for (const obstacle of obstacles) {
            if (Utils.rectCollision(playerRect, obstacle)) {
                return obstacle;
            }
        }
        
        return null;
    }

    // Handle wall collision
    handleWallCollision(walls) {
        const playerRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        
        for (const wall of walls) {
            if (Utils.rectCollision(playerRect, wall)) {
                // Calculate overlap
                const overlapX = Math.min(playerRect.x + playerRect.width - wall.x, 
                                        wall.x + wall.width - playerRect.x);
                const overlapY = Math.min(playerRect.y + playerRect.height - wall.y, 
                                        wall.y + wall.height - playerRect.y);
                
                // Push out of wall based on smallest overlap
                if (overlapX < overlapY) {
                    // Horizontal collision
                    if (playerRect.x < wall.x) {
                        this.x = wall.x - this.width;
                    } else {
                        this.x = wall.x + wall.width;
                    }
                    this.velocity.x = 0;
                } else {
                    // Vertical collision
                    if (playerRect.y < wall.y) {
                        this.y = wall.y - this.height;
                    } else {
                        this.y = wall.y + wall.height;
                    }
                    this.velocity.y = 0;
                }
            }
        }
    }

    // Set input state
    setInput(direction, pressed) {
        if (this.inputState.hasOwnProperty(direction)) {
            this.inputState[direction] = pressed;
        }
    }

    // Get center position
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    // Get bounds for collision detection
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    // Reset player to starting position
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.inputState = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.trailPoints = [];
        this.isMoving = false;
        this.animationTime = 0;
    }

    // Render the player
    render(ctx) {
        ctx.save();
        
        // Render trail
        this.renderTrail(ctx);
        
        // Calculate render position with bob effect
        const renderX = Math.floor(this.x);
        const renderY = Math.floor(this.y + this.bobOffset);
        
        // Draw player glow
        Utils.createGlowEffect(ctx, this.glowColor, 6);
        this.drawPlayerPixelArt(ctx, renderX, renderY, this.color);
        Utils.removeGlowEffect(ctx);
        
        // Draw player body
        this.drawPlayerPixelArt(ctx, renderX, renderY, this.color);
        
        // Draw eyes/details
        this.drawPlayerDetails(ctx, renderX, renderY);
        
        ctx.restore();
    }

    // Draw player trail
    renderTrail(ctx) {
        ctx.save();
        
        for (let i = 0; i < this.trailPoints.length; i++) {
            const point = this.trailPoints[i];
            const alpha = point.life * 0.6;
            const size = point.life * 3;
            
            ctx.globalAlpha = alpha;
            Utils.createGlowEffect(ctx, this.glowColor, 4);
            ctx.fillStyle = this.glowColor;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
            Utils.removeGlowEffect(ctx);
        }
        
        ctx.restore();
    }

    // Draw player using pixel art style
    drawPlayerPixelArt(ctx, x, y, color) {
        const pixels = [
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0]
        ];
        
        ctx.fillStyle = color;
        
        for (let row = 0; row < pixels.length; row++) {
            for (let col = 0; col < pixels[row].length; col++) {
                if (pixels[row][col]) {
                    Utils.drawPixelRect(
                        ctx,
                        x + col * this.pixelSize - this.pixelSize,
                        y + row * this.pixelSize - this.pixelSize,
                        this.pixelSize,
                        this.pixelSize,
                        color
                    );
                }
            }
        }
    }

    // Draw player details (eyes, etc.)
    drawPlayerDetails(ctx, x, y) {
        const eyeColor = '#ffffff';
        const eyeSize = this.pixelSize;
        
        // Left eye
        Utils.drawPixelRect(
            ctx,
            x + this.pixelSize,
            y + this.pixelSize,
            eyeSize,
            eyeSize,
            eyeColor
        );
        
        // Right eye
        Utils.drawPixelRect(
            ctx,
            x + this.pixelSize * 4,
            y + this.pixelSize,
            eyeSize,
            eyeSize,
            eyeColor
        );
        
        // Add direction indicator based on movement
        if (this.isMoving) {
            const indicatorX = x + this.width / 2 + this.lastDirection.x * 8;
            const indicatorY = y + this.height / 2 + this.lastDirection.y * 8;
            
            ctx.fillStyle = this.glowColor;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(indicatorX, indicatorY, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }

    // Debug render
    renderDebug(ctx) {
        ctx.save();
        
        // Draw bounds
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Draw center point
        const center = this.getCenter();
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(center.x, center.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw velocity vector
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + this.velocity.x * 0.1, center.y + this.velocity.y * 0.1);
        ctx.stroke();
        
        ctx.restore();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}
