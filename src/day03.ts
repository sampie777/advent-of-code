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
    // const input = await readInput("day0302_test.txt");
    return "";
}

console.log(await part1());
console.log(await part2());