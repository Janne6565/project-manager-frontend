import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '@/components/technical/protected-route';
import { useAppSelector } from '@/store/hooks';
import { ProjectsTable } from '@/components/display/ProjectsTable/ProjectsTable';
import { CreateProjectDialog } from '@/components/display/CreateProjectDialog/CreateProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const { t } = useTranslation();
  const { projects, loading, error } = useAppSelector(
    (state) => state.projects
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("projects.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("projects.description")}
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="size-4" />
            {t("projects.newProject")}
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">{t("projects.loading")}</div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 py-12">
            <div className="text-destructive font-medium">
              {t("projects.error")}
            </div>
            <div className="text-muted-foreground text-sm">{error}</div>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12">
            <div className="text-muted-foreground font-medium">
              {t("projects.empty.title")}
            </div>
            <div className="text-muted-foreground text-sm">
              {t("projects.empty.description")}
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="size-4" />
              {t("projects.createProject")}
            </Button>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <ProjectsTable projects={projects} />
        )}

        <CreateProjectDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    </ProtectedRoute>
  );
}


