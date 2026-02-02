import { useState } from "react";
import type { RepositoryAggregate } from "@/lib/repository-utils";
import { formatDateRange } from "@/lib/repository-utils";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, ChevronLeft, ChevronRight, MoreVertical, FolderPlus, Plus } from "lucide-react";
import { AssignToProjectDialog } from "./AssignToProjectDialog";
import { CreateProjectDialog } from "@/components/display/CreateProjectDialog/CreateProjectDialog";

interface RepositoriesTableProps {
  repositories: RepositoryAggregate[];
}

export function RepositoriesTable({ repositories }: RepositoriesTableProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(() => {
    const stored = localStorage.getItem("repositoriesTable.pageSize");
    return stored ? Number(stored) : 10;
  });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState<string | null>(null);

  const totalPages = Math.ceil(repositories.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRepositories = repositories.slice(startIndex, endIndex);

  const handlePageSizeChange = (newSize: string) => {
    const size = Number(newSize);
    setPageSize(size);
    localStorage.setItem("repositoriesTable.pageSize", newSize);
    setCurrentPage(0);
  };

  const handleAssignToProject = (repositoryUrl: string) => {
    setSelectedRepository(repositoryUrl);
    setAssignDialogOpen(true);
  };

  const handleCreateWithRepository = (repositoryUrl: string) => {
    setSelectedRepository(repositoryUrl);
    setCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Pull Requests</TableHead>
              <TableHead className="text-center">Commits</TableHead>
              <TableHead className="text-center">Issues</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRepositories.map((repo) => (
              <TableRow key={repo.repositoryUrl}>
                <TableCell>
                  <a
                    href={repo.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                  >
                    {repo.repositoryName}
                    <ExternalLink className="size-3" />
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{repo.totalContributions}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {repo.pullRequests > 0 ? (
                    <Badge variant="default">{repo.pullRequests}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {repo.commits > 0 ? (
                    <Badge variant="secondary">{repo.commits}</Badge>
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
                <TableCell className="text-muted-foreground text-sm">
                  {formatDateRange(repo.dateRange.earliest, repo.dateRange.latest)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAssignToProject(repo.repositoryUrl)}>
                        <FolderPlus className="size-4" />
                        Add to project
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateWithRepository(repo.repositoryUrl)}>
                        <Plus className="size-4" />
                        Create new project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {repositories.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
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
              Page {currentPage + 1} of {totalPages} ({repositories.length} total)
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

      {/* Dialogs */}
      {selectedRepository && (
        <>
          <AssignToProjectDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            repositoryUrl={selectedRepository}
          />
          <CreateProjectDialog
            open={createDialogOpen}
            onOpenChange={(open) => {
              setCreateDialogOpen(open);
              if (!open) setSelectedRepository(null);
            }}
            initialRepository={selectedRepository}
          />
        </>
      )}
    </div>
  );
}
