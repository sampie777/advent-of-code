import {readInput} from "./utils.ts";

type Conditions = { red: number, green: number, blue: number };
type Game = {
    id: number,
    draws: {
        red: number,
        green: number,
        blue: number,
    }[]
}

const part1 = async (conditions: Conditions): Promise<string | number> => {
    const gameMeetsConditions = (game: Game, conditions: Conditions): boolean => {
        return game.draws.every(draw =>
            draw.red <= conditions.red
            && draw.green <= conditions.green
            && draw.blue <= conditions.blue
        )
    }

    const input = await readInput("day02.txt");
    const games = input.trim()
        .split("\n")
        .map(line => {
            const game: Game = {
                id: 0,
                draws: [],
            }

            if (line.match(/Game (\d+)/)?.length > 1) {
                game.id = +line.match(/Game (\d+)/)![1]
            } else {
                console.error("Invalid ID for line", line)
            }

            line
                .split(":")[1]
                .split(";")
                .map(drawLine => {
                    const draw = {
                        red: 0,
                        green: 0,
                        blue: 0
                    }
                    drawLine
                        .split(",")
                        .forEach(it => {
                            const value = +it.replaceAll(/[a-z ]/gi, '');
                            if (it.includes("red")) {
                                draw.red = value
                            } else if (it.includes("green")) {
                                draw.green = value
                            } else if (it.includes("blue")) {
                                draw.blue = value
                            }
                        })
                    game.draws.push(draw)
                })
            return game
        })

    const matchingGames = games.filter(game => gameMeetsConditions(game, conditions));
    return matchingGames.map(it => it.id).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
}

const part2 = async (): Promise<string | number> => {
    const input = await readInput("day02.txt");
    const games = input.trim()
        .split("\n")
        .map(line => {
            const game: Game = {
                id: 0,
                draws: [],
            }

            if (line.match(/Game (\d+)/)?.length > 1) {
                game.id = +line.match(/Game (\d+)/)![1]
            } else {
                console.error("Invalid ID for line", line)
            }

            line
                .split(":")[1]
                .split(";")
                .map(drawLine => {
                    const draw = {
                        red: 0,
                        green: 0,
                        blue: 0
                    }
                    drawLine
                        .split(",")
                        .forEach(it => {
                            const value = +it.replaceAll(/[a-z ]/gi, '');
                            if (it.includes("red")) {
                                draw.red = value
                            } else if (it.includes("green")) {
                                draw.green = value
                            } else if (it.includes("blue")) {
                                draw.blue = value
                            }
                        })
                    game.draws.push(draw)
                })
            return game
        })

    return games
        .map(game => {
            const lowestCubes = {
                red: 0,
                green: 0,
                blue: 0
            }

            game.draws.forEach(draw => {
                if (draw.red > lowestCubes.red) lowestCubes.red = draw.red;
                if (draw.green > lowestCubes.green) lowestCubes.green = draw.green;
                if (draw.blue > lowestCubes.blue) lowestCubes.blue = draw.blue;
            })

            return lowestCubes.red * lowestCubes.green * lowestCubes.blue;
        })
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
}

console.log(await part1({red: 12, green: 13, blue: 14}));
console.log(await part2());