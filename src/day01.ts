import {readInput} from "./utils.ts";

const part1 = async () => {
    const input = await readInput("day01.txt");
    return input.replaceAll(/[a-z]/gi, '')
        .trim()
        .split("\n")
        .map(it => +(it[0] + it[it.length - 1]))
        .reduce((previousValue, currentValue) => previousValue + currentValue)
}

console.log(await part1());