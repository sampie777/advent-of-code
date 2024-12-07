import { readOnlineInput, Stopwatch } from "./utils.ts";

const getProcessedInput = async (): Promise<{ result: number, numbers: number[] }[]> => {
  const input = await readOnlineInput(2024, 7) as string;
  const input2 = "190: 10 19\n" +
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

const operators = ["+", "*", "|"];

// STS115066
//

const evaluate = (numbers: number[], mask: number[]): number => {
  return numbers.reduce((prev, current, index) => {
    if (index == 0) return prev;
    const operator = operators[mask[index - 1]];
    if (operator == "|") return +`${prev}${current}`;
    if (operator == "+") return prev + current;
    if (operator == "*") return prev * current;
    console.error("invalid operator! ", {
      numbers: numbers,
      mask: mask,
      operator: operator
    });
    return prev + current;
  }, numbers[0]);
};

const part1 = async (): Promise<string | number> => {
  const input = await getProcessedInput();
  const stopwatch = Stopwatch();
  stopwatch.start();

  const validEquationsResults: number[] = [];

  input.forEach(equation => {

    const maxPossibilities = Math.pow(2, equation.numbers.length - 1);
    for (let i = 0; i < maxPossibilities; i++) {
      const mask = (i >>> 0).toString(2).padStart(equation.numbers.length - 1, "0");

      const result = evaluate(equation.numbers, mask.split("").map(it => +it));

      if (result != equation.result) continue;

      validEquationsResults.push(equation.result);
      return;
    }

  });

  const result = validEquationsResults.reduce((prev, current) => prev + current, 0);
  console.debug((`Time: ${stopwatch.stop()} ms`));
  return result;
};

const logProgress = (elapsedTime: number, equationIndex: number, inputLength: number) => {
  const estimatedTotalDuration = (elapsedTime / equationIndex) * inputLength;
  console.info(`${Math.round(equationIndex / inputLength * 100).toString().padStart(3, " ")} % [${equationIndex.toString().padStart(inputLength.toString().length, " ")} / ${inputLength}] ${elapsedTime} ms - Estimated total duration: ${Math.round(estimatedTotalDuration / 1000)} s - Estimated time left: ${Math.round((estimatedTotalDuration - elapsedTime) / 1000)} s`);
};

const createMask = (length: number): number[][] => {
  const stopwatch = Stopwatch();
  stopwatch.start();

  const result: number[][] = [];
  const resultValues: number[] = [];
  const maxPossibilities = Math.pow(2, length);
  for (let i = 0; i < maxPossibilities; i++) {
    logProgress(stopwatch.read(), i, maxPossibilities);

    const mask1 = (i >>> 0).toString(2).padStart(length, "0").split("");

    for (let j = 0; j < maxPossibilities; j++) {
      const mask2 = (j >>> 0).toString(2).padStart(length, "0").split("");
      const maskResult = mask1
        .map((_, index) => +mask1[index] + +mask2[index]);

      // Check if mask already exists
      const maskValue = maskResult.reduce((prev, current, index) => prev + current * Math.pow(3, index), 0);
      if (resultValues.some(it => it == maskValue)) continue;
      // resultValues.push(maskValue);  // Somehow this makes is slow

      result.push(maskResult);
    }
  }

  return result;
};

const generateOrLoadAllMasks = async (maxMaskLength: number): Promise<number[][]> => {
  const stopwatch = Stopwatch();
  stopwatch.start();

  const maskFile = Bun.file(`mask${maxMaskLength}x.json`);
  if (await maskFile.exists()) {
    console.debug(`     Loading mask file ${maskFile.name}...`);
    return (await maskFile.json()) as number[][];
  }

  console.debug(`  Generating mask for length ${maxMaskLength}...`);
  const allMasks = createMask(maxMaskLength)
    .sort((a, b) =>
      a.reduce((prev, current, index) => prev + current * Math.pow(3, index), 0)
      - b.reduce((prev, current, index) => prev + current * Math.pow(3, index), 0)
    )
    .map(it => it.reverse());
  console.debug(`  Generating done in ${stopwatch.stop()} ms`);

  console.debug(`     Saving to file ${maskFile}`);
  await Bun.write(maskFile, JSON.stringify(allMasks));
  console.debug(`     Mask saved to file ${maskFile}`);
  return allMasks;
};

const part2 = async (startIndex: number, maxLength: number): Promise<string | number> => {
  console.log(`From ${startIndex} to ${startIndex + maxLength - 1}`);
  const input = (await getProcessedInput())
    .slice(startIndex, startIndex + maxLength);
  const stopwatch = Stopwatch();

  let validEquationsResult = 0;
  const maxMaskLength = input
    .map(it => it.numbers.length)
    .sort((a, b) => a - b)
    .pop()! - 1;

  const allMasks = await generateOrLoadAllMasks(maxMaskLength);
  const precalculatedMasks: { [key: number]: number[][] } = {};

  const getMasks = (maskLength: number): number[][] => {
    if (!Object.keys(precalculatedMasks).includes(maskLength.toString())) {
      precalculatedMasks[maskLength] = allMasks
        .slice(0, Math.pow(4, maskLength))
        .map(it => it.slice(it.length - maskLength));
    }
    return precalculatedMasks[maskLength];
  };

  stopwatch.start();
  input.forEach((equation, equationIndex) => {
    logProgress(stopwatch.read(), equationIndex, input.length);

    const masks = getMasks(equation.numbers.length - 1);
    for (let i = 0; i < masks.length; i++) {
      const mask = masks[i];
      const evaluationResult = evaluate(equation.numbers, mask);
      if (evaluationResult != equation.result) continue;

      validEquationsResult += equation.result;
      console.debug(` current total result [${startIndex} - ${startIndex + i}]: ${validEquationsResult}`);
      return;
    }
  });

  console.debug((`Time: ${stopwatch.stop()} ms`));
  return validEquationsResult;
};

// console.log(await part1());
console.log(await part2(+Bun.argv[2], +Bun.argv[3]));
