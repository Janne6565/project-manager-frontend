import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
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
              <TableHead>{t("contributions.table.columns.date")}</TableHead>
              <TableHead>{t("contributions.table.columns.type")}</TableHead>
              <TableHead>{t("contributions.table.columns.repository")}</TableHead>
              <TableHead>{t("contributions.table.columns.reference")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentContributions.map((contribution, index) => (
              <TableRow key={`${currentPage}-${index}`}>
                <TableCell className="font-medium">
                  {formatDate(contribution.day, i18n.language)}
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
                    {t("contributions.table.viewLink")}
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
                count: sortedContributions.length
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

function ContributionTypeBadge({ type }: { type: Contribution["type"] }) {
  const { t } = useTranslation();
  
  const config = {
    PULL_REQUEST: { label: t("contributions.table.types.pullRequest"), variant: "default" as const },
    COMMIT: { label: t("contributions.table.types.commit"), variant: "secondary" as const },
    ISSUE: { label: t("contributions.table.types.issue"), variant: "outline" as const },
  };

  const { label, variant } = config[type];

  return <Badge variant={variant}>{label}</Badge>;
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
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
