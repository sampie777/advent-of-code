import {readInput} from "./utils.ts";

const isNumber = (char: string): boolean => {
    return char.match(/\d/) != null;
}
const isSymbol = (char: string): boolean => {
    return char.match(/[.\d]/) == null;
}

const checkIfSymbolAround = (lines: string[], row: number, col: number): boolean => {
    for (let i = Math.max(0, row - 1); i < Math.min(lines.length, row + 2); i++) {
        for (let j = Math.max(0, col - 1); j < Math.min(lines[i].length, col + 2); j++) {
            if (isSymbol(lines[i][j])) return true;
        }
    }

    return false;
};

const checkIfGearAround = (lines: string[], row: number, col: number): { row: number, col: number } | null => {
    for (let i = Math.max(0, row - 1); i < Math.min(lines.length, row + 2); i++) {
        for (let j = Math.max(0, col - 1); j < Math.min(lines[i].length, col + 2); j++) {
            if (lines[i][j].match(/\*/)) return {row: i, col: j};
        }
    }

    return null;
};

const part1 = async (): Promise<string | number | number[]> => {
    const input = await readInput("day03.txt");
    const lines = input.split("\n");

    let currentNumberString = "";
    let hasSymbolAround = false;
    const foundNumbers: number[] = [];

    function finishNumber() {
        if (hasSymbolAround) {
            foundNumbers.push(+currentNumberString);
        }

        currentNumberString = "";
        hasSymbolAround = false;
    }

    for (let i = 0; i < lines.length; i++) {
        finishNumber();

        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];

            if (!isNumber(char)) {
                finishNumber();
                continue;
            }

            if (!hasSymbolAround) {
                hasSymbolAround = checkIfSymbolAround(lines, i, j);
            }

            currentNumberString += char;
        }
    }

    return foundNumbers.reduce((prev, current) => prev + current, 0);
}

const part2 = async (): Promise<string | number> => {
    const input = await readInput("day03.txt");
    const lines = input.split("\n");

    let currentNumberString = "";
    let nearestGearPositions: { row: number, col: number }[] = [];
    const foundGears: { [key: number]: number[] } = {};

    function finishNumber() {
        nearestGearPositions.forEach(it => {
            const index = it.row * lines[0].length + it.col;
            if (!Object.keys(foundGears).includes(index.toString())) {
                foundGears[index] = [];
            }
            foundGears[index].push(+currentNumberString);
        })

        currentNumberString = "";
        nearestGearPositions = [];
    }

    for (let i = 0; i < lines.length; i++) {
        finishNumber();

        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];

            if (!isNumber(char)) {
                finishNumber();
                continue;
            }

            const nearestGearPosition = checkIfGearAround(lines, i, j);
            if (nearestGearPosition != null
                && !nearestGearPositions.find(it =>
                    it.row == nearestGearPosition!.row &&
                    it.col == nearestGearPosition!.col)
            ) {
                nearestGearPositions.push(nearestGearPosition!);
            }

            currentNumberString += char;
        }
    }

    return Object.values(foundGears)
        .filter(it => it.length == 2)
        .map(it => it.reduce((prev, current) => prev * current, 1))
        .reduce((prev, current) => prev + current, 0)
}

console.log(await part1());
console.log(await part2());