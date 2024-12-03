# advent-of-code

Welcome to the Advent of Code[^aoc] project created by [sampie777][github].

In this repository, sampie777 is about to provide solutions for the puzzles using TypeScript language anb Bun.

[^aoc]:
    [Advent of Code][aoc] – An annual event of Christmas-oriented programming challenges started December 2015.
    Every year since then, beginning on the first day of December, a programming puzzle is published every day for twenty-five days.
    You can solve the puzzle and provide an answer using the language of your choice.

[aoc]: https://adventofcode.com
[github]: https://github.com/sampie777

## Usage

Run `./generate_day.sh <day>` in Linux to create a new day for the current year.

Then open the newly generated file and add the logic to solve the puzzle.

Run `bun run ./src/<year>day<day>.ts` to run the code. The puzzle input will be automatically fetched from the server. 
