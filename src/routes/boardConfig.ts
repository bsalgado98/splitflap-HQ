const boardConfig = {
    ROWS: 7,
    COLS: 15,
    CELLS: (): number => boardConfig.ROWS * boardConfig.COLS,
    UPDATE_SPEED: 25,
    EMPTY_MATRIX: (): string[][] => {
        const matrix: string[][] = []

        for (let i = 0; i < boardConfig.ROWS; i++) {
            matrix.push([])
            for (let j = 0; j < boardConfig.COLS; j++) {
                matrix[i].push("")
            }
        }

        return matrix
    }
}

export default boardConfig