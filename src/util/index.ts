import { Project } from "../../types";

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

  requiredFields.forEach((field) => {
    if (projectDictionary.get(field) === undefined) {
      throw new Error(`required field ${field} is undefined for ${header}. \n${JSON.stringify(projectDictionary)}`);
    }
  });

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