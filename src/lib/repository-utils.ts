import type { Contribution } from "@/types/contribution";

export interface RepositoryAggregate {
  repositoryUrl: string;
  repositoryName: string; // "owner/repo"
  totalContributions: number;
  pullRequests: number;
  commits: number;
  issues: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
  contributions: Contribution[];
}

export function aggregateContributionsByRepository(
  contributions: Contribution[]
): RepositoryAggregate[] {
  const repoMap = new Map<string, RepositoryAggregate>();

  contributions.forEach((contribution) => {
    const { repositoryUrl, type, day } = contribution;
    const repoName = extractRepoName(repositoryUrl);

    if (!repoMap.has(repositoryUrl)) {
      repoMap.set(repositoryUrl, {
        repositoryUrl,
        repositoryName: repoName,
        totalContributions: 0,
        pullRequests: 0,
        commits: 0,
        issues: 0,
        dateRange: {
          earliest: day,
          latest: day,
        },
        contributions: [],
      });
    }

    const repo = repoMap.get(repositoryUrl)!;
    repo.totalContributions++;
    repo.contributions.push(contribution);

    // Update type counts
    if (type === "PULL_REQUEST") repo.pullRequests++;
    else if (type === "COMMIT") repo.commits++;
    else if (type === "ISSUE") repo.issues++;

    // Update date range
    if (day < repo.dateRange.earliest) repo.dateRange.earliest = day;
    if (day > repo.dateRange.latest) repo.dateRange.latest = day;
  });

  // Convert to array and sort by most recent activity (latest date descending)
  return Array.from(repoMap.values()).sort(
    (a, b) => new Date(b.dateRange.latest).getTime() - new Date(a.dateRange.latest).getTime()
  );
}

function extractRepoName(url: string): string {
  try {
    const parts = url.replace("https://github.com/", "").split("/");
    return parts.slice(0, 2).join("/");
  } catch {
    return url;
  }
}

export function formatDateRange(earliest: string, latest: string): string {
  const start = new Date(earliest);
  const end = new Date(latest);
  
  const formatDate = (date: Date) => 
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (earliest === latest) {
    return formatDate(start);
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`;
}
