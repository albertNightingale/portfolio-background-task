import { authorize } from "./gcapi/auth";

import scrapeGithub from "./scraper/github";
import { scrapePastExperiences, scrapeProjects } from "./scraper/googledocs/";

import { replaceFile, readGDocsHTML } from "./gcapi";
import { replaceObject } from "./aws/S3";

export let isDev = false;

// handler
export default async function main(isDevelopment: boolean) {
  isDev = isDevelopment;

  authorize(); // authorize google drive api

  // call all event handlers once at the start
  console.log("handle google docs by reading from google drive");
  await handleProjects();
  await handlePastExperiences();

  console.log("\nhandle github");
  await handleGithub();
}

async function handleGithub() {
  try {
    // scrape data from github
    console.log("handleGithub: scraping data from github");
    const data = await scrapeGithub("albertNightingale");
    // write data into file and name it output
    console.log("handleGithub: storing the data to google drive");
    await replaceFile("portfolio", "github-contribution", JSON.stringify(data));

    // store data to s3
    console.log("handleGithub: storing data to s3");
    await replaceObject("github-contribution", JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

async function handlePastExperiences() {
  const C = "past-experiences";
  try {
    // scrape data from google docs past experiences
    console.log("handleGoogleDocs: scraping data from google docs in", C);
    const gdocsHTML = await readGDocsHTML(C);
    const projects = scrapePastExperiences(gdocsHTML);

    // store data to s3 projects
    console.log("handleGoogleDocs: storing data to s3 in", C);
    await replaceObject(C, JSON.stringify(projects));

  } catch (error) {
    console.error(error);
  }
}

async function handleProjects() {
  const C = "projects";

  try {
    // scrape data from google docs projects
    console.log("handleGoogleDocs: scraping data from google docs in", C);
    const gdocsHTML = await readGDocsHTML(C);
    const projects = scrapeProjects(gdocsHTML);

    // store data to s3 projects
    console.log("handleGoogleDocs: storing data to s3 in", C);
    await replaceObject(C, JSON.stringify(projects));
  } catch (error) {
    console.error(error);
  }
}