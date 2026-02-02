import type { Contribution } from './contribution';

export interface Project {
  uuid: string;
  name: string;
  description: string;
  additionalInformation?: {
    projectId?: string;
    [key: string]: unknown;
  };
  repositories: string[];
  contributions: Contribution[];
}

