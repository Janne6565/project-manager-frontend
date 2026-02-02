import { createFileRoute } from '@tanstack/react-router';
import { ProtectedRoute } from '@/components/technical/protected-route';
import { useAppSelector } from '@/store/hooks';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const { projects, loading: projectsLoading } = useAppSelector(
    (state) => state.projects
  );
  const { contributions, loading: contributionsLoading } = useAppSelector(
    (state) => state.contributions
  );

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold">Welcome to Project Manager</h1>
        <p className="text-muted-foreground">
          You are now logged in. Your projects will appear here.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-2">Projects</h2>
            {projectsLoading ? (
              <p className="text-sm text-muted-foreground">Loading projects...</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {projects.length} project(s) found
              </p>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-2">
              Unassigned Contributions
            </h2>
            {contributionsLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading contributions...
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {contributions.length} contribution(s) found
              </p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

