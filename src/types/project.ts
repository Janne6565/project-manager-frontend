import type { Contribution } from "./contribution";

export interface Project {
  uuid: string;
  name: string;
  description: string;
  index: number;
  additionalInformation?: {
    [key: string]: string;
  };
  repositories?: string[];
  contributions?: Contribution[];
}
