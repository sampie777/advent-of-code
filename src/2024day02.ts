import { readOnlineInput } from "./utils.ts";

const getAndSortData = async () => {
  const input = await readOnlineInput(2024, 2) as string;
  // const input = "7 6 4 2 1\n" +
  //   "1 2 7 8 9\n" +
  //   "9 7 6 2 1\n" +
  //   "1 3 2 4 5\n" +
  //   "8 6 4 4 1\n" +
  //   "1 3 6 7 9";

  return input
    .trim()
    .split("\n")
    .map(it => it.split(" ").map(x => +x));
};

const checkIfReportIsSafe = (report: number[]) => {
  let direction = 0;
  for (let i = 1; i < report.length; i++) {
    const prev = report[i - 1];
    const current = report[i];

    if (prev == current) return false;
    if (direction == 0) {
      direction = current < prev ? -1 : 1;
    }

    const difference = current - prev;

    if ((direction < 0 && difference >= 0) || (direction > 0 && difference <= 0)) return false;
    if (Math.abs(difference) > 3) return false;
  }
  return true;
};

const part1 = async (): Promise<string | number> => {
  const reports = await getAndSortData();

  const safeReports = reports.map(checkIfReportIsSafe)
    .filter(it => it);

  return safeReports.length;
};

const part2 = async (): Promise<string | number> => {
  const reports = await getAndSortData();

  const safeReports = reports
    .map(report => {
      if (checkIfReportIsSafe(report)) return true;
      for (let i = 0; i < report.length; i++) {
        if (checkIfReportIsSafe(report.filter((_, index) => index != i))) return true;
      }
    })
    .filter(it => it);

  return safeReports.length;
};

console.log(await part1());
console.log(await part2());