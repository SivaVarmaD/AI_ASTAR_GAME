import { Game } from './game.js';

export function startGame() {
    const game = new Game('gameCanvas');
    game.start();
}
