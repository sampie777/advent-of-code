import {readInput} from "./utils.ts";

const part1 = async (): Promise<string | number> => {
    const input = await readInput("day04.txt");
    return input.split("\n")
        .map(it => it.split(":")[1].trim())
        .map(card => {
            const [winningString, actualString] = card.split(" | ")
            const winning = winningString.split(" ").filter(it => it.length > 0)
            const actual = actualString.split(" ").filter(it => it.length > 0)

            const matches = winning.filter(it => actual.includes(it))

            if (matches.length == 0) return 0
            return Math.pow(2, matches.length - 1)
        })
        .reduce((prev, current) => prev + current, 0)
}

const part2 = async (): Promise<string | number> => {
    const input = await readInput("day0402_test.txt");
    return "";
}

console.log(await part1());
console.log(await part2());