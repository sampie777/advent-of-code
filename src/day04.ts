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

const part2 = async (): Promise<any> => {
    const input = await readInput("day04.txt");
    const cardMatches = input.split("\n")
        .map(it => it.split(":")[1].trim())
        .map(card => {
            const [winningString, actualString] = card.split(" | ")
            const winning = winningString.split(" ").filter(it => it.length > 0)
            const actual = actualString.split(" ").filter(it => it.length > 0)

            const matches = winning.filter(it => actual.includes(it))

            return matches.length;
        })

    function getSubCardsFromCardIndex(index: number): number {
        let result = 1;
        for (let j = 0; j < cardMatches[index]; j++) {
            result += getSubCardsFromCardIndex(index + j + 1);
        }
        return result
    }

    let result = 0;
    for (let i = 0; i < cardMatches.length; i++) {
        result += getSubCardsFromCardIndex(i);
    }
    return result
}

console.log(await part1());
console.log(await part2());