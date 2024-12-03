import { readOnlineInput } from "./utils.ts";

const part1 = async (): Promise<string | number> => {
    const input = await readOnlineInput(2024, 3) as string;
    // const input = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"

    const matches = Array.from(input.matchAll(/mul\((\d+),(\d+)\)/g));
    return matches
      .map(it => +it[1] * +it[2])
      .reduce((prev, current) => prev + current, 0);
}

const part2 = async (): Promise<string | number> => {
    const input = await readOnlineInput(2024, 3) as string;
    // const input = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5)"
    const doInputs = input.split("do()").map(it => it.split("don't()")[0]).join("");

    const matches = Array.from(doInputs.matchAll(/mul\((\d+),(\d+)\)/g));
    return matches
      .map(it => +it[1] * +it[2])
      .reduce((prev, current) => prev + current, 0);
}

console.log(await part1());
console.log(await part2());
