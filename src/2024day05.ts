import { readOnlineInput } from "./utils.ts";

const getProcessedInput = async () => {
  const input = await readOnlineInput(2024, 5) as string;
  const input2 = "47|53\n" +
    "97|13\n" +
    "97|61\n" +
    "97|47\n" +
    "75|29\n" +
    "61|13\n" +
    "75|53\n" +
    "29|13\n" +
    "97|29\n" +
    "53|29\n" +
    "61|53\n" +
    "97|53\n" +
    "61|29\n" +
    "47|13\n" +
    "75|47\n" +
    "97|75\n" +
    "47|61\n" +
    "75|61\n" +
    "47|29\n" +
    "75|13\n" +
    "53|13\n" +
    "\n" +
    "75,47,61,53,29\n" +
    "97,61,53,29,13\n" +
    "75,29,13\n" +
    "75,97,47,61,53\n" +
    "61,13,29\n" +
    "97,13,75,29,47";

  const [rulesRaw, updatesRaw] = input.split("\n\n");
  const rules = rulesRaw
    .trim()
    .split("\n")
    .map(it => it
      .trim()
      .split("|")
      .map(x => +x));
  const updates = updatesRaw
    .trim()
    .split("\n")
    .map(it => it
      .trim()
      .split(",")
      .map(x => +x));
  return { rules, updates };
};

const part1 = async (): Promise<string | number> => {
  const { rules, updates } = await getProcessedInput();

  return updates.filter(update => {
    const appliedRules = rules.filter(rule =>
      update.includes(rule[0]) && update.includes(rule[1]));
    return appliedRules.every(rule => update.indexOf(rule[0]) < update.indexOf(rule[1]));
  })
    .map(update => update[(update.length - 1) / 2])
    .reduce((prev, current) => prev + current, 0);
};

const part2 = async (): Promise<string | number> => {
  const { rules, updates } = await getProcessedInput();

  return updates.filter(update => {
    const appliedRules = rules.filter(rule =>
      update.includes(rule[0]) && update.includes(rule[1]));

    return appliedRules.some(rule => update.indexOf(rule[0]) >= update.indexOf(rule[1]));
  })
    .map(update => {
      const appliedRules = rules.filter(rule =>
        update.includes(rule[0]) && update.includes(rule[1]));

      // Fix update by placing the lower page in front of the higher page
      for (let i = 0; i < appliedRules.length; i++) {
        const rule = appliedRules[i];
        const firstIndex = update.indexOf(rule[0]);
        const secondIndex = update.indexOf(rule[1]);
        if (firstIndex < secondIndex) continue;

        const newUpdate = update.filter((_, index) => index != secondIndex);
        update = [
          ...newUpdate.slice(0, firstIndex),
          rule[1],
          ...newUpdate.slice(firstIndex)
        ];

        i = -1;
      }

      return update;
    })
    .map(update => update[(update.length - 1) / 2])
    .reduce((prev, current) => prev + current, 0);
};

console.log(await part1());
console.log(await part2());
