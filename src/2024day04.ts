import { readOnlineInput } from "./utils.ts";

const findCharInDirection = (
  matrix: string[][],
  start: { x: number; y: number },
  direction: { x: number; y: number },
  char: string): boolean => {
  const search = {
    x: start.x + direction.x,
    y: start.y + direction.y
  };
  try {
    const foundChar = matrix[search.y][search.x];
    if (foundChar == char) return true;
  } catch (e) {

  }
  return false;
};

const getProcessedInput = async () => {
  const input = await readOnlineInput(2024, 4) as string;
  // const input = "MMMSXXMASM\n" +
  //   "MSAMXMSMSA\n" +
  //   "AMXSXMAAMM\n" +
  //   "MSAMASMSMX\n" +
  //   "XMASAMXAMM\n" +
  //   "XXAMMXXAMA\n" +
  //   "SMSMSASXSS\n" +
  //   "SAXAMASAAA\n" +
  //   "MAMMMXMMMM\n" +
  //   "MXMXAXMASX";

  return input.trim().split("\n").map(it => it.trim().split(""));
};

const part1 = async (): Promise<string | number> => {
  const matrix = await getProcessedInput();

  let foundCount = 0;

  matrix.forEach((row, rowIndex) =>
    row.forEach((col, colIndex) => {
      if (col != "X") return;

      const direction = { y: 0, x: 0 };
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          const nextRowIndex = rowIndex + y;
          const nextColIndex = colIndex + x;

          if (nextRowIndex < 0 || nextRowIndex >= matrix.length) continue;
          if (nextColIndex < 0 || nextColIndex >= row.length) continue;

          const char = matrix[nextRowIndex][nextColIndex];
          if (char != "M") continue;

          direction.y = y;
          direction.x = x;

          if (!findCharInDirection(matrix, { y: nextRowIndex, x: nextColIndex }, direction, "A")) continue;
          if (!findCharInDirection(matrix, {
            y: nextRowIndex + direction.y,
            x: nextColIndex + direction.x
          }, direction, "S")) continue;
          foundCount++;
        }
      }
    }));

  return foundCount;
};

const part2 = async (): Promise<string | number> => {
  const matrix = await getProcessedInput();

  const allowedPatterns = [
    "MMSS",
    "SMMS",
    "SSMM",
    "MSSM",
  ]

  let foundCount = 0;

  matrix.forEach((row, rowIndex) => {
    if (rowIndex == 0 || rowIndex == matrix.length - 1) return;

    row.forEach((col, colIndex) => {
      if (colIndex == 0 || colIndex == row.length - 1) return;
      if (col != "A") return;

      const foundChars: string[] = [
        matrix[rowIndex - 1][colIndex - 1],
        matrix[rowIndex - 1][colIndex + 1],
        matrix[rowIndex + 1][colIndex + 1],
        matrix[rowIndex + 1][colIndex - 1],
      ];
      const foundString = foundChars.join("");

      if (!allowedPatterns.includes(foundString)) return;
      foundCount++;
    });
  });

  return foundCount;
};

console.log(await part1());
console.log(await part2());
