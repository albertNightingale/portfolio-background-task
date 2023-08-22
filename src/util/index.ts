import { PastExperience, Project } from "../../types";

export function mapToPastExperience(pastExperienceDictionary: Map<string, string>, header: string): PastExperience {
  if (!pastExperienceDictionary) {
    throw new Error(`pastExperienceDictionary is undefined for ${header}`);
  }

  const pastExperience = {} as PastExperience;

  /// check on the required fields
  const requiredFields = [
    "onGoing",
    "type",
    "orgName",
    "position",
    "startingDate",
    "description"
  ];

  // check if the object exists
  checkRequiredFields(requiredFields, pastExperienceDictionary, header);

  /// convert the dictionary to a pastExperience object required fields
  const orgName = pastExperienceDictionary.get("orgName");
  pastExperience.orgName = orgName ? orgName : "";

  const startingDate = pastExperienceDictionary.get("startingDate");
  pastExperience.startingDate = startingDate ? startingDate : "";

  const position = pastExperienceDictionary.get("position");
  pastExperience.position = position ? position : "";

  const description = pastExperienceDictionary.get("description");
  pastExperience.description = description ? description : "";

  /// optional fields
  const endingDate = pastExperienceDictionary.get("endingDate");
  if (endingDate !== undefined) {
    pastExperience.endingDate = endingDate;
  }

  return pastExperience;
}

export function mapToProject(projectDictionary: Map<string, string>, header: string): Project {
  if (!projectDictionary) {
    throw new Error(`projectDictionary is undefined for ${header}`);
  }

  const project = {} as Project;

  /// check on the required fields
  const requiredFields = [
    "onGoing",
    "projectName",
    "startingDate",
    "stack",
    "description"
  ];

  checkRequiredFields(requiredFields, projectDictionary, header);

  /// convert the dictionary to a project object required fields
  const onGoing = projectDictionary.get("onGoing") === "true";
  project.onGoing = onGoing;

  const projectName = projectDictionary.get("projectName");
  project.projectName = projectName ? projectName : "";

  const startingDate = projectDictionary.get("startingDate");
  project.startingDate = startingDate ? startingDate : "";

  const stack = projectDictionary.get("stack");
  if (stack?.startsWith("[") && stack?.endsWith("]")) {
    const stackList = stack.substring(1, stack.length - 1)
      .split(",")
      .map(e => e.trim());
    project.stack = stackList;
  }
  else {
    throw new Error(`stack is not a list for ${header}`);
  }

  const description = projectDictionary.get("description");
  project.description = description ? description : "";

  /// optional fields
  const endingDate = projectDictionary.get("endingDate");
  if (endingDate !== undefined) {
    project.endingDate = endingDate;
  }

  const website = projectDictionary.get("website");
  if (website !== undefined) {
    project.website = website;
  }

  const github = projectDictionary.get("github");
  if (github !== undefined) {
    project.github = github;
  }

  return project;
}

function checkRequiredFields(requiredFields: string[], projectDictionary: Map<string, string>, header: string) {
  requiredFields.forEach((field) => {
    if (projectDictionary.get(field) === undefined) {
      throw new Error(`required field ${field} is undefined for ${header}. \n${JSON.stringify(projectDictionary)}`);
    }
  });
}