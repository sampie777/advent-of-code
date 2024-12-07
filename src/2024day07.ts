import { readOnlineInput, Stopwatch } from "./utils.ts";

const getProcessedInput = async (): Promise<{ result: number, numbers: number[] }[]> => {
  // const input = await readOnlineInput(2024, 7) as string;
  const input = "190: 10 19\n" +
    "3267: 81 40 27\n" +
    "83: 17 5\n" +
    "156: 15 6\n" +
    "7290: 6 8 6 15\n" +
    "161011: 16 10 13\n" +
    "192: 17 8 14\n" +
    "21037: 9 7 18 13\n" +
    "292: 11 6 16 20";

  return input
    .trim()
    .split("\n")
    .map(line => line
      .trim()
      .split(":")
      .map(it => it.trim())
    )
    .map(it => ({
      result: +it[0],
      numbers: it[1]
        .split(" ")
        .map(number => +number)
    }));
};

const evaluate = (numbers: number[], operators: string[]): number => {
  return numbers.reduce((prev, current, index) => {
    if (index == 0) return prev;
    const operator = operators[index - 1];
    if (operator == "|") return `${prev}${current}`;
    return eval(`${prev}${operator}${current}`)
  }, numbers[0]);
};

const part1 = async (): Promise<string | number> => {
  const input = await getProcessedInput();
  const stopwatch = Stopwatch();
  stopwatch.start();

  const validEquationsResults: number[] = [];
  const operators = ["+", "*"];

  input.forEach(equation => {

    const maxPossibilities = Math.pow(2, equation.numbers.length - 1);
    for (let i = 0; i < maxPossibilities; i++) {
      const mask = (i >>> 0).toString(2).padStart(equation.numbers.length - 1, "0");

      const appliedOperators = mask
        .replaceAll("0", operators[0])
        .replaceAll("1", operators[1])
        .split("");

      const result = evaluate(equation.numbers, appliedOperators);

      // // Debug only
      // const evaluation = equation.numbers
      //   .map((number, index) => index < appliedOperators.length ? `${number}${appliedOperators[index]}` : `${number}`)
      //   .join("");
      // console.debug(mask, evaluation, result, result == equation.result ? "==" : "!=", equation.result);

      if (result != equation.result) continue;

      validEquationsResults.push(equation.result);
      return;
    }

  });

  const result = validEquationsResults.reduce((prev, current) => prev + current, 0);
  console.debug((`Time: ${stopwatch.stop()} ms`))
  return result;
};

const part2 = async (): Promise<string | number> => {
  const input = await getProcessedInput();
  const stopwatch = Stopwatch();
  stopwatch.start();

  const validEquationsResults: number[] = [];
  const operators = ["+", "*", "|"];

  input.forEach(equation => {

    const maxPossibilities = Math.pow(2, equation.numbers.length - 1);
    for (let i = 0; i < maxPossibilities; i++) {
      const mask = (i >>> 0).toString(2).padStart(equation.numbers.length - 1, "0");

      const appliedOperators = mask
        .replaceAll("0", operators[0])
        .replaceAll("1", operators[1])
        .split("");

      const result = evaluate(equation.numbers, appliedOperators);

      // // Debug only
      const evaluation = equation.numbers
        .map((number, index) => index < appliedOperators.length ? `${number}${appliedOperators[index]}` : `${number}`)
        .join("");
      console.debug(mask, evaluation, result, result == equation.result ? "==" : "!=", equation.result);

      if (result != equation.result) continue;

      validEquationsResults.push(equation.result);
      return;
    }

  });

  const result = validEquationsResults.reduce((prev, current) => prev + current, 0);
  console.debug((`Time: ${stopwatch.stop()} ms`))
  return result;
};

console.log(await part1());
console.log(await part2());
