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

const isNodeWithinMap = (node: Point, map: string[][]) => node.x >= 0 && node.x < map[0].length && node.y >= 0 && node.y < map.length && node.y < map.length;

const getAntiNodesForAntennas1 = (antennaA: Point, antennaB: Point): Point[] => {
  const antiNodes: Point[] = [];
  const distanceX = antennaB.x - antennaA.x;
  const distanceY = antennaB.y - antennaA.y;

  antiNodes.push({ x: Math.round(antennaA.x - distanceX), y: Math.round(antennaA.y - distanceY) });
  antiNodes.push({ x: Math.round(antennaB.x + distanceX), y: Math.round(antennaB.y + distanceY) });

  return antiNodes;
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

        getAntiNodesForAntennas1(antennaA, antennaB)
          .filter(node => isNodeWithinMap(node, map))
          .filter(node => !antiNodes.some(it => it.x == node.x && it.y == node.y))
          .forEach(node => antiNodes.push(node));
      }
    }
  });

  return antiNodes.length;
};


const getAntiNodesForAntennas2 = (map: string[][], antennaA: Point, antennaB: Point): Point[] => {
  const antiNodes: Point[] = [];
  const distanceX = antennaB.x - antennaA.x;
  const distanceY = antennaB.y - antennaA.y;

  let factor = 0;
  while (true) {
    const node = { x: Math.round(antennaA.x - distanceX * factor), y: Math.round(antennaA.y - distanceY * factor) };
    if (!isNodeWithinMap(node, map)) break;
    antiNodes.push(node);
    factor++;
  }

  factor = 0;
  while (true) {
    const node = { x: Math.round(antennaB.x + distanceX * factor), y: Math.round(antennaB.y + distanceY * factor) };
    if (!isNodeWithinMap(node, map)) break;
    antiNodes.push(node);
    factor++;
  }

  return antiNodes;
};

const part2 = async (): Promise<string | number> => {
  const { antennas, map } = await getProcessedInput();

  const antiNodes: Point[] = [];
  antennas.forEach((antenna) => {
    if (antenna.length <= 1) return;

    for (let i = 0; i < antenna.length; i++) {
      for (let j = i + 1; j < antenna.length; j++) {
        const antennaA = antenna[i];
        const antennaB = antenna[j];

        getAntiNodesForAntennas2(map, antennaA, antennaB)
          .filter(node => !antiNodes.some(it => it.x == node.x && it.y == node.y))
          .forEach(node => antiNodes.push(node));
      }
    }
  });

  return antiNodes.length;
};

console.log(await part1());
console.log(await part2());