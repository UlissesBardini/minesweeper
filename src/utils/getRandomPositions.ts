export default function getRandomPositions<T>(matrix: T[][], count: number) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    const positions = new Array<[number, number]>();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            positions.push([i, j]);
        }
    }
    
    for (let i = 0; i < count; i++) {
        const j = i + Math.floor(Math.random() * (rows * cols - i));
        [positions[i], positions[j]] = [positions[j], positions[i]]
    }

    return positions;
}