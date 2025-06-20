import { Player } from './player.js';
import { NPC } from './npc.js';
import { Wall } from './wall.js';
import { astar } from './astar.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.cellSize = 40;
        this.player = new Player(this.width / 2, this.height / 2);
        this.npcs = [];
        this.walls = [];
        this.gameOver = false;
        this.startTime = 0;
        this.score = 0;
        this.lastScoreUpdateTime = 0;
        this.chaseRadius = 200; // Radius within which NPCs are considered to be chasing
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        });
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.initGame();
    }

    initGame() {
        this.createNPCs();
        this.createWalls();
        this.setupEventListeners();
    }

    createNPCs() {
        for (let i = 0; i < 6; i++) {
            this.npcs.push(new NPC(
                Math.random() * this.width,
                Math.random() * this.height
            ));
        }
    }

    createWalls() {
        for (let x = 0; x < this.width; x += this.cellSize) {
            for (let y = 0; y < this.height; y += this.cellSize) {
                if (Math.random() < 0.3) {
                    this.walls.push(new Wall(x, y, this.cellSize, this.cellSize));
                }
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.player.move(e, this.width, this.height));
    }

    start() {
    this.startTime = Date.now();
    this.lastScoreUpdateTime = Date.now();
    this.startNPCSpawner();
    this.gameLoop();
}

    startNPCSpawner() {
        this.npcSpawnInterval = setInterval(() => {
            const newNPC = new NPC(
                Math.random() * this.width,
                Math.random() * this.height
            );
            this.npcs.push(newNPC);
        }, 3000);
    }


    gameLoop() {
        if (this.gameOver) return;

        this.update();
        this.draw();
        this.checkCollisions();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.updateNPCs();
        this.updateScore();
    }

    isPlayerInsideWall() {
        return this.walls.some(wall => this.player.collidesWith(wall));
    }

    isPlayerBeingChased() {
        return this.npcs.some(npc => {
            const dx = this.player.x - npc.x;
            const dy = this.player.y - npc.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= this.chaseRadius;
        });
    }

    updateNPCs() {
        this.npcs.forEach(npc => {
            const path = astar(
                {x: Math.round(npc.x / this.cellSize) * this.cellSize, 
                 y: Math.round(npc.y / this.cellSize) * this.cellSize},
                {x: Math.round(this.player.x / this.cellSize) * this.cellSize, 
                 y: Math.round(this.player.y / this.cellSize) * this.cellSize},
                this.walls,
                this.width,
                this.height,
                this.cellSize
            );
            if (path.length > 1) {
                npc.moveTo(path[1].x, path[1].y);
            }
        });
    }

    updateScore() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastScoreUpdateTime;

        // Only update score if player is not inside a wall and is being chased
        if (!this.isPlayerInsideWall() && this.isPlayerBeingChased()) {
            this.score = Math.floor((currentTime - this.startTime) / 1000);
            document.getElementById('scoreValue').textContent = this.score;
        } else {
            // If player is inside wall or not being chased, update startTime to prevent score increase
            this.startTime += deltaTime;
        }

        this.lastScoreUpdateTime = currentTime;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.walls.forEach(wall => wall.draw(this.ctx));
        this.player.draw(this.ctx);
        this.npcs.forEach(npc => {
            npc.draw(this.ctx);
            const path = astar(
                {x: Math.round(npc.x / this.cellSize) * this.cellSize, 
                 y: Math.round(npc.y / this.cellSize) * this.cellSize},
                {x: Math.round(this.player.x / this.cellSize) * this.cellSize, 
                 y: Math.round(this.player.y / this.cellSize) * this.cellSize},
                this.walls,
                this.width,
                this.height,
                this.cellSize
            );
            this.drawDebugPath(path);
        });
    }

    checkCollisions() {
        // Check collision with NPCs
        for (let npc of this.npcs) {
            if (this.player.collidesWith(npc)) {
                this.gameOver = true;
                clearInterval(this.npcSpawnInterval);
                alert(`Game Over! Your score: ${this.score}`);
                return;
            }
        }

        // Check collision with walls
        for (let wall of this.walls) {
            if (this.player.collidesWith(wall)) {
                this.player.resolveCollision(wall);
            }
        }
    }

    drawDebugPath(path) {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        path.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        this.ctx.stroke();
    }
}