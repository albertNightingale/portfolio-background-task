import {
  load,
} from "cheerio";

import {
  scrapeContentList, scrapeHeader
} from "./scrape";
import { Project, PastExperience } from "../../../types";
import { mapToPastExperience, mapToProject } from "../../util";

export const scrapeProjects = (content: string): Array<Project> => {
  const $ = load(content);

  const headers = scrapeHeader($);
  const projectMapList = scrapeContentList($);

  if (headers.length === projectMapList.length) {
    return headers.map((header, index) => {
      const projectDictionary = projectMapList[index];

      const project = mapToProject(projectDictionary, header);
      return project;
    });
  }
  else {
    throw new Error(`there is a mismatch between the number of 
      headers and the number of projects: headers length: ${headers.length}, 
      projectMapList length: ${projectMapList.length}`);
  }
}

export const scrapePastExperiences = (content: string): Array<PastExperience> => {
  const $ = load(content);

  const headers = scrapeHeader($);
  const pastExperienceMapList = scrapeContentList($);

  if (headers.length === pastExperienceMapList.length) {
    return headers.map((header, index) => {
      const pastExperienceDictionary = pastExperienceMapList[index];

      const project = mapToPastExperience(pastExperienceDictionary, header);
      return project;
    });
  }
  else {
    throw new Error(`there is a mismatch between the number of 
      headers and the number of past experiences : headers length: ${headers.length}, 
      pastExperienceMapList length: ${pastExperienceMapList.length}`);
  }
}