import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/technical/protected-route';
import { useAppSelector } from '@/store/hooks';
import { ProjectsTable } from '@/components/display/ProjectsTable/ProjectsTable';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const { projects, loading, error } = useAppSelector(
    (state) => state.projects
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your projects
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 py-12">
            <div className="text-destructive font-medium">
              Failed to load projects
            </div>
            <div className="text-muted-foreground text-sm">{error}</div>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-12">
            <div className="text-muted-foreground font-medium">
              No projects yet
            </div>
            <div className="text-muted-foreground text-sm">
              Create your first project to get started
            </div>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <ProjectsTable projects={projects} />
        )}
      </div>
    </ProtectedRoute>
  );
}


