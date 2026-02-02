export interface Contribution {
  day: string;
  type: 'PULL_REQUEST' | 'COMMIT' | 'ISSUE';
  repositoryUrl: string;
  reference: string;
}
