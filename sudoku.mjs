function generateSudoku() {
    const grid = new Array(9).fill(null).map(() => new Array(9).fill(0));
    fillSudoku(grid);
    return grid;
}

function fillSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                const values = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (const value of values) {
                    if (isValid(grid, row, col, value)) {
                        grid[row][col] = value;
                        if (fillSudoku(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (grid[i][j] === num) {
                return false;
            }
        }
    }

    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const sudokuGrid = generateSudoku();
// console.log(sudokuGrid);

// sudokuGrid.forEach(row => {console.log(row.join(' '));});

// console.log(checksudokuGrid());

export default sudokuGrid;