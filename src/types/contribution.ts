export interface RepositoryContribution {
  url: string;
  name: string;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
}

export function totalContributions(repo: RepositoryContribution): number {
  return repo.commits + repo.pullRequests + repo.issues + repo.reviews;
}

export function totalContributionsForList(repos: RepositoryContribution[]): number {
  return repos.reduce((sum, r) => sum + totalContributions(r), 0);
}
