// Thread system for Thread of Fate game

class Thread {
    constructor(startX, startY) {
        this.startPoint = { x: startX, y: startY };
        this.points = [{ x: startX, y: startY }];
        this.maxPoints = 150; // Limit thread length for performance
        this.segmentLength = 8; // Distance between thread points
        this.isBroken = false;
        this.glowIntensity = 1.0;
        this.animationTime = 0;
        this.threadColor = '#00ff00';
        this.glowColor = '#88ff88';
        this.brokenColor = '#ff0000';
        this.thickness = 2;
    }

    // Add a new point to the thread
    addPoint(x, y) {
        if (this.isBroken) return;

        const lastPoint = this.points[this.points.length - 1];
        const distance = Utils.distance({ x, y }, lastPoint);

        // Only add point if it's far enough from the last one
        if (distance >= this.segmentLength) {
            this.points.push({ x, y });

            // Remove old points to maintain performance
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
        }
    }

    // Update thread animation
    update(deltaTime) {
        this.animationTime += deltaTime * 2;
        
        // Animate glow intensity
        this.glowIntensity = 0.7 + Math.sin(this.animationTime) * 0.3;
        
        // If thread is broken, fade it out
        if (this.isBroken) {
            this.glowIntensity = Math.max(0, this.glowIntensity - deltaTime * 2);
        }
    }

    // Check collision with obstacles
    checkCollisions(obstacles) {
        if (this.isBroken || this.points.length < 2) return false;

        // Check each thread segment against obstacles
        for (let i = 0; i < this.points.length - 1; i++) {
            const segmentStart = this.points[i];
            const segmentEnd = this.points[i + 1];

            for (const obstacle of obstacles) {
                if (this.checkSegmentObstacleCollision(segmentStart, segmentEnd, obstacle)) {
                    this.breakThread();
                    return true;
                }
            }
        }

        return false;
    }

    // Check if a thread segment collides with an obstacle
    checkSegmentObstacleCollision(segmentStart, segmentEnd, obstacle) {
        // Get obstacle bounds
        const bounds = {
            left: obstacle.x,
            right: obstacle.x + obstacle.width,
            top: obstacle.y,
            bottom: obstacle.y + obstacle.height
        };

        // Check intersection with all four sides of the obstacle
        const sides = [
            { start: { x: bounds.left, y: bounds.top }, end: { x: bounds.right, y: bounds.top } },     // Top
            { start: { x: bounds.right, y: bounds.top }, end: { x: bounds.right, y: bounds.bottom } }, // Right
            { start: { x: bounds.right, y: bounds.bottom }, end: { x: bounds.left, y: bounds.bottom } }, // Bottom
            { start: { x: bounds.left, y: bounds.bottom }, end: { x: bounds.left, y: bounds.top } }     // Left
        ];

        for (const side of sides) {
            if (Utils.lineIntersection(segmentStart, segmentEnd, side.start, side.end)) {
                return true;
            }
        }

        return false;
    }

    // Check if thread is tangled (self-intersection)
    checkTangling() {
        if (this.isBroken || this.points.length < 4) return false;

        // Check if any thread segment intersects with non-adjacent segments
        for (let i = 0; i < this.points.length - 3; i++) {
            for (let j = i + 2; j < this.points.length - 1; j++) {
                // Skip adjacent segments
                if (Math.abs(i - j) <= 1) continue;

                const seg1Start = this.points[i];
                const seg1End = this.points[i + 1];
                const seg2Start = this.points[j];
                const seg2End = this.points[j + 1];

                if (Utils.lineIntersection(seg1Start, seg1End, seg2Start, seg2End)) {
                    this.breakThread();
                    return true;
                }
            }
        }

        return false;
    }

    // Break the thread
    breakThread() {
        if (!this.isBroken) {
            this.isBroken = true;
            this.threadColor = this.brokenColor;
            this.glowColor = '#ff8888';
        }
    }

    // Reset the thread
    reset(startX, startY) {
        this.startPoint = { x: startX, y: startY };
        this.points = [{ x: startX, y: startY }];
        this.isBroken = false;
        this.glowIntensity = 1.0;
        this.animationTime = 0;
        this.threadColor = '#00ff00';
        this.glowColor = '#88ff88';
    }

    // Get thread length
    getLength() {
        let length = 0;
        for (let i = 0; i < this.points.length - 1; i++) {
            length += Utils.distance(this.points[i], this.points[i + 1]);
        }
        return length;
    }

    // Check if thread is too stretched (optional mechanic)
    isTooStretched(maxLength = 400) {
        return this.getLength() > maxLength;
    }

    // Render the thread
    render(ctx) {
        if (this.points.length < 2) return;

        ctx.save();

        // Set line properties
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw glow effect
        if (this.glowIntensity > 0) {
            Utils.createGlowEffect(ctx, this.glowColor, 8 * this.glowIntensity);
            this.drawThreadPath(ctx, this.threadColor);
            Utils.removeGlowEffect(ctx);
        }

        // Draw main thread
        this.drawThreadPath(ctx, this.threadColor);

        // Draw connection to start point (anchor)
        this.drawAnchor(ctx);

        ctx.restore();
    }

    // Draw the thread path
    drawThreadPath(ctx, color) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = this.glowIntensity;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        // Draw smooth curves between points
        for (let i = 1; i < this.points.length; i++) {
            if (i === this.points.length - 1) {
                // Last point - draw straight line
                ctx.lineTo(this.points[i].x, this.points[i].y);
            } else {
                // Interpolate for smooth curves
                const current = this.points[i];
                const next = this.points[i + 1];
                const midX = (current.x + next.x) / 2;
                const midY = (current.y + next.y) / 2;
                
                ctx.quadraticCurveTo(current.x, current.y, midX, midY);
            }
        }

        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    // Draw the anchor point
    drawAnchor(ctx) {
        const anchorSize = 4;
        const pulseSize = 2 + Math.sin(this.animationTime * 3) * 1;

        // Draw anchor glow
        Utils.createGlowEffect(ctx, this.threadColor, 10);
        ctx.fillStyle = this.threadColor;
        ctx.beginPath();
        ctx.arc(this.startPoint.x, this.startPoint.y, anchorSize + pulseSize, 0, Math.PI * 2);
        ctx.fill();
        Utils.removeGlowEffect(ctx);

        // Draw anchor core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.startPoint.x, this.startPoint.y, anchorSize - 1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Debug render (for development)
    renderDebug(ctx) {
        if (this.points.length < 2) return;

        ctx.save();
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;

        // Draw debug lines
        ctx.beginPath();
        for (let i = 0; i < this.points.length - 1; i++) {
            ctx.moveTo(this.points[i].x, this.points[i].y);
            ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
        }
        ctx.stroke();

        // Draw debug points
        ctx.fillStyle = 'red';
        for (const point of this.points) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Thread;
}