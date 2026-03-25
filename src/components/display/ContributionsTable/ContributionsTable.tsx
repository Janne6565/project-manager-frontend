import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { RepositoryContribution } from "@/types/contribution";
import { totalContributions } from "@/types/contribution";
import { extractRepoName } from "@/lib/repository-utils";
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

interface ContributionsTableProps {
  contributions: RepositoryContribution[];
}

export function ContributionsTable({ contributions }: ContributionsTableProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(() => {
    const stored = localStorage.getItem("contributionsTable.pageSize");
    return stored ? Number(stored) : 10;
  });

  const totalPages = Math.ceil(contributions.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentContributions = contributions.slice(startIndex, endIndex);

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
          {t("contributions.empty.title")}
        </div>
        <div className="text-muted-foreground text-sm mt-1">
          {t("contributions.empty.description")}
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
              <TableHead>{t("contributions.table.columns.repository")}</TableHead>
              <TableHead className="text-center">{t("contributions.table.columns.total")}</TableHead>
              <TableHead className="text-center">{t("contributions.table.types.commit")}</TableHead>
              <TableHead className="text-center">{t("contributions.table.types.pullRequest")}</TableHead>
              <TableHead className="text-center">{t("contributions.table.types.issue")}</TableHead>
              <TableHead className="text-center">{t("contributions.table.types.review")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentContributions.map((repo) => (
              <TableRow key={repo.url}>
                <TableCell>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                  >
                    {repo.name || extractRepoName(repo.url)}
                    <ExternalLink className="size-3" />
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{totalContributions(repo)}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {repo.commits > 0 ? (
                    <Badge variant="secondary">{repo.commits}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {repo.pullRequests > 0 ? (
                    <Badge variant="default">{repo.pullRequests}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {repo.issues > 0 ? (
                    <Badge variant="outline">{repo.issues}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {repo.reviews > 0 ? (
                    <Badge variant="outline">{repo.reviews}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {contributions.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("contributions.table.pagination.rowsPerPage")}
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
              {t("contributions.table.pagination.page", {
                current: currentPage + 1,
                total: totalPages,
                count: contributions.length
              })}
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
              {t("contributions.table.pagination.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              {t("contributions.table.pagination.next")}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
