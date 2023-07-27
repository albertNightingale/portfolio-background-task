import {
  load,
} from "cheerio";

import {
  scrapeContentList, scrapeHeader
} from "./scrape";
import { Project } from "../../../types";
import { mapToProject } from "../../util";

export default (content: string): Array<Project> => {
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
