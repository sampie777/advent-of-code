import { isInBounds, readOnlineInput } from "./utils.ts";

type Point = { x: number, y: number };
type Position = Point & { direction: number };

const directions = [
  "^",
  ">",
  "v",
  "<"
];

const getProcessedInput = async () => {
  const input = await readOnlineInput(2024, 6) as string;
  const input2 = "....#.....\n" +
    ".........#\n" +
    "..........\n" +
    "..#.......\n" +
    ".......#..\n" +
    "..........\n" +
    ".#..^.....\n" +
    "........#.\n" +
    "#.........\n" +
    "......#...";

  const map = input
    .trim()
    .split("\n")
    .map(row => row.trim().split(""));

  const startingRowIndex = map.findIndex(row => row.some(it => directions.includes(it)));
  const startingColIndex = map[startingRowIndex].findIndex(it => directions.includes(it));
  const position = {
    x: startingColIndex,
    y: startingRowIndex,
    direction: directions.indexOf(map[startingRowIndex][startingColIndex])
  };

  return { map, position };
};

const markPositionAsVisited = (map: string[][], position: Point) => {
  map[position.y][position.x] = "X";
};

const getNextPositionPoint = (map: string[][], position: Position): Point => {
  if (position.direction == 0) return { x: position.x, y: position.y - 1 };
  if (position.direction == 1) return { x: position.x + 1, y: position.y };
  if (position.direction == 2) return { x: position.x, y: position.y + 1 };
  if (position.direction == 3) return { x: position.x - 1, y: position.y };
  throw new Error("Unknown direction " + position.direction);
};

const part1 = async (): Promise<string | number> => {
  const { map, position } = await getProcessedInput();

  while (isInBounds(map, position.x, position.y)) {
    markPositionAsVisited(map, position);
    const nextPosition = getNextPositionPoint(map, position);
    if (!isInBounds(map, nextPosition.x, nextPosition.y)) break;

    const nextPositionValue = map[nextPosition.y][nextPosition.x];
    if (nextPositionValue == "#") {
      position.direction++;
      if (position.direction > directions.length - 1) position.direction = 0;
      continue;
    }

    position.x = nextPosition.x;
    position.y = nextPosition.y;
  }

  return map
    .map(row => row.filter(it => it == "X").length)
    .reduce((prev, current) => prev + current, 0);
};

const part2 = async (): Promise<string | number> => {
  const map = getProcessedInput();
  return "";
};

console.log(await part1());
console.log(await part2());
