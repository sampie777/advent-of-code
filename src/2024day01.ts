import { readOnlineInput } from "./utils.ts";

const getAndSortData = async () => {
  const input = await readOnlineInput(2024, 1) as string;
  // const input = "3   4\n" +
  //   "4   3\n" +
  //   "2   5\n" +
  //   "1   3\n" +
  //   "3   9\n" +
  //   "3   3";
  const group1: number[] = [];
  const group2: number[] = [];

  input.trim()
    .split(/\r?\n/)
    .map(it => it.trim().split(/ +/))
    .forEach(it => {
      group1.push(+it[0]);
      group2.push(+it[1]);
    });

  group1.sort((a, b) => a - b);
  group2.sort((a, b) => a - b);
  return { group1, group2 };
};

const part1 = async (): Promise<string | number> => {
  const { group1, group2 } = await getAndSortData();

  const distances = group1.map((it, i) => it < group2[i] ? group2[i] - it : it - group2[i]);

  return distances.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
};

const part2 = async (): Promise<string | number> => {
  const { group1, group2 } = await getAndSortData();

  return group1.reduce((prev, current) => prev += current * group2.filter(it => it == current).length, 0)
};

console.log(await part1());
console.log(await part2());