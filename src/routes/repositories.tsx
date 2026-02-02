import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          <div className="text-muted-foreground">{t("repositories.loading")}</div>
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
            <h2 className="text-2xl font-bold">{t("repositories.errorTitle")}</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t("repositories.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("repositories.description", { count: aggregatedRepositories.length })}
        </p>
      </div>

      {aggregatedRepositories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <div className="text-muted-foreground font-medium">
            {t("repositories.empty.title")}
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            {t("repositories.empty.description")}
          </div>
        </div>
      ) : (
        <RepositoriesTable repositories={aggregatedRepositories} />
      )}
    </div>
  );
}
