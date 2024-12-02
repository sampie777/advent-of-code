import {readInput} from "./utils.ts";

type SeedMap = {
    seed: number,
    soil: number,
    fertilizer: number,
    water: number,
    light: number,
    temperature: number,
    humidity: number,
    location: number
}

const getValueFromMap = (input: string[], map: string, sourceID) => {
    let mapStarted = false;
    for (const line of input) {
        if (line.includes(map)) {
            mapStarted = true;
            continue;
        }
        if (line.length == 0) mapStarted = false;
        if (!mapStarted) continue;

        const splitString = line
            .split(" ")
            .filter(it => it.length > 0);
        const destinationStart = +splitString[0]
        const seedStart = +splitString[1]
        const length = +splitString[2]

        if (sourceID < seedStart || sourceID >= seedStart + length) continue;

        return destinationStart + (sourceID - seedStart);
    }
    return sourceID;
};

const getSeedMapForSeed = (input: string[], seedID): SeedMap => {
    const result = {
        seed: seedID,
        soil: 0,
        fertilizer: 0,
        water: 0,
        light: 0,
        temperature: 0,
        humidity: 0,
        location: 0
    }

    result.soil = getValueFromMap(input, "seed-to-soil", result.seed)
    result.fertilizer = getValueFromMap(input, "soil-to-fertilizer", result.soil)
    result.water = getValueFromMap(input, "fertilizer-to-water", result.fertilizer)
    result.light = getValueFromMap(input, "water-to-light", result.water)
    result.temperature = getValueFromMap(input, "light-to-temperature", result.light)
    result.humidity = getValueFromMap(input, "temperature-to-humidity", result.temperature)
    result.location = getValueFromMap(input, "humidity-to-location", result.humidity)

    return result;
}

const part1 = async (): Promise<string | number> => {
    const input = (await readInput("day05.txt")).split("\n");

    const seeds = input[0]
        .split(":")[1]
        .split(" ")
        .filter(it => it.length > 0)
        .map(it => +it)

    const seedMaps = seeds.map(it => getSeedMapForSeed(input, it))

    let nearestLocationSeedMap = seedMaps[0];
    seedMaps.forEach(it => {
        if (it.location < nearestLocationSeedMap.location) {
            nearestLocationSeedMap = it
        }
    })
    return nearestLocationSeedMap.location;
}

const part2 = async (): Promise<string | number> => {
    const input = (await readInput("day05.txt")).split("\n");

    const seedPairs = input[0]
        .split(":")[1]
        .split(" ")
        .filter(it => it.length > 0)
        .map(it => +it)

    let nearestLocation: number | null = null;
    for (let i = 0; i < seedPairs.length; i += 2) {
        for (let j = seedPairs[i]; j < seedPairs[i] + seedPairs[i + 1]; j++) {
            const location = getSeedMapForSeed(input, j).location;
            if (nearestLocation == null || location < nearestLocation) {
                nearestLocation = location
            }
        }
    }


    return nearestLocation ?? -1;
}

console.log(await part1());
console.log(await part2());
