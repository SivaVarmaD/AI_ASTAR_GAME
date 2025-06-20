export function astar(start, goal, walls, maxWidth, maxHeight, cellSize) {
    const openSet = [start];
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(`${start.x},${start.y}`, 0);
    fScore.set(`${start.x},${start.y}`, heuristic(start, goal));

    while (openSet.length > 0) {
        let current = openSet[0];
        let lowestFScore = fScore.get(`${current.x},${current.y}`);

        for (let i = 1; i < openSet.length; i++) {
            const fScoreI = fScore.get(`${openSet[i].x},${openSet[i].y}`);
            if (fScoreI < lowestFScore) {
                current = openSet[i];
                lowestFScore = fScoreI;
            }
        }

        if (current.x === goal.x && current.y === goal.y) {
            return reconstructPath(cameFrom, current);
        }

        openSet.splice(openSet.indexOf(current), 1);
        closedSet.add(`${current.x},${current.y}`);

        const neighbors = getNeighbors(current, walls, maxWidth, maxHeight, cellSize);

        for (let neighbor of neighbors) {
            if (closedSet.has(`${neighbor.x},${neighbor.y}`)) {
                continue;
            }

            const tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;

            if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                openSet.push(neighbor);
            } else if (tentativeGScore >= gScore.get(`${neighbor.x},${neighbor.y}`)) {
                continue;
            }

            cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
            gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
            fScore.set(`${neighbor.x},${neighbor.y}`, gScore.get(`${neighbor.x},${neighbor.y}`) + heuristic(neighbor, goal));
        }
    }

    return [];
}

function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(`${current.x},${current.y}`)) {
        current = cameFrom.get(`${current.x},${current.y}`);
        path.unshift(current);
    }
    return path;
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(node, walls, maxWidth, maxHeight, cellSize) {
    const directions = [
        { dx: 0, dy: -cellSize },
        { dx: cellSize, dy: 0 },
        { dx: 0, dy: cellSize },
        { dx: -cellSize, dy: 0 }
    ];

    return directions
        .map(dir => ({
            x: node.x + dir.dx,
            y: node.y + dir.dy
        }))
        .filter(neighbor =>
            neighbor.x >= 0 && neighbor.x < maxWidth &&
            neighbor.y >= 0 && neighbor.y < maxHeight &&
            !walls.some(wall =>
                neighbor.x >= wall.x && neighbor.x < wall.x + wall.width &&
                neighbor.y >= wall.y && neighbor.y < wall.y + wall.height
            )
        );
}