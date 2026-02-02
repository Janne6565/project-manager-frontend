import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/technical/protected-route";
import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { aggregateContributionsByRepository } from "@/lib/repository-utils";
import { RepositoriesTable } from "@/components/display/RepositoriesTable/RepositoriesTable";
import { Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/repositories")({
  component: RepositoriesPage,
});

function RepositoriesPage() {
  return (
    <ProtectedRoute>
      <RepositoriesContent />
    </ProtectedRoute>
  );
}

function RepositoriesContent() {
  const { contributions, loading, error } = useAppSelector(
    (state) => state.contributions
  );

  const aggregatedRepositories = useMemo(
    () => aggregateContributionsByRepository(contributions),
    [contributions]
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <div className="text-muted-foreground">Loading contributions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Failed to Load Contributions</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Repositories</h1>
        <p className="text-muted-foreground mt-1">
          Repositories with unassigned contributions ({aggregatedRepositories.length} repositories)
        </p>
      </div>

      {aggregatedRepositories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <div className="text-muted-foreground font-medium">
            No unassigned contributions
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            All contributions are assigned to projects
          </div>
        </div>
      ) : (
        <RepositoriesTable repositories={aggregatedRepositories} />
      )}
    </div>
  );
}
