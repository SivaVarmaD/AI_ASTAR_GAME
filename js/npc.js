export class NPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 1;
        this.color = 'red';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    moveTo(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.x = x;
            this.y = y;
        }
    }
}