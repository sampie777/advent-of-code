import { Secrets } from "./secrets.ts";

export const readInput = async (filename: string): Promise<string> => {
  return (await Bun.file(`./src/inputs/${filename}`).text()).trim();
};

export const readOnlineInput = async (year: number, day: number): Promise<string> => {
  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      "Cookie": Secrets.cookie
    }
  });
  return await response.text();
};

export const isInBounds = (matrix: any[][], col: number, row: number) => {
  if (col < 0 || row < 0) return false;
  if (row >= matrix.length) return false;
  if (col >= matrix[row].length) return false;
  return true;
};