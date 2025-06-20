export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.speed = 10;
        this.color = 'blue';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    move(e, maxWidth, maxHeight) {
        switch (e.key) {
            case 'ArrowUp':
                this.y = Math.max(this.y - this.speed, this.size / 2);
                break;
            case 'ArrowDown':
                this.y = Math.min(this.y + this.speed, maxHeight - this.size / 2);
                break;
            case 'ArrowLeft':
                this.x = Math.max(this.x - this.speed, this.size / 2);
                break;
            case 'ArrowRight':
                this.x = Math.min(this.x + this.speed, maxWidth - this.size / 2);
                break;
        }
    }

    collidesWith(other) {
        return (
            this.x + this.size / 2 > other.x - other.size / 2 &&
            this.x - this.size / 2 < other.x + other.size / 2 &&
            this.y + this.size / 2 > other.y - other.size / 2 &&
            this.y - this.size / 2 < other.y + other.size / 2
        );
    }

    resolveCollision(wall) {
        if (this.x < wall.x) this.x = wall.x - this.size / 2;
        if (this.x > wall.x + wall.width) this.x = wall.x + wall.width + this.size / 2;
        if (this.y < wall.y) this.y = wall.y - this.size / 2;
        if (this.y > wall.y + wall.height) this.y = wall.y + wall.height + this.size / 2;
    }
}