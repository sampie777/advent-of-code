import { isInBounds, readOnlineInput, Stopwatch } from "./utils.ts";

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

const debugMaps = (map: string[][], obstaclePlacementOptions?: boolean[][], visitedLocations?: boolean[][][]) => {
  for (let row = 0; row < map.length; row++) {
    let output = "";
    for (let col = 0; col < map[row].length; col++) {
      if (obstaclePlacementOptions && obstaclePlacementOptions[row][col]) {
        output += "O";
        continue;
      }
      if (visitedLocations && visitedLocations[row][col].every(it => it)) {
        output += "+";
        continue;
      }
      if (visitedLocations && (visitedLocations[row][col][0] || visitedLocations[row][col][2])) {
        output += "|";
        continue;
      }
      if (visitedLocations && (visitedLocations[row][col][1] || visitedLocations[row][col][3])) {
        output += "-";
        continue;
      }
      output += map[row][col];
    }
    console.debug(output);
  }
};

const checkIfMapHasAnExit = (map: string[][], obstaclePosition: Point, startPosition: Position): boolean => {
  const position = { ...startPosition };

  const visitedLocations: boolean[][][] = [];
  map.forEach((row, rowIndex) => {
    visitedLocations.push([]);

    row.forEach((col, colIndex) => {
      visitedLocations[rowIndex].push([]);

      directions.forEach(() => {
        visitedLocations[rowIndex][colIndex].push(false);
      });
    });
  });

  while (true) {
    if (visitedLocations[position.y][position.x][position.direction]) return false;

    visitedLocations[position.y][position.x][position.direction] = true;

    const nextPosition = getNextPositionPoint(map, position);

    if (!isInBounds(map, nextPosition.x, nextPosition.y)) return true;

    const nextPositionValue = map[nextPosition.y][nextPosition.x];
    if (
      nextPositionValue == "#"
      || (nextPosition.x == obstaclePosition.x && nextPosition.y == obstaclePosition.y)
    ) {
      position.direction++;
      if (position.direction > directions.length - 1) position.direction = 0;
      continue;
    }

    position.x = nextPosition.x;
    position.y = nextPosition.y;
  }
};

const part2 = async (): Promise<string | number> => {
  const stopwatch = Stopwatch();
  const { map, position } = await getProcessedInput();

  stopwatch.start();
  const startPosition = { ...position };

  const visitedLocations: boolean[][][] = [];
  const obstaclePlacementOptions: boolean[][] = [];
  map.forEach((row, rowIndex) => {
    visitedLocations.push([]);
    obstaclePlacementOptions.push([]);

    row.forEach((col, colIndex) => {
      visitedLocations[rowIndex].push([]);
      obstaclePlacementOptions[rowIndex].push(false);

      directions.forEach(() => {
        visitedLocations[rowIndex][colIndex].push(false);
      });
    });
  });

  while (true) {
    visitedLocations[position.y][position.x][position.direction] = true;

    const nextPosition = getNextPositionPoint(map, position);
    if (!isInBounds(map, nextPosition.x, nextPosition.y)) break;

    const nextPositionValue = map[nextPosition.y][nextPosition.x];

    if (nextPositionValue == "#") {
      position.direction++;
      if (position.direction > directions.length - 1) position.direction = 0;
      visitedLocations[position.y][position.x][position.direction] = true;
      continue;
    } else if (
      !obstaclePlacementOptions[nextPosition.y][nextPosition.x] // Check if there wasn't already an obstacle position found
      && !visitedLocations[nextPosition.y][nextPosition.x].some(it => it) // Check if we haven't visited this location yet
      && !(nextPosition.x == startPosition.x && nextPosition.y == startPosition.y)  // Make sure it's not the start location
      && !checkIfMapHasAnExit(map, nextPosition, position)  // For optimization: only check from last known position, as we haven't changed the path
    ) {
      obstaclePlacementOptions[nextPosition.y][nextPosition.x] = true;
    }

    position.x = nextPosition.x;
    position.y = nextPosition.y;
  }

  // debugMaps(map, obstaclePlacementOptions, visitedLocations);
  //
  // // Double check our solution
  // obstaclePlacementOptions.forEach((row, rowIndex) => {
  //   row.forEach((col, colIndex) => {
  //     if (!col) return;
  //     if(checkIfMapHasAnExit(map, {x: colIndex, y: rowIndex}, startPosition)) {
  //       console.debug("Map has an exit!", colIndex, rowIndex)
  //     }
  //   });
  // });

  const result = obstaclePlacementOptions
    .map(row => row.filter(it => it).length)
    .reduce((prev, current) => prev + current, 0);

  console.debug(`Time: ${stopwatch.stop()} ms`);
  return result;
};

console.log(await part1());
console.log(await part2());
