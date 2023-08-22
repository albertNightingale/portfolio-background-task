export interface PastExperience {
  onGoing: boolean;
  type: string;
  orgName: string;
  position: string;
  startingDate: string;
  endingDate?: string;
  description: string;
}

export interface Project {
  onGoing: boolean;
  projectName: string;
  startingDate: string;
  endingDate?: string;
  website?: string;
  github?: string;
  stack: string[];
  description: string;
}

export interface GitContributionObject {
  startingDate: string;
  endingDate: string;
  contributions: {
    monday: Contribution[];
    tuesday: Contribution[];
    wednesday: Contribution[];
    thursday: Contribution[];
    friday: Contribution[];
    saturday: Contribution[];
    sunday: Contribution[];
  },
  contribCount: number;
}

export interface Contribution {
  count: number;
  date: string;
  dayOfWeek: string;
}

export enum Environment {
  development = "dev",
  production = "prod"
}
