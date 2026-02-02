import { useState, useMemo } from "react";
import type { Contribution } from "@/types/contribution";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { sorted } from "@/lib/utils.ts";

interface ContributionsTableProps {
  contributions: Contribution[];
}

export function ContributionsTable({ contributions }: ContributionsTableProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(() => {
    const stored = localStorage.getItem("contributionsTable.pageSize");
    return stored ? Number(stored) : 10;
  });

  const sortedContributions = useMemo(
    () => sorted(contributions, (a, b) => b.day.localeCompare(a.day)),
    [contributions],
  );

  const totalPages = Math.ceil(sortedContributions.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentContributions = sortedContributions.slice(startIndex, endIndex);

  // Reset to first page when page size changes
  const handlePageSizeChange = (newSize: string) => {
    const size = Number(newSize);
    setPageSize(size);
    localStorage.setItem("contributionsTable.pageSize", newSize);
    setCurrentPage(0);
  };

  if (contributions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <div className="text-muted-foreground font-medium">
          No contributions yet
        </div>
        <div className="text-muted-foreground text-sm mt-1">
          Contributions will appear here once they're added to this project
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Repository</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentContributions.map((contribution, index) => (
              <TableRow key={`${currentPage}-${index}`}>
                <TableCell className="font-medium">
                  {formatDate(contribution.day)}
                </TableCell>
                <TableCell>
                  <ContributionTypeBadge type={contribution.type} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {extractRepoName(contribution.repositoryUrl)}
                </TableCell>
                <TableCell>
                  <a
                    href={contribution.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View
                    <ExternalLink className="size-3" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {sortedContributions.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages} (
              {sortedContributions.length} total)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ContributionTypeBadge({ type }: { type: Contribution["type"] }) {
  const config = {
    PULL_REQUEST: { label: "Pull Request", variant: "default" as const },
    COMMIT: { label: "Commit", variant: "secondary" as const },
    ISSUE: { label: "Issue", variant: "outline" as const },
  };

  const { label, variant } = config[type];

  return <Badge variant={variant}>{label}</Badge>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function extractRepoName(url: string): string {
  try {
    const parts = url.replace("https://github.com/", "").split("/");
    return parts.slice(0, 2).join("/");
  } catch {
    return url;
  }
}
