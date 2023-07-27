import {
  Contribution,
  scrapeDataForLastYear
} from "./scrape";

export default async (username: string) => {
  const data = await scrapeDataForLastYear(username);

  // given the data with contributions, split it into multiple arrays by the day of the week
  const map = new Map<string, Array<Contribution>>([
    ["Monday", []],
    ["Tuesday", []],
    ["Wednesday", []],
    ["Thursday", []],
    ["Friday", []],
    ["Saturday", []],
    ["Sunday", []],
  ]);

  data.contributions.forEach(e => map.get(e.dayOfWeek)?.push(e));

  return {
    startingDate: data.startingDate,
    endingDate: data.endingDate,
    contributions: {
      monday: map.get("Monday"),
      tuesday: map.get("Tuesday"),
      wednesday: map.get("Wednesday"),
      thursday: map.get("Thursday"),
      friday: map.get("Friday"),
      saturday: map.get("Saturday"),
      sunday: map.get("Sunday"),
    },
    contribCount: data.contribCount,
  }
}
