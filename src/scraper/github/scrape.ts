import {
  load,
} from "cheerio";
import { getProfilePage } from "./githubapi";

export interface Contribution {
  count: number;
  date: string;
  dayOfWeek: string;
}

function scrapeContributionTable($: cheerio.Root) {
  const searchQuery = ".js-yearly-contributions .js-calendar-graph tbody .ContributionCalendar-day"
  const $days = $(searchQuery);

  if (!$days.html()) {
    throw `unable to scrape for the github contribution table of class \"${searchQuery}\"`;
  }
  else {
    console.log(`find ${$days.length} days of entry`);
  }

  const contributions: Array<Contribution> = $days.toArray()
    .map((element: any) => $(element).text())
    .map(promptString => {
      // example of the expected input: 
      // No contributions on Thursday, July 13, 2023
      // 10 contributions on Friday, July 14, 2023
      const contributionCount = Number.parseInt(promptString.substring(0, promptString.indexOf(" ")));
      return {
        count: Number.isNaN(contributionCount) ? 0 : contributionCount,
        date: promptString.substring(promptString.indexOf(", ") + 1).trim(),
        dayOfWeek: promptString.substring(0, promptString.indexOf(", ")).split(" ").pop(),
      } as Contribution;
    });

  // scrape contribution counts
  const $contrib = $(".js-yearly-contributions h2")
  const contribText = $contrib.text()
    .trim()
    .match(/^([0-9,]+)\s/);

  let contribCount: number = 0;
  if (contribText) {
    contribCount = parseInt(contribText[0].replace(/,/g, ""), 10);
  }

  return {
    contribCount,
    contributions
  };
}

export async function scrapeDataForLastYear(username: string) {
  const profile = await getProfilePage(username);
  const $ = load(profile);
  const { contribCount, contributions } = scrapeContributionTable($);

  const startingDate = contributions[0].date;
  const endingDate = contributions[contributions.length - 1].date;

  return {
    startingDate,
    endingDate,
    contribCount,
    contributions
  };
}