import {readInput} from "./utils.ts";

const part1 = async () => {
    const input = await readInput("day01.txt");
    return input.replaceAll(/[a-z]/gi, '')
        .trim()
        .split("\n")
        .map(it => +(it[0] + it[it.length - 1]))
        .reduce((previousValue, currentValue) => previousValue + currentValue)
}

const part2 = async () => {
    const numberMap = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
    ]
    const replaceWordedNumbers = (text: string): string => {
        let result = text;
        numberMap.forEach((placeholder, value) => {
            if (placeholder.length === 0) return;
            result = result.replaceAll(RegExp(`(${placeholder})`, "gi"), "$1" + value.toString() + "$1")
        })
        return result;
    };

    const input = await readInput("day01.txt");
    return replaceWordedNumbers(input)
        .replaceAll(/[a-z]/gi, '')
        .trim()
        .split("\n")
        .map(it => +(it[0] + it[it.length - 1]))
        .reduce((previousValue, currentValue) => previousValue + currentValue)
}

console.log(await part1());
console.log(await part2());