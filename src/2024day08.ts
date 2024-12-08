import { Point, readOnlineInput } from "./utils.ts";

const getProcessedInput = async () => {
  const input = await readOnlineInput(2024, 8) as string;
  // const input =
    "............\n" +
    "........0...\n" +
    ".....0......\n" +
    ".......0....\n" +
    "....0.......\n" +
    "......A.....\n" +
    "............\n" +
    "............\n" +
    "........A...\n" +
    ".........A..\n" +
    "............\n" +
    "............";

  const antennas: Point[][] = [];
  const antennaNames: string[] = [];
  const map = input.trim()
    .split("\n")
    .map(line => line.trim().split(""));

  map.forEach((row, y) =>
    row.forEach((col, x) => {
      if (col == ".") return;
      if (!antennaNames.includes(col)) {
        antennaNames.push(col);
        antennas.push([]);
      }

      const antennaIndex = antennaNames.indexOf(col);
      antennas[antennaIndex].push({ x: x, y: y });
    }));

  return { antennas, map };
};

const getAntiNodesForAntennas = (antennaA: Point, antennaB: Point): Point[] => {
  const slope = (antennaB.y - antennaA.y) / (antennaB.x - antennaA.x);
  const offset = antennaA.y - slope * antennaA.x;

  if (antennaA.x != antennaB.x) {
    const distanceX = antennaB.x - antennaA.x;
    const x1 = antennaA.x - distanceX;
    const y1 = slope * x1 + offset;
    const x2 = antennaB.x + distanceX;
    const y2 = slope * x2 + offset;
    return [{ x: Math.round(x1), y: Math.round(y1) }, { x: Math.round(x2), y: Math.round(y2) }];
  } else {
    const distanceY = antennaB.y - antennaA.y;
    const x1 = antennaA.x;
    const y1 = antennaA.y - distanceY;
    const x2 = antennaB.x;
    const y2 = antennaB.y + distanceY;
    return [{ x: Math.round(x1), y: Math.round(y1) }, { x: Math.round(x2), y: Math.round(y2) }];
  }
};

const part1 = async (): Promise<string | number> => {
  const { antennas, map } = await getProcessedInput();

  const antiNodes: Point[] = [];
  antennas.forEach((antenna) => {
    if (antenna.length <= 1) return;

    for (let i = 0; i < antenna.length; i++) {
      for (let j = i + 1; j < antenna.length; j++) {
        const antennaA = antenna[i];
        const antennaB = antenna[j];

        getAntiNodesForAntennas(antennaA, antennaB)
          .filter(node => node.x >= 0 && node.x < map[0].length && node.y >= 0 && node.y < map.length && node.y < map.length)
          .filter(node => !antiNodes.some(it => it.x == node.x && it.y == node.y))
          .forEach(node => antiNodes.push(node));
      }
    }
  });

  return antiNodes.length;
};

const part2 = async (): Promise<string | number> => {
  const antennas = await getProcessedInput();
  return "";
};

console.log(await part1());
console.log(await part2());